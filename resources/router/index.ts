import type { RouteRecordRaw } from 'vue-router'

interface RouterIndexInterface {
	default: RouteRecordRaw[]
}

const router = (): Promise<RouterIndexInterface> => {
	// uncomment this if using chunked files
	// return import('@/router/config/index-chunked')

	// uncomment this if using single files
	return import('@/router/config/index-single')
}

export default router