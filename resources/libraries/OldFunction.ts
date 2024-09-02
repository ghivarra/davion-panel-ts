import Swal from 'sweetalert2'

/**
 * @param {string} uri
 */
function baseUrl(uri: string = ''): string {
    return import.meta.env.VITE_URL + `/${uri}`
}

/**
 * @param {interface} status
 */
function checkAxiosError(status: number): void {

    let switchNotDetected = false

    switch (status) {
        case 400:
            Swal.fire('Whoopss!!', 'Ada kesalahan dalam pengisian form', 'error')
            break;

        case 401:
            Swal.fire('Whoopss!!', 'Sesi login anda sudah kedaluwarsa, silahkan login kembali', 'warning').then(() => {
                window.location.reload()
            })
            break;
        
        case 403:
            Swal.fire('Whoopss!!', 'Anda tidak memiliki izin untuk mengakses halaman ini', 'error').then(() => {
                window.history.back()
            })
            break;

        case 404:
            Swal.fire('Whoopss!!', 'Halaman Tidak Ditemukan', 'error')
            break;
            
        default:
            switchNotDetected = true
            break;
    }

    if (switchNotDetected && status >= 500) {
        Swal.fire('Whoopss!!', 'Server sedang sibuk, silahkan coba lagi dalam beberapa saat', 'warning')
    }
}

/**
 * @param {string} uri
 * @param {string|null|integer} width
 * @param {string|null|integer} height
 * @param {string} priority
 */
function imageUrl(uri: string, width: number | null = null, height: number | null = null, priority: string = 'width'): string {
    let url = baseUrl(`assets/images/${uri}?priority=${priority}`)

    if (width !== null)
    {
        url += `&width=${width}`
    }

    if (height !== null)
    {
        url += `&height=${height}`
    }

    return url
}

/**
 * @param {string} uri
 */
function loginUrl(uri: string): string {
    return import.meta.env.VITE_URL + '/' + import.meta.env.VITE_LOGIN_PAGE + `/${uri}`
}

/**
 * @param {string} uri
 */
function panelUrl(uri: string): string {
    return import.meta.env.VITE_URL + '/' + import.meta.env.VITE_PANEL_PAGE + `/${uri}`
}

/**
 * @param {object} obj
 */
function restructurized(obj: object): object {
    return {... obj}
}

// export functions
export { baseUrl, checkAxiosError, imageUrl, loginUrl, panelUrl, restructurized }