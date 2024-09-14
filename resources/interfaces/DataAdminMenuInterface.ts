export interface DataAdminMenuInterface {
    id: string | number,
    status: string,
    title: string,
    router_name: string,
    icon: string,
    type: string,
    admin_menu_parent_id: string | number | null,
    admin_menu_group_id: string | number,
    admin_menu_group_name: string
}