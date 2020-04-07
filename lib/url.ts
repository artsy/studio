export const normalizeParam = param =>
  param.replace(/[\W_]+/g, "_").toLowerCase();
