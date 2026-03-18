export function normalizeCallbackUrl(callbackUrl?: string | null) {
  if (!callbackUrl) {
    return "/";
  }

  if (callbackUrl.startsWith("/")) {
    return callbackUrl;
  }

  try {
    const url = new URL(callbackUrl);
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return "/";
  }
}

export function getReferrerCallback(referrer?: string | null) {
  if (!referrer) {
    return "/";
  }

  try {
    const url = new URL(referrer);
    const callbackUrl = `${url.pathname}${url.search}${url.hash}` || "/";

    if (callbackUrl.startsWith("/sign-in") || callbackUrl.startsWith("/sign-up")) {
      return "/";
    }

    return callbackUrl;
  } catch {
    return "/";
  }
}
