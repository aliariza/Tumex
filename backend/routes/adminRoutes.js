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
    createAdminListMachinesHandler()
  )

  app.post(
    '/admin/machines',
    authMiddleware,
    requireRole('admin'),
    createAdminCreateMachineHandler()
  )

  app.put(
    '/admin/machines/:id',
    authMiddleware,
    requireRole('admin'),
    createAdminUpdateMachineHandler()
  )

  app.delete(
    '/admin/machines/:id',
    authMiddleware,
    requireRole('admin'),
    createAdminDeleteMachineHandler()
  )

  app.get(
    '/admin/job-positions',
    authMiddleware,
    requireRole('admin'),
    createAdminListJobPositionsHandler()
  )

  app.post(
    '/admin/job-positions',
    authMiddleware,
    requireRole('admin'),
    createAdminCreateJobPositionHandler()
  )

  app.put(
    '/admin/job-positions/:id',
    authMiddleware,
    requireRole('admin'),
    createAdminUpdateJobPositionHandler()
  )

  app.delete(
    '/admin/job-positions/:id',
    authMiddleware,
    requireRole('admin'),
    createAdminDeleteJobPositionHandler()
  )

  app.get(
    '/admin/users',
    authMiddleware,
    requireRole('admin'),
    createAdminListUsersHandler()
  )

  app.patch(
    '/admin/users/:id/role',
    authMiddleware,
    requireRole('admin'),
    createAdminUpdateUserRoleHandler({ roleChangeNotifier })
  )

  app.delete(
    '/admin/users/:id',
    authMiddleware,
    requireRole('admin'),
    createAdminDeleteUserHandler()
  )
}

module.exports = { registerAdminRoutes }
