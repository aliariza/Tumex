import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import TheTable from './TheTable.vue'
import DropdownCell from './DropdownCell.vue'
import { laserMachinesData } from '@/data/laserMachineData'

const laserTableData = [
  {
    key: 'LAZER GÜCÜ',
    value: 'SEÇİNİZ',
    options: ['3KW', '6KW']
  },
  {
    key: 'EBAT SEÇİN (mm)',
    value: 'SEÇİNİZ',
    options: ['3015', '4015']
  }
]

async function mountTable() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/:machineType/:productType',
        component: { template: '<div />' }
      }
    ]
  })

  await router.push('/laser-cutting/DLC')
  await router.isReady()

  return mount(TheTable, {
    props: {
      tableData: laserTableData,
      machines: laserMachinesData
    },
    global: {
      plugins: [router]
    }
  })
}

describe('TheTable', () => {
  it('shows selected machine details when both dropdowns are chosen', async () => {
    const wrapper = await mountTable()
    const dropdowns = wrapper.findAllComponents(DropdownCell)

    await dropdowns[0].vm.$emit('select', '3KW')
    await dropdowns[1].vm.$emit('select', '3015')

    expect(wrapper.text()).toContain('LAZER KAFASI')
    expect(wrapper.text()).toContain('Raytools-BM 111')
    expect(wrapper.text()).toContain('ÇALIŞMA ALANI')
    expect(wrapper.text()).toContain('3050 x 1530mm')
  })

  it('toggles to the options section when the options header is clicked', async () => {
    const wrapper = await mountTable()
    const tbodies = wrapper.findAll('tbody')

    await tbodies[1].trigger('click')

    expect(wrapper.text()).toContain('Henüz hazır değil.')
  })
})
