package live.ebetstream.app;

import android.app.Activity;
import android.content.Intent;
import android.media.projection.MediaProjectionManager;
import android.os.Build;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Sur Android 14+, le token MediaProjection expire si on ne démarre pas
 * le service IMMÉDIATEMENT dans onActivityResult. On fusionne donc
 * requestPermission + startStream en un seul appel.
 */
@CapacitorPlugin(name = "ScreenCapture", requestCodes = { ScreenCapturePlugin.REQUEST_MEDIA_PROJECTION })
public class ScreenCapturePlugin extends Plugin {

    public static final int REQUEST_MEDIA_PROJECTION = 9001;
    private static final String TAG = "ScreenCapturePlugin";

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode != REQUEST_MEDIA_PROJECTION) return;

        PluginCall call = getSavedCall();
        if (call == null) return;

        if (resultCode != Activity.RESULT_OK || data == null) {
            call.reject("Permission refusée");
            getBridge().releaseCall(call);
            return;
        }

        // Android 14+ : démarrer le service IMMÉDIATEMENT avec le token
        Activity activity = getActivity();
        Intent svcIntent = new Intent(activity, ScreenCaptureService.class);
        svcIntent.putExtra("resultCode", resultCode);
        svcIntent.putExtra("data", data);
        try {
            if (Build.VERSION.SDK_INT >= 26) {
                activity.startForegroundService(svcIntent);
            } else {
                activity.startService(svcIntent);
            }
        } catch (Throwable t) {
            Log.e(TAG, "startForegroundService failed", t);
            call.reject("Erreur démarrage service : " + t.getMessage());
            getBridge().releaseCall(call);
            return;
        }

        // Attendre que le serveur HTTP soit prêt (max 9s)
        new Thread(() -> {
            String url = null;
            for (int i = 0; i < 90; i++) {
                try { Thread.sleep(100); } catch (InterruptedException e) { break; }
                url = ScreenCaptureService.getStreamUrl();
                if (url != null) break;
            }
            final String finalUrl = url;
            Activity a = getActivity();
            if (a == null || a.isDestroyed()) return;
            a.runOnUiThread(() -> {
                if (finalUrl != null) {
                    JSObject ret = new JSObject();
                    ret.put("url", finalUrl);
                    ret.put("granted", true);
                    call.resolve(ret);
                } else {
                    try { activity.stopService(new Intent(activity, ScreenCaptureService.class)); } catch (Exception ignored) {}
                    call.reject("Serveur de capture non disponible");
                }
                getBridge().releaseCall(call);
            });
        }, "ScreenCaptureWait").start();
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) { call.reject("Activity not available"); return; }
        MediaProjectionManager mgr =
            (MediaProjectionManager) activity.getSystemService(Activity.MEDIA_PROJECTION_SERVICE);
        if (mgr == null) { call.reject("MediaProjection not available"); return; }
        startActivityForResult(call, mgr.createScreenCaptureIntent(), REQUEST_MEDIA_PROJECTION);
    }

    @PluginMethod
    public void stopStream(PluginCall call) {
        Activity activity = getActivity();
        if (activity != null) {
            activity.stopService(new Intent(activity, ScreenCaptureService.class));
        }
        call.resolve();
    }
}
