export function createEmptyJobPositionForm() {
  return {
    title: '',
    department: '',
    locationType: 'Ofis içi',
    employmentType: 'Tam zamanlı',
    summary: '',
    highlightsText: '',
    applicationEmail: 'info@tum-ex.com',
    applicationSubject: '',
    sortOrder: 0,
    isPublished: true
  }
}

export function jobPositionToForm(position = {}) {
  return {
    title: position.title || '',
    department: position.department || '',
    locationType: position.locationType || 'Ofis içi',
    employmentType: position.employmentType || 'Tam zamanlı',
    summary: position.summary || '',
    highlightsText: Array.isArray(position.highlights) ? position.highlights.join('\n') : '',
    applicationEmail: position.applicationEmail || 'info@tum-ex.com',
    applicationSubject: position.applicationSubject || '',
    sortOrder: Number(position.sortOrder || 0),
    isPublished: Boolean(position.isPublished)
  }
}

export function formToJobPositionPayload(form = {}) {
  return {
    title: String(form.title || '').trim(),
    department: String(form.department || '').trim(),
    locationType: String(form.locationType || '').trim(),
    employmentType: String(form.employmentType || '').trim(),
    summary: String(form.summary || '').trim(),
    highlights: String(form.highlightsText || '')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    applicationEmail: String(form.applicationEmail || '').trim(),
    applicationSubject: String(form.applicationSubject || '').trim(),
    sortOrder: Number(form.sortOrder || 0),
    isPublished: Boolean(form.isPublished)
  }
}

export function validateJobPositionForm(form = {}) {
  const errors = {}

  if (!String(form.title || '').trim()) {
    errors.title = 'Pozisyon başlığı zorunludur.'
  }

  if (!String(form.department || '').trim()) {
    errors.department = 'Departman zorunludur.'
  }

  if (!String(form.summary || '').trim()) {
    errors.summary = 'Kısa açıklama zorunludur.'
  }

  const email = String(form.applicationEmail || '').trim()
  if (!email) {
    errors.applicationEmail = 'Başvuru e-postası zorunludur.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.applicationEmail = 'Geçerli bir e-posta adresi girin.'
  }

  return errors
}
