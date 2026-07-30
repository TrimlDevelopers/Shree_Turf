import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminGuard, SiteLayout } from './layouts/AppLayouts'
import AdminLayout from './layouts/AdminLayout'
import { BookingDraftProvider } from './contexts/BookingDraftContext'
import Home from './pages/Home'
import BookPage from './pages/BookPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminBookings from './pages/AdminBookings'
import AdminRates from './pages/AdminRates'

function App() {
  return (
    <BrowserRouter>
      <BookingDraftProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/rates" element={<AdminRates />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BookingDraftProvider>
    </BrowserRouter>
  )
}

export default App
