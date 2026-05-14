package live.ebetstream.app;

import android.graphics.Bitmap;
import android.graphics.PixelFormat;
import android.graphics.Point;
import android.hardware.display.DisplayManager;
import android.hardware.display.VirtualDisplay;
import android.media.Image;
import android.media.ImageReader;
import android.media.projection.MediaProjection;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.util.Log;
import android.view.Display;
import android.view.WindowManager;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Capture l'écran via MediaProjection.
 *
 * ARCHITECTURE LOW-LATENCY :
 *  - ImageReader reçoit les frames RGBA en callback immédiat
 *  - Encode en JPEG sur le thread de capture
 *  - Push binaire via WebSocket vers tous les clients connectés
 *  - Pas de polling, pas de délai artificiel
 *  - Latence cible : 80-150ms au lieu de 300-800ms avec le MJPEG+XHR
 *
 * Le endpoint /frame (single JPEG) est conservé pour la phase de warmup.
 */
public class ScreenCaptureHelper {
    private static final String TAG = "ScreenCaptureHelper";
    private static final int VIRT_DISPLAY_FLAGS =
            DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR;
    private static final int MIN_DIMENSION = 64;
    private static final int MAX_DIMENSION = 1280;
    private static final int JPEG_QUALITY = 70; // réduit pour moins de latence réseau
    private static final int TARGET_FPS = 20;   // augmenté pour fluidité

    private final WindowManager windowManager;
    private final int width;
    private final int height;
    private final int densityDpi;
    private MediaProjection mediaProjection;
    private VirtualDisplay virtualDisplay;
    private ImageReader imageReader;
    private HandlerThread handlerThread;
    private Handler handler;
    private final AtomicReference<byte[]> latestJpeg = new AtomicReference<>();
    private ServerSocket serverSocket;
    private int serverPort = 0;
    private volatile boolean running = false;
    private Thread serverThread;

    // Liste des clients WebSocket connectés — accès synchronisé
    private final List<WebSocketClient> wsClients = Collections.synchronizedList(new ArrayList<>());

