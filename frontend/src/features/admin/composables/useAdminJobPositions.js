import { computed, onBeforeUnmount, ref, watch } from 'vue'
import {
  createAdminJobPosition,
  deleteAdminJobPosition,
  getAdminJobPositions,
  updateAdminJobPosition
} from '@/features/admin/services/adminJobPositionService'
import {
  createEmptyJobPositionForm,
  formToJobPositionPayload,
  jobPositionToForm,
  validateJobPositionForm
} from '@/features/admin/services/adminJobPositionHelpers'

export function useAdminJobPositions() {
  const positions = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')
  const editingId = ref(null)
  const searchTerm = ref('')
  const selectedStatus = ref('all')
  const form = ref(createEmptyJobPositionForm())
  const formErrors = ref({})
  const toast = ref({
    show: false,
    message: '',
    type: 'success'
  })
  const confirmDialog = ref({
    show: false,
    positionId: null,
    positionTitle: ''
  })
  let toastTimeout = null

  const filteredPositions = computed(() => {
    const keyword = searchTerm.value.trim().toLowerCase()

    return [...positions.value]
      .filter((position) => {
        const matchesStatus =
          selectedStatus.value === 'all' ||
          (selectedStatus.value === 'published' && position.isPublished) ||
          (selectedStatus.value === 'passive' && !position.isPublished)

        const matchesSearch =
          !keyword ||
          position.title?.toLowerCase().includes(keyword) ||
          position.department?.toLowerCase().includes(keyword) ||
          position.summary?.toLowerCase().includes(keyword)

        return matchesStatus && matchesSearch
      })
      .sort((a, b) => {
        if ((a.sortOrder || 0) !== (b.sortOrder || 0)) {
          return (a.sortOrder || 0) - (b.sortOrder || 0)
        }

        return String(a.title || '').localeCompare(String(b.title || ''), undefined, {
          sensitivity: 'base'
        })
      })
  })

  function showToast(message, type = 'success') {
    toast.value = { show: true, message, type }
    clearTimeout(toastTimeout)
    toastTimeout = setTimeout(() => {
      toast.value.show = false
    }, 2500)
  }

  async function fetchPositions() {
    loading.value = true
    error.value = ''

    try {
      const { data } = await getAdminJobPositions()
      positions.value = data
    } catch (requestError) {
      error.value = requestError.response?.data?.message || 'Pozisyon listesi alınamadı'
    } finally {
      loading.value = false
    }
  }

  function resetForm() {
    editingId.value = null
    form.value = createEmptyJobPositionForm()
    formErrors.value = {}
    error.value = ''
  }

  function startEdit(position) {
    editingId.value = position._id
    form.value = jobPositionToForm(position)
    formErrors.value = {}
    error.value = ''
  }

  function clearFieldError(field) {
    if (!formErrors.value[field]) return
    const nextErrors = { ...formErrors.value }
    delete nextErrors[field]
    formErrors.value = nextErrors
  }

  async function savePosition() {
    error.value = ''
    formErrors.value = validateJobPositionForm(form.value)

    if (Object.keys(formErrors.value).length > 0) {
      showToast('Lütfen form hatalarını düzeltin.', 'error')
      return
    }

    saving.value = true

    try {
      const payload = formToJobPositionPayload(form.value)

      if (editingId.value) {
        await updateAdminJobPosition(editingId.value, payload)
        showToast('Pozisyon başarıyla güncellendi.')
      } else {
        await createAdminJobPosition(payload)
        showToast('Pozisyon başarıyla eklendi.')
      }

      resetForm()
      await fetchPositions()
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Pozisyon kaydedilemedi'
      error.value = message
      showToast(message, 'error')
    } finally {
      saving.value = false
    }
  }

  function handleDelete(position) {
    confirmDialog.value = {
      show: true,
      positionId: position._id,
      positionTitle: position.title || ''
    }
  }

  function closeDeleteDialog() {
    confirmDialog.value = {
      show: false,
      positionId: null,
      positionTitle: ''
    }
  }

  async function confirmDelete() {
    const id = confirmDialog.value.positionId
    if (!id) return

    try {
      await deleteAdminJobPosition(id)
      showToast('Pozisyon silindi.')

      if (editingId.value === id) {
        resetForm()
      }

      await fetchPositions()
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Pozisyon silinemedi'
      error.value = message
      showToast(message, 'error')
    } finally {
      closeDeleteDialog()
    }
  }

  watch(selectedStatus, () => {
    error.value = ''
  })

  onBeforeUnmount(() => {
    clearTimeout(toastTimeout)
  })

  return {
    closeDeleteDialog,
    confirmDelete,
    confirmDialog,
    editingId,
    error,
    fetchPositions,
    filteredPositions,
    form,
    formErrors,
    handleDelete,
    loading,
    resetForm,
    savePosition,
    saving,
    searchTerm,
    selectedStatus,
    startEdit,
    toast,
    clearFieldError
  }
}
