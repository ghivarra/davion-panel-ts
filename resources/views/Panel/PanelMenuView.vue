<template>
    <main role="main" class="mb-4">
        <slot name="breadcrumb"></slot>

        <!-- TOP ACTION BUTTON -->
        <section class="mb-4">
            <button v-on:click.prevent="createGroupModalOpen" type="button" class="btn btn-primary me-3">
                <font-awesome icon="fas fa-plus" class="me-1"></font-awesome>
                Tambah Grup
            </button>
        </section>

        <!-- ACCORDION SORTIR MENU -->
        <section class="accordion mb-5">

            <draggable v-bind:list="menus" itemKey="id">
                <template v-slot:item="{ element, index }">
                    <div class="accordion-item cursor-grab mb-4">
                        <header class="accordion-header position-relative">
                            <div v-bind:data-bs-target="`#group${index}`" v-bind:aria-controls="`group${index}`"
                                type="button" class="accordion-button fw-bold" data-bs-toggle="collapse"
                                aria-expanded="true">
                                {{ element.name }}
                                <span v-if="element.status === 'Aktif'" class="badge ms-2 text-bg-success">Aktif</span>
                                <span v-else class="badge ms-2 text-bg-warning">Nonaktif</span>
                            </div>
                        </header>
                        <div v-bind:id="`group${index}`" class="accordion-collapse collapse show">
                            <div class="accordion-body">

                                <div class="d-flex mt-2 mb-4">
                                    <button v-on:click.prevent="editGroupModalOpen(index)"
                                        v-if="(parseInt(element.id) !== 1) " type="button"
                                        class="btn btn-sm btn-primary">
                                        <font-awesome icon="fas fa-pen-to-square" class="me-1"></font-awesome>
                                        Edit
                                    </button>
                                    <button v-on:click.prevent="updateGroupStatus(index)"
                                        v-if="(parseInt(element.id) !== 1) "
                                        v-bind:class="(element.status === 'Aktif') ? 'btn-warning' : 'btn-success'"
                                        type="button" class="btn btn-sm mx-2 text-white">
                                        <font-awesome icon="fas fa-sliders" class="me-1"></font-awesome>
                                        {{ (element.status === 'Aktif') ? 'Nonaktifkan' : 'Aktifkan' }}
                                    </button>
                                    <button v-on:click.prevent="deleteGroup(index)" v-if="(parseInt(element.id) !== 1) "
                                        type="button" class="btn btn-sm btn-danger me-2">
                                        <font-awesome icon="fas fa-trash-can" class="me-1"></font-awesome>
                                        Hapus
                                    </button>
                                    <button v-on:click.prevent="createMenuModalOpen(index)" type="button"
                                        class="btn btn-sm btn-dark">
                                        <font-awesome icon="fas fa-plus" class="me-1"></font-awesome>
                                        Tambah Menu
                                    </button>
                                </div>

                                <DraggableMenuComponent v-bind:child="element.child"
                                    v-bind:setUpdateMenuId="setUpdateMenuId" groupName="menus"
                                    itemKey="id" />
                            </div>
                        </div>
                    </div>
                </template>
            </draggable>

            <div>
                <button v-on:click.prevent="saveList" type="button" class="btn btn-primary">
                    <font-awesome icon="fas fa-save" class="me-1"></font-awesome>
                    Simpan Susunan Menu
                </button>
            </div>

        </section>

        <!-- CREATE GROUP MODAL -->
        <GroupMenuCreateModal ref="groupCreateModal" />
        
        <!-- UPDATE GROUP MODAL -->
        <GroupMenuUpdateModal ref="groupUpdateModal" v-bind:update-data="groupUpdateData" />

        <!-- CREATE MENU MODAL -->
        <MenuCreateModal ref="menuCreateModal" v-bind:group-id="menuCreateGroupId" v-bind:group-name="menuCreateGroupName" />

        <!-- UPDATE MENU MODAL -->
        <MenuUpdateModal ref="menuUpdateModal" v-bind:menu-id="menuUpdateId" />

    </main>
</template>

<script setup lang="ts">

// import libs
import { ref, inject } from 'vue'
import { checkAxiosError, panelUrl } from '@/libraries/Helpers'
import axios from 'axios'
import swal from 'sweetalert'

// import components
import draggable from 'vuedraggable'
import DraggableMenuComponent from '@/components/DraggableMenuComponent.vue'
import GroupMenuCreateModal from '@/views/Modal/GroupMenuCreateModal.vue'
import GroupMenuUpdateModal from '@/views/Modal/GroupMenuUpdateModal.vue'
import MenuCreateModal from '@/views/Modal/MenuCreateModal.vue'
import MenuUpdateModal from '@/views/Modal/MenuUpdateModal.vue'

// import types
import type { Ref } from 'vue'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'
import type { ListChildMenuInterface, ListGroupMenuInterface, ListMenuInterface } from '@/interfaces/DataListMenuInterface'

// env
const emit = defineEmits(['loaded'])

// inject
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')

// data
const menus: Ref<ListGroupMenuInterface[]> = ref([])
const groupUpdateData = ref({
    id: 0,
    name: '',
    status: 'Aktif'
})
const menuCreateGroupId = ref(0)
const menuCreateGroupName = ref('Grup')
const menuUpdateId = ref(0)

// refs
const groupCreateModal: Ref<InstanceType<typeof GroupMenuCreateModal> | null> = ref(null)
const groupUpdateModal: Ref<InstanceType<typeof GroupMenuUpdateModal> | null> = ref(null)
const menuCreateModal: Ref<InstanceType<typeof MenuCreateModal> | null> = ref(null)
const menuUpdateModal: Ref<InstanceType<typeof MenuUpdateModal> | null> = ref(null)

