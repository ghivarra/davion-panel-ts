<template>
    <main role="main" class="mb-4">
        <slot name="breadcrumb"></slot>

        <!-- INFORMASI FORM -->
        <section class="panel-box bg-white mb-4">
            <header class="panel-box-header">
                Informasi
            </header>
            <form v-on:submit.prevent="submitMainForm($event as SubmitEvent)" id="websiteMainForm" class="p-3">
                <div class="mb-3">
                    <label for="formName" class="form-label fw-bold">Nama Website</label>
                    <input v-model="mainForm.name" name="name" id="formName" type="text" class="form-control" autocomplete="off" required>
                </div>
                <div class="mb-3">
                    <label for="formTagline" class="form-label fw-bold">Slogan/Tagline</label>
                    <input v-model="mainForm.tagline" name="tagline" id="formTagline" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="formAppVersion" class="form-label fw-bold">Versi Aplikasi</label>
                    <input v-model="mainForm.app_version" name="app_version" id="formAppVersion" type="text" class="form-control" required>
                </div>
                <div class="mb-4">
                    <label for="formDescription" class="form-label fw-bold">Deskripsi</label>
                    <textarea v-model="mainForm.description" name="description" id="formDescription" class="form-control" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary d-flex align-items-center">
                    <font-awesome icon="fa-solid fa-floppy-disk" class="me-2"></font-awesome>
                    Simpan Informasi
                </button>
            </form>
        </section>

        <div class="row row-cols-1 row-cols-sm-2">

            <!-- LOGO FORM -->
            <div class="col">
                <section class="panel-box bg-white mb-4 w-100">
                    <header class="panel-box-header">
                        Logo
                    </header>
                    <form v-on:submit.prevent="submitLogoForm($event as SubmitEvent)" id="websiteMainForm" class="p-3">
                        <img v-bind:src="logoUrl" v-bind:alt="mainForm.name" class="d-block mb-4">
                        <div class="mb-4">
                            <label for="logoInput" class="form-label fw-bold">Unggah Logo Baru</label>
                            <input name="logo" class="form-control" type="file" id="logoInput" accept="image/png" required>
                        </div>
                        <button type="submit" class="btn btn-primary d-flex align-items-center">
                            <font-awesome icon="fa-solid fa-floppy-disk" class="me-2"></font-awesome>
                            Simpan Logo
                        </button>
                    </form>
                </section>
            </div>

            <!-- ICON FORM -->
            <div class="col">
                <section class="panel-box bg-white mb-4 w-100">
                    <header class="panel-box-header">
                        Icon
                    </header>
                    <form v-on:submit.prevent="submitIconForm($event as SubmitEvent)" id="websiteMainForm" class="p-3">
                        <img v-bind:src="iconUrl" v-bind:alt="mainForm.name" class="d-block mb-4">
                        <div class="mb-4">
                            <label for="iconInput" class="form-label fw-bold">Unggah Icon Baru</label>
                            <input name="icon" class="form-control" type="file" id="iconInput" accept="image/png" required>
                        </div>
                        <button type="submit" class="btn btn-primary d-flex align-items-center">
                            <font-awesome icon="fa-solid fa-floppy-disk" class="me-2"></font-awesome>
                            Simpan Icon
                        </button>
                    </form>
                </section>
            </div>

        </div>

    </main>
</template>

<script setup lang="ts">

// import libs
import { inject, ref, computed, onMounted, defineEmits } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { panelUrl, checkAxiosError, imageUrl } from '@/libraries/Helpers'

// import type
import type { Ref, ComputedRef } from 'vue'
import type { WebsiteInfoInterface } from '@/interfaces/WebsiteInfoInterface'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'

// define emitted events
const emit = defineEmits(['loaded'])

// inject
const config = inject<ComputedRef<WebsiteInfoInterface>>('config')
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('hideLoader')

// data interface
interface MainFormInterface {
    name: string,
    tagline: string,
    description: string,
    app_version: string
}

// data
// const name = ref('Website')
const mainForm: Ref<MainFormInterface> = ref({
    name: '',
    tagline: '',
    description: '',
    app_version: ''
})

// computed data
const logoUrl = computed(() => imageUrl(`logo/${config?.value.logo}`, 180))
const iconUrl = computed(() => imageUrl(`icon/${config?.value.icon}`, 64))

// methods
const submitMainForm = (event: SubmitEvent): void => {
    showLoader!()
    const form = event.currentTarget as HTMLFormElement
    axios.post(panelUrl('website/main-form-update'), new FormData(form))  
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

const submitLogoForm = (event: SubmitEvent): void => {
    showLoader!()
    const form = event.currentTarget as HTMLFormElement
    axios.post(panelUrl('website/logo-update'), new FormData(form))  
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

const submitIconForm = (event: SubmitEvent): void => {
    showLoader!()
    const form = event.currentTarget as HTMLFormElement
    axios.post(panelUrl('website/icon-update'), new FormData(form))  
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

// on mounted
onMounted(() => {
    // get website data
    axios.get(panelUrl('website/data'))
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            const data: MainFormInterface = res.data
            mainForm.value = data
        }).catch(function(response) {
            checkAxiosError(response.request.status)
        }).finally(function() {
            emit('loaded')
        })
})

</script>