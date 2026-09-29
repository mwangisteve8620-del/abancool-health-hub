import { useNavigate } from "@tanstack/react-router";
import { DEMO_USERS, ROLE_LABELS, can, navForRole } from "./rbac";
import { authService } from "./services";
import { useHimsState } from "./store";
import type { PermissionLevel, PermissionModule, User } from "./types";

export function useAuth() {
  const state = useHimsState();
  const navigate = useNavigate();
  const user: User | null = DEMO_USERS.find((u) => u.id === state.session.user_id) ?? null;

  return {
    user,
    isAuthenticated: !!user,
    roleLabel: user ? ROLE_LABELS[user.role] : "Guest",
    nav: user ? navForRole(user.role) : [],
    can: (module: PermissionModule, level: PermissionLevel = "view") => (user ? can(user.role, module, level) : false),
    async loginAs(userId: string) {
      const res = await authService.loginAs(userId);
      const target = res.data.role === "patient" ? "/portal" : "/app";
      await navigate({ to: target });
      return res;
    },
    logout() {
      authService.logout();
      void navigate({ to: "/" });
    },
  };
}
