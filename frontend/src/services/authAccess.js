export function getRouteAccess(route) {
  return route.meta?.access || 'public'
}

export function isPublicRoute(route) {
  return getRouteAccess(route) === 'public'
}

export function isRestrictedRoute(route) {
  return getRouteAccess(route) !== 'public'
}

export function canAccessRoute(user, access) {
  if (access === 'public') {
    return true
  }

  if (access === 'protected') {
    return user.role === 'dealer' || user.role === 'admin'
  }

  if (access === 'admin') {
    return user.role === 'admin'
  }

  return false
}
