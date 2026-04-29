<template>
  <section class="admin-page admin-job-positions-page">
    <div class="admin-page__glow admin-page__glow--left" aria-hidden="true"></div>
    <div class="admin-page__glow admin-page__glow--right" aria-hidden="true"></div>

    <Teleport to="body">
      <AppToast :show="toast.show" :message="toast.message" :type="toast.type" />
      <ConfirmDialog
        :show="confirmDialog.show"
        title="Pozisyonu Sil"
        :message="`${confirmDialog.positionTitle || 'Bu pozisyonu'} silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`"
        @confirm="confirmDelete"
        @cancel="closeDeleteDialog"
      />
    </Teleport>

    <header class="page-header card card--hero">
      <div class="page-header__copy">
        <p class="page-header__eyebrow">YÖNETİM PANELİ • POZİSYON YÖNETİMİ</p>
        <h1>Pozisyon Yönetimi</h1>
        <p>Kariyer sayfasında görünen açık pozisyonları buradan ekleyebilir, düzenleyebilir, yayına alabilir veya silebilirsiniz.</p>
      </div>

      <div class="page-header__meta">
        <div v-if="editingId" class="editing-badge">Düzenleme Modu</div>
        <div class="page-header__summary">
          <span class="page-header__summary-label">Toplam sonuç</span>
          <strong>{{ filteredPositions.length }}</strong>
        </div>
      </div>
    </header>

    <AdminPanelNav />

    <section class="card">
      <div class="section-header section-header--stacked">
        <div>
          <h2 class="section-title">{{ editingId ? 'Pozisyonu Düzenle' : 'Yeni Pozisyon Ekle' }}</h2>
          <p class="section-description">
            Kartta gösterilecek başlık, departman, kısa açıklama ve madde listesini bu formdan yönetin.
          </p>
        </div>
      </div>

      <form class="job-form" @submit.prevent="savePosition">
        <label class="field">
          <span>Pozisyon Başlığı</span>
          <input v-model="form.title" type="text" @input="clearFieldError('title')" />
          <small v-if="formErrors.title" class="field-error">{{ formErrors.title }}</small>
        </label>

        <label class="field">
          <span>Departman</span>
          <input v-model="form.department" type="text" @input="clearFieldError('department')" />
          <small v-if="formErrors.department" class="field-error">{{ formErrors.department }}</small>
        </label>

        <label class="field">
          <span>Çalışma Şekli</span>
          <input v-model="form.locationType" type="text" />
        </label>

        <label class="field">
          <span>İstihdam Tipi</span>
          <input v-model="form.employmentType" type="text" />
        </label>

        <label class="field field--full">
          <span>Kısa Açıklama</span>
          <textarea v-model="form.summary" rows="4" @input="clearFieldError('summary')"></textarea>
          <small v-if="formErrors.summary" class="field-error">{{ formErrors.summary }}</small>
        </label>

        <label class="field field--full">
          <span>Madde Listesi</span>
          <textarea
            v-model="form.highlightsText"
            rows="5"
            placeholder="Her satıra bir madde yazın"
          ></textarea>
        </label>

        <label class="field">
          <span>Başvuru E-postası</span>
          <input v-model="form.applicationEmail" type="email" @input="clearFieldError('applicationEmail')" />
          <small v-if="formErrors.applicationEmail" class="field-error">{{ formErrors.applicationEmail }}</small>
        </label>

        <label class="field">
          <span>Başvuru Konusu</span>
          <input v-model="form.applicationSubject" type="text" />
        </label>

        <label class="field">
          <span>Sıralama</span>
          <input v-model.number="form.sortOrder" type="number" />
        </label>

        <label class="field field--checkbox">
          <input v-model="form.isPublished" type="checkbox" />
          <span>Yayında göster</span>
        </label>

        <div class="form-actions">
          <button class="action-button action-button--primary" type="submit" :disabled="saving">
            {{ saving ? 'Kaydediliyor...' : editingId ? 'Pozisyonu Güncelle' : 'Pozisyon Ekle' }}
          </button>
          <button class="action-button" type="button" @click="resetForm">Temizle</button>
        </div>
      </form>
    </section>

    <section class="card">
      <div class="section-header">
        <div>
          <h2 class="section-title">Pozisyon Listesi</h2>
          <p class="section-description">Mevcut kariyer kartlarını filtreleyin, düzenleyin veya kaldırın.</p>
        </div>
        <span class="count-badge">{{ filteredPositions.length }}</span>
      </div>

      <div class="toolbar">
        <input v-model="searchTerm" class="search-input" type="text" placeholder="Pozisyon ara..." />
        <AppSelect v-model="selectedStatus" class="filter-select" :options="statusOptions" />
      </div>

      <p v-if="loading" class="info-text">Yükleniyor...</p>
      <p v-if="error" class="error">{{ error }}</p>

      <div v-if="!loading" class="positions-list">
        <article v-for="position in filteredPositions" :key="position._id" class="position-card">
          <div class="position-card__top">
            <div>
              <p class="position-card__eyebrow">{{ position.department }}</p>
              <h3>{{ position.title }}</h3>
            </div>
            <span :class="['status-pill', position.isPublished ? 'is-published' : 'is-passive']">
              {{ position.isPublished ? 'Yayında' : 'Pasif' }}
            </span>
          </div>

          <div class="position-card__meta">
            <span>{{ position.locationType }}</span>
            <span>{{ position.employmentType }}</span>
            <span>Sıra {{ position.sortOrder || 0 }}</span>
          </div>

          <p class="position-card__summary">{{ position.summary }}</p>

          <ul v-if="position.highlights?.length" class="position-card__highlights">
            <li v-for="item in position.highlights" :key="item">{{ item }}</li>
          </ul>

          <div class="position-card__actions">
            <button class="action-button action-button--primary" type="button" @click="startEdit(position)">
              Düzenle
            </button>
            <button class="action-button action-button--danger" type="button" @click="handleDelete(position)">
              Sil
            </button>
          </div>
        </article>

        <p v-if="!filteredPositions.length" class="empty-state">Henüz pozisyon bulunmuyor.</p>
      </div>
    </section>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminPanelNav from '../components/AdminPanelNav.vue'
