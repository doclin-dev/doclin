export interface SidebarItemType {
  label: string;
  href?: string;
  subItems?: SidebarItemType[]; // Add this for nested items
}
