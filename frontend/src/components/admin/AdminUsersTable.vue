<template>
  <div class="users-table-wrapper">
    <table class="users-table">
      <thead>
        <tr>
          <th>KULLANICI</th>
          <th>ŞİRKET</th>
          <th>İLETİŞİM</th>
          <th>ROL</th>
          <th>İŞLEMLER</th>
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
              <component :is="roleIcons[user.role] || User" :size="14" />
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
                title="Genel"
                aria-label="Kullanıcıyı Genel rolüne geçir"
              >
                <User :size="16" />
                <span class="sr-only">Genel</span>
              </button>
              <button
                type="button"
                class="primary-btn"
                :disabled="savingId === user._id || user.role === 'dealer'"
                @click="$emit('set-role', user, 'dealer')"
                title="Bayi"
                aria-label="Kullanıcıyı Bayi rolüne geçir"
              >
                <Building2 :size="16" />
                <span class="sr-only">Bayi</span>
              </button>
              <button
                type="button"
                class="dark-btn"
                :disabled="savingId === user._id || user.role === 'admin'"
                @click="$emit('set-role', user, 'admin')"
                title="Admin"
                aria-label="Kullanıcıyı Admin rolüne geçir"
              >
                <ShieldCheck :size="16" />
                <span class="sr-only">Admin</span>
              </button>
              <button
                type="button"
                class="danger-btn"
                :disabled="savingId === user._id"
                @click="$emit('delete', user)"
                title="Kullanıcıyı sil"
                aria-label="Kullanıcıyı sil"
              >
                <Trash2 :size="16" />
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
import { Trash2, User } from 'lucide-vue-next'
import { ADMIN_USER_ROLE_ICONS, ADMIN_USER_ROLE_LABELS } from '@/services/adminUserMeta'

defineOptions({ name: 'AdminUsersTable' })

defineEmits(['set-role', 'delete'])

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

const roleLabels = ADMIN_USER_ROLE_LABELS
const roleIcons = ADMIN_USER_ROLE_ICONS
</script>

<style scoped>
.users-table-wrapper {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 860px;
  background: rgba(255, 255, 255, 0.72);
}

.users-table th,
.users-table td {
  padding: 16px 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.22);
  text-align: left;
  vertical-align: top;
}

.users-table th {
  color: #627d98;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.users-table td {
  font-size: 14px;
  color: #243b53;
}

.user-name {
  font-weight: 700;
  color: #102a43;
  font-size: 14px;
  line-height: 1.45;
}

.user-email,
.muted {
  color: #627d98;
  font-size: 14px;
  line-height: 1.45;
  margin-top: 4px;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 13px;
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
  background: #e8eef5;
  color: #102a43;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ghost-btn,
.primary-btn,
.dark-btn,
.danger-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  min-width: 4.2rem;
  min-height: 4rem;
  padding: 9px 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 0;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.ghost-btn {
  background: #f8fafc;
  border-color: rgba(16, 42, 67, 0.1);
  color: #102a43;
}

.primary-btn {
  background: #e8f1fb;
  border-color: rgba(0, 83, 156, 0.14);
  color: #00539c;
}

.dark-btn {
  background: #102a43;
  color: #fff;
}

.danger-btn {
  min-width: 4rem;
  background: #fff1f2;
  border-color: rgba(185, 28, 28, 0.12);
  color: #b91c1c;
}

.ghost-btn:hover:not(:disabled),
.primary-btn:hover:not(:disabled),
.dark-btn:hover:not(:disabled),
.danger-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  color: #627d98;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
