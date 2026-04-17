<template>
  <form class="machine-form" novalidate @submit.prevent="$emit('submit')">
    <div class="field-grid">
      <div class="field-group">
        <input :value="form.name" @input="updateField('name', $event.target.value)" type="text" placeholder="Makine adı"  />
        <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
      </div>

      <div class="field-group">
        <input :value="form.brand" @input="updateField('brand', $event.target.value)" type="text" placeholder="Marka"  />
        <p v-if="errors.brand" class="field-error">{{ errors.brand }}</p>
      </div>

      <div class="field-group">
        <select :value="form.category" @change="updateField('category', $event.target.value)" >
          <option value="abkant">Abkant</option>
          <option value="laser-cutting">Lazer Kesim</option>
          <option value="laser-welding">Lazer Kaynak</option>
        </select>
        <p v-if="errors.category" class="field-error">{{ errors.category }}</p>
      </div>

      <div class="field-group">
        <input :value="form.model" @input="updateField('model', $event.target.value)" type="text" placeholder="Model"  />
        <p v-if="errors.model" class="field-error">{{ errors.model }}</p>
      </div>

      <div class="field-group">
        <input :value="form.description" @input="updateField('description', $event.target.value)" type="text" placeholder="Açıklama" />
      </div>

      <div class="field-group">
        <input :value="form.price" @input="updateField('price', $event.target.value === '' ? 0 : Number($event.target.value))" type="number" min="0" placeholder="Fiyat" />
        <p v-if="errors.price" class="field-error">{{ errors.price }}</p>
      </div>

      <div class="field-group full-width">
        <input :value="form.image" @input="updateField('image', $event.target.value)" type="text" placeholder="Görsel URL" />
        <p v-if="errors.image" class="field-error">{{ errors.image }}</p>
      </div>
    </div>
    <div v-if="form.image" class="image-preview">
      <img
        :src="form.image"
        alt="Önizleme"
        class="preview-image"
      />
    </div>

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
  emits: ['update:form', 'submit', 'cancel'],
  methods: {
    updateField(field, value) {
      this.$emit('update:form', {
        ...this.form,
        [field]: value
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

input,
select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d8dbe2;
  border-radius: 0px;
  font-size: 14px;
  background: #fff;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.primary-btn,
.secondary-btn {
  border: none;
  border-radius: 0px;
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
}

.primary-btn {
  background: #111827;
  color: white;
}

.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.secondary-btn {
  background: #e5e7eb;
  color: #111827;
}

.image-preview {
  grid-column: 1 / -1;
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
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-error {
  margin: 0;
  font-size: 12px;
  color: #b91c1c;
}

@media (max-width: 700px) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
</style>