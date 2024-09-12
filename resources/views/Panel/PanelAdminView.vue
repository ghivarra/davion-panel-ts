<template>
    <main role="main" class="mb-4">
        <slot name="breadcrumb"></slot>

        <section id="create-table" class="mb-4">
            <button v-on:click="adminCreateModalOpen" type="button" class="btn btn-primary">
                <font-awesome icon="fas fa-plus" class="me-2"></font-awesome>
                Tambah Admin
            </button>
        </section>

        <!-- ADMIN CREATE MODAL -->
        <AdminCreateModal ref="adminCreateModal" v-bind:roles="roles" v-on:formSubmitted="refreshTable" />
        
        <!-- ADMIN UPDATE MODAL -->
        <AdminUpdateModal ref="adminUpdateModal" v-bind:admin="adminUpdate" v-bind:roles="roles" v-on:formSubmitted="updateRefreshTable" />

        <!-- ADMIN DETAIL MODAL -->
        <AdminDetailModal ref="adminDetailModal" v-bind:admin="adminDetail" />

        <!-- TABLE -->
        <section ref="adminTableSection">
            <VueTable id="admin-table" ref="adminTable" v-bind:defaultLength="25" v-bind:lengthOptions="[10,25,50]"
                v-bind:url="table.url" v-bind:order="table.order" v-bind:columns="table.columns"
                v-bind:processData="processData" v-on:afterCreate="$emit('loaded')">

                <!-- SLOT HEADER -->
                <template v-slot:header>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>
                            <input v-model="table.columns[2].query" name="searchInput1" type="text" class="form-control">
                        </th>
                        <th>
                            <input v-model="table.columns[3].query" name="searchInput2" type="text" class="form-control">
                        </th>
                        <th>
                            <input v-model="table.columns[4].query" name="searchInput3" type="text" class="form-control">
                        </th>
                        <th>
                            <select v-model="table.columns[5].query" name="searchInput4" class="form-select">
                                <option value="">Tampilkan Semua</option>
                                <option v-for="(role, n) in roles" v-bind:key="n" v-bind:value="role.id">
                                    {{ role.name }}
                                </option>
                            </select>
                        </th>
                        <th>
                            <select v-model="table.columns[6].query" name="searchInput6" class="form-select">
                                <option value="">Tampilkan Semua</option>
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                            </select>
                        </th>
                    </tr>
                </template>

                <!-- SLOT ROW -->
                <template v-slot:row="{ rowData, columnData, key }">
                    <td v-bind:class="columnData[0].class">{{ rowData.no }}</td>
                    <td v-bind:class="columnData[1].class">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle table-dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-list me-1"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <button v-on:click.prevent="adminDetailModalOpen(key)" class="detail-button dropdown-item" type="button" title="Cek Sesi Login">
                                        <i class="fa-solid fa-circle-info me-1 text-primary"></i>
                                        Detail
                                    </button>
                                </li>
                                <li>
                                    <button v-on:click.prevent="checkSession(key)" class="check-session-button dropdown-item" type="button" title="Cek Sesi Login">
                                        <i class="fa-solid fa-clock-rotate-left me-1 text-primary"></i>
                                        Sesi Login
                                    </button>
                                </li>
                                <li>
                                    <button v-on:click.prevent="adminUpdateModalOpen(key)" class="edit-button dropdown-item" type="button" title="Edit Data">
                                        <i class="fa-solid fa-pen-to-square me-1 text-primary"></i>
                                        Edit
                                    </button>
                                </li>
                                <li>
                                    <button v-on:click.prevent="updateStatusRow(key)" class="status-button dropdown-item" type="button" title="${btnText} Data">
                                        <i class="fa-solid fa-sliders me-1 ${btnTextColor}"></i>
                                        {{ (rowData.status === 'Aktif') ? 'Nonaktifkan' : 'Aktifkan' }}
                                    </button>
                                </li>
                                <li>
                                    <button v-on:click.prevent="deleteRow(key)" class="delete-button dropdown-item" type="button" title="Hapus Data">
                                        <i class="fa-solid fa-trash-can me-1 text-danger"></i>
                                        Hapus
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </td>
                    <td v-bind:class="columnData[2].class">{{ rowData.name }}</td>
                    <td v-bind:class="columnData[3].class">{{ rowData.username }}</td>
                    <td v-bind:class="columnData[4].class">{{ rowData.email }}</td>
                    <td v-bind:class="columnData[5].class">{{ rowData.admin_role_name }}</td>
                    <td v-bind:class="columnData[6].class">
                        <span v-bind:class="{ 'bg-success': (rowData.status === 'Aktif'), 'bg-danger': (rowData.status === 'Nonaktif') }" class="text-white py-2 px-3 rounded-pill fw-bold">{{ rowData.status }}</span>
                    </td>
                </template>

            </VueTable>
        </section>
        <!-- TABLE -->
    </main>
