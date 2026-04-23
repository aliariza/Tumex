import { computed, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildSeriesSummary, useMachineCatalog } from './useMachineCatalog.js'
import { fetchMachines } from '../services/machineApi.js'

vi.mock('../services/machineApi.js', () => ({
  fetchMachines: vi.fn()
}))

const abkantMachines = [
  { category: 'abkant', series: 'WC67K', pressForceTon: 30, bendingLengthMm: 1600 },
  { category: 'abkant', series: 'PSH4', pressForceTon: 40, bendingLengthMm: 2000 },
  { category: 'abkant', series: 'DGE', pressForceTon: 50, bendingLengthMm: 2500 },
  { category: 'abkant', series: 'PSH8', pressForceTon: 60, bendingLengthMm: 3200 }
]

const laserMachines = [
  { category: 'laser-cutting', series: 'DLC', powerKw: 3, workingAreaCode: '3015' },
  { category: 'laser-cutting', series: 'D-DLC', powerKw: 6, workingAreaCode: '6025' },
  { category: 'laser-cutting', series: 'D-DLC-S', powerKw: 12, workingAreaCode: '8025' }
]

function mockMachines() {
  fetchMachines.mockImplementation(({ category }) => {
    if (category === 'abkant') return Promise.resolve(abkantMachines)
    if (category === 'laser-cutting') return Promise.resolve(laserMachines)
    return Promise.resolve([])
  })
}

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe('useMachineCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMachines()
  })

  it('returns catalog content for a static machine type', async () => {
    const { heroItem, machineItems, altBolumler } = useMachineCatalog('abkant')
    await flushPromises()

    expect(heroItem.value.title).toContain('Abkant')
    expect(machineItems.value).toHaveLength(4)
    expect(altBolumler.value.title).toContain('Bükmedeki')
  })

  it('reacts when the machine type source changes', async () => {
    const currentType = ref('laser-cutting')

    const { heroItem, machineItems } = useMachineCatalog(
      computed(() => currentType.value)
    )
    await flushPromises()

    expect(heroItem.value.title).toContain('Lazer')
    expect(machineItems.value).toHaveLength(3)

    currentType.value = 'abkant'
    await flushPromises()

    expect(heroItem.value.title).toContain('Abkant')
    expect(machineItems.value).toHaveLength(4)
  })

  it('builds dynamic laser range summaries for every laser series', () => {
    expect(buildSeriesSummary('laser-cutting', 'D-DLC', [
      {
        powerKw: 0,
        workingAreaCode: '.',
        model: 'D-DLC-30KW-8025',
        description: 'Do not use saved descriptions for laser cards'
      },
      {
        powerKw: 6,
        workingAreaCode: '3015',
        model: 'D-DLC-6KW-3015'
      }
    ])).toBe('D-DLC serisi 6KW - 30KW ve 3015 - 8025 ebat aralığında lazer tezgahları.')
  })

  it('does not treat series names or zero values as laser ranges', () => {
    expect(buildSeriesSummary('laser-cutting', 'DLC', [
      {
        powerKw: 0,
        workingAreaCode: '.',
        model: 'DLC-3KW-3015',
        title: 'DLC Lazer tezgah'
      },
      {
        powerKw: 0,
        workingAreaCode: '',
        model: 'DLC-30KW-8025',
        title: 'DLC Lazer tezgah'
      }
    ])).toBe('DLC serisi 3KW - 30KW ve 3015 - 8025 ebat aralığında lazer tezgahları.')
  })
})
