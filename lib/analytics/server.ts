function detectDeviceType(userAgent: string) {
  const value = userAgent.toLowerCase();

  if (/tablet|ipad|playbook|silk/.test(value)) {
    return "tablet";
  }

  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(value)) {
    return "mobile";
  }

  return "desktop";
}

function detectBrowser(userAgent: string) {
  const value = userAgent.toLowerCase();

  if (value.includes("edg/")) return "Edge";
  if (value.includes("opr/") || value.includes("opera")) return "Opera";
  if (value.includes("chrome/")) return "Chrome";
  if (value.includes("safari/") && !value.includes("chrome/")) return "Safari";
  if (value.includes("firefox/")) return "Firefox";

  return "Outro";
}

function detectOs(userAgent: string) {
  const value = userAgent.toLowerCase();

  if (value.includes("windows")) return "Windows";
  if (value.includes("iphone") || value.includes("ipad") || value.includes("ios")) return "iOS";
  if (value.includes("android")) return "Android";
  if (value.includes("mac os")) return "macOS";
  if (value.includes("linux")) return "Linux";

  return "Outro";
}

export function parseRequestContext(userAgent: string) {
  return {
    deviceType: detectDeviceType(userAgent),
    browser: detectBrowser(userAgent),
    os: detectOs(userAgent)
  };
}

export function parseReferrerHost(referrer?: string | null) {
  if (!referrer) {
    return "";
  }

  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

