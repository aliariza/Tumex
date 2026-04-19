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

  async function submitForm(validateForm, submitHandler) {
    if (!validateForm()) {
      return
    }

    try {
      await submitHandler()
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
