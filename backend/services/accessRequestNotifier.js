const nodemailer = require('nodemailer')

function isMailConfigured(config = {}) {
  return Boolean(
    config.host &&
    config.port &&
    config.user &&
    config.pass &&
    config.recipient
  )
}

function buildNotificationText(user = {}) {
  return [
    `${user.email} asked permission to access the bayi pages.`,
    '',
    'Registration details:',
    `Name: ${user.username || '-'}`,
    `Company: ${user.companyname || '-'}`,
    `Telephone: ${user.telephone || '-'}`,
    `Address: ${user.address || '-'}`,
    `Role: ${user.role || 'user'}`
  ].join('\n')
}

function buildRoleChangeText(user = {}, previousRole, nextRole) {
  const accessByRole = {
    user: 'Public pages only',
    dealer: 'Public pages and bayi protected pages',
    admin: 'Public, bayi and admin pages'
  }

  return [
    `Hello ${user.username || user.email || 'Tumex user'},`,
    '',
    `Your Tumex access level has been updated from ${previousRole} to ${nextRole}.`,
    `You can now access: ${accessByRole[nextRole] || nextRole}.`,
    '',
    nextRole === 'user'
      ? 'Your bayi/admin access is currently inactive. If you think this is a mistake, please contact Tumex.'
      : 'You can sign in again to use your updated permissions.',
    '',
    'Tumex'
  ].join('\n')
}

function createMailTransport(config = {}) {
  return nodemailer.createTransport({
    host: config.host,
    port: Number(config.port),
    secure: config.secure === 'true' || config.secure === true,
    auth: {
      user: config.user,
      pass: config.pass
    }
  })
}

function createAccessRequestNotifier(config = {}) {
  if (!isMailConfigured(config)) {
    return async () => false
  }

  const transporter = createMailTransport(config)

  return async (user) => {
    await transporter.sendMail({
      from: config.from || config.user,
      to: config.recipient,
      subject: 'Tumex bayi access request',
      text: buildNotificationText(user)
    })

    return true
  }
}

function createRoleChangeNotifier(config = {}) {
  if (!isMailConfigured(config)) {
    return async () => false
  }

  const transporter = createMailTransport(config)

  return async (user, previousRole, nextRole) => {
    await transporter.sendMail({
      from: config.from || config.user,
      to: user.email,
      subject: 'Tumex access update',
      text: buildRoleChangeText(user, previousRole, nextRole)
    })

    return true
  }
}

module.exports = {
  buildNotificationText,
  buildRoleChangeText,
  createAccessRequestNotifier,
  createRoleChangeNotifier
}
