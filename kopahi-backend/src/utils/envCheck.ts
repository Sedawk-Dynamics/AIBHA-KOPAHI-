import logger from "./logger";

/*
 * Validate critical environment variables on boot. Refuse to start in
 * production if any required value is missing; warn loudly in development.
 */
const REQUIRED = ["JWT_SECRET", "DATABASE_URL"] as const;
const RECOMMENDED = ["FRONTEND_URL", "JWT_EXPIRES_IN"] as const;

const checkEnv = (): void => {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  const weak = REQUIRED.filter(
    (k) =>
      !!process.env[k] && /change_me|your_|placeholder/i.test(process.env[k] as string)
  );
  const recMissing = RECOMMENDED.filter((k) => !process.env[k]);

  const isProd = process.env.NODE_ENV === "production";

  if (missing.length || weak.length) {
    logger.error("env_invalid", { missing, weak });
    if (isProd) {
      // eslint-disable-next-line no-console
      console.error("Refusing to start in production with missing/weak env vars.");
      process.exit(1);
    }
  }

  if (recMissing.length) {
    logger.warn("env_recommended_missing", { recMissing });
  }
};

export default checkEnv;
