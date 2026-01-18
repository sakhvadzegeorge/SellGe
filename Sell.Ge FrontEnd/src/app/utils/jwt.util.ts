export function decodeJwt(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const decoded = atob(
      payload.replace(/-/g, '+').replace(/_/g, '/')
    );

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
