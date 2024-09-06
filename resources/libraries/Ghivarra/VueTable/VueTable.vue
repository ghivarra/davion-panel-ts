<template>
    <section v-bind:class="[ `${id}-wrapper`, 'ghivarra-vue-table-wrapper' ]" v-bind:id="`${id}-wrapper`">

        <!-- Vue Table Header -->
        <header class="ghivarra-vue-table-header">

            <!-- Length Options -->
            <div class="input-length-wrapper">
                <select v-model="length" v-bind:id="`${id}-length-selector`" class="input-length">
                    <option v-for="(option, n) in lengthOptions" v-bind:key="n" v-bind:value="option">
                        {{ (option === 0) ? 'Semua' : option }}
                    </option>
                </select>
            </div>

            <!-- Navigator -->
            <div class="top-paginator-wrapper paginator-wrapper">
                <button v-on:click.prevent="previous" v-bind:disabled=prevButtonDisabled type="button"
                    class="prev-button paginator-button">
                    <svg class="chevron chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path
                            d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z">
                        </path>
                    </svg>
                </button>
                <input v-model="pageNow" v-bind:max="pageTotal" v-bind:id="`${id}-paginator-top`" type="number" min="1" class="paginator-input">
                <button v-on:click.prevent="next" v-bind:disabled=nextButtonDisabled type="button"
                    class="next-button paginator-button">
                    <svg class="chevron chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path
                            d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z">
                        </path>
                    </svg>
                </button>
            </div>
        </header>

        <!-- Vue Table Body -->
        <div class="ghivarra-vue-table-body">

            <div class="ghivarra-vue-table-overflow-wrapper">

                <table v-bind:id="id" class="ghivarra-vue-table">

                    <thead>
                        <slot name="header"></slot>
                        <tr>
                            <th v-for="(item, key) in columns" v-bind:key="key"
                                v-on:click.prevent="sort(item, (item.key === orderColumn) ? orderDir : 'none')"
                                v-bind:class="(typeof item.sortable === 'undefined' || item.sortable === true) ? 'sortable' : '' + item.class?.join(' ')"
                                v-bind:data-sort="(item.key === orderColumn) ? orderDir : 'none'">
                                {{ item.text }}
                            </th>
                        </tr>
                    </thead>

                    <tbody v-if="status === 'loading'">
                        <tr>
                            <td v-bind:colspan="columns.length">{{ loadingText }}</td>
                        </tr>
                    </tbody>

                    <tbody v-if="status === 'loaded'">
                        <tr v-if="response.row.length < 1">
                            <td v-bind:colspan="columns.length">{{ emptyText }}</td>
                        </tr>
                        <tr v-else v-for="(item, n) in response.row" v-bind:key="n">
                            <td v-for="(column, b) in columns" v-bind:key="b" v-bind:class="column.class"
                                v-html="item[column.key]"></td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr>
                            <th v-for="(item, key) in columns" v-bind:key="key"
                                v-on:click.prevent="sort(item, (item.key === orderColumn) ? orderDir : 'none')"
                                v-bind:class="(typeof item.sortable === 'undefined' || item.sortable === true) ? 'sortable' : '' + item.class?.join(' ')"
                                v-bind:data-key="item.key"
                                v-bind:data-sort="(item.key === orderColumn) ? orderDir : 'none'">
                                {{ item.text }}
                            </th>
                        </tr>
                    </tfoot>

                </table>

            </div>

        </div>

        <!-- Vue Table Footer -->
        <footer class="ghivarra-vue-table-footer">

            <!-- Navigator -->
            <div class="bottom-paginator-wrapper paginator-wrapper">
                <button v-on:click.prevent="previous" v-bind:disabled=prevButtonDisabled type="button"
                    class="prev-button paginator-button">
                    <svg class="chevron chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path
                            d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z">
                        </path>
                    </svg>
                </button>
                <input v-model="pageNow" v-bind:max="pageTotal" v-bind:id="`${id}-paginator-bottom`" type="number" min="1" class="paginator-input">
                <button v-on:click.prevent="next" v-bind:disabled=nextButtonDisabled type="button"
                    class="next-button paginator-button">
                    <svg class="chevron chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path
                            d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z">
                        </path>
                    </svg>
                </button>
            </div>

            <!-- Table Info -->
            <div class="info">
                <span v-if="response.recordsFiltered == response.recordsTotal">
                    Menampilkan item {{ pageItems }} dari total {{ pageItemsFiltered }} data
                </span>
                <span v-else>
                    Menampilkan item {{ pageItems }} dari total {{ pageItemsFiltered }} data (disaring dari {{
                    pageItemsTotal }} data)
                </span>
            </div>

        </footer>

    </section>
