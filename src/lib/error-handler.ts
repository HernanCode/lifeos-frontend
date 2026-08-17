import { toast } from 'sonner'
import type { AxiosError } from 'axios'

type LaravelValidationErrors = Record<string, string[]>

export function handleMutationError(error: unknown, fallback = 'Ocurrió un error inesperado') {
  const axiosError = error as AxiosError<LaravelValidationErrors>
  const status = axiosError.response?.status
  const data = axiosError.response?.data

  if (status === 422 && data) {
    const firstKey = Object.keys(data)[0]
    const firstMessage = firstKey ? data[firstKey]?.[0] : null
    toast.error(firstMessage ?? 'Error de validación')
    return
  }

  if (status === 404) {
    toast.error('No se encontró el recurso')
    return
  }

  if (status === 403) {
    toast.error('No tenés permiso para realizar esta acción')
    return
  }

  if (status === 409) {
    toast.error('Hay un conflicto con los datos actuales')
    return
  }

  const message = axiosError.message
  if (message === 'Network Error') {
    toast.error('Sin conexión a internet')
    return
  }

  toast.error(fallback)
}
