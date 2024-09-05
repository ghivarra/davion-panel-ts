import Swal from "sweetalert2"
import type { Router } from "vue-router"

/**
 * @param {number} status
 */
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

/**
 * @param {string} uri
 */
const baseUrl = (uri: string = ''): string => {
    return import.meta.env.VITE_URL + `/${uri}`
}

/**
 * @param {string} uri
 * @param {null|number} width
 * @param {null|number} height
 * @param {string} priority
 */
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

/**
 * @param {string} uri
 */
const loginUrl = (uri: string): string => {
    return import.meta.env.VITE_URL + '/' + import.meta.env.VITE_LOGIN_PAGE + `/${uri}`
}

/**
 * @param {string} uri
 */
const panelUrl = (uri: string): string => {
    return import.meta.env.VITE_URL + '/' + import.meta.env.VITE_PANEL_PAGE + `/${uri}`
}

/**
 * @param {object} items
 */
const restructurized = (items: object): object => {
    return (typeof items === 'object' && Array.isArray(items)) ? [... items] : {... items}
}

/**
 * @param {Router} router
 */
interface BreadcrumbInterface {
    path: string,
    name: string,
    title: {} | null
}

const generateBreadcrumb = (router: Router): BreadcrumbInterface[] => {
    const currentPath = window.location.pathname.substring(1).split('/')
    const breadcrumbs: BreadcrumbInterface[] = []
    let eachPath = ''

    currentPath.forEach((item) => {
        eachPath += `/${item}`
        const resolvedPath = router.resolve(eachPath)
        if (resolvedPath.name !== 'pageNotFound') {
            breadcrumbs.push({
                path: eachPath,
                name: (typeof resolvedPath.name === 'undefined' || resolvedPath.name === null) ? 'page-not-found' : resolvedPath.name.toString(),
                title: (typeof resolvedPath.meta.pageName === 'undefined') ? null : resolvedPath.meta.pageName
            })
        }
    })

    // return
    return breadcrumbs;
}

/**
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 */
function parents(child: HTMLElement, parent: HTMLElement): ParentNode[] {
    const parentsElement: any[] = []
    let parentNode: ParentNode | null = child.parentNode;

    while (child !== parent && parentNode !== null) {
        parentNode = child.parentNode
        if (parentNode !== null) {
            parentsElement.push(parentNode)
        }
    }

    return parentsElement
}

export { checkAxiosError, baseUrl, imageUrl, loginUrl, panelUrl, restructurized, generateBreadcrumb, parents }
export type { BreadcrumbInterface }