export const firstIfMany = <T>(arg: T | T[]): T => {
  if (Array.isArray(arg)) {
    return arg[0];
  }
  return arg;
};
