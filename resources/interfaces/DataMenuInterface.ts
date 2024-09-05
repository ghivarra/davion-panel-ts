interface ChildMenuInterface {
    id: string | number,
    title: string,
    router_name: string,
    parent_id: string | number
}

interface MenuInterface {
    id: string | number,
    title: string,
    router_name: string | null,
    icon: string | null,
    type: string,
    admin_menu_group_id: string | number,
    admin_menu_group_name: string,
    childs?: ChildMenuInterface[]
}

export interface DataMenuInterface {
    id: string | number,
    name: string,
    menu: MenuInterface[],
}