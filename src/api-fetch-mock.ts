/**
 * Mock @wordpress/api-fetch for WP REST endpoints so the block editor works
 * without a WordPress backend. Registers a middleware that returns stub data
 * for known paths; all other requests pass through.
 */
import apiFetch from '@wordpress/api-fetch'

const WP_TYPES_STUB: Record<string, unknown> = {
  post: {
    slug: 'post',
    name: 'Posts',
    rest_base: 'posts',
    rest_namespace: 'wp/v2',
    labels: {},
    supports: { title: true, editor: true },
    viewable: true,
    hierarchical: false,
    taxonomies: ['category', 'post_tag'],
  },
  page: {
    slug: 'page',
    name: 'Pages',
    rest_base: 'pages',
    rest_namespace: 'wp/v2',
    labels: {},
    supports: { title: true, editor: true },
    viewable: true,
    hierarchical: true,
    taxonomies: [],
  },
}

const WP_TAXONOMIES_STUB: Record<string, unknown> = {
  category: {
    slug: 'category',
    name: 'Categories',
    rest_base: 'categories',
    rest_namespace: 'wp/v2',
    labels: {},
  },
  post_tag: {
    slug: 'post_tag',
    name: 'Tags',
    rest_base: 'tags',
    rest_namespace: 'wp/v2',
    labels: {},
  },
}

const WP_USER_ME_STUB = {
  id: 1,
  name: 'Demo User',
  slug: 'demo-user',
  avatar_urls: {},
  meta: {},
  capabilities: {},
}

const WP_SETTINGS_OPTIONS_STUB = {
  schema: {
    properties: {},
  },
}

function pathMatches(path: string | undefined, pattern: string): boolean {
  if (path == null) return false
  return path === pattern || path.startsWith(pattern + '?') || path.startsWith(pattern + '&')
}

function mockResponse(data: unknown, options: { parse?: boolean }): Promise<unknown> {
  if (options.parse === false) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
      headers: new Headers(),
    } as Response)
  }
  return Promise.resolve(data)
}

function setupApiFetchMock(): void {
  apiFetch.use((options, next) => {
    const path = options.path ?? (typeof options.url === 'string' ? options.url : undefined)
    const method = (options.method ?? 'GET').toUpperCase()

    // GET /wp/v2/types (post types)
    if (pathMatches(path, '/wp/v2/types')) {
      return mockResponse(WP_TYPES_STUB, options as { parse?: boolean })
    }

    // GET /wp/v2/users/me (current user)
    if (pathMatches(path, '/wp/v2/users/me')) {
      return mockResponse(WP_USER_ME_STUB, options as { parse?: boolean })
    }

    // GET /wp/v2/taxonomies
    if (pathMatches(path, '/wp/v2/taxonomies')) {
      return mockResponse(WP_TAXONOMIES_STUB, options as { parse?: boolean })
    }

    // GET /wp/v2/block-patterns/patterns
    if (pathMatches(path, '/wp/v2/block-patterns/patterns')) {
      return mockResponse([], options as { parse?: boolean })
    }

    // OPTIONS /wp/v2/settings (schema for site entity)
    if (pathMatches(path, '/wp/v2/settings') && method === 'OPTIONS') {
      return mockResponse(WP_SETTINGS_OPTIONS_STUB, options as { parse?: boolean })
    }

    // GET /wp/v2/settings
    if (pathMatches(path, '/wp/v2/settings')) {
      return mockResponse({}, options as { parse?: boolean })
    }

    // Root/site (baseURL "/" with _fields)
    if (path === '/' || (path != null && path.startsWith('/?') && !path.includes('/wp/'))) {
      return mockResponse(
        {
          name: 'Gutenberg Demo',
          description: '',
          url: typeof window !== 'undefined' ? window.location.origin : '',
          home: typeof window !== 'undefined' ? window.location.origin + '/' : '',
          gmt_offset: '0',
          timezone_string: '',
        },
        options as { parse?: boolean }
      )
    }

    return next(options)
  })
}

export { setupApiFetchMock }
