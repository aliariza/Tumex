import { beforeEach, describe, expect, it, vi } from 'vitest'
import serverModule from './server'

const { createCorsOriginMatcher, createLoginHandler, createRegisterHandler } = serverModule

function createUserModel() {
  const instances = []

  function UserModel(data) {
    Object.assign(this, data)
    this.save = vi.fn().mockResolvedValue(undefined)
    instances.push(this)
  }

  UserModel.instances = instances
  UserModel.findOne = vi.fn()

  return UserModel
}

describe('backend routes', () => {
  let UserModel
  let bcryptLib
  let jwtLib

  beforeEach(() => {
    UserModel = createUserModel()
    bcryptLib = {
      compare: vi.fn(),
      hash: vi.fn()
    }
    jwtLib = {
      sign: vi.fn()
    }
  })

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

  it('rejects login requests with missing credentials', async () => {
    const handler = createLoginHandler({
      userModel: UserModel,
      bcryptLib,
      jwtLib,
      tokenSecret: 'test-secret'
    })
    const req = { body: { email: '' } }
    const res = createResponse()

    await handler(req, res)

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('E-posta ve şifre gerekli')
  })

  it('returns a token for valid login requests', async () => {
    UserModel.findOne.mockResolvedValue({ _id: 'user-1', password: 'hashed-password' })
    bcryptLib.compare.mockResolvedValue(true)
    jwtLib.sign.mockReturnValue('signed-token')

    const handler = createLoginHandler({
      userModel: UserModel,
      bcryptLib,
      jwtLib,
      tokenSecret: 'test-secret'
    })
    const req = {
      body: {
        email: 'Dealer@Example.com',
        password: 'secret'
      }
    }
    const res = createResponse()

    await handler(req, res)

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'dealer@example.com' })
    expect(jwtLib.sign).toHaveBeenCalledWith({ _id: 'user-1' }, 'test-secret', { expiresIn: '1h' })
    expect(res.statusCode).toBe(200)
    expect(res.body.token).toBe('signed-token')
  })

  it('creates trimmed users during registration', async () => {
    UserModel.findOne.mockResolvedValue(null)
    bcryptLib.hash.mockResolvedValue('hashed-password')

    const handler = createRegisterHandler({
      userModel: UserModel,
      bcryptLib
    })
    const req = {
      body: {
        username: ' Dealer Name ',
        email: ' Dealer@Example.com ',
        password: 'secret123',
        companyname: ' Tumex ',
        telephone: ' 123456 ',
        address: ' Istanbul '
      }
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.statusCode).toBe(201)
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'dealer@example.com' })
    expect(UserModel.instances).toHaveLength(1)
    expect(UserModel.instances[0]).toMatchObject({
      username: 'Dealer Name',
      email: 'dealer@example.com',
      password: 'hashed-password',
      companyname: 'Tumex',
      telephone: '123456',
      address: 'Istanbul'
    })
  })

  it('rejects duplicate email registration', async () => {
    UserModel.findOne.mockResolvedValue({ _id: 'existing-user' })

    const handler = createRegisterHandler({
      userModel: UserModel,
      bcryptLib
    })
    const req = {
      body: {
        username: 'Dealer Name',
        email: 'dealer@example.com',
        password: 'secret123',
        companyname: 'Tumex',
        telephone: '123456',
        address: 'Istanbul'
      }
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('Bu e-posta zaten kayıtlı')
  })

  it('allows configured frontend origins for CORS', () => {
    const matcher = createCorsOriginMatcher({
      corsOrigin: 'https://tumex.vercel.app,https://tumex.com'
    })
    const callback = vi.fn()

    matcher('https://tumex.vercel.app', callback)

    expect(callback).toHaveBeenCalledWith(null, true)
  })

  it('allows origins that match the configured regex for preview deployments', () => {
    const matcher = createCorsOriginMatcher({
      corsOrigin: 'https://tumex.com',
      corsOriginRegex: '^https://.*\\.vercel\\.app$'
    })
    const callback = vi.fn()

    matcher('https://tumex-git-feature-branch.vercel.app', callback)

    expect(callback).toHaveBeenCalledWith(null, true)
  })

  it('rejects unknown frontend origins for CORS', () => {
    const matcher = createCorsOriginMatcher({
      corsOrigin: 'https://tumex.vercel.app'
    })
    const callback = vi.fn()

    matcher('https://example.com', callback)

    expect(callback).toHaveBeenCalledOnce()
    expect(callback.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(callback.mock.calls[0][1]).toBeUndefined()
  })
})
