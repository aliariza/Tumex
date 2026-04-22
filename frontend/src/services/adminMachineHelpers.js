export const ADMIN_MACHINE_CATEGORIES = [
  { value: 'abkant', label: 'Abkant', metricLabel: 'Tonaj', secondaryMetricLabel: 'Bukme Uzunlugu' },
  { value: 'laser-cutting', label: 'Lazer Kesim', metricLabel: 'Lazer Gucu', secondaryMetricLabel: 'Ebat' }
]

export function createEmptyMachineForm(category = 'abkant') {
  return {
    category,
    brand: '',
    family: '',
    series: '',
    model: '',
    title: '',
    description: '',
    price: 0,
    pressForceTon: null,
    bendingLengthMm: null,
    powerKw: null,
    workingAreaCode: '',
    image: '',
    gallery: [],
    specs: [],
    isPublished: false
  }
}

export function normalizeMachineSpecs(specs = []) {
  return (Array.isArray(specs) ? specs : [])
    .map((spec, index) => ({
      key: spec?.key?.trim() || '',
      label: spec?.label?.trim() || '',
      value: spec?.value?.trim() || '',
      order: index + 1
    }))
    .filter((spec) => spec.key || spec.label || spec.value)
}

export function machineToForm(machine = {}) {
  const normalizedTitle = buildMachineTitle(machine) || machine.title || ''

  return {
    ...createEmptyMachineForm(machine.category || 'abkant'),
    category: machine.category || 'abkant',
    brand: machine.brand || '',
    family: machine.family || '',
    series: machine.series || '',
    model: machine.model || '',
    title: normalizedTitle,
    description: machine.description || '',
    price: machine.price || 0,
    pressForceTon: machine.pressForceTon ?? null,
    bendingLengthMm: machine.bendingLengthMm ?? null,
    powerKw: machine.powerKw ?? null,
    workingAreaCode: machine.workingAreaCode || '',
    image: machine.image || '',
    gallery: Array.isArray(machine.gallery) ? machine.gallery : [],
    specs: Array.isArray(machine.specs) ? machine.specs : [],
    isPublished: Boolean(machine.isPublished)
  }
}

export function formToMachinePayload(form = {}, overrides = {}) {
  return {
    ...createEmptyMachineForm(form.category || 'abkant'),
    ...form,
    gallery: Array.isArray(form.gallery) ? form.gallery : [],
    specs: normalizeMachineSpecs(form.specs),
    isPublished: typeof form.isPublished === 'boolean' ? form.isPublished : false,
    ...overrides
  }
}

export function buildMachineTitle(form = {}) {
  const series = form.series?.trim() || form.family?.trim() || ''

  if (!series) {
    return ''
  }

  if (form.category === 'abkant') {
    const ton = form.pressForceTon != null && form.pressForceTon !== '' ? `${form.pressForceTon}T` : ''
    const length = form.bendingLengthMm != null && form.bendingLengthMm !== '' ? `${form.bendingLengthMm}` : ''

    return [series, ton, length].filter(Boolean).join('-').concat(' Abkant tezgah').trim()
  }

  const power = form.powerKw != null && form.powerKw !== '' ? `${form.powerKw}KW` : ''
  const size = form.workingAreaCode?.trim() || ''

  return [series, power, size].filter(Boolean).join('-').concat(' Lazer tezgah').trim()
}

export function validateMachineForm(form = {}) {
  const errors = {}

  if (!form.category?.trim()) {
    errors.category = 'Kategori zorunludur.'
  }

  if (!form.brand?.trim()) {
    errors.brand = 'Marka zorunludur.'
  }

  if (!form.family?.trim()) {
    errors.family = 'Aile / Family zorunludur.'
  }

  if (!form.series?.trim()) {
    errors.series = 'Seri zorunludur.'
  }

  if (!form.model?.trim()) {
    errors.model = 'Model zorunludur.'
  }

  if (!form.title?.trim()) {
    errors.title = 'Başlık zorunludur.'
  }

  if (form.price < 0) {
    errors.price = 'Fiyat 0 veya daha büyük olmalıdır.'
  }

  if (form.category === 'abkant') {
    if (form.pressForceTon != null && form.pressForceTon < 0) {
      errors.pressForceTon = 'Tonaj 0 veya daha büyük olmalıdır.'
    }

    if (form.bendingLengthMm != null && form.bendingLengthMm < 0) {
      errors.bendingLengthMm = 'Bükme uzunluğu 0 veya daha büyük olmalıdır.'
    }
  } else {
    if (form.powerKw != null && form.powerKw < 0) {
      errors.powerKw = 'Lazer gücü 0 veya daha büyük olmalıdır.'
    }

    if (!form.workingAreaCode?.trim()) {
      errors.workingAreaCode = 'Ebat zorunludur.'
    }
  }

  if (form.image?.trim()) {
    const looksLikeUrl = /^(https?:\/\/|\/).+/i.test(form.image.trim())
    if (!looksLikeUrl) {
      errors.image = 'Görsel URL geçerli görünmüyor.'
    }
  }

  if (Array.isArray(form.specs)) {
    form.specs.forEach((spec, index) => {
      const hasAnyValue = spec?.label?.trim() || spec?.key?.trim() || spec?.value?.trim()

      if (!hasAnyValue) return

      if (!spec?.label?.trim()) {
        errors[`specs.${index}.label`] = `Özellik ${index + 1} için etiket zorunludur.`
      }

      if (!spec?.key?.trim()) {
        errors[`specs.${index}.key`] = `Özellik ${index + 1} için key zorunludur.`
      }
    })
  }

  return errors
}
