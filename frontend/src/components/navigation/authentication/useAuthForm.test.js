import { nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useAuthForm } from './useAuthForm'

describe('useAuthForm', () => {
  it('resets the form when the visibility ref becomes true', async () => {
    const visibleRef = ref(false)
    const { form } = useAuthForm(
      () => ({
        email: '',
        errors: {}
      }),
      visibleRef
    )

    form.email = 'dealer@example.com'
    visibleRef.value = true
    await nextTick()

    expect(form.email).toBe('')
  })

  it('runs the error handler and resets the form when submit fails', async () => {
    const errorHandler = vi.fn()
    const { form, submitForm } = useAuthForm(() => ({
      email: '',
      errors: {}
    }))

    form.email = 'dealer@example.com'

    const result = await submitForm(
      () => true,
      async () => {
        throw new Error('request failed')
      },
      errorHandler
    )

    expect(result).toBe(false)
    expect(errorHandler).toHaveBeenCalledTimes(1)
    expect(form.email).toBe('')
  })
})
