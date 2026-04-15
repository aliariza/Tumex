import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import authenticateToken from './middleware/authMiddleware.js'

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    }
  }
}

describe('authenticateToken', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    process.env.TOKEN_SECRET = 'test-secret'
  })

  it('rejects requests without an authorization header', () => {
    const req = { headers: {} }
    const res = createResponse()
    const next = vi.fn()

    authenticateToken(req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe('Erişim reddedildi. Token bulunamadı.')
    expect(next).not.toHaveBeenCalled()
  })

  it('rejects requests with a malformed authorization header', () => {
    const req = { headers: { authorization: 'Token abc123' } }
    const res = createResponse()
    const next = vi.fn()

    authenticateToken(req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe('Erişim reddedildi. Token bulunamadı.')
    expect(next).not.toHaveBeenCalled()
  })

  it('attaches the decoded user and calls next for a valid token', () => {
    const verifySpy = vi.spyOn(jwt, 'verify').mockReturnValue({ _id: 'user-1' })
    const req = { headers: { authorization: 'Bearer valid-token' } }
    const res = createResponse()
    const next = vi.fn()

    authenticateToken(req, res, next)

    expect(verifySpy).toHaveBeenCalledWith('valid-token', 'test-secret')
    expect(req.user).toEqual({ _id: 'user-1' })
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('returns 401 when token verification fails', () => {
    vi.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('jwt malformed')
    })
    const req = { headers: { authorization: 'Bearer broken-token' } }
    const res = createResponse()
    const next = vi.fn()

    authenticateToken(req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe('Geçersiz veya süresi dolmuş token.')
    expect(next).not.toHaveBeenCalled()
  })
})
