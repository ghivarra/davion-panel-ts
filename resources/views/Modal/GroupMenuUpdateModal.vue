<template>
    <section id="edit-menu-group">
        <button ref="modalOpenButton" v-on:click="setFormData" class="d-none" data-bs-toggle="modal"
            data-bs-target="#groupEditFormModal"></button>
        <div class="modal fade" id="groupEditFormModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="groupEditFormModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <form v-on:submit.prevent="submitForm" method="POST" class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h1 class="modal-title fs-5" id="groupEditFormModalLabel">Update Grup Menu</h1>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="groupUpdateName" class="form-label fw-bold">
                                Nama
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input v-model="name" type="text" class="form-control" id="groupUpdateName" name="name"
                                maxlength="200" autocomplete="off" required>
                        </div>
                        <div class="mb-3">
                            <label for="groupUpdateStatus" class="form-label fw-bold">
                                Status
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <select v-model="status" name="status" id="groupUpdateStatus" class="form-select"
                                required>
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button ref="modalCloseButton" type="button" class="btn btn-secondary"
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
import { ref, inject } from 'vue'
import { panelUrl, checkAxiosError } from '@/libraries/Helpers'
import axios from 'axios'
import Swal from 'sweetalert2'

// import types
import type { Ref } from 'vue'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'
import type { DataGroupMenuInterface } from '@/interfaces/DataGroupMenuInterface'

// inject
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')

// props
const props = defineProps<{
    updateData: DataGroupMenuInterface
}>()

// data
const id = ref(0)
const name = ref('')
const status = ref('Aktif')

// refs
const modalOpenButton: Ref<HTMLElement | null> = ref(null)
const modalCloseButton: Ref<HTMLElement | null> = ref(null)

// methods
const setFormData = (): void => {
    id.value = props.updateData.id
    name.value = ''
    status.value = 'Aktif'
}

const submitForm = (): void => {
    showLoader!()
    modalCloseButton.value?.click()

    const form = new FormData()
    form.append('id', id.value.toString())
    form.append('name', name.value)
    form.append('status', status.value)

    // save data
    axios.post(panelUrl('menu/group/update'), form)  
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            if (res.status !== 'success') {
                hideLoader!()
                Swal.fire('Whoopss!!', res.message, 'warning')
            } else {
                window.location.reload()
            }
        }).catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

// expose
defineExpose({
    modalOpenButton, modalCloseButton
})

</script>