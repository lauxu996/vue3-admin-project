/**
 * 权限验证工具
 */
import { useUserStore } from "@/store/modules/user";

/**
 * 检查是否有指定角色
 * @param roles 角色数组
 */
export function hasRole(roles: string[]): boolean {
  const userStore = useUserStore();
  const userRoles = userStore.roles;

  if (!roles || roles.length === 0) {
    return true;
  }

  return roles.some((role) => userRoles.includes(role));
}

/**
 * 检查是否有指定权限
 * @param permissions 权限数组
 */
export function hasPermission(permissions: string[]): boolean {
  const userStore = useUserStore();
  const userPermissions = userStore.permissions;

  if (!permissions || permissions.length === 0) {
    return true;
  }

  return permissions.some((permission) => userPermissions.includes(permission));
}

/**
 * 检查是否有任意一个角色
 */
export function hasAnyRole(roles: string[]): boolean {
  return hasRole(roles);
}

/**
 * 检查是否有任意一个权限
 */
export function hasAnyPermission(permissions: string[]): boolean {
  return hasPermission(permissions);
}
