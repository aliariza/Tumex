import { afterEach, beforeEach, vi } from 'vitest'

beforeEach(() => {
  sessionStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})
