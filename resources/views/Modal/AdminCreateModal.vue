<template>
    <section id="create-admin-modal">
        <button ref="modalOpenButton" v-on:click="clearForm" class="d-none" data-bs-toggle="modal" data-bs-target="#adminCreateFormModal"></button>
        <div class="modal fade" id="adminCreateFormModal" tabindex="-1" aria-labelledby="adminCreateFormModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <form v-on:submit.prevent="submitForm($event as SubmitEvent)" method="POST" class="modal-content" enctype="multipart/form-data">
                    <div class="modal-header bg-primary text-white">
                        <h1 class="modal-title fs-5" id="adminCreateFormModalLabel">Tambah Admin</h1>
                    </div>
                    <div class="modal-body">
                        
                        <div class="mb-3">
                            <label for="adminCreateUsername" class="form-label fw-bold">
                                Username
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input v-model="data.username" type="text" class="form-control" id="adminCreateUsername" name="username" autocomplete="off" maxlength="100" required>
                        </div>

                        <div class="mb-3">
                            <label for="adminCreateEmail" class="form-label fw-bold">
                                Email
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input v-model="data.email" type="email" class="form-control" id="adminCreateEmail" name="admin_email" autocomplete="off" maxlength="200" required>
                        </div>

                        <div class="mb-3">
                            <label for="adminCreateFullname" class="form-label fw-bold">
                                Nama Lengkap
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input v-model="data.name" type="text" class="form-control" id="adminCreateFullname" name="admin_fullname" autocomplete="off" maxlength="200" required>
                        </div>

                        <div class="mb-3">
                            <label for="adminCreateRoles" class="form-label fw-bold">
                                Role
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <select v-model="data.adminRoleId" name="admin_role_id" id="adminCreateRoles" class="form-select" required>
                                <option v-for="(role, n) in roles" v-bind:key="n" v-bind:value="role.id">{{ role.name }}</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="adminCreatePassword" class="form-label fw-bold">
                                Password
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <div class="position-relative">
                                <input v-model="data.password" v-bind:type="inputType.password" class="form-control" id="adminCreatePassword" name="password" autocomplete="new-password" placeholder="*************" required>
                                <button v-on:click.prevent="passwordToggle('password')" type="button" class="btn btn-link text-secondary password-toggle">
                                    <font-awesome v-if="inputType.password === 'password'" icon="fas fa-eye"></font-awesome>
                                    <font-awesome v-if="inputType.password === 'text'" icon="fas fa-eye-slash"></font-awesome>
                                </button>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="adminCreatePasswordConfirmation" class="form-label fw-bold">
                                Konfirmasi Password
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <div class="position-relative">
                                <input v-model="data.passwordConfirmation" v-bind:type="inputType.passwordConf" class="form-control" id="adminCreatePasswordConfirmation" name="confirmation_password" autocomplete="new-password" placeholder="*************" required>
                                <button v-on:click.prevent="passwordToggle('passwordConf')" type="button" class="btn btn-link text-secondary password-toggle">
                                    <font-awesome v-show="inputType.passwordConf === 'password'" icon="fas fa-eye"></font-awesome>
                                    <font-awesome v-show="inputType.passwordConf === 'text'" icon="fas fa-eye-slash"></font-awesome>
                                </button>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="adminCreatePhoto" class="form-label fw-bold">Foto</label>
                            <input v-on:change="showImage" type="file" class="form-control" id="adminCreatePhoto" name="photo" autocomplete="new-password" accept="image/png,image/jpeg,image/gif">
                        </div>

                        <div v-show="showImagePreview" class="mb-3 pt-3">
                            <img ref="imagePreview" src="" class="admin-image-preview" alt="Preview Gambar/Foto">
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
import { ref, inject, defineProps, defineExpose, defineEmits } from 'vue'
import { panelUrl, checkAxiosError } from '@/libraries/Helpers'
import axios from 'axios'
import Swal from 'sweetalert2'

// import type
// import type { DatatableAdminInterface } from '@/interfaces/Datatable/DatatableAdminInterface'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'
import type { DataAdminRoleInterface } from '@/interfaces/DataAdminRoleInterface'

// define emitted events
const emit = defineEmits(['formSubmitted'])

// inject
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')

// props
defineProps<{
    roles: DataAdminRoleInterface[]
}>()

// data
const data = ref({
    username: '',
    password: '',
    passwordConfirmation: '',
    name: '',
    email: '',
    adminRoleId: '1'
})
const showImagePreview = ref(false)
const inputType = ref({
    password: 'password',
    passwordConf: 'password'
})

// refs
const imagePreview = ref<HTMLImageElement | null>(null)
const modalCloseButton = ref<HTMLImageElement | null>(null)
const modalOpenButton = ref<HTMLImageElement | null>(null)

// methods
const clearForm = (): void => {
    data.value.username = '',
    data.value.password = '',
    data.value.passwordConfirmation = '',
    data.value.name = '',
    data.value.email = '',
    data.value.adminRoleId = '1'
    showImagePreview.value = false

    if (imagePreview.value !== null) {
        imagePreview.value.setAttribute('src', '')
    }
}

const showImage = (event: Event): void => {
    const input = event.target as HTMLInputElement
    const files = input.files
    if (files !== null) {
        const [file] = files
        if (file) {
            if (imagePreview.value !== null) {
                imagePreview.value.setAttribute('src', URL.createObjectURL(file))
                showImagePreview.value = true
            }
        } else {
            if (imagePreview.value !== null) {
                showImagePreview.value = false
                imagePreview.value.setAttribute('src', '')
            }
        }
    }
}

const passwordToggle = (key: "password" | "passwordConf"): void => {
    const currentType = inputType.value[key]
    inputType.value[key] = (currentType === 'text') ? 'password' : 'text'
}

const submitForm = (event: SubmitEvent): void => {
    const form = event.target as HTMLFormElement
    
    // submit form
    if (modalCloseButton.value !== null) {
        modalCloseButton.value.click()
    }

    // show loader
    showLoader!()

    // save data
    axios.post(panelUrl('administrator/create'), new FormData(form))  
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            if (res.status !== 'success') {
                Swal.fire('Whoopss!!', res.message, 'warning')
            } else {
                emit('formSubmitted')
            }
        }).catch(function(res) {
            checkAxiosError(res.request.status)
        }).finally(function() {
            hideLoader!()
        })
}

// expose refs
defineExpose({ modalCloseButton, modalOpenButton })

</script>

<style lang="scss">

.admin-image-preview {
    max-width: 200px;
}

.password-toggle {
    position: absolute;
    top: 0;
    right: 0;
}

</style>