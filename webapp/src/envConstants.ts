import { PUBLIC_API_URL } from '$env/static/public';

export const API_URL = PUBLIC_API_URL || 'http://localhost:3000';

export const PRODUCTION = process.env.NODE_ENV === 'production';
