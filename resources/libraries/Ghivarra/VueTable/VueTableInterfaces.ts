interface ColumnInterface {
    query: string,
    text: string,
    key: string, 
    sortable?: boolean, 
    searchable?: boolean,
    class?: string[],
}

interface PropInterface {
    url: string,
    id?: string,
    language?: string,
    headers?: object,
    defaultLength?: number,
    lengthOptions?: number[],
    order?: {
        column: string,
        dir: string,
    },
    loadingText?: string,
    emptyText?: string,
    columns?: ColumnInterface[],
    processData?: () => void
}

interface VueTableInterface {
    draw: number,
    length: number,
    recordsTotal: number,
    recordsFiltered: number,
    row: any[]
}

export type { VueTableInterface, PropInterface, ColumnInterface }