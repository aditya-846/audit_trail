// src/utils/permissions.js

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  OPERATOR: "operator",
  VIEWER: "viewer",
};

export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_SHIPMENTS: "view_shipments",
  CREATE_SHIPMENT: "create_shipment",
  EDIT_SHIPMENT: "edit_shipment",
  DELETE_SHIPMENT: "delete_shipment",

  VIEW_AUDIT_LOGS: "view_audit_logs",
  EXPORT_AUDIT_LOGS: "export_audit_logs",

  VIEW_LIVE_MONITOR: "view_live_monitor",
  VIEW_SENSOR_DATA: "view_sensor_data",
  VIEW_MAP: "view_map",

  MANAGE_USERS: "manage_users",
  MANAGE_SETTINGS: "manage_settings",
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_SHIPMENTS,
    PERMISSIONS.CREATE_SHIPMENT,
    PERMISSIONS.EDIT_SHIPMENT,
    PERMISSIONS.DELETE_SHIPMENT,

    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.EXPORT_AUDIT_LOGS,

    PERMISSIONS.VIEW_LIVE_MONITOR,
    PERMISSIONS.VIEW_SENSOR_DATA,
    PERMISSIONS.VIEW_MAP,

    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_SETTINGS,
  ],

  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_SHIPMENTS,
    PERMISSIONS.CREATE_SHIPMENT,
    PERMISSIONS.EDIT_SHIPMENT,

    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.EXPORT_AUDIT_LOGS,

    PERMISSIONS.VIEW_LIVE_MONITOR,
    PERMISSIONS.VIEW_SENSOR_DATA,
    PERMISSIONS.VIEW_MAP,
  ],

  [ROLES.OPERATOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_SHIPMENTS,
    PERMISSIONS.CREATE_SHIPMENT,
    PERMISSIONS.EDIT_SHIPMENT,

    PERMISSIONS.VIEW_LIVE_MONITOR,
    PERMISSIONS.VIEW_SENSOR_DATA,
    PERMISSIONS.VIEW_MAP,
  ],

  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_SHIPMENTS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.VIEW_LIVE_MONITOR,
    PERMISSIONS.VIEW_SENSOR_DATA,
    PERMISSIONS.VIEW_MAP,
  ],
};

export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;

  const rolePermissions = ROLE_PERMISSIONS[role.toLowerCase()];

  if (!rolePermissions) return false;

  return rolePermissions.includes(permission);
};

export const hasAnyPermission = (role, permissions = []) => {
  return permissions.some((permission) =>
    hasPermission(role, permission)
  );
};

export const hasAllPermissions = (role, permissions = []) => {
  return permissions.every((permission) =>
    hasPermission(role, permission)
  );
};

export const isAdmin = (role) => {
  return role?.toLowerCase() === ROLES.ADMIN;
};

export const isManager = (role) => {
  return role?.toLowerCase() === ROLES.MANAGER;
};

export const isOperator = (role) => {
  return role?.toLowerCase() === ROLES.OPERATOR;
};

export const isViewer = (role) => {
  return role?.toLowerCase() === ROLES.VIEWER;
};