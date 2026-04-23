import { computed, ref } from 'vue'
import { deleteAdminUser, getAdminUsers, updateAdminUserRole } from '@/features/admin/services/adminUserService'
import { useAppToast } from '@/shared/composables/useAppToast'
import { ADMIN_USER_ROLE_LABELS } from '@/features/admin/services/adminUserMeta'

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
  const { toast, toastApi } = useAppToast()

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
      toastApi.success(`${data.email} kullanıcısının rolü ${ADMIN_USER_ROLE_LABELS[role]} olarak güncellendi.`)
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Rol güncellenemedi'
      error.value = message
      toastApi.error(message)
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
      toastApi.success('Kullanıcı silindi.')
      closeDeleteDialog()
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Kullanıcı silinemedi'
      error.value = message
      toastApi.error(message)
      closeDeleteDialog()
    } finally {
      savingId.value = null
    }
  }

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
