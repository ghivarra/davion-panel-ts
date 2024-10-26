<template>
    <div class="d-flex">

        <!-- BACKDROP FOR SIDEBAR -->
        <div v-if="showSidebar" v-on:click.prevent="toggleSidebar" id="sidebarBackdrop"></div>

        <!-- SIDEBAR -->
        <aside>
            <PanelSidebarComponent ref="PanelSidebarRef" v-bind:activeMenu="activeMenuId" v-bind:activeParentMenu="activeParentMenuId"
            v-bind:menu="menu" v-bind:showSidebar="showSidebar" v-on:sidebarToggleClick="toggleSidebar" />
        </aside>

        <!-- MAIN -->
        <div class="panel-body px-4 py-3">

            <!-- PRELOADER -->
            <div v-show="useLoader">
                <Transition name="loader">
                    <PreloadComponent v-if="loaderState" />
                </Transition>
            </div>

            <!-- HEADER -->
             <PanelHeaderComponent v-on:sidebarToggleClick="toggleSidebar" />

            <!-- VIEW -->
            <router-view v-slot="{ Component }">
                <component v-on:loaded="stopLoader" v-bind:is="Component">
                    <template v-slot:breadcrumb>
                        <header class="panel-main-header my-4 justify-content-between align-items-center">
                            <h4 class="panel-main-header-title text-primary fw-bold">{{
                $router.currentRoute.value.meta.pageName }}</h4>
                            <div class="d-flex align-items-center">
                                <router-link v-for="(bread, n) in breadcrumbs" v-bind:key="n"
                                    v-bind:to="{ name: bread.name }" class="text-decoration-none link-secondary">
                                    <span v-if="(n > 0)" class="mx-1">/</span>
                                    {{ bread.title }}
                                </router-link>
                            </div>
                        </header>
                    </template>
                </component>
            </router-view>
        </div>

    </div>
</template>

<script setup lang="ts">

// import components
import PreloadComponent from '@/components/PreloadComponent.vue'
import PanelHeaderComponent from '@/components/PanelHeaderComponent.vue'
import PanelSidebarComponent from '@/components/PanelSidebarComponent.vue'

// import library
import { dom } from '@fortawesome/fontawesome-svg-core'
import { computed, ref, nextTick, provide, onMounted, watch } from 'vue'
import { panelUrl, checkAxiosError, generateBreadcrumb, baseUrl, imageUrl } from '@/libraries/Helpers'
import axios from 'axios'
import swal from 'sweetalert'
import { useRouter, useRoute } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faPenToSquare, faSliders, faTrashCan, faPlus, faMagnifyingGlass, faXmark, faGear, faKey, faRightFromBracket, faTableCellsLarge, faUser, faUserTie, faTableColumns, faGlobe, faChevronRight, faSave, faEllipsisVertical, faEye, faEyeSlash, faEnvelope, faClockRotateLeft, faCircleInfo, faList, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from "@fortawesome/free-regular-svg-icons"

// import types / interfaces
import type { Ref } from 'vue'
import type { BreadcrumbInterface } from '@/libraries/Helpers'
import type { WebsiteInfoInterface } from '@/interfaces/WebsiteInfoInterface'
import type { EnvInterface } from '@/interfaces/EnvInterface'
import type { GroupMenuInterface, MenuInterface, ChildMenuInterface } from '@/interfaces/DataMenuInterface'
import type { DataAdminInterface } from '@/interfaces/DataAdminInterface'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'

// font awesome
library.add(faBars, faPenToSquare, faSliders, faTrashCan, faPlus, faMagnifyingGlass, faXmark, faGear, faKey, faRightFromBracket, faTableCellsLarge, faUser, faUserTie, faTableColumns, faGlobe, faChevronRight, faSave, faEllipsisVertical, faEye, faEyeSlash, faEnvelope, faClockRotateLeft, faCircleInfo, faList, faCircle, faFloppyDisk)

// env
const env: EnvInterface = import.meta.env
const router = useRouter()
const route = useRoute()

// props
const props = defineProps<{
    website: WebsiteInfoInterface,
    title: string,
}>()

