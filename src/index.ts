import { Platform } from 'react-native';
import devicesWithNotch from './internal/devicesWithNotch';
import RNDeviceInfo from './internal/nativeInterface';
import {
  getSupportedPlatformInfoFunctions,
  getSupportedPlatformInfoSync,
} from './internal/supported-platform-info';
import { DeviceInfoModule } from './internal/privateTypes';
import type {
  AsyncHookResult,
  DeviceType,
  LocationProviderInfo,
  PowerState,
} from './internal/types';

export const [getUniqueId, getUniqueIdSync] = getSupportedPlatformInfoFunctions({
  memoKey: 'uniqueId',
  supportedPlatforms: ['android', 'ios', 'windows'],
  getter: () => RNDeviceInfo.getUniqueId(),
  syncGetter: () => RNDeviceInfo.getUniqueIdSync(),
  defaultValue: 'unknown',
});

let uniqueId: string;
export async function syncUniqueId() {
  if (Platform.OS === 'ios') {
    uniqueId = await RNDeviceInfo.syncUniqueId();
  } else {
    uniqueId = await getUniqueId();
  }
  return uniqueId;
}

export const getModel = () =>
  getSupportedPlatformInfoSync({
    memoKey: 'model',
    defaultValue: 'unknown',
    supportedPlatforms: ['ios', 'android', 'windows'],
    getter: () => RNDeviceInfo.model,
  });

export const getBrand = () =>
  getSupportedPlatformInfoSync({
    memoKey: 'brand',
    supportedPlatforms: ['android', 'ios', 'windows'],
    defaultValue: 'unknown',
    getter: () => RNDeviceInfo.brand,
  });

export const getSystemVersion = () =>
  getSupportedPlatformInfoSync({
    defaultValue: 'unknown',
    getter: () => RNDeviceInfo.systemVersion,
    supportedPlatforms: ['android', 'ios', 'windows'],
    memoKey: 'systemVersion',
  });

export const getBundleId = () =>
  getSupportedPlatformInfoSync({
    memoKey: 'bundleId',
    supportedPlatforms: ['android', 'ios', 'windows'],
    defaultValue: 'unknown',
    getter: () => RNDeviceInfo.bundleId,
  });

export const getBuildNumber = () =>
  getSupportedPlatformInfoSync({
    memoKey: 'buildNumber',
    supportedPlatforms: ['android', 'ios', 'windows'],
    getter: () => RNDeviceInfo.buildNumber,
    defaultValue: 'unknown',
  });

export const getVersion = () =>
  getSupportedPlatformInfoSync({
    memoKey: 'version',
    defaultValue: 'unknown',
    supportedPlatforms: ['android', 'ios', 'windows'],
    getter: () => RNDeviceInfo.appVersion,
  });

let notch: boolean;
export function hasNotch() {
  if (notch === undefined) {
    let _brand = getBrand();
    let _model = getModel();
    notch =
      devicesWithNotch.findIndex(
        (item) =>
          item.brand.toLowerCase() === _brand.toLowerCase() &&
          item.model.toLowerCase() === _model.toLowerCase()
      ) !== -1;
  }
  return notch;
}

export const [getTotalMemory, getTotalMemorySync] = getSupportedPlatformInfoFunctions({
  memoKey: 'totalMemory',
  supportedPlatforms: ['android', 'ios', 'windows', 'web'],
  getter: () => RNDeviceInfo.getTotalMemory(),
  syncGetter: () => RNDeviceInfo.getTotalMemorySync(),
  defaultValue: -1,
});

export const [isLocationEnabled, isLocationEnabledSync] = getSupportedPlatformInfoFunctions({
  supportedPlatforms: ['android', 'ios', 'web'],
  getter: () => RNDeviceInfo.isLocationEnabled(),
  syncGetter: () => RNDeviceInfo.isLocationEnabledSync(),
  defaultValue: false,
});


export type { AsyncHookResult, DeviceType, LocationProviderInfo, PowerState };

const deviceInfoModule: DeviceInfoModule = {
  syncUniqueId,
  getModel,
  isLocationEnabled,
  isLocationEnabledSync,
  hasNotch,
  getUniqueId,
  getUniqueIdSync,
  getVersion,
  getTotalMemory,
  getTotalMemorySync,
  getSystemVersion,
  getBuildNumber,
  getBundleId,
  getBrand
};

export default deviceInfoModule;
