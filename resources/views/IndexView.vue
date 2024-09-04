<template>
    <div v-show="useLoader">
        <Transition name="loader">
            <PreloadComponent v-if="loaderState" />
        </Transition>
    </div>
    <RouterView v-bind:token="csrfToken" v-bind:hash="csrfHash" />
</template>

<script setup lang="ts">

import { ref, computed, provide, onMounted, nextTick } from 'vue'
import type { Ref } from 'vue'
import { dom } from '@fortawesome/fontawesome-svg-core'
import { baseUrl, imageUrl } from '@/libraries/Helpers'
import PreloadComponent from '@/components/PreloadComponent.vue'
import type { WebsiteInfoInterface } from '@/interfaces/WebsiteInfoInterface'

// props
const props = defineProps<{
    website: WebsiteInfoInterface,
    title: string,
    csrfToken: string,
    csrfHash: string,
}>()

// data
const useLoader: Ref<string> = ref(import.meta.env.VITE_USE_LOADER)
const firstLoad: Ref<boolean> = ref(true)
const loaderState: Ref<boolean> = ref(true)
const webInfo = ref(props.website)
const pageTitle = ref(props.title)

// methods
const updateMetaData = (): void => {
    document.querySelector('title')!.innerHTML = `${pageTitle.value} | ${webInfo.value.name} - ${webInfo.value.tagline}`
    document.querySelector('meta[name=description]')!.setAttribute('content', webInfo.value.description)
    document.querySelector('link[data-id=favicon]')!.setAttribute('href', baseUrl('favicon.ico?v=' + webInfo.value.icon_version))
    document.querySelector('link[data-id=iconApple]')!.setAttribute('href', imageUrl(`icon/${webInfo.value.icon}`, 180))
    document.querySelector('link[data-id=icon32]')!.setAttribute('href', imageUrl(`icon/${webInfo.value.icon}`, 32))
    document.querySelector('link[data-id=icon16]')!.setAttribute('href', imageUrl(`icon/${webInfo.value.icon}`, 16))
}

const updateConfig = (newConfig: WebsiteInfoInterface): void => {
    webInfo.value = newConfig
    updateMetaData()
}

const showLoader = (): void => {
    loaderState.value = true
}

const hideLoader = (): void => {
    loaderState.value = false
}

// provide
provide('config', computed(() => webInfo.value))
provide('completeTitle', computed(() => `${pageTitle.value} | ${webInfo.value.name} - ${webInfo.value.tagline}`))
provide('updateConfig', updateConfig)
provide('showLoader', showLoader)
provide('hideLoader', hideLoader)

// on mounted
onMounted(() => {
    // set first load and loader state to false because the page already loaded
    nextTick(() => {
        firstLoad.value = false
        loaderState.value = false
        updateMetaData()
    })

    // watch font awesome icons
    dom.watch()
})

</script>
  