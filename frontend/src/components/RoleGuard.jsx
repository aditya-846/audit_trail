import { useAuth } from "../context/AuthContext";

export default function RoleGuard({
  allowedRoles = [],
  children,
  fallback = null,
}) {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  if (allowedRoles.length === 0) {
    return children;
  }

  const hasPermission = allowedRoles.includes(user.role);

  if (!hasPermission) {
    return fallback;
  }

  return children;
}
