export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch { return null; }
}

export function hasRole(role) {
  const u = getUser();
  return u && u.rol === role;
}

export function logout() {
  localStorage.clear();
  window.location.href = '/';
}