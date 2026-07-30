import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp'
import Seo from '../components/seo/Seo'
import JsonLdLocalBusiness from '../components/seo/JsonLdLocalBusiness'
import { getAdminToken } from '../api/authStorage'
import { siteInfo } from '../data/site'

export function SiteLayout() {
  const { pathname } = useLocation()
  const isBook = pathname === '/book'
  const seo = isBook
    ? {
        title: siteInfo.seo.titleBook,
        description: siteInfo.seo.descriptionBook,
        path: '/book',
      }
    : {
        title: siteInfo.seo.titleDefault,
        description: siteInfo.seo.description,
        path: '/',
      }

  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        path={seo.path}
        image={siteInfo.seo.ogImagePath}
      />
      {!isBook && <JsonLdLocalBusiness />}
      <Navbar />
      <main id="main-content" aria-label={siteInfo.name}>
        <Outlet />
      </main>
      {!isBook && <Footer />}
      <FloatingWhatsApp />
    </>
  )
}

export function AdminGuard() {
  const token = getAdminToken()
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }
  return <Outlet />
}
