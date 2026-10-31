export function shouldUseSecureCookies(isProduction: boolean): boolean {
  return isProduction && process.env.COOKIE_SECURE !== "false";
}
