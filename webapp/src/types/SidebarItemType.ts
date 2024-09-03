import type { IconifyIcon } from '@iconify/svelte';

export interface SidebarItemType {
  label: string;
  href?: string;
  subItems?: SidebarItemType[]; // Add this for nested items
  isOpen?: boolean;
  arrowIcon?: IconifyIcon;
}
