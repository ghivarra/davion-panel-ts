<template>
    <main role="main" class="mb-4">
        <slot name="breadcrumb"></slot>

        <!-- ACCOUNT FORM -->
        <section class="panel-box bg-white mb-4">
            <header class="panel-box-header">
                Data Akun
            </header>
            <form v-on:submit.prevent="submitForm" class="p-3" enctype="multipart/form-data">
                <div class="mb-3 position-relative">
                    <label for="name" class="form-label fw-bold">Nama Lengkap</label>
                    <input v-model="data.name" autocomplete="off" name="name" id="name" type="text" class="form-control" required>
                </div>
                <div class="mb-3 position-relative">
                    <label for="email" class="form-label fw-bold">Email</label>
                    <input v-model="data.email" autocomplete="off" name="email" id="email" type="email" class="form-control" required>
                </div>
                <div class="position-relative">
                    <label for="photo" class="form-label fw-bold">Unggah Foto Baru</label>
                    <input v-on:change="showImage" name="photo" id="photo" type="file" class="form-control" accept="image/jpeg,image/png,image/gif">
                </div>
                <div class="my-4">
                    <img v-show="showImagePreview" ref="imagePreview" src="" class="image-preview" alt="image-preview">
                </div>
                <button type="submit" class="btn btn-primary">
                    <font-awesome icon="fas fa-save" class="me-1"></font-awesome>
                    Simpan Perubahan
                </button>
            </form>
        </section>
    </main>
</template>

<script setup lang="ts">

// import libs
import { ref, inject, defineEmits, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { panelUrl, checkAxiosError } from '@/libraries/Helpers'
import Swal from 'sweetalert2'
import axios from 'axios'

// import types
import type { ComputedRef } from 'vue'
import type { DataAdminInterface } from '@/interfaces/DataAdminInterface'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'

// env
const router = useRouter()

// define emitted events
const emit = defineEmits(['loaded'])

// inject
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')
const updateAdminData = inject<() => void>('updateAdminData')
const admin = inject<ComputedRef<DataAdminInterface>>('admin')

// data
const showImagePreview = ref(false)
const data = ref({
    name: '',
    email: ''
})

// refs
const imagePreview = ref<HTMLImageElement | null>(null)

// watcher
watch(admin!, (newData) => {
    if (typeof newData !== 'undefined') {
        data.value.name = newData.name
        data.value.email = newData.email
    }
})

// methods
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

const submitForm = (event: Event): void => {
    const form = event.target as HTMLFormElement

    // show loader
    showLoader!()

    // send
    axios.post(panelUrl('account/update'), new FormData(form))
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            hideLoader!()
            if (res.status !== 'success') {
                Swal.fire('Whoopss!!', res.message, 'warning')
            } else {
                updateAdminData!()
                router.push({ name: 'panel.profile' })
            }
        })
        .catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

onMounted(() => {
    nextTick(() => {
        if (typeof admin !== 'undefined') {
            data.value.name = admin.value.name
            data.value.email = admin.value.email
            emit('loaded')
        }
    })
})

</script>

<style lang="scss">
.image-preview {
    max-width: 300px;
    height: auto;
}
</style>