    public ScreenCaptureHelper(WindowManager wm, int densityDpi) {
        this.windowManager = wm;
        this.densityDpi = densityDpi <= 0 ? 320 : Math.min(480, Math.max(120, densityDpi));
        Display display = wm.getDefaultDisplay();
        Point size = new Point();
        try { display.getSize(size); } catch (Throwable t) { size.x = 720; size.y = 1280; }
        int w = Math.max(1, size.x);
        int h = Math.max(1, size.y);
        while (w * h > (2 << 19)) { w >>= 1; h >>= 1; }
        if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
            float scale = Math.min((float) MAX_DIMENSION / w, (float) MAX_DIMENSION / h);
            w = (int) (w * scale);
            h = (int) (h * scale);
        }
        if (w < MIN_DIMENSION) w = MIN_DIMENSION;
        if (h < MIN_DIMENSION) h = MIN_DIMENSION;
        w = w & ~1;
        h = h & ~1;
        if (w < MIN_DIMENSION) w = MIN_DIMENSION;
        if (h < MIN_DIMENSION) h = MIN_DIMENSION;
        this.width = w;
        this.height = h;
    }

    public int getWidth() { return width; }
    public int getHeight() { return height; }

    public void start(MediaProjection projection) {
        if (running) return;
        if (projection == null) return;
        if (width <= 0 || height <= 0) { Log.e(TAG, "Invalid dimensions"); return; }

        Log.d("SCDBG", "H3: helper.start begin " + width + "x" + height);
        try {
            this.mediaProjection = projection;
            running = true;

            // Démarrer le ServerSocket en premier
            Thread setupThread = new Thread(() -> {
                try {
                    ServerSocket ss = new ServerSocket(0);
                    serverSocket = ss;
                    serverPort = ss.getLocalPort();
                    ScreenCaptureService.streamUrl = "http://127.0.0.1:" + serverPort;
                    serverThread = new Thread(this::serveConnections, "WsFrameServer");
                    serverThread.start();
                    Log.d("SCDBG", "H3: Server port=" + serverPort);
                } catch (Exception e) {
                    Log.e(TAG, "Failed to start server", e);
                    running = false;
                }
            }, "ScreenCaptureSetup");
            setupThread.start();

            handlerThread = new HandlerThread("ScreenCapture", android.os.Process.THREAD_PRIORITY_BACKGROUND);
            handlerThread.start();
            handler = new Handler(handlerThread.getLooper());

            imageReader = ImageReader.newInstance(width, height, PixelFormat.RGBA_8888, 2);
            imageReader.setOnImageAvailableListener(reader -> {
                Image image = null;
                try {
                    image = reader.acquireLatestImage();
                    if (image == null) return;
                    byte[] jpeg = imageToJpeg(image);
                    if (jpeg == null) return;
                    latestJpeg.set(jpeg);
                    // Push immédiat vers tous les clients WebSocket
                    pushToWebSocketClients(jpeg);
                } catch (Exception e) {
                    Log.e(TAG, "onImageAvailable error", e);
                } finally {
                    if (image != null) try { image.close(); } catch (Exception ignored) {}
                }
            }, handler);

            Handler mainHandler = new Handler(Looper.getMainLooper());
            virtualDisplay = mediaProjection.createVirtualDisplay(
                    "ScreenCapture", width, height, densityDpi,
                    VIRT_DISPLAY_FLAGS, imageReader.getSurface(), null, mainHandler);

            Log.d("SCDBG", "H3: createVirtualDisplay done");
        } catch (Throwable t) {
            Log.e(TAG, "start failed", t);
            running = false;
            ScreenCaptureService.streamUrl = null;
            stop();
        }
    }

    // ── JPEG encoding ─────────────────────────────────────────────────────────

    private byte[] imageToJpeg(Image image) {
        try {
            Image.Plane[] planes = image.getPlanes();
            if (planes == null || planes.length == 0) return null;
            ByteBuffer buffer = planes[0].getBuffer();
            int pixelStride = planes[0].getPixelStride();
            int rowStride = planes[0].getRowStride();
            if (rowStride <= 0 || pixelStride <= 0) return null;
            int rowPadding = rowStride - pixelStride * width;
            int bitmapWidth = width + rowPadding / pixelStride;
            if (bitmapWidth <= 0 || height <= 0) return null;

            Bitmap bitmap = Bitmap.createBitmap(bitmapWidth, height, Bitmap.Config.ARGB_8888);
            bitmap.copyPixelsFromBuffer(buffer);
            Bitmap cropped = (bitmapWidth != width)
                    ? Bitmap.createBitmap(bitmap, 0, 0, width, height)
                    : bitmap;
            if (bitmap != cropped) bitmap.recycle();

            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream(width * height / 4);
            cropped.compress(Bitmap.CompressFormat.JPEG, JPEG_QUALITY, baos);
            cropped.recycle();
            return baos.toByteArray();
        } catch (Exception e) {
            Log.e(TAG, "imageToJpeg error", e);
            return null;
        }
    }

    // ── WebSocket push ────────────────────────────────────────────────────────

    private void pushToWebSocketClients(byte[] jpeg) {
        List<WebSocketClient> dead = new ArrayList<>();
        synchronized (wsClients) {
            for (WebSocketClient c : wsClients) {
                if (!c.sendBinary(jpeg)) dead.add(c);
            }
        }
        if (!dead.isEmpty()) wsClients.removeAll(dead);
    }

    // ── HTTP server : upgrade vers WS ou servir /frame ────────────────────────

    private void serveConnections() {
        try {
            while (running) {
                Socket client = serverSocket.accept();
                new Thread(() -> handleClient(client), "WsFrameClient").start();
            }
        } catch (Exception e) {
            if (running) Log.e(TAG, "Server accept error", e);
        }
    }

    private void handleClient(Socket client) {
        try {
            InputStream in = client.getInputStream();
            OutputStream out = client.getOutputStream();

            // Lire la requête HTTP
            StringBuilder requestBuilder = new StringBuilder();
            int prev = -1, b;
            while ((b = in.read()) != -1) {
                requestBuilder.append((char) b);
                // Détecter fin des headers HTTP (\r\n\r\n)
                if (requestBuilder.length() >= 4) {
                    String tail = requestBuilder.substring(requestBuilder.length() - 4);
                    if (tail.equals("\r\n\r\n")) break;
                }
            }
            String request = requestBuilder.toString();
            String firstLine = request.split("\r\n")[0];
            String path = firstLine.contains(" ") ? firstLine.split(" ")[1].split("\\?")[0] : "/";

            // Détecter WebSocket upgrade (case-insensitive)
            if (request.toLowerCase().contains("upgrade: websocket")) {
                handleWebSocketUpgrade(client, in, out, request);
            } else if (path.contains("frame")) {
                // Endpoint single JPEG pour warmup
                for (int i = 0; i < 80 && latestJpeg.get() == null && running; i++) {
                    try { Thread.sleep(50); } catch (InterruptedException e) { break; }
                }
                byte[] jpeg = latestJpeg.get();
                if (jpeg != null && jpeg.length > 0) {
                    String header = "HTTP/1.0 200 OK\r\nContent-Type: image/jpeg\r\nContent-Length: "
                            + jpeg.length + "\r\nCache-Control: no-store\r\nAccess-Control-Allow-Origin: *\r\n\r\n";
                    out.write(header.getBytes());
                    out.write(jpeg);
                } else {
                    out.write("HTTP/1.0 204 No Content\r\nContent-Length: 0\r\nAccess-Control-Allow-Origin: *\r\n\r\n".getBytes());
                }
                out.flush();
                client.close();
            } else {
                // MJPEG fallback (legacy)
                String boundary = "frame";
                String header = "HTTP/1.0 200 OK\r\nContent-Type: multipart/x-mixed-replace; boundary="
                        + boundary + "\r\nCache-Control: no-store\r\nAccess-Control-Allow-Origin: *\r\n\r\n";
                out.write(header.getBytes());
                out.flush();
                long frameIntervalMs = 1000L / TARGET_FPS;
                while (running && !client.isClosed()) {
                    byte[] jpeg = latestJpeg.get();
                    if (jpeg != null && jpeg.length > 0) {
                        String part = "--" + boundary + "\r\nContent-Type: image/jpeg\r\nContent-Length: " + jpeg.length + "\r\n\r\n";
                        out.write(part.getBytes());
                        out.write(jpeg);
                        out.write("\r\n".getBytes());
                        out.flush();
                    }
                    Thread.sleep(frameIntervalMs);
                }
                client.close();
            }
        } catch (Exception e) {
            try { client.close(); } catch (Exception ignored) {}
            if (running) Log.d(TAG, "Client disconnected: " + e.getMessage());
        }
    }

    private void handleWebSocketUpgrade(Socket socket, InputStream in, OutputStream out, String request) throws Exception {
        // Extraire Sec-WebSocket-Key
        String key = "";
        for (String line : request.split("\r\n")) {
            if (line.startsWith("Sec-WebSocket-Key:")) {
                key = line.split(":", 2)[1].trim();
                break;
            }
        }
        // Calculer accept key
        String acceptKey = Base64.getEncoder().encodeToString(
                MessageDigest.getInstance("SHA-1")
                        .digest((key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").getBytes("UTF-8"))
        );
        // Répondre avec handshake
        String response =
                "HTTP/1.1 101 Switching Protocols\r\n" +
                "Upgrade: websocket\r\n" +
                "Connection: Upgrade\r\n" +
                "Access-Control-Allow-Origin: *\r\n" +
                "Sec-WebSocket-Accept: " + acceptKey + "\r\n\r\n";
        out.write(response.getBytes("UTF-8"));
        out.flush();

        // Créer et enregistrer le client
        WebSocketClient wsClient = new WebSocketClient(socket, out);
        wsClients.add(wsClient);
        Log.d(TAG, "WS client connected. Total: " + wsClients.size());

        // Garder le thread en vie pour détecter la déconnexion
        try {
            byte[] buf = new byte[256];
            while (running && !socket.isClosed()) {
                int n = in.read(buf);
                if (n == -1) break;
                // Frame opcode 8 = close
                if (n > 0 && (buf[0] & 0x0F) == 8) break;
            }
        } catch (Exception ignored) {}

        wsClients.remove(wsClient);
        try { socket.close(); } catch (Exception ignored) {}
        Log.d(TAG, "WS client disconnected. Total: " + wsClients.size());
    }

    // ── WebSocket frame builder ───────────────────────────────────────────────

    private static class WebSocketClient {
        private final Socket socket;
        private final OutputStream out;

        WebSocketClient(Socket socket, OutputStream out) {
            this.socket = socket;
            this.out = out;
        }

        /**
         * Envoie un frame WebSocket binaire (opcode 0x02).
         * Retourne false si la connexion est morte.
         */
        boolean sendBinary(byte[] data) {
            try {
                byte[] frame = buildBinaryFrame(data);
                synchronized (out) {
                    out.write(frame);
                    out.flush();
                }
                return true;
            } catch (Exception e) {
                return false;
            }
        }

        private byte[] buildBinaryFrame(byte[] payload) {
            int len = payload.length;
            byte[] header;
            if (len <= 125) {
                header = new byte[]{(byte) 0x82, (byte) len};
            } else if (len <= 65535) {
                header = new byte[]{
                        (byte) 0x82, (byte) 126,
                        (byte) (len >> 8), (byte) (len & 0xFF)
                };
            } else {
                header = new byte[]{
                        (byte) 0x82, (byte) 127,
                        0, 0, 0, 0,
                        (byte) (len >> 24), (byte) (len >> 16), (byte) (len >> 8), (byte) (len & 0xFF)
                };
            }
            byte[] frame = new byte[header.length + len];
            System.arraycopy(header, 0, frame, 0, header.length);
            System.arraycopy(payload, 0, frame, header.length, len);
            return frame;
        }
    }

    // ── Getters / Stop ────────────────────────────────────────────────────────

    public String getStreamUrl() {
        if (serverPort <= 0) return null;
        return "http://127.0.0.1:" + serverPort;
    }

    public void stop() {
        running = false;
        synchronized (wsClients) { wsClients.clear(); }
        try { if (virtualDisplay != null) { virtualDisplay.release(); virtualDisplay = null; } } catch (Exception e) { Log.e(TAG, "stop virtualDisplay", e); }
        try { if (imageReader != null) { imageReader.close(); imageReader = null; } } catch (Exception e) { Log.e(TAG, "stop imageReader", e); }
        try { if (mediaProjection != null) { mediaProjection.stop(); mediaProjection = null; } } catch (Exception e) { Log.e(TAG, "stop mediaProjection", e); }
        try { if (serverSocket != null) { serverSocket.close(); serverSocket = null; } } catch (Exception e) { Log.e(TAG, "stop serverSocket", e); }
        if (serverThread != null && serverThread.isAlive()) serverThread.interrupt();
        try { if (handlerThread != null && handlerThread.isAlive()) handlerThread.quitSafely(); } catch (Exception e) { Log.e(TAG, "stop handlerThread", e); }
    }
}