import { useEffect } from 'react'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Client-side SEO head updater for SPA routes.
 */
export default function Seo({
  title,
  description,
  path = '/',
  image,
  noindex = false,
  type = 'website',
}) {
  useEffect(() => {
    const origin =
      (import.meta.env.VITE_SITE_URL || window.location.origin || '').replace(
        /\/$/,
        '',
      )
    const url = `${origin}${path.startsWith('/') ? path : `/${path}`}`
    const img = image?.startsWith('http')
      ? image
      : `${origin}${image || '/turflogo.jpeg'}`

    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    upsertLink('canonical', url)

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:image', img)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', img)
  }, [title, description, path, image, noindex, type])

  return null
}