</template>

<script setup lang="ts">

// import libs
import { inject, ref, onMounted } from 'vue'
import { panelUrl, checkAxiosError } from '@/libraries/Helpers'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

// import components
import VueTable from '@/libraries/Ghivarra/VueTable/VueTable.vue'
import AdminCreateModal from '../Modal/AdminCreateModal.vue'
import AdminUpdateModal from '../Modal/AdminUpdateModal.vue'
import AdminDetailModal from '../Modal/AdminDetailModal.vue'

// import type
import type { ComputedRef, Ref } from 'vue'
import type { DataAdminInterface } from '@/interfaces/DataAdminInterface'
import type { DataAdminRoleInterface } from '@/interfaces/DataAdminRoleInterface'
import type { DatatableAdminInterface } from '@/interfaces/Datatable/DatatableAdminInterface'
import type { VueTableInterface } from '@/libraries/Ghivarra/VueTable/VueTableInterfaces'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'

// env
const router = useRouter()

// inject
const admin = inject<ComputedRef<DataAdminInterface>>('admin')
const loggingOut = inject<() => void>('loggingOut')
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')

// data
const table = ref({
    url: panelUrl('administrator/datatable'),
    order: {
        column: 'name',
        dir: 'asc'
    },
    columns: [
        { query: '', text: 'No.', key: 'no', sortable: false, searchable: false, class: ['col-no'] },
        { query: '', text: '', key: 'action', sortable: false, searchable: false, class: ['col-action'] },
        { query: '', text: 'Nama', key: 'name', class: ['col-primary'] },
        { query: '', text: 'Username', key: 'username', class: ['col-secondary'] },
        { query: '', text: 'Email', key: 'email', class: ['col-secondary'] },
        { query: '', text: 'Role', key: 'admin_role_name', class: ['col-email-status'] },
        { query: '', text: 'Status', key: 'status', class: ['col-secondary'] },
    ]
})

const tableData: Ref<DatatableAdminInterface[]> = ref([])
const roles: Ref<DataAdminRoleInterface[]> = ref([])
const adminDetail: Ref<DatatableAdminInterface> = ref({
    id: 0,
    username: '',
    name: '',
    email: '',
    email_verified_at: '',
    status: '',
    admin_role_id: 0,
    admin_role_name: '',
    is_superadmin: 0,
    photo: null,
})
const adminUpdate: Ref<DatatableAdminInterface> = ref({
    id: 0,
    username: '',
    name: '',
    email: '',
    email_verified_at: '',
    status: '',
    admin_role_id: 0,
    admin_role_name: '',
    is_superadmin: 0,
    photo: null,
})

// refs
const adminTableSection: Ref<HTMLElement | null> = ref(null)
const adminTable: Ref<InstanceType<typeof VueTable> | null> = ref(null)
const adminCreateModal: Ref<InstanceType<typeof AdminCreateModal> | null> = ref(null)
const adminUpdateModal: Ref<InstanceType<typeof AdminUpdateModal> | null> = ref(null)
const adminDetailModal: Ref<InstanceType<typeof AdminDetailModal> | null> = ref(null)

