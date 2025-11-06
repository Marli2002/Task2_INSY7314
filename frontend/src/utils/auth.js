export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function hasRole(role) {
  const user = getUser();
  return user?.role === role;
}
