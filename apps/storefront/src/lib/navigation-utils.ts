export interface BreadcrumbItem {
  label: string
  path: string
  isActive: boolean
}

export interface RouteConfig {
  path: string
  label: string
  parent?: string
  children?: string[]
}

export function buildBreadcrumbs(
  currentPath: string,
  routes: RouteConfig[]
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = []
  const routeMap = new Map(routes.map((r) => [r.path, r]))

  let current = routeMap.get(currentPath)
  const visited = new Set<string>()

  while (current && !visited.has(current.path)) {
    visited.add(current.path)
    breadcrumbs.unshift({
      label: current.label,
      path: current.path,
      isActive: current.path === currentPath,
    })

    if (current.parent) {
      current = routeMap.get(current.parent)
    } else {
      break
    }
  }

  return breadcrumbs
}

export function getActiveRoute(
  currentPath: string,
  routes: RouteConfig[]
): RouteConfig | null {
  const exact = routes.find((r) => r.path === currentPath)
  if (exact) return exact

  const sorted = [...routes]
    .filter((r) => currentPath.startsWith(r.path))
    .sort((a, b) => b.path.length - a.path.length)

  return sorted[0] || null
}

export function isRouteActive(routePath: string, currentPath: string, exact: boolean = false): boolean {
  if (exact) {
    return routePath === currentPath
  }
  return currentPath === routePath || currentPath.startsWith(routePath + "/")
}

export function getParentRoute(
  currentPath: string,
  routes: RouteConfig[]
): RouteConfig | null {
  const current = routes.find((r) => r.path === currentPath)

  if (current?.parent) {
    return routes.find((r) => r.path === current.parent) || null
  }

  const segments = currentPath.split("/").filter(Boolean)
  if (segments.length <= 1) return null

  const parentPath = "/" + segments.slice(0, -1).join("/")
  return routes.find((r) => r.path === parentPath) || null
}
