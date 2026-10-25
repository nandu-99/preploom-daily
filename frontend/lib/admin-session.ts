const adminTokenKey = "preploom-admin-token";

export function getAdminToken() {
  return sessionStorage.getItem(adminTokenKey);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(adminTokenKey, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(adminTokenKey);
}
