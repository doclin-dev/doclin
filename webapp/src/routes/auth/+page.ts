import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
  const token = url.searchParams.get('token');
  if (token) {
    localStorage.setItem('auth_token', token);
  }
  window.location.href = '/';
  return {};
};
