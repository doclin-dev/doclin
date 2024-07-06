export const PRODUCTION = process.env.NODE_ENV === 'production';
export const API_BASE_URL = PRODUCTION ? 'https://api.doclin.dev' : 'http://localhost:3000';