// data
const breadcrumbs: Ref<BreadcrumbInterface[]> = ref([])
const webInfo = ref(props.website)
const pageTitle = ref(props.title)
const admin: Ref<DataAdminInterface> = ref({
    id: 0,
    username: '',
    name: '',
    email: '',
    email_verified_at: '',
    status: '',
    admin_role_id: 0,
    admin_role_name: '',
    is_superadmin: 0,
    photo: null
})
const menu: Ref<GroupMenuInterface[]> = ref([])
const useLoader = ref(env.VITE_USE_LOADER)
const firstLoad = ref(true)
const loaderState = ref(true)
const showSidebar = ref(false)
const activeMenuId: Ref<number|null> = ref(null)
const activeParentMenuId: Ref<number|null> = ref(null)
const PanelSidebarRef: Ref<InstanceType<typeof PanelSidebarComponent> | null> = ref(null)

// methods
const updateMetaData = (): void => {
    document.querySelector('title')!.innerHTML = `${pageTitle.value} | ${webInfo.value.name} - ${webInfo.value.tagline}`
    document.querySelector('meta[name=description]')!.setAttribute('content', webInfo.value.description)
    document.querySelector('link[data-id=favicon]')!.setAttribute('href', baseUrl('favicon.ico?v=' + webInfo.value.icon_version))
    document.querySelector('link[data-id=iconApple]')!.setAttribute('href', imageUrl(`icon/${webInfo.value.icon}`, 180))
    document.querySelector('link[data-id=icon32]')!.setAttribute('href', imageUrl(`icon/${webInfo.value.icon}`, 32))
    document.querySelector('link[data-id=icon16]')!.setAttribute('href', imageUrl(`icon/${webInfo.value.icon}`, 16))
}

const toggleSidebar = (): void => {
    showSidebar.value = !showSidebar.value
}

const activateMenu = (): void => {
    menu.value.forEach((group: GroupMenuInterface) => {
        if (group.menu.length > 0) {
            group.menu.forEach((groupMenu: MenuInterface) => {
                if (groupMenu.type !== 'Parent') {
                    groupMenu.is_active = (groupMenu.router_name === route.name)
                }
                if (typeof groupMenu.childs !== 'undefined') {
                    groupMenu.childs.forEach((childMenu: ChildMenuInterface) => {
                        if (childMenu.router_name === route.name) {
                            childMenu.is_active = true
                            groupMenu.is_active = true
                        } else {
                            childMenu.is_active = false
                            // groupMenu.is_active = false
                        }
                    })
                }
            })
        }
    })
}

const stopLoader = (): void => {
    if (firstLoad.value) {
        firstLoad.value = false
        setTimeout(() => {
            loaderState.value = false
            activateMenu()
        }, 1000)
    } else {
        nextTick(() => {
            loaderState.value = false
        })
    }
}

const updateAdminData = (): void => {
    axios.get(panelUrl('public/session-data'))
            .then(function(response) {
                const res: BackendResponseInterface = response.data
                if (res.status !== 'success') {
                    swal({
                        title: 'Whoopss!!',
                        icon: 'warning',
                        text: res.message,
                        buttons: {
                            confirm: {
                                className: 'btn btn-primary',
                                text: 'OK'
                            }
                        }
                    }).then(() => {
                        window.location.reload()
                    })
                } else {
                    admin.value = res.data
                }
            }).catch(function(res) {
                checkAxiosError(res.request.status)
            })
}

const updateConfig = (newConfig: WebsiteInfoInterface): void => {
    webInfo.value = newConfig
    updateMetaData()
}

const showLoader = (): void => {
    loaderState.value = true
}

const hideLoader = (): void => {
    loaderState.value = false
}

const loggingOut = (): void => {
    axios.get(panelUrl('public/logout'))
            .then(function(res) {
                let data: BackendResponseInterface = res.data
                if(typeof data.status === 'undefined' || data.status !== 'success') {
                    swal({
                        title: 'Whoopss!!',
                        icon: 'warning',
                        text: 'Koneksi jaringan atau server sedang bermasalah, silahkan coba lagi',
                        buttons: {
                            confirm: {
                                className: 'btn btn-primary',
                                text: 'OK'
                            }
                        }
                    })
                } else {
                    window.location.reload()
                }
            }).catch(function(res) {
                checkAxiosError(res.request.status)
            })
}

// provides
provide('config', computed(() => webInfo.value))
provide('admin', computed(() => admin.value))
provide('completeTitle', computed(() => `${pageTitle.value} | ${webInfo.value.name} - ${webInfo.value.tagline}`))
provide('updateConfig', updateConfig)
provide('showLoader', showLoader)
provide('hideLoader', hideLoader)
provide('updateAdminData', updateAdminData)
provide('loggingOut', loggingOut)

