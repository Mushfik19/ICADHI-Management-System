import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEYS = {
  currentUser: 'icadhi.currentUser',
  organizers: 'icadhi.organizers',
}

const adminCredentials = {
  email: import.meta.env.VITE_DEMO_ADMIN_EMAIL || 'mushfik.cse@gmail.com',
  password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD || '1324',
}

const initialLoginForm = {
  role: 'admin',
  email: '',
  password: '',
}

const initialSignupForm = {
  name: '',
  institution: '',
  phone: '',
  email: '',
  password: '',
}

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'Request failed.')
  }

  return data
}

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function normalizeOrganizers(items = []) {
  return items.map((organizer, index) => ({
    id: Number(organizer.id) || index + 1,
    name: organizer.name || '',
    institution: organizer.institution || '',
    phone: organizer.phone || '',
    email: organizer.email || '',
    password: organizer.password || '',
    status: organizer.status || 'pending',
  }))
}

async function fetchOrganizers() {
  const data = await requestJson('/api/organizers')
  return normalizeOrganizers(data.data || data.organizers || [])
}

export function useAuth(seedOrganizers = []) {
  const [loginForm, setLoginForm] = useState(initialLoginForm)
  const [signupForm, setSignupForm] = useState(initialSignupForm)
  const [organizers, setOrganizers] = useState(() =>
    readStorage(STORAGE_KEYS.organizers, []),
  )
  const [currentUser, setCurrentUser] = useState(() =>
    readStorage(STORAGE_KEYS.currentUser, null),
  )
  const [message, setMessage] = useState(
    'Sign in with the admin account or submit an organizer signup request for approval.',
  )

  useEffect(() => {
    if (organizers.length > 0 || seedOrganizers.length === 0) {
      return
    }

    setOrganizers(normalizeOrganizers(seedOrganizers))
  }, [organizers.length, seedOrganizers])

  useEffect(() => {
    let isActive = true

    fetchOrganizers()
      .then((items) => {
        if (isActive && items.length > 0) {
          setOrganizers(items)
        }
      })
      .catch(() => {
        if (organizers.length === 0 && seedOrganizers.length > 0) {
          setOrganizers(normalizeOrganizers(seedOrganizers))
        }
      })

    return () => {
      isActive = false
    }
  }, [organizers.length, seedOrganizers])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.organizers, JSON.stringify(organizers))
  }, [organizers])

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser))
      return
    }

    window.localStorage.removeItem(STORAGE_KEYS.currentUser)
  }, [currentUser])

  const pendingOrganizers = useMemo(
    () => organizers.filter((organizer) => organizer.status === 'pending'),
    [organizers],
  )

  const approvedOrganizers = useMemo(
    () => organizers.filter((organizer) => organizer.status === 'approved'),
    [organizers],
  )

  const updateLoginField = (event) => {
    const { name, value } = event.target
    setLoginForm((current) => ({ ...current, [name]: value }))
  }

  const updateSignupField = (event) => {
    const { name, value } = event.target
    setSignupForm((current) => ({ ...current, [name]: value }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    const email = loginForm.email.trim().toLowerCase()
    const password = loginForm.password

    if (!email || !password) {
      setMessage('Please enter both email and password before logging in.')
      return false
    }

    try {
      const data = await requestJson('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (!data.success) {
        throw new Error(data.message || 'Login failed.')
      }

      const resolvedRole = data.user?.role || 'user'
      const resolvedName = data.user?.name || (resolvedRole === 'admin' ? 'Mushfik Admin' : data.user?.email || email)

      setCurrentUser({
        role: resolvedRole,
        name: resolvedName,
        email: data.user?.email || email,
      })
      setLoginForm(initialLoginForm)
      setMessage(data.message || 'Login successful.')
      window.location.hash = '/dashboard'
      return true
    } catch (error) {
      if (loginForm.role === 'admin') {
        const isValidAdmin =
          email === adminCredentials.email.toLowerCase() &&
          password === adminCredentials.password

        if (!isValidAdmin) {
          setMessage(error.message || 'Admin login failed. Check the configured admin credentials.')
          return false
        }

        setCurrentUser({
          role: 'admin',
          name: 'Mushfik Admin',
          email: adminCredentials.email,
        })
        setLoginForm(initialLoginForm)
        setMessage('Admin login successful. You can now approve organizers and manage protected modules.')
        window.location.hash = '/dashboard'
        return true
      }

      const organizer = organizers.find(
        (item) => item.email.trim().toLowerCase() === email && item.password === password,
      )

      if (!organizer) {
        setMessage(error.message || 'Organizer login failed. Please verify the email and password.')
        return false
      }

      if (organizer.status !== 'approved') {
        setMessage('Organizer account is pending admin approval. Login is blocked until verification.')
        return false
      }

      setCurrentUser({
        role: 'organizer',
        name: organizer.name,
        email: organizer.email,
      })
      setLoginForm(initialLoginForm)
      setMessage('Organizer login successful. Only organizer-safe modules are available.')
      window.location.hash = '/dashboard'
      return true
    }
  }

  const handleSignup = async (event) => {
    event.preventDefault()

    const preparedSignup = Object.fromEntries(
      Object.entries(signupForm).map(([key, value]) => [key, value.trim()]),
    )

    const hasEmpty = Object.values(preparedSignup).some((value) => value === '')
    if (hasEmpty) {
      setMessage('Please fill in every organizer signup field.')
      return false
    }

    const alreadyExists = organizers.some(
      (organizer) =>
        organizer.email.trim().toLowerCase() === preparedSignup.email.toLowerCase(),
    )

    if (alreadyExists) {
      setMessage('This organizer email already exists.')
      return false
    }

    try {
      const data = await requestJson('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(preparedSignup),
      })

      if (!data.success) {
        throw new Error(data.message || 'Signup failed.')
      }

      setOrganizers((current) => [
        ...current,
        normalizeOrganizers([data.organizer || preparedSignup])[0],
      ])
      setSignupForm(initialSignupForm)
      setMessage(data.message || 'Organizer signup submitted successfully. An admin must approve the account before login.')
      return true
    } catch (error) {
      setMessage(error.message || 'Signup failed.')
      return false
    }
  }

  const approveOrganizer = async (id) => {
    if (!currentUser || currentUser.role !== 'admin') {
      setMessage('Only an admin can approve organizer accounts.')
      return
    }

    try {
      const data = await requestJson(`/api/organizers/${id}/approve`, {
        method: 'PATCH',
      })
      const approvedOrganizer = normalizeOrganizers([data.organizer || { id, status: 'approved' }])[0]

      setOrganizers((current) =>
        current.map((organizer) =>
          organizer.id === id ? { ...organizer, ...approvedOrganizer, status: 'approved' } : organizer,
        ),
      )
      setMessage(data.message || 'Organizer approved successfully. The user can now log in.')
    } catch (error) {
      setMessage(error.message || 'Organizer approval failed.')
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setLoginForm(initialLoginForm)
    setMessage('You have been logged out successfully.')
    window.location.hash = '/auth'
  }

  return {
    adminCredentials,
    loginForm,
    signupForm,
    organizers,
    currentUser,
    message,
    pendingOrganizers,
    approvedOrganizers,
    isAdmin: currentUser?.role === 'admin',
    isOrganizer: currentUser?.role === 'organizer',
    updateLoginField,
    updateSignupField,
    handleLogin,
    handleSignup,
    approveOrganizer,
    logout,
  }
}
