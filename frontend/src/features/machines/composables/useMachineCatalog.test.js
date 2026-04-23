import { computed, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useMachineCatalog } from './useMachineCatalog.js'

describe('useMachineCatalog', () => {
  it('returns catalog content for a static machine type', () => {
    const { heroItem, machineItems, altBolumler } = useMachineCatalog('abkant')

    expect(heroItem.value.title).toContain('Abkant')
    expect(machineItems.value).toHaveLength(4)
    expect(altBolumler.value.title).toContain('Bükmedeki')
  })

  it('reacts when the machine type source changes', () => {
    const currentType = ref('laser-cutting')

    const { heroItem, machineItems } = useMachineCatalog(
      computed(() => currentType.value)
    )

    expect(heroItem.value.title).toContain('Lazer')
    expect(machineItems.value).toHaveLength(3)

    currentType.value = 'abkant'

    expect(heroItem.value.title).toContain('Abkant')
    expect(machineItems.value).toHaveLength(4)
  })
})
