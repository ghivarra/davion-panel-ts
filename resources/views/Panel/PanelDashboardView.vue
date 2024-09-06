<template>
    <main role="main" class="mb-4">
        <slot name="breadcrumb"></slot>
        Hello this is {{ name }} page. I made it blank so anyone can edit this page easily.
    </main>
</template>

<script setup lang="ts">

import { ref, onMounted, defineEmits, nextTick } from 'vue'

// define events
const emit = defineEmits(['loaded'])

// data
const name = ref('Dashboard')

// on mounted
onMounted(() => {
    nextTick(() => {
        emit('loaded')
    })
})


</script>