const processData = (data: VueTableInterface): VueTableInterface => {
    tableData.value = (data.row.length < 1) ? [] : [... data.row]
    return data
}

const refreshTable = (): void => {
    adminTable.value?.draw()
}

const updateRefreshTable = (id: string | number): void => {
    const parsedId = (typeof id === 'string') ? parseInt(id) : id
    const adminId = (typeof admin?.value.id === 'string') ? parseInt(admin?.value.id) : id

    if (parsedId === adminId) {
        window.location.reload()
    } else {
        adminTable.value?.draw()
    }
}

const adminCreateModalOpen = (): void => {
    if (adminCreateModal.value?.modalOpenButton !== null) {
        adminCreateModal.value?.modalOpenButton.click()
    }
}

const adminUpdateModalOpen = (key: number): void => {
    adminUpdate.value = {... tableData.value[key]}
    if (adminUpdateModal.value?.modalOpenButton !== null) {
        adminUpdateModal.value?.modalOpenButton.click()
    }
}

const adminDetailModalOpen = (key: number): void => {
    adminDetail.value = {... tableData.value[key]}
    if (adminDetailModal.value?.modalOpenButton !== null) {
        adminDetailModal.value?.modalOpenButton.click()
    }
}

const updateStatusRow = (key: number): void => {
    showLoader!()

    const data = {... tableData.value[key]}
    const targetStatus = (data.status === 'Aktif') ? 'Nonaktif' : 'Aktif'

    // create form
    const form = new FormData()
    const id = (typeof data.id === 'number') ? data.id.toString() : data.id
    form.append('id', id)
    form.append('status', targetStatus)

    // save data
    axios.post(panelUrl('administrator/update-status'), form)  
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            hideLoader!()
            if (res.status !== 'success') {
                Swal.fire('Whoopss!!', res.message, 'warning')
            } else {
                const dataId = (typeof data.id === 'string') ? parseInt(data.id) : data.id
                const adminId = (typeof admin?.value.id === 'string') ? parseInt(admin.value.id) : admin?.value.id
                if (dataId === adminId) {
                    loggingOut!()
                } else {
                    adminTable.value?.draw()
                }
            }
        }).catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

const deleteRow = (key: number):void => {
    showLoader!()

    const data = {... tableData.value[key]}

    // create form
    const form = new FormData()
    const id = (typeof data.id === 'number') ? data.id.toString() : data.id
    form.append('id', id)

    // save data
    axios.post(panelUrl('administrator/delete'), form)  
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            hideLoader!()
            if (res.status !== 'success') {
                Swal.fire('Whoopss!!', res.message, 'warning')
            } else {
                const dataId = (typeof data.id === 'string') ? parseInt(data.id) : data.id
                const adminId = (typeof admin?.value.id === 'string') ? parseInt(admin.value.id) : admin?.value.id
                if (dataId === adminId) {
                    loggingOut!()
                } else {
                    adminTable.value?.draw()
                }
            }
        }).catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

const checkSession = (key: number): void => {
    router.push({ path: `administrator/session/${tableData.value[key].id}` })
}

// on mounted
onMounted(() => {

    // get roles
    axios.get(panelUrl('administrator/get-role'))
            .then(function(response) {
                const res: BackendResponseInterface = response.data
                if (res.status !== 'success') {
                    Swal.fire('Whoopss!!', res.message, 'warning').then(function() {
                        window.location.reload()
                    })
                } else {
                    roles.value = res.data
                }
            }).catch(function(res) {
                checkAxiosError(res.request.status)
            })
})

</script>

<style lang="scss">

#admin-table {
    min-width: 900px;

    .col-no, .col-action {
        width: 50px;
    }
    .col-secondary {
        width: 130px;
    }
    .col-email-status, .col-primary {
        width: 200px;
    }
}

</style>