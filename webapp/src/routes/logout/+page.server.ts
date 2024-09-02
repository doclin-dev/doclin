import { serialize } from 'cookie';

export async function load() {
  // Clear the JWT cookie by setting an expiration date in the past
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    sameSite: 'strict',
    path: '/',
  });

  return {
    status: 302, // Redirect status code
    headers: {
      'Set-Cookie': cookie,
      Location: '/', // Redirect to home or desired URL
    },
  };
}
