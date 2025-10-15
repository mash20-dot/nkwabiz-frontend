export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds since epoch
    return Date.now() / 1000 > payload.exp;
  } catch {
    return true;
  }
}