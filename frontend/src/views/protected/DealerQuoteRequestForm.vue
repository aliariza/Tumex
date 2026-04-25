<template>
  <section class="dealer-request">
    <AppToast :show="toast.show" :message="toast.message" :type="toast.type" />

    <div class="dealer-request__intro">
      <div>
        <p class="dealer-request__eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>

      <div class="dealer-request__summary">
        <span>Hızlı Akış</span>
        <strong>Tek form, doğrudan Tumex ekibine iletim</strong>
      </div>
    </div>

    <form class="dealer-request__form" @submit.prevent="handleSubmit">
      <label class="dealer-request__field">
        <span>Ürün grubu</span>
        <input :value="productGroupLabel" type="text" readonly />
      </label>

      <label class="dealer-request__field">
        <span>Seri veya model</span>
        <input
          v-model.trim="form.machineSeries"
          type="text"
          :placeholder="seriesPlaceholder"
        />
      </label>

      <label class="dealer-request__field">
        <span>Müşteri adı</span>
        <input
          v-model.trim="form.customerName"
          type="text"
          placeholder="İlgili kişi adı"
          @input="clearError('customerName')"
        />
        <small v-if="errors.customerName" class="dealer-request__error">{{ errors.customerName }}</small>
      </label>

      <label class="dealer-request__field">
        <span>Firma adı</span>
        <input
          v-model.trim="form.customerCompany"
          type="text"
          placeholder="Müşteri firma adı"
          @input="clearError('customerCompany')"
        />
        <small v-if="errors.customerCompany" class="dealer-request__error">{{ errors.customerCompany }}</small>
      </label>

      <label class="dealer-request__field">
        <span>E-posta</span>
        <input
          v-model.trim="form.contactEmail"
          type="email"
          placeholder="musteri@firma.com"
          @input="clearError('contactEmail')"
        />
        <small v-if="errors.contactEmail" class="dealer-request__error">{{ errors.contactEmail }}</small>
      </label>

      <label class="dealer-request__field">
        <span>Telefon</span>
        <input
          v-model.trim="form.contactPhone"
          type="text"
          placeholder="+90 ..."
        />
      </label>

      <label class="dealer-request__field">
        <span>Zaman planı</span>
        <select v-model="form.timeline">
          <option value="">Belirtilmedi</option>
          <option value="Acil">Acil</option>
          <option value="2 hafta">2 hafta</option>
          <option value="1 ay">1 ay</option>
          <option value="3 ay">3 ay</option>
          <option value="Planlama aşaması">Planlama aşaması</option>
        </select>
      </label>

      <label class="dealer-request__field dealer-request__field--full">
        <span>İhtiyaç özeti</span>
        <textarea
          v-model.trim="form.requirementSummary"
          rows="5"
          placeholder="Tonaj, güç, ebat, malzeme, müşteri notları veya öncelikler..."
          @input="clearError('requirementSummary')"
        ></textarea>
        <small v-if="errors.requirementSummary" class="dealer-request__error">{{ errors.requirementSummary }}</small>
      </label>

      <div class="dealer-request__actions">
        <button class="dealer-request__button" type="submit" :disabled="submitting">
          {{ submitting ? 'Gönderiliyor...' : buttonLabel }}
        </button>
        <p>Talep, giriş yaptığınız bayi hesabı bilgileriyle birlikte Tumex ekibine iletilir.</p>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'
import AppToast from '@/shared/components/ui/AppToast.vue'
import { useAppToast } from '@/shared/composables/useAppToast'
import { createDealerQuoteRequest } from './dealerQuoteRequestService'

defineOptions({ name: 'DealerQuoteRequestForm' })

const props = defineProps({
  eyebrow: {
    type: String,
    default: 'Teklif Formu'
  },
  title: {
    type: String,
    default: 'Bayi teklif talebi oluşturun'
  },
  description: {
    type: String,
    default: 'Müşteri ihtiyacını birkaç alanla özetleyin, Tumex ekibi talebi doğrudan bayi hesabınızla eşleştirsin.'
  },
  productGroup: {
    type: String,
    required: true
  },
  productGroupLabel: {
    type: String,
    default: ''
  },
  seriesPlaceholder: {
    type: String,
    default: 'Örn. PSH, D-DLC veya özel model'
  },
  buttonLabel: {
    type: String,
    default: 'Talebi Gönder'
  }
})

const form = reactive({
  machineSeries: '',
  customerName: '',
  customerCompany: '',
  contactEmail: '',
  contactPhone: '',
  timeline: '',
  requirementSummary: ''
})

