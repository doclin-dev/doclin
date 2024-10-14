import replyOutline from '@iconify/icons-mdi/reply-outline';
import reloadIcon from '@iconify/icons-mdi/reload';
import dotsHorizontal from '@iconify/icons-mdi/dots-horizontal';
import keyboardBackspace from '@iconify/icons-mdi/keyboard-backspace';
import bellOutline from '@iconify/icons-mdi/bell-outline';
import openInNew from '@iconify/icons-mdi/open-in-new';
import accountPlusOutline from '@iconify/icons-mdi/account-plus-outline';
import logout from '@iconify/icons-mdi/logout';
import git from '@iconify/icons-mdi/git';
import file from '@iconify/icons-mdi/file-document';
import send from '@iconify/icons-mdi/send';
import trash from '@iconify/icons-mdi/trash';
import search from '@iconify/icons-mdi/search';
import type { IconifyIcon } from '@iconify/svelte';

export const iconsMap: { [key: string]: IconifyIcon } = {
  reply: replyOutline,
  reload: reloadIcon,
  'context-menu': dotsHorizontal,
  'back-icon': keyboardBackspace,
  notification: bellOutline,
  'open-in-new-window': openInNew,
  invite: accountPlusOutline,
  logout: logout,
  git: git,
  file: file,
  send: send,
  trash: trash,
  search: search,
};
