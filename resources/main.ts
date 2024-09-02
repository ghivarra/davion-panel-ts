// import base css
import './assets/main.scss'

// import type
import type { EnvInterface } from './interfaces/EnvInterface'

// import modules
import { createApp, h } from 'vue'
import router from './router'
import { VueIgniter } from './libraries/Ghivarra/VueIgniter'

const env: EnvInterface = import.meta.env

VueIgniter({
    rootId: (typeof env.VITE_APP_ID === 'undefined') ? 'app' : env.VITE_APP_ID,
    setup: (App, props, root) => {
        const app = createApp({
            render: () => h(App, props)
        })

        // app.config.unwrapInjectedRef = true
        app.use(router)
        app.mount(root)
    }
})
