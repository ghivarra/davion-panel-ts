import Swal from "sweetalert2"

const checkAxiosError = (status: number): void => {

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

const baseUrl = (uri: string = ''): string => {
    return import.meta.env.VITE_URL + `/${uri}`
}

const imageUrl = (uri: string, width: number | null = null, height: number | null = null, priority: string = 'width'): string => {
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

const loginUrl = (uri: string): string => {
    return import.meta.env.VITE_URL + '/' + import.meta.env.VITE_LOGIN_PAGE + `/${uri}`
}

const panelUrl = (uri: string): string => {
    return import.meta.env.VITE_URL + '/' + import.meta.env.VITE_PANEL_PAGE + `/${uri}`
}

const restructurized = (items: object): object => {
    return (typeof items === 'object' && Array.isArray(items)) ? [... items] : {... items}
}

export { checkAxiosError, baseUrl, imageUrl, loginUrl, panelUrl, restructurized }