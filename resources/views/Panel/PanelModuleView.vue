<template>
    <main role="main" class="mb-4">
        <slot name="breadcrumb"></slot>

        <!-- MODULE CREATE MODAL -->
        <ModuleCreateModal v-bind:module-groups="moduleGroups" v-bind:get-module-group="getModuleGroup" v-bind:update-table="updateTable"/>

        <!-- MODULE UPDATE MODAL -->
        <ModuleUpdateModal ref="moduleUpdateModalRef" v-bind:module-groups="moduleGroups" v-bind:get-module-group="getModuleGroup" v-bind:update-table="updateTable" v-bind:module-update-data="moduleUpdateData" />

        <section v-on:click="activeActionButton" ref="moduleTableSection">
            <vue-table id="module-table" ref="moduleTable" v-bind:defaultLength="25" v-bind:lengthOptions="[10,25,50]"
                v-bind:url="table.url" v-bind:order="table.order" v-bind:columns="table.columns"
                v-bind:processData="processData" v-on:afterCreate="$emit('loaded')">
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
            </vue-table>
        </section>
    </main>
</template>

<script setup lang="ts">

// import libs
import { ref, inject } from 'vue'
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
    id: 0,
    group: '',
    alias: '',
    name: '',
    status: '',
    groupDefault: '',
    statusDefault: '',
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
    if (data.row.length < 1) {
        tableData.value = []
        return data
    }

    data.row.forEach((item, i) => {
        let btnText = (item.status === 'Aktif') ? 'Nonaktifkan' : 'Aktifkan'
        let btnTextColor = (item.status === 'Aktif') ? 'text-warning' : 'text-success'
        data.row[i].action = `<div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle table-dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-list me-1"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <button data-key="${i}" class="edit-button dropdown-item" type="button" title="Edit Data">
                                            <i class="fa-solid fa-pen-to-square me-1 text-primary"></i>
                                            Edit
                                        </button>
                                    </li>
                                    <li>
                                        <button data-key="${i}" class="status-button dropdown-item" type="button" title="${btnText} Data">
                                            <i class="fa-solid fa-sliders me-1 ${btnTextColor}"></i>
                                            ${btnText}
                                        </button>
                                    </li>
                                    <li>
                                        <button data-key="${i}" class="delete-button dropdown-item" type="button" title="Hapus Data">
                                            <i class="fa-solid fa-trash-can me-1 text-danger"></i>
                                            Hapus
                                        </button>
                                    </li>
                                </ul>
                            </div>`
        data.row[i].groupDefault = item.group
        data.row[i].statusDefault = item.status
        data.row[i].group = `<p class="m-0 fw-bold">${item.group}</p>`
        data.row[i].status = (item.status === 'Aktif') ? `<span class="bg-success text-white py-2 px-3 rounded-pill fw-bold">${item.status}</span>` : `<span class="bg-warning py-2 px-3 text-white rounded-pill fw-bold">${item.status}</span>`
    })

    // put into data
    tableData.value = [... data.row]

    return {
        draw: (typeof data.draw === 'string') ? parseInt(data.draw) : data.draw,
        length: data.length,
        recordsTotal: data.recordsTotal,
        recordsFiltered: data.recordsFiltered,
        row: [... data.row],
    }
}

const updateTable = (): void => {
    moduleTable.value?.draw()
}

const editData = (key: number): void => {
    const moduleData = {... tableData.value[key]}
    moduleUpdateData.value.id = (typeof moduleData.id === 'string') ? parseInt(moduleData.id) : moduleData.id
    moduleUpdateData.value.group = (typeof moduleData.groupDefault === 'undefined') ? '' : moduleData.groupDefault
    moduleUpdateData.value.alias = moduleData.alias
    moduleUpdateData.value.name = moduleData.name
    moduleUpdateData.value.statusDefault = (typeof moduleData.statusDefault === 'undefined') ? 'Aktif' : moduleData.statusDefault
    moduleUpdateModalRef.value?.updateModalOpenButton?.click()
}

const updateStatusData = (key: number): void => {
    showLoader!()

    // set status
    const moduleData = {... tableData.value[key]}
    const targetId = (typeof moduleData.id === 'number') ? moduleData.id.toString() : moduleData.id
    const targetStatus = (moduleData.statusDefault === 'Aktif') ? 'Nonaktif' : 'Aktif'

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

const deleteData = (key: number): void => {
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

const activeActionButton = (event: MouseEvent): void => {
    const target = event.target as HTMLElement

    if (target.closest('.edit-button')) {
        const key = target.getAttribute('data-key')
        if (typeof key === 'string') {
            editData(parseInt(key))
        }
    }

    if (target.closest('.status-button')) {
        const key = target.getAttribute('data-key')
        if (typeof key === 'string') {
            updateStatusData(parseInt(key))
        }
    }

    if (target.closest('.delete-button')) {
        const key = target.getAttribute('data-key')
        if (typeof key === 'string') {
            deleteData(parseInt(key))
        }
    }
}

// created
getModuleGroup()

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