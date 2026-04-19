import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProductView from './ProductView.vue'
import { fetchMachines } from '../api/machines.js'

vi.mock('../api/machines.js', () => ({
  fetchMachines: vi.fn()
}))

async function mountWithRoute(path) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/:machineType/:productType',
        component: ProductView
      }
    ]
  })

  await router.push(path)
  await router.isReady()

  const wrapper = mount(ProductView, {
    global: {
      plugins: [router],
      stubs: {
        ProductHero: {
          props: ['item'],
          template: '<div data-test="hero">{{ item.title }}</div>'
        },
        AltBolumler: {
          props: ['item'],
          template: '<div data-test="sections">{{ item.title }}</div>'
        },
        TheTable: {
          props: ['tableData', 'machines'],
          template: '<div data-test="table">{{ tableData[0]?.key }}</div>'
        },
        HighlightsDownloads: {
          props: ['pdfPath'],
          template: '<div data-test="downloads">{{ pdfPath }}</div>'
        }
      }
    }
  })

  await flushPromises()
  return wrapper
}

describe('ProductView', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('renders laser product content from the route params', async () => {
    fetchMachines.mockResolvedValue([
      {
        _id: '1',
        category: 'laser-cutting',
        series: 'DLC',
        model: 'DLC-3KW-3015',
        powerKw: 3,
        workingAreaCode: '3015',
        specs: [
          {
            key: 'laser_head',
            label: 'LAZER KAFASI',
            value: 'Raytools-BM 111',
            order: 1
          }
        ],
        isPublished: true
      }
    ])

    const wrapper = await mountWithRoute('/laser-cutting/DLC')

    expect(wrapper.text()).toContain('DLC serisi')
    expect(wrapper.get('[data-test="hero"]').text()).toContain('DLC serisi')
    expect(wrapper.get('[data-test="sections"]').text()).toContain('DLC: Hassasiyet ve Güç Bir Arada')
    expect(wrapper.get('[data-test="downloads"]').text()).toContain('Durmark_Laser.pdf')
    expect(wrapper.get('[data-test="table"]').text()).toContain('LAZER GÜCÜ')
    expect(fetchMachines).toHaveBeenCalledWith({
      category: 'laser-cutting',
      series: 'DLC'
    })
  })

  it('switches brochure and table labels for abkant products', async () => {
    fetchMachines.mockResolvedValue([
      {
        _id: '2',
        category: 'abkant',
        series: 'WC67K',
        model: 'WC67K-30T-1600',
        pressForceTon: 30,
        bendingLengthMm: 1600,
        specs: [
          {
            key: 'control_axis',
            label: 'CNC kontrol Ekseni',
            value: '2 Eksen',
            order: 1
          }
        ],
        isPublished: true
      }
    ])

    const wrapper = await mountWithRoute('/abkant/WC67K')

    expect(wrapper.text()).toContain('WC67K serisi')
    expect(wrapper.get('[data-test="downloads"]').text()).toContain('DurMarkAbkant.pdf')
    expect(wrapper.get('[data-test="table"]').text()).toContain('TONAJ SEÇİN (ton)')
    expect(fetchMachines).toHaveBeenCalledWith({
      category: 'abkant',
      series: 'WC67K'
    })
  })
})