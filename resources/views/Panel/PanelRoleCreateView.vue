<template>
    <main role="main" class="mb-4">
        <slot name="breadcrumb"></slot>
        
        <!-- CREATING FORM -->
        <section class="panel-box bg-white mb-4">
            <form v-on:submit.prevent="submitForm" class="p-3">
                <div class="mb-3">
                    <label for="roleName" class="form-label fw-bold">
                        Nama Role
                        <span class="text-danger" title="Wajib Diisi">*</span>
                    </label>
                    <input v-model="data.name" name="name" id="roleName" type="text" class="form-control" autocomplete="off" required>
                </div>
                <div class="mb-3">
                    <p class="mb-2 fw-bold">Tipe:</p>
                    <div class="form-check form-check-inline">
                        <input v-bind:checked="data.is_superadmin === '0'" v-model="data.is_superadmin"
                            class="form-check-input" type="radio" name="type" id="restrictedRole"
                            value="0">
                        <label class="form-check-label" for="restrictedRole">Admin Terbatas</label>
                    </div>

                    <div class="mb-3 form-check form-check-inline">
                        <input v-bind:checked="data.is_superadmin === '1'" v-model="data.is_superadmin" class="form-check-input" type="radio" name="type" id="superRole" value="1">
                        <label class="form-check-label" for="superRole">Superadmin</label>
                    </div>

                    <div v-if="(data.is_superadmin === '1')" class="alert alert-warning mb-4">
                        Role dengan tipe Superadmin secara otomatis akan bisa mengakses <b>semua</b> jenis menu dan modul.
                    </div>

                    <div v-if="(data.is_superadmin === '0')" class="mb-3">
                        <div class="fw-bold mb-3 border-bottom pb-2">Pilihan Menu:</div>
                        <div>
                            <div v-for="(group, n) in menus" v-bind:key="n" class="mb-3">
                                <h6 class="text-secondary fw-bold border-start border-3 ps-2 mb-3">{{ group.name }}</h6>
                                <div class="row row-cols-2 row-cols-sm-3 row-cols-md-4">
                                    <div v-for="(menu, i) in group.menus" v-bind:key="i" class="mb-2 col">
                                        <div class="form-check">
                                            <input v-model="menu.checked" v-bind:checked="menu.checked" v-bind:id="`check${menu.id}`" v-bind:value="menu.id" v-on:change="parentMenuCheck(menu)" class="form-check-input" type="checkbox">
                                            <label v-bind:for="`check${menu.id}`" class="form-check-label pe-2">
                                                {{ menu.title }}
                                            </label>
                                        </div>
                                        <div v-show="(menu.childs.length > 0)" class="ps-4 mb-2">
                                            <div v-for="(child, x) in menu.childs" v-bind:key="x" class="form-check">
                                                <input v-model="child.checked" v-bind:checked="child.checked" v-bind:id="`check${child.id}`" v-bind:value="child.id" v-on:change="childMenuCheck(menu)" class="form-check-input" type="checkbox">
                                                <label v-bind:for="`check${child.id}`" class="form-check-label pe-2">
                                                    {{ child.title }}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="(data.is_superadmin === '0')" class="mb-4">
                        <div class="fw-bold mb-3 border-bottom pb-2">Pilihan Modul:</div>
                        <div>
                            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-2">
                                <div v-for="(group, i) in modules" v-bind:key="i" class="mb-2 col">
                                    <div class="form-check">
                                        <input v-model="group.checked" v-bind:checked="group.checked" v-bind:id="`moduleCheck${group.name}`" v-bind:value="group.name" v-on:change="moduleGroupCheck(group)" class="form-check-input" type="checkbox">
                                        <label v-bind:for="`moduleCheck${group.name}`" class="form-check-label pe-2">
                                            {{ group.name }}
                                        </label>
                                    </div>
                                    <div v-show="(group.modules.length > 0)" class="ps-4 mb-2">
                                        <div v-for="(modul, x) in group.modules" v-bind:key="x" class="form-check">
                                            <input v-model="modul.checked" v-bind:checked="modul.checked" v-bind:id="`moduleCheck${modul.id}`" v-bind:value="modul.id" v-on:change="moduleCheck(group)" class="form-check-input" type="checkbox">
                                            <label v-bind:for="`moduleCheck${modul.id}`" class="form-check-label pe-2">
                                                {{ modul.name }}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary">
                        <font-awesome icon="fas fa-save" class="me-1"></font-awesome>
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </section>
    </main>