import AppToast from '@/shared/components/ui/AppToast.vue'
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog.vue'
import AppSelect from '@/shared/components/ui/AppSelect.vue'
import { useAdminJobPositions } from '../composables/useAdminJobPositions'

defineOptions({ name: 'AdminJobPositionsView' })

const {
  clearFieldError,
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
  toast
} = useAdminJobPositions()

const statusOptions = [
  { value: 'all', label: 'Tüm Durumlar' },
  { value: 'published', label: 'Yayında' },
  { value: 'passive', label: 'Pasif' }
]

onMounted(() => {
  fetchPositions()
})
</script>

<style scoped lang="scss">
@use '@/shared/styles/admin-page-shell.scss' as *;

.page-header__meta {
  display: grid;
  gap: 1rem;
  justify-items: end;
}

.editing-badge {
  background: #fff4d6;
  color: #92400e;
  border: 1px solid rgba(180, 83, 9, 0.12);
  padding: 0.8rem 1.2rem;
  font-size: 1.3rem;
  font-weight: 700;
  white-space: nowrap;
}

.job-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.6rem;
}

.field {
  display: grid;
  gap: 0.8rem;

  span {
    font-size: 1.35rem;
    font-weight: 700;
    color: #102a43;
  }

  input,
  textarea {
    width: 100%;
    border: 1px solid rgba(125, 166, 216, 0.7);
    background: #fff;
    color: #102a43;
    font-size: 1.5rem;
    padding: 1.2rem 1.4rem;
    resize: vertical;
  }
}

.field--full {
  grid-column: 1 / -1;
}

.field--checkbox {
  align-self: end;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 1rem;

  input {
    width: 1.8rem;
    height: 1.8rem;
  }
}

.field-error {
  color: #b42318;
  font-size: 1.25rem;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-button {
  border: 1px solid rgba(16, 42, 67, 0.14);
  background: #fff;
  color: #102a43;
  font-size: 1.4rem;
  font-weight: 700;
  padding: 1.1rem 1.6rem;
  cursor: pointer;
}

.action-button--primary {
  background: #00539c;
  border-color: #00539c;
  color: #fff;
}

.action-button--danger {
  border-color: rgba(180, 35, 24, 0.16);
  color: #b42318;
}

.positions-list {
  display: grid;
  gap: 1.6rem;
}

.position-card {
  border: 1px solid rgba(125, 166, 216, 0.24);
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  display: grid;
  gap: 1.2rem;
}

.position-card__top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;

  h3 {
    font-size: 2.2rem;
    line-height: 1.2;
    color: #102a43;
  }
}

.position-card__eyebrow {
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #2f79bb;
  margin-bottom: 0.6rem;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.2rem;
  padding: 0.4rem 1rem;
  font-size: 1.2rem;
  font-weight: 800;
}

.status-pill.is-published {
  background: rgba(5, 150, 105, 0.12);
  color: #047857;
}

.status-pill.is-passive {
  background: rgba(148, 163, 184, 0.16);
  color: #475569;
}

.position-card__meta {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;

  span {
    padding: 0.6rem 0.9rem;
    background: #eef5fa;
    color: #33506b;
    font-size: 1.25rem;
    font-weight: 700;
  }
}

.position-card__summary {
  font-size: 1.5rem;
  line-height: 1.7;
  color: #486581;
}

.position-card__highlights {
  display: grid;
  gap: 0.6rem;
  padding-left: 1.8rem;
  color: #102a43;
  font-size: 1.45rem;
  line-height: 1.6;
}

.position-card__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.empty-state {
  font-size: 1.5rem;
  color: #486581;
}

@media (max-width: 760px) {
  .job-form {
    grid-template-columns: 1fr;
  }

  .page-header__meta {
    justify-items: start;
  }

  .position-card__top {
    flex-direction: column;
  }
}
</style>
