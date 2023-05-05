import { Platform } from 'react-native';
import type { DeviceType } from './types';

export type NotchDevice = {
  brand: string;
  model: string;

  [key: string]: string;
};

interface NativeConstants {
  appName: string;
  appVersion: string;
  brand: string;
  buildNumber: string;
  bundleId: string;
  deviceId: string;
  deviceType: DeviceType;
  isTablet: boolean;
  model: string;
  systemName: string;
  systemVersion: string;
}

interface ExposedNativeMethods {
  getTotalMemory: () => Promise<number>;
  getTotalMemorySync: () => number;
  getUniqueId: () => Promise<string>;
  getUniqueIdSync: () => string;
  isLocationEnabled: () => Promise<boolean>;
  isLocationEnabledSync: () => boolean;
  syncUniqueId: () => Promise<string>;
}

export interface DeviceInfoNativeModule extends NativeConstants, ExposedNativeMethods {}

export interface DeviceInfoModule extends ExposedNativeMethods {
  getBrand: () => string;
  getBuildNumber: () => string;
  getBundleId: () => string;
  getModel: () => string;
  getSystemVersion: () => string;
  getUniqueId: () => Promise<string>;
  getUniqueIdSync: () => string;
  getVersion: () => string;
  hasNotch: () => boolean;
  isTablet: () => boolean;
}

export type Getter<T> = () => T;
export type PlatformArray = typeof Platform.OS[];

export interface GetSupportedPlatformInfoSyncParams<T> {
  getter: Getter<T>;
  supportedPlatforms: PlatformArray;
  defaultValue: T;
  memoKey?: string;
}

export interface GetSupportedPlatformInfoAsyncParams<T>
  extends Omit<GetSupportedPlatformInfoSyncParams<T>, 'getter'> {
  getter: Getter<Promise<T>>;
}

export interface GetFilterPlatformFunctionsParams<T>
  extends GetSupportedPlatformInfoAsyncParams<T> {
  syncGetter: Getter<T>;
}

export interface GetSupportedPlatformInfoFunctionsParams<T>
  extends GetSupportedPlatformInfoAsyncParams<T> {
  syncGetter: Getter<T>;
}
