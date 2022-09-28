package com.learnium.RNDeviceInfo;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.location.LocationManager;
import android.os.Build;
import android.provider.Settings;
import android.text.TextUtils;
import android.app.ActivityManager;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.Nonnull;
import static android.provider.Settings.Secure.getString;

@ReactModule(name = RNDeviceModule.NAME)
public class RNDeviceModule extends ReactContextBaseJavaModule {
  public static final String NAME = "RNDeviceInfo";

  public RNDeviceModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @Nonnull
  public String getName() {
    return NAME;
  }

  @Override
  public Map<String, Object> getConstants() {
    String appVersion, buildNumber, appName;

    try {
      appVersion = getPackageInfo().versionName;
      buildNumber = Integer.toString(getPackageInfo().versionCode);
      appName = getReactApplicationContext().getApplicationInfo().loadLabel(getReactApplicationContext().getPackageManager()).toString();
    } catch (Exception e) {
      appVersion = "unknown";
      buildNumber = "unknown";
      appName = "unknown";
    }

    final Map<String, Object> constants = new HashMap<>();

    constants.put("deviceId", Build.BOARD);
    constants.put("bundleId", getReactApplicationContext().getPackageName());
    constants.put("systemName", "Android");
    constants.put("systemVersion", Build.VERSION.RELEASE);
    constants.put("appVersion", appVersion);
    constants.put("buildNumber", buildNumber);
    constants.put("appName", appName);
    constants.put("brand", Build.BRAND);
    constants.put("model", Build.MODEL);

    return constants;
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean isLocationEnabledSync() {
    boolean locationEnabled;

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      LocationManager mLocationManager = (LocationManager) getReactApplicationContext().getSystemService(Context.LOCATION_SERVICE);
      try {
        locationEnabled = mLocationManager.isLocationEnabled();
      } catch (Exception e) {
        System.err.println("Unable to determine if location enabled. LocationManager was null");
        return false;
      }
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
      int locationMode = Settings.Secure.getInt(getReactApplicationContext().getContentResolver(), Settings.Secure.LOCATION_MODE, Settings.Secure.LOCATION_MODE_OFF);
      locationEnabled = locationMode != Settings.Secure.LOCATION_MODE_OFF;
    } else {
      String locationProviders = getString(getReactApplicationContext().getContentResolver(), Settings.Secure.LOCATION_PROVIDERS_ALLOWED);
      locationEnabled = !TextUtils.isEmpty(locationProviders);
    }

    return locationEnabled;
  }
  @ReactMethod
  public void isLocationEnabled(Promise p) { p.resolve(isLocationEnabledSync()); }


  private PackageInfo getPackageInfo() throws Exception {
    return getReactApplicationContext().getPackageManager().getPackageInfo(getReactApplicationContext().getPackageName(), 0);
  }

  @SuppressLint("HardwareIds")
  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getUniqueIdSync() { return getString(getReactApplicationContext().getContentResolver(), Settings.Secure.ANDROID_ID); }
  @ReactMethod
  public void getUniqueId(Promise p) {
    p.resolve(getUniqueIdSync());
  }


  @ReactMethod(isBlockingSynchronousMethod = true)
  public double getTotalMemorySync() {
    ActivityManager actMgr = (ActivityManager) getReactApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
    ActivityManager.MemoryInfo memInfo = new ActivityManager.MemoryInfo();
    if (actMgr != null) {
      actMgr.getMemoryInfo(memInfo);
    } else {
      System.err.println("Unable to getMemoryInfo. ActivityManager was null");
      return -1;
    }
    return (double)memInfo.totalMem;
  }
  @ReactMethod
  public void getTotalMemory(Promise p) { p.resolve(getTotalMemorySync()); }

}
