import { onBeforeUnmount, ref } from 'vue'

const DEFAULT_TIMEOUT = 3000

export function useAppToast() {
  const toast = ref({
    show: false,
    message: '',
    type: 'success'
  })

  let timeoutId = null

  function hideToast() {
    toast.value.show = false
  }

  function scheduleHide(timeout) {
    clearTimeout(timeoutId)

    if (!timeout || timeout < 0) {
      return
    }

    timeoutId = setTimeout(() => {
      hideToast()
    }, timeout)
  }

  function showToast(message, type = 'success', options = {}) {
    toast.value = {
      show: true,
      message,
      type
    }

    scheduleHide(options.timeout ?? DEFAULT_TIMEOUT)
  }

  onBeforeUnmount(() => {
    clearTimeout(timeoutId)
  })

  return {
    toast,
    hideToast,
    toastApi: {
      success(message, options) {
        showToast(message, 'success', options)
      },
      error(message, options) {
        showToast(message, 'error', options)
      }
    }
  }
}
