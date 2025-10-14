export function isAuthenticated() {
  return !!localStorage.getItem("access_token");
}
export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("business_name");
}