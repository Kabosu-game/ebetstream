package live.ebetstream.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.webkit.PermissionRequest;
import androidx.core.content.ContextCompat;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebChromeClient;
import java.util.Arrays;

public class MediaPermissionWebChromeClient extends BridgeWebChromeClient {

    private final Bridge bridge;

    public MediaPermissionWebChromeClient(Bridge bridge) {
        super(bridge);
        this.bridge = bridge;
    }

    @Override
    public void onPermissionRequest(final PermissionRequest request) {
        if (request == null || request.getResources() == null) return;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) return;

        String[] resources = request.getResources();
        boolean needCamera = Arrays.asList(resources).contains(PermissionRequest.RESOURCE_VIDEO_CAPTURE);
        boolean needAudio  = Arrays.asList(resources).contains(PermissionRequest.RESOURCE_AUDIO_CAPTURE);
        boolean hasCamera  = !needCamera || ContextCompat.checkSelfPermission(bridge.getContext(), Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
        boolean hasAudio   = !needAudio  || ContextCompat.checkSelfPermission(bridge.getContext(), Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;

        if (hasCamera && hasAudio) {
            request.grant(resources);
            return;
        }
        super.onPermissionRequest(request);
    }
}
