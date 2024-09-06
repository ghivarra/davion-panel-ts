<template>
    <section id="update-admin-modal">
        <button ref="modalOpenButton" v-on:click="clearForm" class="d-none" data-bs-toggle="modal" data-bs-target="#adminUpdateFormModal"></button>
        <div class="modal fade" id="adminUpdateFormModal" tabindex="-1" aria-labelledby="adminUpdateFormModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <form v-on:submit.prevent="submitForm($event as SubmitEvent)" method="POST" class="modal-content" enctype="multipart/form-data">
                    <div class="modal-header bg-primary text-white">
                        <h1 class="modal-title fs-5" id="adminUpdateFormModalLabel">Tambah Admin</h1>
                    </div>
                    <div class="modal-body">

                        <input name="id" type="hidden" v-model="data.id">
                        
                        <div class="mb-3">
                            <label for="adminUpdateUsername" class="form-label fw-bold">
                                Username
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input v-model="data.username" type="text" class="form-control" id="adminUpdateUsername" name="username" autocomplete="off" maxlength="100" required>
                        </div>

                        <div class="mb-3">
                            <label for="adminUpdateEmail" class="form-label fw-bold">
                                Email
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input v-model="data.email" type="email" class="form-control" id="adminUpdateEmail" name="admin_email" autocomplete="off" maxlength="200" required>
                        </div>

                        <div class="mb-3">
                            <label for="adminUpdateFullname" class="form-label fw-bold">
                                Nama Lengkap
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <input v-model="data.name" type="text" class="form-control" id="adminUpdateFullname" name="admin_fullname" autocomplete="off" maxlength="200" required>
                        </div>

                        <div class="mb-3">
                            <label for="adminUpdateRoles" class="form-label fw-bold">
                                Role
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <select v-model="data.adminRoleId" name="admin_role_id" id="adminUpdateRoles" class="form-select" required>
                                <option v-for="(role, n) in roles" v-bind:key="n" v-bind:value="role.id">{{ role.name }}</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="adminUpdatePassword" class="form-label fw-bold">
                                Password
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <div class="position-relative">
                                <input v-model="data.password" v-bind:type="inputType.password" class="form-control" id="adminUpdatePassword" name="password" autocomplete="new-password" placeholder="*************">
                                <button v-on:click.prevent="passwordToggle('password')" type="button" class="btn btn-link text-secondary password-toggle">
                                    <font-awesome v-if="inputType.password === 'password'" icon="fas fa-eye"></font-awesome>
                                    <font-awesome v-if="inputType.password === 'text'" icon="fas fa-eye-slash"></font-awesome>
                                </button>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="adminUpdatePasswordConfirmation" class="form-label fw-bold">
                                Konfirmasi Password
                                <span class="text-danger" title="Wajib Diisi">*</span>
                            </label>
                            <div class="position-relative">
                                <input v-model="data.passwordConfirmation" v-bind:type="inputType.passwordConf" class="form-control" id="adminUpdatePasswordConfirmation" name="confirmation_password" autocomplete="new-password" placeholder="*************">
                                <button v-on:click.prevent="passwordToggle('passwordConf')" type="button" class="btn btn-link text-secondary password-toggle">
                                    <font-awesome v-show="inputType.passwordConf === 'password'" icon="fas fa-eye"></font-awesome>
                                    <font-awesome v-show="inputType.passwordConf === 'text'" icon="fas fa-eye-slash"></font-awesome>
                                </button>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="adminUpdatePhoto" class="form-label fw-bold">Foto</label>
                            <div v-show="showImagePreview" class="mb-3 pt-1">
                                <img ref="imagePreview" src="" class="admin-image-preview" alt="Preview Gambar/Foto">
                            </div>
                            <input v-on:change="showImage" type="file" class="form-control" id="adminUpdatePhoto" name="photo" autocomplete="new-password" accept="image/png,image/jpeg,image/gif">
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
import { ref, defineEmits, defineExpose, inject, nextTick } from 'vue'
import { panelUrl, checkAxiosError, restructurized } from '@/libraries/Helpers'
import axios from 'axios'
import Swal from 'sweetalert2'

// import types
import type { DatatableAdminInterface } from '@/interfaces/Datatable/DatatableAdminInterface'
import type { DataAdminRoleInterface } from '@/interfaces/DataAdminRoleInterface'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'

// define emitted events
const emit = defineEmits(['formSubmitted'])

// inject
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')

// props
const props = defineProps<{
    roles: DataAdminRoleInterface[],
    admin: DatatableAdminInterface
}>()

// data
const data = ref({
    id: 0,
    username: '',
    password: '',
    passwordConfirmation: '',
    name: '',
    email: '',
    adminRoleId: 1
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
    nextTick(() => {
        const admin = restructurized(props.admin) as DatatableAdminInterface
        data.value.id = (typeof admin.id === 'string') ? parseInt(admin.id) : admin.id
        data.value.username = admin.username,
        data.value.password = '',
        data.value.passwordConfirmation = '',
        data.value.name = admin.name,
        data.value.email = admin.email,
        data.value.adminRoleId = (typeof admin.admin_role_id === 'string') ? parseInt(admin.admin_role_id) : admin.admin_role_id
        showImagePreview.value = false

        if (imagePreview.value !== null) {
            imagePreview.value.setAttribute('src', '')
        }
    })
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
    axios.post(panelUrl('administrator/update'), new FormData(form))  
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