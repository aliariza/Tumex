<template>
  <form class="machine-form" novalidate @submit.prevent="$emit('submit')">
    <div class="field-grid">
      <div class="field-group">
        <select :value="form.category" @change="updateField('category', $event.target.value)">
          <option value="abkant">Abkant</option>
          <option value="laser-cutting">Lazer Kesim</option>
          <option value="laser-welding">Lazer Kaynak</option>
        </select>
        <p v-if="errors.category" class="field-error">{{ errors.category }}</p>
      </div>

      <div class="field-group">
        <input :value="form.brand" @input="updateField('brand', $event.target.value)" type="text" placeholder="Marka" />
        <p v-if="errors.brand" class="field-error">{{ errors.brand }}</p>
      </div>

      <div class="field-group">
        <input :value="form.family" @input="updateField('family', $event.target.value)" type="text" placeholder="Aile / Family (örn: WC67K)" />
        <p v-if="errors.family" class="field-error">{{ errors.family }}</p>
      </div>

      <div class="field-group">
        <input :value="form.series" @input="updateField('series', $event.target.value)" type="text" placeholder="Seri" />
        <p v-if="errors.series" class="field-error">{{ errors.series }}</p>
      </div>

      <div class="field-group">
        <input :value="form.model" @input="updateField('model', $event.target.value)" type="text" placeholder="Model" />
        <p v-if="errors.model" class="field-error">{{ errors.model }}</p>
      </div>

      <div class="field-group">
        <input :value="form.title" type="text" placeholder="Başlık" readonly />
        <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
      </div>

      <div class="field-group">
        <input
          :value="form.pressForceTon ?? ''"
          @input="updateField('pressForceTon', $event.target.value === '' ? null : Number($event.target.value))"
          type="number"
          min="0"
          placeholder="Tonaj"
        />
        <p v-if="errors.pressForceTon" class="field-error">{{ errors.pressForceTon }}</p>
      </div>

      <div class="field-group">
        <input
          :value="form.bendingLengthMm ?? ''"
          @input="updateField('bendingLengthMm', $event.target.value === '' ? null : Number($event.target.value))"
          type="number"
          min="0"
          placeholder="Bükme Uzunluğu (mm)"
        />
        <p v-if="errors.bendingLengthMm" class="field-error">{{ errors.bendingLengthMm }}</p>
      </div>

      <div class="field-group">
        <input
          :value="form.price"
          @input="updateField('price', $event.target.value === '' ? 0 : Number($event.target.value))"
          type="number"
          min="0"
          placeholder="Fiyat"
        />
        <p v-if="errors.price" class="field-error">{{ errors.price }}</p>
      </div>

      <div class="field-group">
        <input :value="form.description" @input="updateField('description', $event.target.value)" type="text" placeholder="Açıklama" />
      </div>

      <div class="field-group full-width">
        <input :value="form.image" @input="updateField('image', $event.target.value)" type="text" placeholder="Görsel URL" />
        <p v-if="errors.image" class="field-error">{{ errors.image }}</p>
      </div>
    </div>

    <div v-if="form.image" class="image-preview">
      <img :src="form.image" alt="Önizleme" class="preview-image" />
    </div>

    <section class="specs-section">
      <div class="specs-header">
        <h3>Özellikler</h3>
        <button class="secondary-btn" type="button" @click="addSpecRow">
          Özellik Ekle
        </button>
      </div>

      <div v-if="!form.specs || !form.specs.length" class="empty-specs">
        Henüz özellik eklenmedi.
      </div>

      <div
        v-for="(spec, index) in form.specs"
        :key="`spec-${index}`"
        class="spec-row-wrapper"
      >
        <div class="spec-row">
          <div class="field-group">
            <input
              :value="spec.label"
              @input="updateSpecField(index, 'label', $event.target.value)"
              type="text"
              placeholder="Etiket / Label"
            />
            <p v-if="errors[`specs.${index}.label`]" class="field-error">
              {{ errors[`specs.${index}.label`] }}
            </p>
          </div>

          <div class="field-group">
            <input
              :value="spec.key"
              @input="updateSpecField(index, 'key', $event.target.value)"
              type="text"
              placeholder="Key (örn: control_axis)"
            />
            <p v-if="errors[`specs.${index}.key`]" class="field-error">
              {{ errors[`specs.${index}.key`] }}
            </p>
          </div>

          <div class="field-group">
            <input
              :value="spec.value"
              @input="updateSpecField(index, 'value', $event.target.value)"
              type="text"
              placeholder="Değer / Value"
            />
          </div>

          <button class="danger-btn" type="button" @click="removeSpecRow(index)">
            Sil
          </button>
        </div>
      </div>
    </section>

    <div class="form-actions">
      <button class="primary-btn" type="submit" :disabled="saving">
        {{ saving ? 'Kaydediliyor...' : (editingId ? 'Güncelle' : 'Makine Ekle') }}
      </button>
      <button v-if="editingId" class="secondary-btn" type="button" @click="$emit('cancel')" :disabled="saving">
        İptal
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'AdminMachineForm',
  props: {
    form: {
      type: Object,
      required: true
    },
    editingId: {
      type: [String, null],
      default: null
    },
    saving: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:form', 'submit', 'cancel', 'clear-error'],
  methods: {
    updateField(field, value) {
      this.$emit('clear-error', field)
      this.$emit('update:form', {
        ...this.form,
        [field]: value
      })
    },
    updateSpecField(index, field, value) {
      const nextSpecs = Array.isArray(this.form.specs) ? [...this.form.specs] : []
      const current = nextSpecs[index] || { key: '', label: '', value: '', order: index + 1 }

      nextSpecs[index] = {
        ...current,
        [field]: value,
        order: index + 1
      }

      this.$emit('clear-error', `specs.${index}.${field}`)
      this.$emit('update:form', {
        ...this.form,
        specs: nextSpecs
      })
    },
    addSpecRow() {
      const nextSpecs = Array.isArray(this.form.specs) ? [...this.form.specs] : []
      nextSpecs.push({
        key: '',
        label: '',
        value: '',
        order: nextSpecs.length + 1
      })

      this.$emit('update:form', {
        ...this.form,
        specs: nextSpecs
      })
    },
    removeSpecRow(index) {
      const nextSpecs = (Array.isArray(this.form.specs) ? [...this.form.specs] : [])
        .filter((_, i) => i !== index)
        .map((spec, i) => ({
          ...spec,
          order: i + 1
        }))

      this.$emit('update:form', {
        ...this.form,
        specs: nextSpecs
      })
    }
  }
}
</script>

