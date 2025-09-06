import { headers } from "next/headers";

export type DeviceType = "mobile" | "tablet" | "desktop";

export interface DeviceDetection {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Detects device type based on user agent header
 * @returns DeviceDetection object with device information
 */
export async function getDeviceDetection(): Promise<DeviceDetection> {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent")?.toLowerCase() || "";
  
  // Mobile device detection patterns
  const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
  const tabletRegex = /ipad|android(?!.*mobile)|tablet/i;
  
  let deviceType: DeviceType = "desktop";
  
  if (tabletRegex.test(userAgent)) {
    deviceType = "tablet";
  } else if (mobileRegex.test(userAgent)) {
    deviceType = "mobile";
  }
  
  return {
    deviceType,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop"
  };
}