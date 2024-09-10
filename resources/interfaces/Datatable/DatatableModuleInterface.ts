export interface DatatableModuleInterface {
    id: string | number,
    alias: string,
    name: string,
    group: string,
    status: string,
    statusDefault?: string,
    groupDefault?: string,
    action?: string,
}