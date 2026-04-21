<template>
  <div class="users-table-wrapper">
    <table class="users-table">
      <thead>
        <tr>
          <th>Kullanıcı</th>
          <th>Şirket</th>
          <th>İletişim</th>
          <th>Rol</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>
            <div class="user-name">{{ user.username }}</div>
            <div class="user-email">{{ user.email }}</div>
          </td>
          <td>{{ user.companyname || '-' }}</td>
          <td>
            <div>{{ user.telephone || '-' }}</div>
            <div class="muted">{{ user.address || '-' }}</div>
          </td>
          <td>
            <span class="role-badge" :class="`role-${user.role}`">
              {{ roleLabels[user.role] || user.role }}
            </span>
          </td>
          <td>
            <div class="actions">
              <button
                type="button"
                class="ghost-btn"
                :disabled="savingId === user._id || user.role === 'user'"
                @click="$emit('set-role', user, 'user')"
              >
                Public
              </button>
              <button
                type="button"
                class="primary-btn"
                :disabled="savingId === user._id || user.role === 'dealer'"
                @click="$emit('set-role', user, 'dealer')"
              >
                Bayi
              </button>
              <button
                type="button"
                class="dark-btn"
                :disabled="savingId === user._id || user.role === 'admin'"
                @click="$emit('set-role', user, 'admin')"
              >
                Admin
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="!users.length">
          <td colspan="5" class="empty-state">Gösterilecek kullanıcı yok.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineOptions({ name: 'AdminUsersTable' })

defineEmits(['set-role'])

defineProps({
  users: {
    type: Array,
    required: true
  },
  savingId: {
    type: String,
    default: null
  }
})

const roleLabels = {
  user: 'Public',
  dealer: 'Bayi',
  admin: 'Admin'
}
</script>

<style scoped>
.users-table-wrapper {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 860px;
}

.users-table th,
.users-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  vertical-align: top;
}

.users-table th {
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.user-name {
  font-weight: 600;
  color: #111827;
}

.user-email,
.muted {
  color: #6b7280;
  font-size: 13px;
  margin-top: 4px;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.role-user {
  background: #fef3c7;
  color: #92400e;
}

.role-dealer {
  background: #dbeafe;
  color: #1d4ed8;
}

.role-admin {
  background: #e5e7eb;
  color: #111827;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ghost-btn,
.primary-btn,
.dark-btn {
  border: none;
  padding: 9px 12px;
  font-size: 13px;
  cursor: pointer;
  border-radius: 0;
}

.ghost-btn {
  background: #f3f4f6;
  color: #111827;
}

.primary-btn {
  background: #dbeafe;
  color: #1d4ed8;
}

.dark-btn {
  background: #111827;
  color: #fff;
}

button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  color: #6b7280;
}
</style>
