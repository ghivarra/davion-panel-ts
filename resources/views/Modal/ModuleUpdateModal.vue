<template>
    <section id="update-table">
        <button ref="updateModalOpenButton" v-on:click="clearForm" class="d-none" data-bs-toggle="modal" data-bs-target="#updateFormModal"></button>
        <div class="modal fade" id="updateFormModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="updateFormModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <form v-on:submit.prevent="update($event as MouseEvent)" method="POST" class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h1 class="modal-title fs-5" id="updateFormModalLabel">Update Modul</h1>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="moduleGroup" class="form-label fw-bold">
                                Grup
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input v-model="data.group" list="groupList" type="text" class="form-control"
                                id="moduleGroup" name="group" maxlength="200" required>
                            <datalist id="groupList">
                                <option v-for="(moduleGroup, n) in moduleGroups" v-bind:key="n" v-bind:value="moduleGroup">
                                    {{ moduleGroup }}
                                </option>
                            </datalist>
                        </div>
                        <div class="mb-3">
                            <label for="moduleAlias" class="form-label fw-bold">
                                Alias
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input v-model="data.alias" type="text" class="form-control" id="moduleAlias" name="alias" maxlength="100" required>
                        </div>
                        <div class="mb-3">
                            <label for="moduleName" class="form-label fw-bold">
                                Nama
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input v-model="data.name" type="text" class="form-control" id="moduleName" name="name" maxlength="200" autocomplete="off" required>
                        </div>
                        <div class="mb-3">
                            <label for="moduleStatus" class="form-label fw-bold">
                                Status
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <select v-model="data.statusDefault" name="status" id="moduleStatus" class="form-select"
                                required>
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button ref="updateModalCloseButton" type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">

// import libs
import { ref, inject, nextTick } from 'vue'
import { panelUrl, checkAxiosError } from '@/libraries/Helpers'
import axios from 'axios'
import Swal from 'sweetalert2'

// import types
import type { Ref } from 'vue'
import type { DatatableModuleInterface } from '@/interfaces/Datatable/DatatableModuleInterface';
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'

// inject
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')

// props
const props = defineProps<{
    moduleGroups: string [],
    moduleUpdateData: DatatableModuleInterface,
    getModuleGroup: () => void,
    updateTable: () => void
}>()

// data
const data: Ref<DatatableModuleInterface> = ref({
    id: 0,
    group: '',
    alias: '',
    name: '',
    status: '',
    statusDefault: '',
    groupDefault: ''
})

// refs
const updateModalOpenButton: Ref<HTMLElement | null> = ref(null)
const updateModalCloseButton: Ref<HTMLElement | null> = ref(null)

// methods
const clearForm = (): void => {
    nextTick(() => {
        const moduleData = {... props.moduleUpdateData}
        
        data.value.id = moduleData.id
        data.value.group = moduleData.group
        data.value.alias = moduleData.alias
        data.value.name = moduleData.name
        data.value.status = moduleData.status
        data.value.statusDefault = moduleData.statusDefault
        data.value.groupDefault = moduleData.groupDefault
    })
}

const update = (event: MouseEvent): void => {
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const id = (typeof data.value.id !== 'string') ? data.value.id.toString() : data.value.id

    formData.append('id', id)

    // show loader
    showLoader!()

    // save data
    axios.post(panelUrl('module/update'), form)  
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            hideLoader!()
            if (res.status !== 'success') {
                Swal.fire('Whoopss!!', res.message, 'warning')
            } else {
                clearForm()
                updateModalCloseButton.value?.click()
                props.getModuleGroup()
                props.updateTable()
            }
        }).catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

// expose
defineExpose({
    updateModalOpenButton,
    updateModalCloseButton
})

</script>