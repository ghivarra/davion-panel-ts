<template>
    <main role="main" class="mb-4">
        <slot name="breadcrumb"></slot>

        <!-- MODULE CREATE MODAL -->
        <ModuleCreateModal v-bind:module-groups="moduleGroups" v-bind:get-module-group="getModuleGroup" v-bind:update-table="updateTable"/>

        <!-- MODULE UPDATE MODAL -->
        <ModuleUpdateModal ref="moduleUpdateModalRef" v-bind:module-groups="moduleGroups" v-bind:get-module-group="getModuleGroup" v-bind:update-table="updateTable" v-bind:module-update-data="moduleUpdateData" />

        <section ref="moduleTableSection">
            <vue-table id="module-table" ref="moduleTable" v-bind:defaultLength="25" v-bind:lengthOptions="[10,25,50]"
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
                            <input v-model="table.columns[3].query" id="tableSearchInput2" type="text" class="form-control">
                        </th>
                        <th>
                            <input v-model="table.columns[4].query" id="tableSearchInput3" type="text" class="form-control">
                        </th>
                        <th>
                            <select v-model="table.columns[5].query" id="tableSearchInput4" class="form-select">
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
                                    <button v-on:click.prevent="editData(key)" class="edit-button dropdown-item" type="button" title="Edit Data">
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
                    <td v-bind:class="columnData[2].class">{{ rowData.group }}</td>
                    <td v-bind:class="columnData[3].class">{{ rowData.name }}</td>
                    <td v-bind:class="columnData[4].class">{{ rowData.alias }}</td>
                    <td v-bind:class="columnData[5].class">
                        <span v-bind:class="{ 'bg-success': (rowData.status === 'Aktif'), 'bg-danger': (rowData.status === 'Nonaktif') }" class="text-white py-2 px-3 rounded-pill fw-bold">{{ rowData.status }}</span>
                    </td>
                </template>

            </vue-table>
        </section>
    </main>
</template>

<script setup lang="ts">

// import libs
import { ref, inject, onMounted } from 'vue'
import { panelUrl, checkAxiosError } from '@/libraries/Helpers'
import axios from 'axios'
import Swal from 'sweetalert2'

// import components
import VueTable from '@/libraries/Ghivarra/VueTable/VueTable.vue'
import ModuleCreateModal from '@/views/Modal/ModuleCreateModal.vue'
import ModuleUpdateModal from '@/views/Modal/ModuleUpdateModal.vue'

// import types
import type { Ref } from 'vue'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'
import type { VueTableInterface } from '@/libraries/Ghivarra/VueTable/VueTableInterfaces'
import type { DatatableModuleInterface } from '@/interfaces/Datatable/DatatableModuleInterface'

// define emits
const emit = defineEmits(['loaded'])

// inject
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')

// data
const table = ref({
    url: panelUrl('module/datatable'),
    order: {
        column: 'group',
        dir: 'asc'
    },
    columns: [
        { query: '', text: 'No.', key: 'no', sortable: false, searchable: false, class: ['col-no'] },
        { query: '', text: '', key: 'action', sortable: false, searchable: false, class: ['col-action'] },
        { query: '', text: 'Grup', key: 'group', class: ['col-secondary'] },
        { query: '', text: 'Nama', key: 'name', class: ['col-primary'] },
        { query: '', text: 'Alias', key: 'alias', class: ['col-secondary'] },
        { query: '', text: 'Status', key: 'status', class: ['col-secondary'] },
    ]
})
const moduleGroups: Ref<string[]> = ref([])
const tableData: Ref<DatatableModuleInterface[]> = ref([])
const moduleUpdateData: Ref<DatatableModuleInterface> = ref({
    no: 0,
    id: 0,
    group: '',
    alias: '',
    name: '',
    status: '',
})

// refs
const moduleTable: Ref<InstanceType<typeof VueTable> | null> = ref(null)
const moduleUpdateModalRef: Ref<InstanceType<typeof ModuleUpdateModal> | null> = ref(null)

// methods
const getModuleGroup = (): void => {
    // get module group list
    axios.get(panelUrl('module/group-list'))
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            moduleGroups.value = res.data
        }).catch(function(res) {
            checkAxiosError(res.request.status)
        })
}

const processData = (data: VueTableInterface): VueTableInterface => {
    tableData.value = (data.row.length < 1) ? [] : [... data.row]
    return data
}

const updateTable = (): void => {
    moduleTable.value?.draw()
}

const editData = (key: number): void => {
    const moduleData = {... tableData.value[key]}
    moduleUpdateData.value.id = (typeof moduleData.id === 'string') ? parseInt(moduleData.id) : moduleData.id
    moduleUpdateData.value.alias = moduleData.alias
    moduleUpdateData.value.name = moduleData.name
    moduleUpdateData.value.status = moduleData.status
    moduleUpdateModalRef.value?.updateModalOpenButton?.click()
}

const updateStatusRow = (key: number): void => {
    showLoader!()

    // set status
    const moduleData = {... tableData.value[key]}
    const targetId = (typeof moduleData.id === 'number') ? moduleData.id.toString() : moduleData.id
    const targetStatus = (moduleData.status === 'Aktif') ? 'Nonaktif' : 'Aktif'

    // create form
    const form = new FormData()
    form.append('id', targetId)
    form.append('status', targetStatus)

    // save data
    axios.post(panelUrl('module/update-status'), form)  
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            hideLoader!()
            if (res.status !== 'success') {
                Swal.fire('Whoopss!!', res.message, 'warning')
            } else {
                updateTable()
            }
        }).catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

const deleteRow = (key: number): void => {
    showLoader!()

    // set id
    const moduleData = {... tableData.value[key]}
    const targetId = (typeof moduleData.id === 'number') ? moduleData.id.toString() : moduleData.id

    // create form
    const form = new FormData()
    form.append('id', targetId)

    // send
    axios.post(panelUrl('module/delete'), form)  
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            hideLoader!()
            if (res.status !== 'success') {
                Swal.fire('Whoopss!!', res.message, 'warning')
            } else {
                updateTable()
            }
        }).catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

// created
getModuleGroup()

// on mounted
onMounted(() => {
    emit('loaded')
})

</script>

<style lang="scss">

#module-table {
    min-width: 800px;
    width: 100%;
    .col-no, .col-action {
        width: 50px;
    }
    .col-secondary {
        width: 160px;
    }
}

</style>