import { reactive, watch } from 'vue'

export function useAuthForm(createInitialState, visibleRef) {
  const form = reactive(createInitialState())

  function resetForm() {
    Object.assign(form, createInitialState())
  }

  if (visibleRef) {
    watch(
      visibleRef,
      (isVisible) => {
        if (isVisible) {
          resetForm()
        }
      },
      { immediate: true }
    )
  }

  async function submitForm(validateForm, submitHandler, errorHandler) {
    if (!validateForm()) {
      return false
    }

    try {
      await submitHandler()
      return true
    } catch (error) {
      if (errorHandler) {
        await errorHandler(error)
      }

      return false
    } finally {
      resetForm()
    }
  }

  return {
    form,
    resetForm,
    submitForm
  }
}
