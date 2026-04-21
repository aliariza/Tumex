import { describe, expect, it } from 'vitest'
import {
  buildMachineTitle,
  createEmptyMachineForm,
  formToMachinePayload,
  machineToForm,
  validateMachineForm
} from './adminMachineHelpers'

describe('adminMachineHelpers', () => {
  it('creates the expected empty machine form shape', () => {
    expect(createEmptyMachineForm()).toEqual({
      category: 'abkant',
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
    })
  })

  it('normalizes machine data for editing', () => {
    expect(machineToForm({
      category: 'laser-cutting',
      brand: 'Durmark',
      gallery: null,
      specs: null,
      isPublished: 1
    })).toMatchObject({
      category: 'laser-cutting',
      brand: 'Durmark',
      gallery: [],
      specs: [],
      isPublished: true
    })
  })

  it('normalizes payload specs and gallery before save', () => {
    const payload = formToMachinePayload({
      family: 'WC67K',
      gallery: null,
      specs: [
        { label: ' Control Axis ', key: ' control_axis ', value: ' 4 ' },
        { label: ' ', key: ' ', value: ' ' }
      ]
    })

    expect(payload.gallery).toEqual([])
    expect(payload.specs).toEqual([
      {
        label: 'Control Axis',
        key: 'control_axis',
        value: '4',
        order: 1
      }
    ])
  })

  it('builds a title from the machine form fields', () => {
    expect(buildMachineTitle({
      category: 'abkant',
      family: 'WC67K',
      pressForceTon: 100,
      bendingLengthMm: 3200
    })).toBe('WC67K-100T-3200 Abkant tezgah')
  })

  it('returns validation errors for invalid form data', () => {
    const errors = validateMachineForm({
      ...createEmptyMachineForm(),
      brand: ' ',
      family: 'WC67K',
      series: 'Series A',
      model: 'Model A',
      title: '',
      price: -1,
      image: 'not-a-url',
      specs: [{ label: 'Control Axis', key: '', value: '4' }]
    })

    expect(errors.brand).toBe('Marka zorunludur.')
    expect(errors.title).toBe('Başlık zorunludur.')
    expect(errors.price).toBe('Fiyat 0 veya daha büyük olmalıdır.')
    expect(errors.image).toBe('Görsel URL geçerli görünmüyor.')
    expect(errors['specs.0.key']).toBe('Özellik 1 için key zorunludur.')
  })
})