// watch
watch(() => route.name, () => {
    pageTitle.value = (typeof route.meta.pageName === 'undefined') ? '' : route.meta.pageName
    updateMetaData()
    activateMenu()
    breadcrumbs.value = generateBreadcrumb(router)
    showSidebar.value = false

    if (import.meta.env.VITE_LOADER_ON_CHANGE_PAGE === 'true') {
        loaderState.value = true
    }
})

// get admin data
updateAdminData()

// get menu
axios.get(panelUrl('public/menu'))
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            if (res.status !== 'success') {
                swal({
                    title: 'Whoopss!!',
                    icon: 'warning',
                    text: res.message,
                    buttons: {
                        confirm: {
                            className: 'btn btn-primary',
                            text: 'OK'
                        }
                    }
                }).then(() => {
                    window.location.reload()
                })
            } else {
                menu.value = res.data
                activateMenu()
            }
        }).catch(function(res) {
            checkAxiosError(res.request.status)
        })

// on mounted
onMounted(() => {
    // set first load and loader state to false because the page already loaded
    nextTick(() => {
        firstLoad.value = false
        loaderState.value = false
        breadcrumbs.value = generateBreadcrumb(router)
    })

    // watch font awesome icons
    dom.watch()
})

</script>

<style lang="scss">

@import "../../assets/base.scss";

$largeBreakpoint: "991.98px";

.panel {
    &-body {
        background-color: darken(#ffffff, 5%);
        width: calc(100vw - 260px);
        width: calc(100dvw - 260px);
        display: block;

        @media (max-width: $largeBreakpoint) {
            width: 100vw;
            width: 100dvw;
            background-color: #ffffff;
        }
    }

    &-main {
        &-header {
            display: flex;

            @media (max-width: $largeBreakpoint) {
                display: block;
            }

            &-title {
                margin-bottom: 0;
                font-size: 1.6rem;

                @media (max-width: $largeBreakpoint) {
                    margin-bottom: .4rem;
                }
            }
        }
    }

    &-box {
        border-radius: 6px;
        border: 1px solid lighten(#000000, 85%);
        box-shadow: 0 0.125em 0.25em rgba(0, 0, 0, .15);
        overflow: hidden;

        &-header {
            font-size: 1.25rem;
            font-weight: bold;
            color: var(--bs-light);
            background-color: lighten($primary, 15);
            padding: .75rem 1rem;
        }
    }
}

table {
    .col {
        &-no {
            width: 100px;
        }
        
    }
}

#sidebarBackdrop {
    background-color: #000000;
    min-width: 100%;
    min-height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    opacity: .2;
}

table .table-dropdown::after {
    display: none;
}

.ghivarra-vue-table-wrapper {
    .col-no {
        text-align: center;
    }
}

.swal-overlay {
    .swal-modal {
        .swal-button {

            &.btn {
                font-size: 1.15rem;
                padding-left: 1.2rem;
                padding-right: 1.2rem;

                &.btn-sm {
                    font-size: 0.95rem;
                    padding-left: 1rem;
                    padding-right: 1rem;
                }   
            }

            &.btn-primary:not([disabled]):hover, &.btn-secondary:not([disabled]):hover, &.btn-danger:not([disabled]):hover, &.btn-outline-primary:not([disabled]):hover, &.btn-outline-secondary:not([disabled]):hover, &.btn-outline-danger:not([disabled]):hover {
                background-color: var(--bs-btn-hover-bg);
            }
        }
        
        .swal-footer {
            text-align: center;
        }

        .swal-title {
            margin-bottom: 1.2rem;
        }

        .swal-text {
            text-align: center;
        }

        &.confirmation-alert {
            .swal-title {
                margin-top: 0;
                padding: 1rem 1.5rem;
                border-bottom: 1px solid #dcdcdc;
                font-size: 1.25rem;
                text-align: left;
                background-color: #efefef;
                border-radius: 8px 8px 0 0;
            }
            .swal-text {
                text-align: left;
            }
            .swal-footer {
                margin-top: 2rem;
                padding: .75rem 1rem;
                border-top: 1px solid #dcdcdc;
                font-size: 1.25rem;
                text-align: right;
            }
        }
    }

}

</style>