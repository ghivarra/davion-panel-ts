<template>
    <main role="main" class="mb-4">
        <slot name="breadcrumb"></slot>

        <!-- CHANGE PASSWORD FORM -->
        <section class="panel-box bg-white mb-4">
            <header class="panel-box-header">
                Ubah Password
            </header>
            <form v-on:submit.prevent="submitForm($event as SubmitEvent)" class="p-3">
                <div class="mb-3 position-relative">
                    <label for="oldPassword" class="form-label fw-bold">Password Lama</label>
                    <input v-model="data.oldPassword" v-bind:type="(show.oldPassword) ? 'text' : 'password'" name="old_password" id="oldPassword" class="form-control" placeholder="*************" required>
                    <button v-on:click="show.oldPassword = !show.oldPassword" type="button" class="btn btn-link show-password-toggle" title="Klik untuk melihat/menutup password">
                        <font-awesome v-if="!show.oldPassword" icon="fas fa-eye"></font-awesome>
                        <font-awesome v-if="show.oldPassword" icon="fas fa-eye-slash"></font-awesome>
                    </button>
                </div>
                <div class="mb-3 position-relative">
                    <label for="newPassword" class="form-label fw-bold">Password Baru</label>
                    <input v-model="data.newPassword" v-bind:type="(show.newPassword) ? 'text' : 'password'" name="new_password" id="newPassword" class="form-control" autocomplete="new-password" placeholder="*************" required>
                    <button v-on:click="show.newPassword = !show.newPassword" type="button" class="btn btn-link show-password-toggle" title="Klik untuk melihat/menutup password">
                        <font-awesome v-if="!show.newPassword" icon="fas fa-eye"></font-awesome>
                        <font-awesome v-if="show.newPassword" icon="fas fa-eye-slash"></font-awesome>
                    </button>
                </div>
                <div class="mb-4 position-relative">
                    <label for="confPassword" class="form-label fw-bold">Konfirmasi Password Baru</label>
                    <input v-model="data.confPassword" v-bind:type="(show.confPassword) ? 'text' : 'password'" name="conf_password" id="confPassword" class="form-control" autocomplete="new-password" placeholder="*************" required>
                    <button v-on:click="show.confPassword = !show.confPassword" type="button" class="btn btn-link show-password-toggle" title="Klik untuk melihat/menutup password">
                        <font-awesome v-if="!show.confPassword" icon="fas fa-eye"></font-awesome>
                        <font-awesome v-if="show.confPassword" icon="fas fa-eye-slash"></font-awesome>
                    </button>
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
import { ref, inject, onMounted, nextTick, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { panelUrl, checkAxiosError } from '@/libraries/Helpers'
import Swal from 'sweetalert2'
import axios from 'axios'

// import type
import type { Ref } from 'vue'
import type { BackendResponseInterface } from '@/interfaces/BackendResponseInterface'

// env
const router = useRouter()

// define emitted events
const emit = defineEmits(['loaded'])

// inject
const showLoader = inject<() => void>('showLoader')
const hideLoader = inject<() => void>('showLoader')

// interface
interface ShowDataInterface {
    oldPassword: boolean,
    newPassword: boolean,
    confPassword: boolean
}

interface DataInterface {
    oldPassword: string,
    newPassword: string,
    confPassword: string
}

// data
const show: Ref<ShowDataInterface> = ref({
    oldPassword: false,
    newPassword: false,
    confPassword: false
})

const data: Ref<DataInterface> = ref({
    oldPassword: '',
    newPassword: '',
    confPassword: ''
})

// methods
const submitForm = (event: SubmitEvent): void => {
    const form = event.target as HTMLFormElement

    // check data
    if (data.value.newPassword !== data.value.confPassword) {
        Swal.fire('Perubahan Dibatalkan', 'Form Password Baru dan form Konfirmasi Password Baru tidak sesuai', 'error')
        return
    }

    showLoader!()

    // send
    axios.post(panelUrl('account/change-password'), new FormData(form))
        .then(function(response) {
            const res: BackendResponseInterface = response.data
            hideLoader!()
            if (res.status !== 'success') {
                Swal.fire('Whoopss!!', res.message, 'warning')
            } else {
                Swal.fire('Perubahan Berhasil Disimpan', res.message, 'success')
                    .then(function() {
                        showLoader!()
                        router.push({ name: 'panel.profile' })
                    })
            }
        })
        .catch(function(res) {
            hideLoader!()
            checkAxiosError(res.request.status)
        })
}

// mounted
onMounted(() => {
    nextTick(() => {
        emit('loaded')
    })
})

</script>

<style lang="scss">

.show-password-toggle {
    position: absolute;
    right: 0;
    top: 2em;
}

</style>