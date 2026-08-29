// src/utils/constants.js

export const APP_NAME = "Audit Trail";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",

  SHIPMENTS: "/shipments",
  AUDIT_LOGS: "/audit-logs",
  LIVE_MONITOR: "/live-monitor",
  MAP_VIEW: "/map-view",
  SENSOR_DATA: "/sensor-data",
};

export const STORAGE_KEYS = {
  TOKEN: "syncspace_token",
  USER: "syncspace_user",
};

export const SHIPMENT_STATUS = {
  PENDING: "pending",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  DELAYED: "delayed",
  CANCELLED: "cancelled",
};

export const SHIPMENT_STATUS_LABELS = {
  [SHIPMENT_STATUS.PENDING]: "Pending",
  [SHIPMENT_STATUS.IN_TRANSIT]: "In Transit",
  [SHIPMENT_STATUS.DELIVERED]: "Delivered",
  [SHIPMENT_STATUS.DELAYED]: "Delayed",
  [SHIPMENT_STATUS.CANCELLED]: "Cancelled",
};

export const SENSOR_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  WARNING: "warning",
};

export const SENSOR_TYPES = {
  TEMPERATURE: "temperature",
  HUMIDITY: "humidity",
  PRESSURE: "pressure",
  LOCATION: "location",
};

export const AUDIT_ACTIONS = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  LOGIN: "login",
  LOGOUT: "logout",
  VIEW: "view",
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const DATE_FORMATS = {
  DATE: "DD MMM YYYY",
  DATE_TIME: "DD MMM YYYY, hh:mm A",
};

export const MAP_DEFAULTS = {
  LATITUDE: 17.385,
  LONGITUDE: 78.4867,
  ZOOM: 10,
};

export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  USERS: "/users",

  SHIPMENTS: "/shipments",
  AUDIT_LOGS: "/audit-logs",
  SENSOR_DATA: "/sensor-data",
  LIVE_EVENTS: "/live-events",
};

export const LOCAL_STORAGE = {
  TOKEN: STORAGE_KEYS.TOKEN,
  USER: STORAGE_KEYS.USER,
};