</template>

<script setup lang="ts">

// import libs
import { defineProps, defineEmits, ref, computed, watch, defineExpose } from 'vue'

// interfaces
import type { Ref } from 'vue'
import type { PropInterface, ColumnInterface, VueTableInterface } from './VueTableInterfaces'

// define emit events
const emit = defineEmits(['beforeCreate', 'afterCreate'])

// props
const props = defineProps({
    url: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        default: 'vue-table'
    },
    language: {
        type: String,
        default: 'id'
    },
    headers: {
        type: Object,
        default: (props: PropInterface): Object => {
            return (typeof props.headers === 'undefined') ? { 'X-Requested-With': 'XMLHttpRequest' } : props.headers
        }
    },
    defaultLength: {
        type: Number,
        default: 10
    },
    lengthOptions: {
        type: Array,
        default: (props: PropInterface): number[] => {
            return (typeof props.lengthOptions === 'undefined') ? [ 0, 10, 25, 50] : props.lengthOptions
        }
    },
    order: {
        type: Object,
        default: (props: PropInterface): { column: string, dir: string } => {
            return (typeof props.order === 'undefined') ? { column: 'id', dir: 'asc' } : props.order
        }
    },
    loadingText: {
        type: String,
        default: 'Sedang memuat data...'
    },
    emptyText: {
        type: String,
        default: 'Belum ada data untuk ditampilkan'
    },
    columns: {
        type: Array as () => ColumnInterface[],
        default: (props: PropInterface): ColumnInterface[]  => {
            return (typeof props.columns === 'undefined') ? [] : props.columns
        }
    },
    processData: {
        type: Function,
        default: ((data: VueTableInterface): VueTableInterface => {
            return data
        })
    }
})

// data
const response = ref({
    draw: 0,
    length: 0,
    recordsTotal: 0,
    recordsFiltered: 0,
    row: []
})
const drawCount = ref(0)
const length = ref(10)
const idle = ref(true)
const pageNow = ref(1)
const status = ref('loading')
const searchStatus = ref(0)
const searchTimeout = ref(500)
const orderColumn = ref('')
const orderDir: Ref<"asc"|"desc"|"none"> = ref('asc')

// computed
const pageTotal = computed((): number => {
    return (length.value === 0) ? 1 : Math.ceil(response.value.recordsFiltered / length.value)
})

const prevButtonDisabled = computed((): boolean => {
    return (pageNow.value <= 1) ? true : false
})

const nextButtonDisabled = computed((): boolean => {
    return (pageNow.value === pageTotal.value) ? true : false
})

const pageItems = computed((): string => {
    // if empty data
    if (response.value.recordsFiltered < 1) {
        return '0 - 0'
    }

    const lengthCalc = (length.value === 0) ? response.value.recordsFiltered : length.value
    const pageNowCalc = pageNow.value - 1

    // detect start items
    const start = (pageNowCalc * lengthCalc) + 1
    const startFormatted = new Intl.NumberFormat(props.language).format(start)

    // detect end items
    const end = (pageNowCalc * lengthCalc) + response.value.length
    const endFormatted = new Intl.NumberFormat(props.language).format(end)

    return `${startFormatted} - ${endFormatted}`
})

