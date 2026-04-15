import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it } from 'vitest'
import ProductView from './ProductView.vue'

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

  return mount(ProductView, {
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
          template: '<div data-test="table">{{ tableData[0].key }}</div>'
        },
        HighlightsDownloads: {
          props: ['pdfPath'],
          template: '<div data-test="downloads">{{ pdfPath }}</div>'
        }
      }
    }
  })
}

describe('ProductView', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders laser product content from the route params', async () => {
    const wrapper = await mountWithRoute('/laser-cutting/DLC')

    expect(wrapper.text()).toContain('DLC serisi')
    expect(wrapper.get('[data-test="hero"]').text()).toContain('DLC serisi')
    expect(wrapper.get('[data-test="sections"]').text()).toContain('DLC: Hassasiyet ve Güç Bir Arada')
    expect(wrapper.get('[data-test="downloads"]').text()).toContain('Durmark_Laser.pdf')
    expect(wrapper.get('[data-test="table"]').text()).toContain('LAZER GÜCÜ')
  })

  it('switches brochure and table labels for abkant products', async () => {
    const wrapper = await mountWithRoute('/abkant/WC67K')

    expect(wrapper.text()).toContain('WC67K serisi')
    expect(wrapper.get('[data-test="downloads"]').text()).toContain('DurMarkAbkant.pdf')
    expect(wrapper.get('[data-test="table"]').text()).toContain('TONAJ SEÇİN (ton)')
  })
})
