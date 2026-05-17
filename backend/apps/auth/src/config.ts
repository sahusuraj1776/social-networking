export const SALT_OR_ROUNDS = 10;
export const JWT_SECRET = process.env.JWT_SECRET || 'Secret-key';
export const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
export const DB_USERNAME = process.env.DB_USERNAME || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
export const DB_DATABASE = process.env.DB_DATABASE || 'social-website';