import type { IconifyIcon } from '@iconify/svelte';
import type { SidebarItemAction } from './SidebarItemAction';

export interface SidebarItemType {
  label: string;
  href?: string;
  subItems?: SidebarItemType[];
  isOpen?: boolean;
  arrowIcon?: IconifyIcon;
  actions?: SidebarItemAction[];
  private?: boolean;
}
