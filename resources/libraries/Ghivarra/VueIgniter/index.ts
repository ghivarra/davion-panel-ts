import type { Component } from "vue"

interface VueIgniterOptions {
    rootId: string,
    setup: (pageDefault: object, data: object, id: string) => void,
}

const VueIgniter = (options: VueIgniterOptions): void => {

    // get element
    const id: string = (typeof options.rootId === 'undefined') ? '#app' : `#${options.rootId}`
    const element = document.querySelector(id)

    // get attributes from element
    const attributeData = element?.getAttribute('data-page')
    const pageData: { data: object, view: string } = (attributeData === null || typeof attributeData === 'undefined') ? {} : JSON.parse(attributeData)

    // get module name and type
    const moduleName = `/${import.meta.env.VITE_RESOURCES_DIR}/views/${pageData.view}.vue`

    // uncomment this if using chunked
    // const allPages = import.meta.glob('@/views/**/*.vue', { eager: false})
    // type AsyncComponent = () => Promise<{ default: Component }>
    // const page = allPages[moduleName] as AsyncComponent
    // page().then((app) => {
    //    options.setup(app.default, Object.assign({}, pageData.data), id)
    // })

    // uncomment this if using single file
    type Module = { default: Component }
    const allPages: Record<string, Module> = import.meta.glob('@/views/**/*.vue', { eager: true})
    const page = allPages[moduleName]
    options.setup(page.default, Object.assign({}, pageData.data), id)
}

export { VueIgniter }