import { beforeEach, describe, expect, it, vi } from 'vitest'
import serverModule from './server'

const {
  createAdminListUsersHandler,
  createAdminUpdateUserRoleHandler,
  createCorsOriginMatcher,
  createLoginHandler,
  createRegisterHandler
} = serverModule

function createUserModel() {
  const instances = []

  function UserModel(data) {
    Object.assign(this, data)
    this.save = vi.fn().mockResolvedValue(undefined)
    instances.push(this)
  }

  UserModel.instances = instances
  UserModel.findOne = vi.fn()
  UserModel.find = vi.fn()
  UserModel.findById = vi.fn()
  UserModel.findByIdAndUpdate = vi.fn()

  return UserModel
}

describe('backend routes', () => {
  let UserModel
  let bcryptLib
  let jwtLib
  let accessRequestNotifier
  let roleChangeNotifier

  beforeEach(() => {
    UserModel = createUserModel()
    bcryptLib = {
      compare: vi.fn(),
      hash: vi.fn()
    }
    jwtLib = {
      sign: vi.fn()
    }
    accessRequestNotifier = vi.fn().mockResolvedValue(true)
    roleChangeNotifier = vi.fn().mockResolvedValue(true)
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
    UserModel.findOne.mockResolvedValue({
      _id: 'user-1',
      password: 'hashed-password',
      role: 'dealer'
    })
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
    expect(jwtLib.sign).toHaveBeenCalledWith(
      { _id: 'user-1', role: 'dealer' },
      'test-secret',
      { expiresIn: '1h' }
    )
    expect(res.statusCode).toBe(200)
    expect(res.body.token).toBe('signed-token')
  })

  it('rejects pending users until their dealer access is approved', async () => {
    UserModel.findOne.mockResolvedValue({
      _id: 'user-1',
      password: 'hashed-password',
      role: 'user'
    })
    bcryptLib.compare.mockResolvedValue(true)

    const handler = createLoginHandler({
      userModel: UserModel,
      bcryptLib,
      jwtLib,
      tokenSecret: 'test-secret'
    })
    const req = {
      body: {
        email: 'dealer@example.com',
        password: 'secret'
      }
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.statusCode).toBe(403)
    expect(res.body.message).toContain('Onay sonrası')
    expect(jwtLib.sign).not.toHaveBeenCalled()
  })

  it('creates trimmed users during registration', async () => {
    UserModel.findOne.mockResolvedValue(null)
    bcryptLib.hash.mockResolvedValue('hashed-password')

    const handler = createRegisterHandler({
      userModel: UserModel,
      bcryptLib,
      accessRequestNotifier
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
      address: 'Istanbul',
      role: 'user'
    })
    expect(accessRequestNotifier).toHaveBeenCalledWith(UserModel.instances[0])
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

  it('lists users for the admin user management screen', async () => {
    const users = [
      { _id: '1', email: 'pending@example.com', role: 'user' },
      { _id: '2', email: 'dealer@example.com', role: 'dealer' }
    ]
    const sort = vi.fn().mockResolvedValue(users)
    UserModel.find.mockReturnValue({ sort })

    const handler = createAdminListUsersHandler({ userModel: UserModel })
    const res = createResponse()

    await handler({}, res)

    expect(UserModel.find).toHaveBeenCalledWith({}, '-password')
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(users)
  })

  it('updates a user role from pending public access to dealer', async () => {
    UserModel.findById.mockResolvedValue({
      _id: 'user-2',
      email: 'dealer@example.com',
      role: 'user',
      username: 'Dealer User'
    })
    UserModel.findByIdAndUpdate.mockResolvedValue({
      _id: 'user-2',
      email: 'dealer@example.com',
      role: 'dealer',
      username: 'Dealer User',
      password: 'hashed',
      toObject() {
        return {
          _id: 'user-2',
          email: 'dealer@example.com',
          role: 'dealer',
          username: 'Dealer User',
          password: 'hashed'
        }
      }
    })

    const handler = createAdminUpdateUserRoleHandler({
      userModel: UserModel,
      roleChangeNotifier
    })
    const req = {
      params: { id: 'user-2' },
      body: { role: 'dealer' },
      user: { _id: 'admin-1', role: 'admin' }
    }
    const res = createResponse()

    await handler(req, res)

    expect(UserModel.findById).toHaveBeenCalledWith('user-2')
    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'user-2',
      { role: 'dealer' },
      { new: true, runValidators: true }
    )
    expect(roleChangeNotifier).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: 'user-2',
        email: 'dealer@example.com',
        role: 'dealer'
      }),
      'user',
      'dealer'
    )
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
      _id: 'user-2',
      email: 'dealer@example.com',
      role: 'dealer',
      username: 'Dealer User'
    })
  })

  it('prevents an admin from removing their own admin role', async () => {
    const handler = createAdminUpdateUserRoleHandler({
      userModel: UserModel,
      roleChangeNotifier
    })
    const req = {
      params: { id: 'admin-1' },
      body: { role: 'dealer' },
      user: { _id: 'admin-1', role: 'admin' }
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('Kendi admin yetkinizi kaldıramazsınız')
    expect(UserModel.findById).not.toHaveBeenCalled()
    expect(UserModel.findByIdAndUpdate).not.toHaveBeenCalled()
    expect(roleChangeNotifier).not.toHaveBeenCalled()
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
