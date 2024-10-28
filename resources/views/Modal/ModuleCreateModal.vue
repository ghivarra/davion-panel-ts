<template>
    <section id="create-table" class="mb-4">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createFormModal">
            <font-awesome icon="fas fa-plus" class="me-2"></font-awesome>
            Tambah Modul
        </button>
        <div class="modal fade" id="createFormModal" data-bs-backdrop="static" data-bs-keyboard="false"
            tabindex="-1" aria-labelledby="createFormModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <form v-on:submit.prevent="create($event as MouseEvent)" method="POST" class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h1 class="modal-title fs-5" id="createFormModalLabel">Tambah Modul</h1>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="moduleGroup" class="form-label fw-bold">
                                Grup
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input list="groupList" type="text" class="form-control" id="moduleGroup" name="group" maxlength="200" required>
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
                            <input type="text" class="form-control" id="moduleAlias" name="alias" maxlength="100" required>
                        </div>
                        <div class="mb-3">
                            <label for="moduleName" class="form-label fw-bold">
                                Nama
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input type="text" class="form-control" id="moduleName" name="name" maxlength="200" autocomplete="off" required>
                        </div>
                        <div class="mb-3">
                            <label for="moduleStatus" class="form-label fw-bold">
                                Status
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <select name="status" id="moduleStatus" class="form-select" required>
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button ref="createModalCloseButton" type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary">Simpan Data</button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">

// import libs
import { ref, inject } from 'vue'
import { panelUrl, checkAxiosError } from '@/libraries/Helpers'
import axios from 'axios'
import swal from 'sweetalert'

// import types
import type { Ref } from 'vue'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface';

// inject
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')

// props
const props = defineProps<{
    moduleGroups: string []
    getModuleGroup: () => void,
    updateTable: () => void
}>()

// refs
const createModalCloseButton: Ref<HTMLElement | null> = ref(null)

// methods
const create = (event: MouseEvent) => {
    const form = event.target as HTMLFormElement

    // show loader
    showLoader!()
    
    // save data
    axios.post(panelUrl('module/create'), new FormData(form))  
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
                form.reset()
                createModalCloseButton.value?.click()
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
    createModalCloseButton
})

</script>