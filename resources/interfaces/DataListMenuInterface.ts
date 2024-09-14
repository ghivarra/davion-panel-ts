interface ListChildMenuInterface {
    id: string | number,
    title: string,
    icon: string,
    status: string,
    child?: ListChildMenuInterface[]
}

interface ListMenuInterface {
    id: string | number,
    title: string,
    icon: string,
    type: string,
    status: string,
    child?: ListChildMenuInterface[]
}

interface ListGroupMenuInterface {
    id: string | number,
    name: string,
    status: string,
    child?: ListMenuInterface[]
}

export type { ListChildMenuInterface, ListGroupMenuInterface, ListMenuInterface }