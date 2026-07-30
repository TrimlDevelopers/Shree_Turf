const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text }
    }
  }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

export function getSlots(date) {
  return request(`/slots?date=${encodeURIComponent(date)}`)
}

export function createBooking(payload) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createAdminBooking(token, payload) {
  return request('/bookings/admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export function adminLogin(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function getAdminMe(token) {
  return request('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function listBookings(token, { date, status } = {}) {
  const params = new URLSearchParams()
  if (date) params.set('date', date)
  if (status) params.set('status', status)
  const qs = params.toString()
  return request(`/bookings${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function updateBookingStatus(token, id, status) {
  return request(`/bookings/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  })
}

export function deleteBooking(token, id) {
  return request(`/bookings/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function getPricing() {
  return request('/pricing')
}

export function getAdminPricing(token) {
  return request('/pricing/all', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function updatePricingRate(token, key, payload) {
  return request(`/pricing/${encodeURIComponent(key)}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export function savePricingRates(token, rates) {
  return request('/pricing', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ rates }),
  })
}
