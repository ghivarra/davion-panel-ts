interface RoleModuleInterface {
    id: string | number,
    name: string,
    group: string,
    checked: boolean
}

interface RoleGroupModuleInterface {
    name: string,
    checked: boolean,
    modules: RoleModuleInterface[]
}

export type { RoleModuleInterface, RoleGroupModuleInterface }