// methods
const saveList = (): void => {
    showLoader!()

    const form = new FormData()
    let menuIterator = -1
    let group: ListGroupMenuInterface = {
        id: 0,
        name: '',
        status: 'Aktif'
    }
    let menu: ListMenuInterface = {
        id: 0,
        title: '',
        type: 'Primary',
        icon: '',
        status: 'Aktif'
    }
    let submenu: ListChildMenuInterface = {
        id: 0,
        title: '',
        icon: '',
        status: 'Aktif'
    }

    for (let i = 0; i < menus.value.length; i++) {
        group = menus.value[i]
        let groupId = (typeof group.id === 'number') ? group.id.toString() : group.id
        let sortOrder = (i + 1)
        form.append(`group[${i}][id]`, groupId)
        form.append(`group[${i}][sort_order]`, sortOrder.toString())

        if (typeof group.child !== 'undefined' && group.child.length > 0) {
            for (let n = 0; n < group.child.length; n++) {
                menuIterator++
                menu = group.child[n]
                let menuId = (typeof menu.id === 'number') ? menu.id.toString() : menu.id
                let menuSortOrder = (n + 1)
                form.append(`menu[${menuIterator}][admin_menu_group_id]`, groupId)
                form.append(`menu[${menuIterator}][id]`, menuId)
                form.append(`menu[${menuIterator}][sort_order]`, menuSortOrder.toString())
                
                if (typeof menu.child !== 'undefined' && menu.child.length > 0) {
                    form.append(`menu[${menuIterator}][type]`, 'Parent')

                    for (let x = 0; x < menu.child.length; x++) {
                        menuIterator++
                        submenu = menu.child[x]
                        let submenuId = (typeof submenu.id === 'number') ? submenu.id.toString() : submenu.id
                        let submenuSortOrder = (x + 1)
                        form.append(`menu[${menuIterator}][id]`, submenuId)
                        form.append(`menu[${menuIterator}][sort_order]`, submenuSortOrder.toString())
                        form.append(`menu[${menuIterator}][type]`, 'Child')
                        form.append(`menu[${menuIterator}][admin_menu_parent_id]`, menuId)
                        form.append(`menu[${menuIterator}][admin_menu_group_id]`, groupId)
                    }

                } else {
                    form.append(`menu[${menuIterator}][type]`, 'Primary')
                }
            }
        }
    }

    // send
    axios.post(panelUrl('menu/sort'), form)
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            hideLoader!()
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
                })
            } else {
                window.location.reload()
            }
        }).catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

const createMenuModalOpen = (index: number): void => {
    const groupMenu = {... menus.value[index]}
    menuCreateGroupId.value = (typeof groupMenu.id === 'string') ? parseInt(groupMenu.id) : groupMenu.id
    menuCreateGroupName.value = groupMenu.name
    menuCreateModal.value?.modalOpenButton?.click()
}

const setUpdateMenuId = (id: string | number): void => {
    menuUpdateId.value = (typeof id === 'string') ? parseInt(id) : id
    menuUpdateModal.value?.modalOpenButton?.click()
}

const createGroupModalOpen = (): void => {
    groupCreateModal.value?.modalOpenButton?.click()
}

const editGroupModalOpen = (index: number): void => {
    const groupMenu = {... menus.value[index]}
    groupUpdateData.value = {
        id: (typeof groupMenu.id === 'string') ? parseInt(groupMenu.id) : groupMenu.id,
        name: groupMenu.name,
        status: groupMenu.status
    }
    
    groupUpdateModal.value?.modalOpenButton?.click()
}

const updateGroupStatus = (index: number): void => {
    showLoader!()

    const groupMenu = {... menus.value[index]}
    const targetId = (typeof groupMenu.id === 'number') ? groupMenu.id.toString() : groupMenu.id
    const targetStatus = (groupMenu.status === 'Aktif') ? 'Nonaktif' : 'Aktif'

    const form = new FormData()
    form.append('id', targetId)
    form.append('status', targetStatus)

    // save data
    axios.post(panelUrl('menu/group/update-status'), form)  
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            if (res.status !== 'success') {
                hideLoader!()
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
                })
            } else {
                window.location.reload()
            }
        }).catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

const deleteGroup = (index: number): void => {
    showLoader!()

    const groupMenu = {... menus.value[index]}
    const targetId = (typeof groupMenu.id === 'number') ? groupMenu.id.toString() : groupMenu.id

    const form = new FormData()
    form.append('id', targetId)

    axios.post(panelUrl('menu/group/delete'), form)  
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            if (res.status !== 'success') {
                hideLoader!()
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
                })
            } else {
                window.location.reload()
            }
        }).catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

// on created
// get module group list
axios.get(panelUrl('menu/list'))
    .then(function(response) {
        const res: BackendResponseInterface = response.data
        if (typeof res.status !== 'undefined' && res.status === 'success') {
            menus.value = res.data
            emit('loaded')
        }
    }).catch(function(res) {
        checkAxiosError(res.request.status)
        emit('loaded')
    })

</script>

<style lang="scss">

.cursor-grab {
    cursor: grab;

    &:click, &:focus {
        cursor: grabbing
    }
}

.option-menu-button {
    position: absolute;
    right: 0;
    top: 0;

    &.group {
        right: 2.5rem;
        top: .5rem;
    }

    &.parent-primary {
        top: .5rem;
        right: .6rem;
    }

    .dropdown-toggle::after {
        display: none;
    }
}

</style>