<style scoped>
.machine-form {
  display: grid;
  gap: 16px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.full-width {
  grid-column: 1 / -1;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input,
select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d8dbe2;
  border-radius: 0;
  font-size: 14px;
  background: #fff;
  box-sizing: border-box;
}

.field-error {
  margin: 0;
  font-size: 12px;
  color: #b91c1c;
}

.image-preview {
  border: 1px solid #d8dbe2;
  border-radius: 0;
  padding: 12px;
  background: #fff;
}

.preview-image {
  display: block;
  max-width: 180px;
  max-height: 180px;
  object-fit: contain;
}

.specs-section {
  border: 1px solid #d8dbe2;
  border-radius: 0;
  padding: 16px;
  display: grid;
  gap: 12px;
}

.specs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.specs-header h3 {
  margin: 0;
  font-size: 18px;
}

.empty-specs {
  color: #6b7280;
  font-size: 14px;
}

.spec-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1.2fr auto;
  gap: 10px;
  align-items: center;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.primary-btn,
.secondary-btn,
.danger-btn {
  border: none;
  border-radius: 0;
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
}

.primary-btn {
  background: #111827;
  color: white;
}

.secondary-btn {
  background: #e5e7eb;
  color: #111827;
}

.danger-btn {
  background: #fee2e2;
  color: #991b1b;
}

.primary-btn:disabled,
.secondary-btn:disabled,
.danger-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.spec-row-wrapper {
  display: grid;
  gap: 6px;
}
@media (max-width: 900px) {
  .spec-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
</style>