</template>

<script setup lang="ts">

// import libs
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { panelUrl, checkAxiosError } from '@/libraries/Helpers'
import axios from 'axios'
import Swal from 'sweetalert2'

// import types
import type { Ref } from 'vue'
import type { RoleGroupModuleInterface } from '@/interfaces/RoleModuleInterface'
import type { RoleGroupMenuInterface, RoleMenuInterface } from '@/interfaces/RoleMenuInterface'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'

// env
const router = useRouter()
const emit = defineEmits(['loaded'])

// inject
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')

// data
const menus: Ref<RoleGroupMenuInterface[]> = ref([])
const modules: Ref<RoleGroupModuleInterface[]> = ref([])
const data = ref({
    name: '',
    is_superadmin: '0'
})

// methods
const childMenuCheck = (menu: RoleMenuInterface): void => {
    menu.checked = true
}

const parentMenuCheck = (menu: RoleMenuInterface): void => {
    // check if there are any childs
    if (menu.childs.length > 0 && menu.checked) {
        menu.childs.forEach((child) => {
            child.checked = true
        })
    } else if (menu.childs.length > 0 && !menu.checked) {
        menu.childs.forEach((child) => {
            child.checked = false
        })
    }
}

const moduleCheck = (group: RoleGroupModuleInterface): void => {
    // check if there are any modules
    if (group.modules.length > 0) {
        let allChecked = true

        for (let i = 0; i < group.modules.length; i++) {
            if (!group.modules[i].checked) {
                allChecked = false
            }
        }

        if (allChecked) {
            group.checked = true
        } else {
            group.checked = false
        }
    }
}

const moduleGroupCheck = (group: RoleGroupModuleInterface): void => {
    // check if there are any modules
    if (group.modules.length > 0 && group.checked) {
        group.modules.forEach((modul) => {
            modul.checked = true
        })
    } else if (group.modules.length > 0 && !group.checked) {
        group.modules.forEach((modul) => {
            modul.checked = false
        })
    }
}

const submitForm = (): void => {
    showLoader!()

    // create data
    const checkedMenus: (string|number)[] = []
    const checkedModules: (string|number)[] = []

    if (data.value.is_superadmin === '0') {
        // get menu data
        menus.value.forEach(function(group) {
            if (group.menus.length > 0) {
                group.menus.forEach(function(primaryMenu) {
                    if (primaryMenu.checked) {
                        checkedMenus.push(primaryMenu.id)
                        if (primaryMenu.childs.length > 0) {
                            primaryMenu.childs.forEach(function(child) {
                                if (child.checked) {
                                    checkedMenus.push(child.id)
                                }
                            })
                        }
                    }
                })
            }
        })

        // get module data
        modules.value.forEach(function(group) {
            if (group.modules.length > 0) {
                group.modules.forEach(function(modul) {
                    if (modul.checked) {
                        checkedModules.push(modul.id)
                    }
                })
            }
        })
    }

    // input
    let form = new FormData()
    form.append('name', data.value.name)
    form.append('is_superadmin', data.value.is_superadmin)
    form.append('menus', JSON.stringify(checkedMenus))
    form.append('modules', JSON.stringify(checkedModules))

    // save data
    axios.post(panelUrl('role/create'), form)  
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            hideLoader!()
            if (res.status !== 'success') {
                Swal.fire('Whoopss!!', res.message, 'warning')
            } else {
                router.push({ name: 'panel.role' })
            }
        }).catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

// on created

// get menu list
axios.get(panelUrl('role/get-menu'))
    .then(function(response) {
        const res: BackendResponseInterface = response.data
        menus.value = res.data
    }).catch(function(res) {
        checkAxiosError(res.request.status)
    })

// get module list
axios.get(panelUrl('role/get-module'))
    .then(function(response) {
        const res: BackendResponseInterface = response.data
        modules.value = res.data
        emit('loaded')
    }).catch(function(res) {
        checkAxiosError(res.request.status)
    })

</script>