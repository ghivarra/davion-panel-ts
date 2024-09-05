// import base css
import './assets/main.scss'

// import type
import type { EnvInterface } from './interfaces/EnvInterface'

// import modules
import { createApp, h } from 'vue'
import { VueIgniter } from './libraries/Ghivarra/VueIgniter'
import { createRouter, createWebHistory } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import router from './router'
import axios from 'axios'

// set axios settings
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const env: EnvInterface = import.meta.env

router().then((routeList) => {

    // load router
    const vueRouter = createRouter({
        history: createWebHistory(),
        routes: routeList.default
    })

    // load vue igniter
    VueIgniter({
        rootId: (typeof env.VITE_APP_ID === 'undefined') ? 'app' : env.VITE_APP_ID,
        setup: (App, props, root) => {
            const app = createApp({
                render: () => h(App, props)
            })
    
            app.use(vueRouter)
            app.component('font-awesome', FontAwesomeIcon)
            app.mount(root)
        }
    })
})

