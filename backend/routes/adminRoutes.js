const Machine = require('../models/Machine')
const User = require('../models/User')
const requireRole = require('../middleware/requireRole')
const {
  createAdminDeleteUserHandler,
  createAdminListUsersHandler,
  createAdminUpdateUserRoleHandler
} = require('../controllers/adminUserController')
const {
  createAdminCreateMachineHandler,
  createAdminDeleteMachineHandler,
  createAdminListMachinesHandler,
  createAdminUpdateMachineHandler
} = require('../controllers/machineController')
const {
  createAdminCreateJobPositionHandler,
  createAdminDeleteJobPositionHandler,
  createAdminListJobPositionsHandler,
  createAdminUpdateJobPositionHandler
} = require('../controllers/jobPositionController')

function registerAdminRoutes(app, {
  userModel = User,
  machineModel = Machine,
  jobPositionModel,
  authMiddleware,
  roleChangeNotifier
} = {}) {
  app.get('/admin', authMiddleware, requireRole('admin'), (_req, res) => {
    res.json({ message: 'Admin bölgesine erişildi' })
  })

  app.get(
    '/admin/machines',
    authMiddleware,
    requireRole('admin'),
    createAdminListMachinesHandler({ machineModel })
  )

  app.post(
    '/admin/machines',
    authMiddleware,
    requireRole('admin'),
    createAdminCreateMachineHandler({ machineModel })
  )

  app.put(
    '/admin/machines/:id',
    authMiddleware,
    requireRole('admin'),
    createAdminUpdateMachineHandler({ machineModel })
  )

  app.delete(
    '/admin/machines/:id',
    authMiddleware,
    requireRole('admin'),
    createAdminDeleteMachineHandler({ machineModel })
  )

  app.get(
    '/admin/job-positions',
    authMiddleware,
    requireRole('admin'),
    createAdminListJobPositionsHandler({ jobPositionModel })
  )

  app.post(
    '/admin/job-positions',
    authMiddleware,
    requireRole('admin'),
    createAdminCreateJobPositionHandler({ jobPositionModel })
  )

  app.put(
    '/admin/job-positions/:id',
    authMiddleware,
    requireRole('admin'),
    createAdminUpdateJobPositionHandler({ jobPositionModel })
  )

  app.delete(
    '/admin/job-positions/:id',
    authMiddleware,
    requireRole('admin'),
    createAdminDeleteJobPositionHandler({ jobPositionModel })
  )

  app.get(
    '/admin/users',
    authMiddleware,
    requireRole('admin'),
    createAdminListUsersHandler({ userModel })
  )

  app.patch(
    '/admin/users/:id/role',
    authMiddleware,
    requireRole('admin'),
    createAdminUpdateUserRoleHandler({ userModel, roleChangeNotifier })
  )

  app.delete(
    '/admin/users/:id',
    authMiddleware,
    requireRole('admin'),
    createAdminDeleteUserHandler({ userModel })
  )
}

module.exports = { registerAdminRoutes }
