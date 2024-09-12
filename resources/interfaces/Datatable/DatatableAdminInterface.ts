export interface DatatableAdminInterface {
    id: number | string,
    username: string,
    name: string,
    email: string,
    email_verified_at: string,
    status: string,
    admin_role_id: number | string,
    admin_role_name: string,
    is_superadmin: number | string,
    photo: string | null,
}