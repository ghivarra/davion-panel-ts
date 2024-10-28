<template>
    <main role="main" class="mb-4">
        <slot name="breadcrumb"></slot>

        <section id="create-table" class="mb-4">
            <router-link v-bind:to="{ name: 'panel.role.create' }" class="btn btn-primary">
                <font-awesome icon="fas fa-plus" class="me-2"></font-awesome>
                Tambah Role
            </router-link>
        </section>
        
        <!-- TABLE -->
        <section ref="roleTableSection">
            <VueTable id="role-table" ref="roleTable" v-bind:defaultLength="25" v-bind:lengthOptions="[10,25,50]"
                v-bind:url="table.url" v-bind:order="table.order" v-bind:columns="table.columns"
                v-bind:processData="processData" v-on:afterCreate="$emit('loaded')">

                <!-- SLOT HEADER -->
                <template v-slot:header>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>
                            <input v-model="table.columns[2].query" id="tableSearchInput1" type="text" class="form-control">
                        </th>
                        <th>
                            <select v-model="table.columns[3].query" id="tableSearchInput2" class="form-select">
                                <option value="">Tampilkan Semua</option>
                                <option value="1">Ya</option>
                                <option value="0">Bukan</option>
                            </select>
                        </th>
                        <th>
                            <select v-model="table.columns[4].query" id="tableSearchInput3" class="form-select">
                                <option value="">Tampilkan Semua</option>
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                            </select>
                        </th>
                    </tr>
                </template>

                <!-- SLOT ROW -->
                <template v-slot:row="{ rowData, columnData, key }">
                    <td v-on:class="columnData[0].class">{{ rowData.no }}</td>
                    <td v-on:class="columnData[1].class">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle table-dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-list me-1"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <button v-on:click.prevent="router.push({ path: `${editPage}/${rowData.id}` })" class="edit-button dropdown-item" type="button" title="Edit Data">
                                        <i class="fa-solid fa-pen-to-square me-1 text-primary"></i>
                                        Edit
                                    </button>
                                </li>
                                <li>
                                    <button v-on:click.prevent="updateStatusRow(key)" class="status-button dropdown-item" type="button" title="${btnText} Data">
                                        <i v-bind:class="{ 'text-success': (rowData.status === 'Nonaktif'), 'text-warning': (rowData.status === 'Aktif') }" class="fa-solid fa-sliders me-1"></i>
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
                    <td v-on:class="columnData[2].class">{{ rowData.name }}</td>
                    <td v-on:class="columnData[3].class">
                        <span v-bind:class="{ 'bg-success': (rowData.is_superadmin), 'bg-warning': (!rowData.is_superadmin) }" class="text-white py-2 px-3 rounded-pill fw-bold">
                            {{ (rowData.is_superadmin) ? 'Ya' : 'Bukan' }}
                        </span>
                    </td>
                    <td v-on:class="columnData[4].class">
                        <span v-bind:class="{ 'bg-success': (rowData.status === 'Aktif'), 'bg-warning': (rowData.status === 'Nonaktif') }" class="text-white py-2 px-3 rounded-pill fw-bold">
                            {{ rowData.status }}
                        </span>
                    </td>
                </template>

            </VueTable>
        </section>
        <!-- TABLE -->

    </main>
</template>

<script setup lang="ts">

// import libs
import { onMounted, ref, inject } from 'vue'
import { panelUrl, checkAxiosError } from '@/libraries/Helpers'
import { useRouter } from 'vue-router'
import axios from 'axios'
import swal from 'sweetalert'

// import components
import VueTable from '@/libraries/Ghivarra/VueTable/VueTable.vue'

// import types
import type { Ref } from 'vue'
import type { EnvInterface } from '@/interfaces/EnvInterface'
import type { DatatableRoleInterface } from '@/interfaces/Datatable/DatatableRoleInterface'
import type { VueTableInterface } from '@/libraries/Ghivarra/VueTable/VueTableInterfaces'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'

// environment
const ENV: EnvInterface = import.meta.env
const router = useRouter()
const emit = defineEmits(['loaded'])
// inject
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')

// data
const table = ref({
    url: panelUrl('role/datatable'),
    order: {
        column: 'name',
        dir: 'asc'
    },
    columns: [
        { query: '', text: 'No.', key: 'no', sortable: false, searchable: false, class: ['col-no'] },
        { query: '', text: '', key: 'action', sortable: false, searchable: false, class: ['col-action'] },
        { query: '', text: 'Nama', key: 'name', class: ['col-primary'] },
        { query: '', text: 'Superadmin', key: 'is_superadmin', class: ['col-secondary'] },
        { query: '', text: 'Status', key: 'status', class: ['col-secondary'] },
    ]
})
const tableData: Ref<DatatableRoleInterface[]> = ref([])
const editPage = ref(`/${ENV.VITE_PANEL_PAGE}/role/edit`)

// refs
const roleTable: Ref<InstanceType<typeof VueTable> | null> = ref(null)

// methods
const processData = (data: VueTableInterface): VueTableInterface => {
    tableData.value = (data.row.length < 1) ? [] : [... data.row]
    return data
}

const updateStatusRow = (key: number): void => {
    showLoader!()

    // collect data
    const data = {... tableData.value[key]}
    const targetId = (typeof data.id === 'number') ? data.id.toString() : data.id
    const targetStatus = (data.status === 'Aktif') ? 'Nonaktif' : 'Aktif'

    // create form
    const form = new FormData()
    form.append('id', targetId)
    form.append('status', targetStatus)

    // save data
    axios.post(panelUrl('role/update-status'), form)  
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
                roleTable.value?.draw()
            }
        }).catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

const deleteRow = (key: number): void => {
    showLoader!()

    // collect data
    const data = {... tableData.value[key]}
    const targetId = (typeof data.id === 'number') ? data.id.toString() : data.id

    // create form
    const form = new FormData()
    form.append('id', targetId)

    // send
    axios.post(panelUrl('role/delete'), form)  
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
                roleTable.value?.draw()
            }
        }).catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

onMounted(() => {
    emit('loaded')
})

</script>

<style lang="scss">

#role-table {
    min-width: 700px;

    .col-no, .col-action {
        width: 50px;
    }
    .col-secondary {
        width: 150px;
    }
}

</style>