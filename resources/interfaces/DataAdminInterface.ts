export interface DataAdminInterface {
    id: number,
    username: string,
    name: string,
    email: string,
    email_verified_at: string,
    status: string,
    admin_role_id: number,
    admin_role_name: string,
    is_superadmin: number,
    photo: string | null,
}