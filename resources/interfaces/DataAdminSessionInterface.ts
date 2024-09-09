export interface DataAdminSessionInterface {
    id: string | number,
    useragent: {
        browser: string | null,
        os: string | null,
        mobile: boolean,
        platform: string
    },
    ip_address: string,
    last_update: string,
    current: boolean
}