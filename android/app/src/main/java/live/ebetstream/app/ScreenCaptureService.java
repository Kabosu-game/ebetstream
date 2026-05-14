package live.ebetstream.app;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import android.view.WindowManager;

import androidx.core.app.NotificationCompat;

/**
 * Service en premier plan requis pour MediaProjection sur Android 10+.
 * Exécute la capture d'écran dans ce service pour éviter les crashs.
 */
public class ScreenCaptureService extends Service {
    private static final String TAG = "ScreenCaptureService";
    private static final String SCDBG = "SCDBG";
    private static final String CHANNEL_ID = "screen_capture";
    private static final int NOTIFICATION_ID = 9001;

    public static volatile String streamUrl = null;

    private ScreenCaptureHelper helper;
    private MediaProjection mediaProjection;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(SCDBG, "H1: onStartCommand start");
        // Obligatoire : startForeground() dans les ~5 s sinon crash Android
        Notification notification = null;
        try {
            notification = buildNotification();
        } catch (Throwable t) {
            Log.e(TAG, "buildNotification failed", t);
            stopSelf();
            return START_NOT_STICKY;
        }
        if (notification == null) {
            stopSelf();
            return START_NOT_STICKY;
        }
        try {
            if (Build.VERSION.SDK_INT >= 34) {
                startForeground(NOTIFICATION_ID, notification, android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION);
            } else {
                startForeground(NOTIFICATION_ID, notification);
            }
            Log.d(SCDBG, "H1: startForeground done");
        } catch (Throwable t) {
            Log.e(SCDBG, "H1: startForeground threw", t);
            stopSelf();
            return START_NOT_STICKY;
        }

        if (intent == null) {
            Log.d(SCDBG, "H2: intent null");
            return START_NOT_STICKY;
        }
        int resultCode = intent.getIntExtra("resultCode", Activity.RESULT_CANCELED);
        Intent data = null;
        try {
            if (Build.VERSION.SDK_INT >= 33) {
                data = intent.getParcelableExtra("data", Intent.class);
            } else {
                data = intent.getParcelableExtra("data");
            }
        } catch (Throwable e) {
            Log.e(TAG, "getParcelableExtra failed", e);
        }
        if (data == null || resultCode != Activity.RESULT_OK) {
            Log.e(TAG, "Invalid resultCode or data");
            stopSelf();
            return START_NOT_STICKY;
        }
        Log.d(SCDBG, "H2: intent ok, posting to main");

        streamUrl = null;
        final int rc = resultCode;
        final Intent dataIntent = data;
        // MediaProjection / VirtualDisplay : plus fiable sur le thread principal
        Handler mainHandler = new Handler(Looper.getMainLooper());
        mainHandler.post(() -> {
            try {
                Log.d(SCDBG, "H2: mainHandler.post run");
                MediaProjectionManager mgr = (MediaProjectionManager) getSystemService(MEDIA_PROJECTION_SERVICE);
                if (mgr == null) {
                    Log.d(SCDBG, "H2: mgr null");
                    stopSelf();
                    return;
                }
                MediaProjection proj = mgr.getMediaProjection(rc, dataIntent);
                if (proj == null) {
                    Log.e(TAG, "getMediaProjection returned null");
                    stopSelf();
                    return;
                }
                Log.d(SCDBG, "H2: getMediaProjection done");
                mediaProjection = proj;
                int densityDpi = getResources().getDisplayMetrics().densityDpi;
                if (densityDpi <= 0) densityDpi = 320;
                WindowManager wm = (WindowManager) getSystemService(WINDOW_SERVICE);
                if (wm == null) {
                    stopSelf();
                    return;
                }
                helper = new ScreenCaptureHelper(wm, densityDpi);
                Log.d(SCDBG, "H3: before helper.start");
                helper.start(mediaProjection);
                Log.d(SCDBG, "H3: helper.start done");
            } catch (Throwable t) {
                Log.e(SCDBG, "H2/H3: start capture failed", t);
                streamUrl = null;
                stopSelf();
                return;
            }
            new Thread(() -> {
                try { Thread.sleep(500); } catch (InterruptedException e) { return; }
                for (int i = 0; i < 80; i++) {
                    streamUrl = helper != null ? helper.getStreamUrl() : null;
                    if (streamUrl != null) {
                        Log.d(SCDBG, "H3/H4: streamUrl ready " + streamUrl);
                        break;
                    }
                    try { Thread.sleep(100); } catch (InterruptedException e) { break; }
                }
                if (streamUrl == null) {
                    Log.e(TAG, "Stream URL never ready");
                    stopSelf();
                }
            }, "ScreenCaptureService").start();
        });

        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        streamUrl = null;
        if (helper != null) {
            try { helper.stop(); } catch (Exception e) { Log.e(TAG, "helper.stop", e); }
            helper = null;
        }
        if (mediaProjection != null) {
            try { mediaProjection.stop(); } catch (Exception e) { }
            mediaProjection = null;
        }
        stopForeground(true);
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    public static String getStreamUrl() {
        return streamUrl;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID,
                    "Capture d'écran", NotificationManager.IMPORTANCE_LOW);
            channel.setShowBadge(false);
            NotificationManager mgr = getSystemService(NotificationManager.class);
            if (mgr != null) mgr.createNotificationChannel(channel);
        }
    }

    private Notification buildNotification() {
        try {
            Intent intent = getPackageManager().getLaunchIntentForPackage(getPackageName());
            PendingIntent pi = PendingIntent.getActivity(this, 0, intent != null ? intent : new Intent(), PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            return new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setContentTitle("Partage d'écran")
                    .setContentText("Capture en cours...")
                    .setSmallIcon(android.R.drawable.ic_media_play)
                    .setContentIntent(pi)
                    .setOngoing(true)
                    .setPriority(NotificationCompat.PRIORITY_LOW)
                    .build();
        } catch (Throwable t) {
            Log.e(TAG, "buildNotification", t);
            return null;
        }
    }
}