const pageItemsFiltered = computed(() => new Intl.NumberFormat(props.language).format(response.value.recordsFiltered))
const pageItemsTotal = computed(() => new Intl.NumberFormat(props.language).format(response.value.recordsTotal))

// methods
const buildColumn = (form: FormData, columns: ColumnInterface[]): FormData => {
    columns.forEach((column, i) => {
        let query = (typeof column.query !== 'undefined') ? column.query : ''
        let key = (typeof column.key !== 'undefined') ? column.key : '' 

        if (typeof column.searchable !== 'undefined' && !column.searchable) {
            query = ''
        }

        form.append(`columns[${i}][query]`, query)
        form.append(`columns[${i}][key]`, key)
    })

    return form
}

const handleError = (statusCode: number, statusText: string): void => {
    if (statusCode === 401) {
        alert('Anda harus login untuk mengakses data')
    } else if (statusCode === 403) {
        alert('Anda tidak memiliki izin untuk mengakses data')
    } else if (statusCode === 404) {
        alert('URL data tidak ditemukan')
    } else if (statusCode >= 500) {
        alert('Server sedang sibuk silahkan coba lagi di lain waktu')
    } else {
        alert(statusText)
    }
}

const previous = (): void => {
    if (!prevButtonDisabled.value && idle.value) {
        pageNow.value--
    }
}

const next = (): void => {
    if (!nextButtonDisabled.value && idle.value) {
        pageNow.value++
    }
}

const sort = (item: ColumnInterface, sort: "asc"|"desc"|"none"): void => {
    if (idle.value && typeof item.sortable === 'undefined' || idle.value && item.sortable) {
        orderColumn.value = item.key
        orderDir.value = (sort === 'asc') ? 'desc' : 'asc'
        draw()
    }
}

const init = (): Promise<any> => {
    length.value = props.defaultLength
    orderColumn.value = props.order.column
    orderDir.value = props.order.dir

    return draw()
}

const draw = (): Promise<any> => {

    // return promise if vue table is not idle
    if (!idle.value) {
        return new Promise((resolve) => {
            resolve({
                status: 'error',
                message: 'VueTable is busy'
            })
        })
    }

    idle.value = false
    status.value = 'loading'
    const data = new FormData

    // set data
    drawCount.value++
    const all = (length.value === 0) ? 'true' : 'false'
    const offset = (pageNow.value - 1) * length.value

    // append data
    data.append('draw', drawCount.value.toString())
    data.append('all', all)
    data.append('limit', length.value.toString())
    data.append('offset', offset.toString())
    data.append('order[column]', orderColumn.value)
    data.append('order[dir]', orderDir.value)

    // build column and append
    const finalData = buildColumn(data, props.columns)

    // return new promise
    return fetch(props.url, {
        method: 'POST',
        headers: props.headers,
        body: finalData
    }).then((res) => {
        if (!res.ok) {
            idle.value = true
            return handleError(res.status, res.statusText)
        }

        res.json().then((res): void => {
            if (res.status !== 'success') {
                alert('Gagal menarik data')
            } else {
                response.value = props.processData(res.data as VueTableInterface)
                status.value = 'loaded'
                idle.value = true
            }
        })
    })
}

// watcher
watch(pageNow, () => {
    draw()
})

watch(length, () => {
    if (pageNow.value === 1) {
        draw()
    } else {
        pageNow.value = 1
    }
})

watch(() => props.columns, () => {
    if (searchStatus.value) {
        clearTimeout(searchStatus.value)
    }

    searchStatus.value = setTimeout(() => {
        pageNow.value = 1
        draw()
    }, searchTimeout.value)
}, { deep: true })

// expose all methods
defineExpose({
    draw, init, sort, next, previous
})

// emit events and init
emit('beforeCreate')

init().finally(() => {
    emit('afterCreate')
})

</script>

<style lang="scss">

@import "./style.scss";

</style>