import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MachineView from './MachineView.vue'

describe('MachineView', () => {
  it('renders laser-cutting catalog content from the shared composable', () => {
    const wrapper = mount(MachineView, {
      props: {
        machineType: 'laser-cutting'
      },
      global: {
        stubs: {
          TheHero: {
            props: ['item'],
            template: '<div data-test="hero">{{ item.title }}</div>'
          },
          AltBolumler: {
            props: ['item'],
            template: '<div data-test="sections">{{ item.title }}</div>'
          },
          BaseCard: {
            props: ['item'],
            template: '<div data-test="card">{{ item.title }}</div>'
          }
        }
      }
    })

    expect(wrapper.get('[data-test="hero"]').text()).toContain('Lazer')
    expect(wrapper.get('[data-test="sections"]').text()).toContain('Kesimdeki')
    expect(wrapper.findAll('[data-test="card"]')).toHaveLength(3)
  })
})
