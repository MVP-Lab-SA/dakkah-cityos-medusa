import { RenderAdmin } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import config from '@/payload.config'

export default RenderAdmin({
  config,
  importMap,
})
