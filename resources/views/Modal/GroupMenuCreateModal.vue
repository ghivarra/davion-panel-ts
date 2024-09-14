<template>
    <section id="create-menu-group">
        <button ref="modalOpenButton" v-on:click="clearForm" class="d-none" data-bs-toggle="modal"
            data-bs-target="#groupCreateFormModal"></button>
        <div class="modal fade" id="groupCreateFormModal" data-bs-backdrop="static" data-bs-keyboard="false"
            tabindex="-1" aria-labelledby="groupCreateFormModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <form v-on:submit.prevent="submitForm" method="POST" class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h1 class="modal-title fs-5" id="groupCreateFormModalLabel">Buat Grup Menu</h1>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="groupCreateName" class="form-label fw-bold">
                                Nama
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input v-model="name" type="text" class="form-control" id="groupCreateName"
                                name="name" autocomplete="off" maxlength="200" required>
                        </div>
                        <div class="mb-3">
                            <label for="groupCreateStatus" class="form-label fw-bold">
                                Status
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <select v-model="status" name="status" id="groupCreateStatus"
                                class="form-select" required>
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button ref="modalCloseButton" type="button" class="btn btn-secondary"
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
import Swal from 'sweetalert2'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface';

// inject
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')

// data
const name = ref('')
const status = ref('Aktif')

// methods
const clearForm = (): void => {
    name.value = ''
    status.value = 'Aktif'
}

const submitForm = (): void => {
    showLoader!()

    const form = new FormData()
    form.append('name', name.value)
    form.append('status', status.value)

    // save data
    axios.post(panelUrl('menu/group/create'), form)  
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

</script>