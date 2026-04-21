import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  createAdminMachine,
  deleteAdminMachine,
  getAdminMachines,
  updateAdminMachine
} from '@/services/adminMachineService'
import {
  ADMIN_MACHINE_CATEGORIES,
  buildMachineTitle,
  createEmptyMachineForm,
  formToMachinePayload,
  machineToForm,
  validateMachineForm
} from '@/services/adminMachineHelpers'

export function useAdminMachines() {
  const machines = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')
  const editingId = ref(null)
  const searchTerm = ref('')
  const selectedCategory = ref('abkant')
  const selectedStatus = ref('all')
  const sortKey = ref('title')
  const sortDirection = ref('asc')
  const itemsPerPage = ref(5)
  const currentPage = ref(1)
  const form = ref(createEmptyMachineForm(selectedCategory.value))
  const toast = ref({
    show: false,
    message: '',
    type: 'success'
  })
  const confirmDialog = ref({
    show: false,
    machineId: null
  })
  const formErrors = ref({})
  let toastTimeout = null

  const filteredMachines = computed(() => {
    const filtered = machines.value.filter((machine) => {
      const matchesCategory = machine.category === selectedCategory.value

      const matchesStatus =
        selectedStatus.value === 'all' ||
        (selectedStatus.value === 'published' && machine.isPublished) ||
        (selectedStatus.value === 'passive' && !machine.isPublished)

      const keyword = searchTerm.value.trim().toLowerCase()
      const matchesSearch =
        !keyword ||
        machine.title?.toLowerCase().includes(keyword) ||
        machine.brand?.toLowerCase().includes(keyword) ||
        machine.family?.toLowerCase().includes(keyword) ||
        machine.series?.toLowerCase().includes(keyword) ||
        machine.model?.toLowerCase().includes(keyword) ||
        machine.category?.toLowerCase().includes(keyword) ||
        machine.description?.toLowerCase().includes(keyword)

      return matchesCategory && matchesStatus && matchesSearch
    })

    return [...filtered].sort((a, b) => {
      const aValue = a[sortKey.value]
      const bValue = b[sortKey.value]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
      }

      const aText = String(aValue || '').toLowerCase()
      const bText = String(bValue || '').toLowerCase()

      if (aText < bText) return sortDirection.value === 'asc' ? -1 : 1
      if (aText > bText) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(filteredMachines.value.length / itemsPerPage.value)))

  const paginatedMachines = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredMachines.value.slice(start, start + itemsPerPage.value)
  })

  function showToast(message, type = 'success') {
    toast.value = {
      show: true,
      message,
      type
    }

    clearTimeout(toastTimeout)
    toastTimeout = setTimeout(() => {
      toast.value.show = false
    }, 2500)
  }

  async function fetchMachines() {
    loading.value = true
    error.value = ''

    try {
      const { data } = await getAdminMachines()
      machines.value = data
    } catch (requestError) {
      error.value = requestError.response?.data?.message || 'Makine listesi alınamadı'
    } finally {
      loading.value = false
    }
  }

  function startEdit(machine) {
    error.value = ''
    formErrors.value = {}
    selectedCategory.value = machine.category
    editingId.value = machine._id
    form.value = machineToForm(machine)
  }

  function resetForm(category = selectedCategory.value) {
    editingId.value = null
    error.value = ''
    formErrors.value = {}
    form.value = createEmptyMachineForm(category)
  }

  function setCategory(category) {
    selectedCategory.value = category
    resetForm(category)
  }

  function setCurrentPage(page) {
    currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
  }

  function setItemsPerPage(value) {
    itemsPerPage.value = Number(value) || 5
    currentPage.value = 1
  }

  function validateForm() {
    const errors = validateMachineForm(form.value)
    formErrors.value = errors
    return Object.keys(errors).length === 0
  }

  function clearFieldError(field) {
    if (!formErrors.value[field]) return

    const nextErrors = { ...formErrors.value }
    delete nextErrors[field]
    formErrors.value = nextErrors
  }

  function syncAutoTitle() {
    form.value = {
      ...form.value,
      title: buildMachineTitle(form.value)
    }
  }

  function handleFormUpdate(nextForm) {
    const watchedFieldsChanged =
      nextForm.family !== form.value.family ||
      nextForm.pressForceTon !== form.value.pressForceTon ||
      nextForm.bendingLengthMm !== form.value.bendingLengthMm ||
      nextForm.powerKw !== form.value.powerKw ||
      nextForm.workingAreaCode !== form.value.workingAreaCode

    form.value = nextForm

    if (watchedFieldsChanged) {
      syncAutoTitle()
    }
  }

  async function handleCreate() {
    error.value = ''
    formErrors.value = {}

    if (!validateForm()) {
      showToast('Lütfen form hatalarını düzeltin.', 'error')
      return
    }

    saving.value = true

    try {
      const payload = formToMachinePayload(form.value)

      if (editingId.value) {
        await updateAdminMachine(editingId.value, payload)
        showToast('Makine başarıyla güncellendi.', 'success')
      } else {
        await createAdminMachine(payload)
        showToast('Makine başarıyla eklendi.', 'success')
      }

      resetForm()
      await fetchMachines()
    } catch (requestError) {
      const message = requestError.response?.data?.message || (
        editingId.value ? 'Makine güncellenemedi' : 'Makine oluşturulamadı'
      )
      error.value = message
      showToast(message, 'error')
    } finally {
      saving.value = false
    }
  }

  function handleDelete(id) {
    confirmDialog.value = {
      show: true,
      machineId: id
    }
  }

  function closeDeleteDialog() {
    confirmDialog.value = {
      show: false,
      machineId: null
    }
  }

  async function confirmDelete() {
    const id = confirmDialog.value.machineId
    if (!id) return

    error.value = ''

    try {
      await deleteAdminMachine(id)

      if (editingId.value === id) {
        resetForm()
      }

      showToast('Makine silindi.', 'success')
      closeDeleteDialog()
      await fetchMachines()
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Makine silinemedi'
      error.value = message
      showToast(message, 'error')
      closeDeleteDialog()
    }
  }

  function setSort(key) {
    if (sortKey.value === key) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      return
    }

    sortKey.value = key
    sortDirection.value = 'asc'
  }

  async function togglePublish(machine) {
    error.value = ''

    try {
      const payload = formToMachinePayload(machine, {
        isPublished: !machine.isPublished
      })

      await updateAdminMachine(machine._id, payload)

      showToast(
        payload.isPublished ? 'Makine yayına alındı.' : 'Makine pasife alındı.',
        'success'
      )

      if (editingId.value === machine._id) {
        form.value.isPublished = payload.isPublished
      }

      await fetchMachines()
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Makine durumu güncellenemedi'
      error.value = message
      showToast(message, 'error')
    }
  }

  onMounted(fetchMachines)
  watch([selectedCategory, selectedStatus, searchTerm, itemsPerPage], () => {
    currentPage.value = 1
  })
  watch(totalPages, (value) => {
    if (currentPage.value > value) {
      currentPage.value = value
    }
  })
  onBeforeUnmount(() => {
    clearTimeout(toastTimeout)
  })

  return {
    allMachines: machines,
    categories: ADMIN_MACHINE_CATEGORIES,
    confirmDelete,
    confirmDialog,
    clearFieldError,
    closeDeleteDialog,
    editingId,
    error,
    filteredMachines,
    form,
    formErrors,
    handleCreate,
    handleDelete,
    handleFormUpdate,
    itemsPerPage,
    loading,
    paginatedMachines,
    resetForm,
    saving,
    setCurrentPage,
    searchTerm,
    setCategory,
    setItemsPerPage,
    currentPage,
    selectedCategory,
    selectedStatus,
    setSort,
    sortDirection,
    sortKey,
    startEdit,
    toast,
    totalPages,
    togglePublish
  }
}
