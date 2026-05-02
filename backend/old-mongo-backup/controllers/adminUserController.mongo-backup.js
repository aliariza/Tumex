const User = require('../models/User')
const { sendInternalServerError, trimValue } = require('../utils/http')

function createAdminListUsersHandler({ userModel = User } = {}) {
  return async (_req, res) => {
    try {
      const users = await userModel.find({}, '-password').sort({ createdAt: -1 })
      return res.status(200).json(users)
    } catch (error) {
      return sendInternalServerError(res, '/admin/users GET', error)
    }
  }
}

function createAdminUpdateUserRoleHandler({
  userModel = User,
  roleChangeNotifier = async () => false
} = {}) {
  return async (req, res) => {
    try {
      const nextRole = trimValue(req.body?.role || '')
      const allowedRoles = ['user', 'dealer', 'admin']

      if (!allowedRoles.includes(nextRole)) {
        return res.status(400).json({ message: 'Geçersiz rol' })
      }

      if (String(req.user?._id) === String(req.params.id) && nextRole !== 'admin') {
        return res.status(400).json({ message: 'Kendi admin yetkinizi kaldıramazsınız' })
      }

      const existingUser = await userModel.findById(req.params.id)
      if (!existingUser) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' })
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        { role: nextRole },
        {
          new: true,
          runValidators: true
        }
      )

      if (!updatedUser) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' })
      }

      if (existingUser.role !== nextRole) {
        try {
          const notified = await roleChangeNotifier(updatedUser, existingUser.role, nextRole)
          if (notified) {
            console.info(
              `[/admin/users/:id/role notify] role change email sent to ${updatedUser.email} (${existingUser.role} -> ${nextRole})`
            )
          } else {
            console.info(
              `[/admin/users/:id/role notify] email skipped for ${updatedUser.email} (${existingUser.role} -> ${nextRole})`
            )
          }
        } catch (notificationError) {
          console.error('[/admin/users/:id/role notify]', notificationError.message)
        }
      }

      const safeUser = typeof updatedUser.toObject === 'function'
        ? updatedUser.toObject()
        : { ...updatedUser }

      delete safeUser.password

      return res.status(200).json(safeUser)
    } catch (error) {
      return sendInternalServerError(res, '/admin/users/:id/role PATCH', error)
    }
  }
}

function createAdminDeleteUserHandler({ userModel = User } = {}) {
  return async (req, res) => {
    try {
      if (String(req.user?._id) === String(req.params.id)) {
        return res.status(400).json({ message: 'Kendi admin hesabınızı silemezsiniz' })
      }

      const deletedUser = await userModel.findByIdAndDelete(req.params.id)

      if (!deletedUser) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' })
      }

      return res.status(200).json({ message: 'Kullanıcı silindi' })
    } catch (error) {
      return sendInternalServerError(res, '/admin/users/:id DELETE', error)
    }
  }
}

module.exports = {
  createAdminDeleteUserHandler,
  createAdminListUsersHandler,
  createAdminUpdateUserRoleHandler
}
