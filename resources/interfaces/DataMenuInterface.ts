interface ChildMenuInterface {
    id: string | number,
    title: string,
    router_name: string,
    parent_id: string | number,
    is_active?: boolean ,
}

interface MenuInterface {
    id: string | number,
    title: string,
    router_name: string | null,
    icon: string | null,
    type: string,
    admin_menu_group_id: string | number,
    admin_menu_group_name: string,
    childs?: ChildMenuInterface[],
    is_active?: boolean,
}

interface GroupMenuInterface {
    id: string | number,
    name: string,
    menu: MenuInterface[],
}

export type { GroupMenuInterface, MenuInterface, ChildMenuInterface }