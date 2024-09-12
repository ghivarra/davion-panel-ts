interface RoleChildMenuInterface {
    id: string | number,
    title: string,
    type: string,
    group_name: string,
    admin_menu_parent_id: string | number,
    checked: boolean
}

interface RoleMenuInterface {
    id: string | number,
    title: string,
    type: string,
    group_name: string,
    admin_menu_parent_id: null,
    checked: boolean,
    childs: RoleChildMenuInterface[]
}

interface RoleGroupMenuInterface {
    name: string,
    menus: RoleMenuInterface[]
}

export type { RoleChildMenuInterface, RoleMenuInterface, RoleGroupMenuInterface }