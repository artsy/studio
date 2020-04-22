export const env = (envName: string) => {
  const value = process.env[envName];
  if (!value) {
    throw new Error(
      `Missing environment variable ${envName}, add it to your .env`
    );
  }
  return value;
};
