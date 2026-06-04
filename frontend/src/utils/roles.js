export const roleLabel = (role) => {
  if (role === "admin") return "Administrator";
  if (role === "worker") return "Pracownik";
  return role || "-";
};