import { computed, onBeforeUnmount, ref } from 'vue'
import { deleteAdminUser, getAdminUsers, updateAdminUserRole } from '@/services/adminUserService'

const ROLE_LABELS = {
  user: 'Genel',
  dealer: 'Bayi',
  admin: 'Admin'
}

export function useAdminUsers() {
  const users = ref([])
  const loading = ref(false)
  const error = ref('')
  const savingId = ref(null)
  const searchTerm = ref('')
  const selectedRole = ref('all')
  const confirmDialog = ref({
    show: false,
    userId: null,
    userEmail: ''
  })
  const toast = ref({
    show: false,
    message: '',
    type: 'success'
  })
  let toastTimeout = null

  const filteredUsers = computed(() => {
    const keyword = searchTerm.value.trim().toLowerCase()

    return users.value.filter((user) => {
      const matchesRole =
        selectedRole.value === 'all' || user.role === selectedRole.value

      const matchesKeyword =
        !keyword ||
        user.username?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        user.companyname?.toLowerCase().includes(keyword) ||
        user.telephone?.toLowerCase().includes(keyword)

      return matchesRole && matchesKeyword
    })
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

  async function fetchUsers() {
    loading.value = true
    error.value = ''

    try {
      const { data } = await getAdminUsers()
      users.value = data
    } catch (requestError) {
      error.value = requestError.response?.data?.message || 'Kullanıcı listesi alınamadı'
    } finally {
      loading.value = false
    }
  }

  async function setUserRole(user, role) {
    savingId.value = user._id
    error.value = ''

    try {
      const { data } = await updateAdminUserRole(user._id, role)
      users.value = users.value.map((currentUser) =>
        currentUser._id === data._id ? data : currentUser
      )
      showToast(`${data.email} kullanıcısının rolü ${ROLE_LABELS[role]} olarak güncellendi.`)
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Rol güncellenemedi'
      error.value = message
      showToast(message, 'error')
    } finally {
      savingId.value = null
    }
  }

  function handleDelete(user) {
    confirmDialog.value = {
      show: true,
      userId: user._id,
      userEmail: user.email || ''
    }
  }

  function closeDeleteDialog() {
    confirmDialog.value = {
      show: false,
      userId: null,
      userEmail: ''
    }
  }

  async function confirmDelete() {
    const id = confirmDialog.value.userId
    if (!id) return

    savingId.value = id
    error.value = ''

    try {
      await deleteAdminUser(id)
      users.value = users.value.filter((user) => user._id !== id)
      showToast('Kullanıcı silindi.')
      closeDeleteDialog()
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Kullanıcı silinemedi'
      error.value = message
      showToast(message, 'error')
      closeDeleteDialog()
    } finally {
      savingId.value = null
    }
  }

  onBeforeUnmount(() => {
    clearTimeout(toastTimeout)
  })

  return {
    closeDeleteDialog,
    confirmDelete,
    confirmDialog,
    error,
    fetchUsers,
    filteredUsers,
    handleDelete,
    loading,
    savingId,
    searchTerm,
    selectedRole,
    setUserRole,
    toast
  }
}