const state = reactive({ submitting: false })

const errors = reactive({
  customerName: '',
  customerCompany: '',
  contactEmail: '',
  requirementSummary: ''
})

const { toast, toastApi } = useAppToast()
const submitting = computed(() => state.submitting)
const productGroupLabel = computed(() => props.productGroupLabel || props.productGroup)

function clearError(field) {
  errors[field] = ''
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim().toLowerCase())
}

function validateForm() {
  errors.customerName = form.customerName ? '' : 'Müşteri adı gerekli'
  errors.customerCompany = form.customerCompany ? '' : 'Firma adı gerekli'
  errors.contactEmail = !form.contactEmail
    ? 'E-posta gerekli'
    : validateEmail(form.contactEmail)
      ? ''
      : 'Geçerli bir e-posta girin'
  errors.requirementSummary = form.requirementSummary ? '' : 'İhtiyaç özeti gerekli'

  return !Object.values(errors).some(Boolean)
}

function resetForm() {
  form.machineSeries = ''
  form.customerName = ''
  form.customerCompany = ''
  form.contactEmail = ''
  form.contactPhone = ''
  form.timeline = ''
  form.requirementSummary = ''
}

async function handleSubmit() {
  if (!validateForm()) {
    toastApi.error('Lütfen formdaki zorunlu alanları tamamlayın.')
    return
  }

  state.submitting = true

  try {
    const { data } = await createDealerQuoteRequest({
      productGroup: props.productGroup,
      machineSeries: form.machineSeries,
      customerName: form.customerName,
      customerCompany: form.customerCompany,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      timeline: form.timeline,
      requirementSummary: form.requirementSummary
    })

    toastApi.success(data.message || 'Talep başarıyla gönderildi.')
    resetForm()
  } catch (error) {
    toastApi.error(error.response?.data?.message || 'Talep gönderilemedi')
  } finally {
    state.submitting = false
  }
}
</script>

<style scoped lang="scss">
.dealer-request {
  display: grid;
  gap: 1.8rem;
  padding: 2rem;
  background: linear-gradient(180deg, rgba(248, 251, 255, 0.98), rgba(238, 245, 250, 0.92));
  border: 1px solid rgba(16, 42, 67, 0.1);
}

.dealer-request__intro {
  display: grid;
  gap: 1.4rem;
  grid-template-columns: minmax(0, 2fr) minmax(220px, 1fr);

  h2 {
    margin: 0 0 0.8rem;
    color: #102a43;
    font-size: 2.4rem;
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: #486581;
    font-size: 1.5rem;
    line-height: 1.65;
  }
}

.dealer-request__eyebrow {
  margin-bottom: 0.8rem;
  color: #00539c;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.dealer-request__summary {
  display: grid;
  align-content: start;
  gap: 0.5rem;
  padding: 1.6rem;
  background: #102a43;

  span {
    color: rgba(255, 255, 255, 0.74);
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  strong {
    color: #fff;
    font-size: 1.8rem;
    line-height: 1.45;
  }
}

.dealer-request__form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.2rem 1.4rem;
}

.dealer-request__field {
  display: grid;
  gap: 0.55rem;

  span {
    color: #102a43;
    font-size: 1.35rem;
    font-weight: 700;
  }

  input,
  select,
  textarea {
    width: 100%;
    min-height: 4.6rem;
    padding: 1.1rem 1.2rem;
    border: 1px solid rgba(16, 42, 67, 0.14);
    background: #fff;
    color: #102a43;
    font-size: 1.45rem;
    font-family: inherit;
  }

  textarea {
    min-height: 13rem;
    resize: vertical;
  }

  input[readonly] {
    background: rgba(16, 42, 67, 0.05);
    color: #486581;
  }
}

.dealer-request__field--full,
.dealer-request__actions {
  grid-column: 1 / -1;
}

.dealer-request__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  p {
    margin: 0;
    color: #486581;
    font-size: 1.35rem;
    line-height: 1.6;
  }
}

.dealer-request__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 4.6rem;
  padding: 1rem 1.8rem;
  border: 1px solid #00539c;
  background: #00539c;
  color: #fff;
  font-size: 1.45rem;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
}

.dealer-request__error {
  color: #b42318;
  font-size: 1.25rem;
}

@media (max-width: 820px) {
  .dealer-request__intro,
  .dealer-request__form {
    grid-template-columns: 1fr;
  }
}
</style>
