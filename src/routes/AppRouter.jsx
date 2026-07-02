import { useEffect, useMemo } from 'react'
import { MainLayout } from '../components/layout/MainLayout'
import { useAuth } from '../hooks/useAuth'
import { useCsvData } from '../hooks/useCsvData'
import { useHashRoute } from '../hooks/useHashRoute'
import { AdminPage } from '../pages/admin/AdminPage'
import { AuthPage } from '../pages/auth/AuthPage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { AiHealthPage } from '../pages/ai-health/AiHealthPage'
import { ModulePage } from '../pages/modules/ModulePage'
import { OrganizerPage } from '../pages/organizer/OrganizerPage'
import { QrScannerPage } from '../pages/qr/QrScannerPage'

function AccessDeniedPage({ auth, route }) {
  return (
    <section className="panel">
      <div className="panel__header panel__header--split">
        <div>
          <span className="eyebrow">Access blocked</span>
          <h3>This module needs a different permission level</h3>
        </div>
        <span className="status-pill">{auth.currentUser?.role || 'guest'}</span>
      </div>
      <p className="auth-helper">
        Your account is active, but this area is limited to another role. Use the available sidebar modules or log in as an admin.
      </p>
      <div className="hero-actions">
        <button type="button" onClick={() => route.navigate('dashboard')}>Open Dashboard</button>
        <button type="button" className="ghost-button" onClick={auth.logout}>Logout</button>
      </div>
    </section>
  )
}

const routes = [
  { key: 'auth', label: 'Authentication', scope: 'public' },
  { key: 'dashboard', label: 'Dashboard', scope: 'all' },
  { key: 'participants', label: 'Participants', scope: 'all' },
  { key: 'qr-scanner', label: 'QR Scanner', scope: 'all' },
  { key: 'ai-health', label: 'AI Health', scope: 'all' },
  { key: 'reports', label: 'Reports', scope: 'all' },
  { key: 'settings', label: 'Settings', scope: 'admin' },
  { key: 'admin', label: 'Admin Controls', scope: 'admin' },
  { key: 'badge', label: 'Badge', scope: 'all' },
  { key: 'speakers', label: 'Speakers', scope: 'all' },
  { key: 'sessions', label: 'Sessions', scope: 'all' },
  { key: 'workshops', label: 'Workshops', scope: 'all' },
  { key: 'abstracts', label: 'Abstracts', scope: 'all' },
  { key: 'reviewers', label: 'Reviewers', scope: 'admin' },
  { key: 'ai-analytics', label: 'AI Analytics', scope: 'all' },
  { key: 'food', label: 'Food Service', scope: 'all' },
  { key: 'accommodation', label: 'Accommodation', scope: 'all' },
  { key: 'transport', label: 'Transport', scope: 'all' },
  { key: 'sponsors', label: 'Sponsors', scope: 'all' },
  { key: 'exhibition', label: 'Exhibition', scope: 'all' },
  { key: 'finance', label: 'Finance', scope: 'admin' },
  { key: 'volunteers', label: 'Volunteers', scope: 'all' },
  { key: 'notifications', label: 'Notifications', scope: 'all' },
  { key: 'medical', label: 'Medical', scope: 'all' },
  { key: 'security', label: 'Security', scope: 'admin' },
  { key: 'certificates', label: 'Certificates', scope: 'all' },
  { key: 'profile', label: 'Profile', scope: 'all' },
  { key: 'audit', label: 'Audit Log', scope: 'admin' },
  { key: 'live-monitor', label: 'Live Monitor', scope: 'all' },
  { key: 'venue-map', label: 'Venue Map', scope: 'all' },
  { key: 'roles', label: 'User Roles', scope: 'admin' },
  { key: 'organizer', label: 'Organizer', scope: 'organizer' },
]

const modulePages = {
  participants: {
    eyebrow: 'Participant Management',
    title: 'Participants, badges, payments, and attendance in one place',
    description: 'Search, filter, export, and open participant profiles with QR, badge, workshop, payment, and certificate views.',
    quickAction: 'Add Participant',
    sections: [
      { eyebrow: 'Table', title: 'Participants table', type: 'chips', items: ['Photo', 'Name', 'Country', 'Institution', 'Email', 'Category', 'Status', 'Action'] },
      { eyebrow: 'Profile', title: 'Participant profile layout', type: 'chips', items: ['Photo', 'Personal Info', 'QR', 'Badge', 'Attendance', 'Workshop', 'Payment', 'Certificate', 'Timeline'] },
    ],
  },
  badge: {
    eyebrow: 'Badge System',
    title: 'Badge preview, color system, and instant print flow',
    description: 'Front and back preview, color-coded badge identities, email delivery, and direct print actions.',
    quickAction: 'Generate Badge',
    sections: [
      { eyebrow: 'Preview', title: 'Badge controls', type: 'chips', items: ['Front', 'Back', 'Color', 'Download', 'Print', 'Email', 'Generate'] },
      { eyebrow: 'Identity', title: 'Badge design language', type: 'chips', items: ['VIP', 'Speaker', 'Participant', 'Volunteer', 'Organizer', 'Media', 'Sponsor', 'Student'] },
    ],
  },
  speakers: {
    eyebrow: 'Speaker Management',
    title: 'Speaker profiles, sessions, and presentation readiness',
    description: 'Search speakers, open profiles, view biographies, attach presentation files, and track attendance and certificates.',
    quickAction: 'Add Speaker',
    sections: [
      { eyebrow: 'Directory', title: 'Speaker list', type: 'chips', items: ['Search', 'Photo', 'Country', 'Institution', 'Topic', 'Session', 'Status'] },
      { eyebrow: 'Profile', title: 'Speaker profile', type: 'chips', items: ['Photo', 'Biography', 'Presentation', 'Sessions', 'Schedule', 'Certificate', 'Attendance'] },
    ],
  },
  sessions: {
    eyebrow: 'Session Management',
    title: "Today's halls, speakers, capacity, and feedback overview",
    description: 'Monitor hall capacity, checked-in participants, session timelines, attendance, ratings, and detailed participant lists.',
    quickAction: 'Create Session',
    sections: [
      { eyebrow: 'Today', title: 'Session cards', type: 'chips', items: ['Hall', 'Speaker', 'Capacity', 'Registered', 'Checked In', 'Status'] },
      { eyebrow: 'Detail', title: 'Session details', type: 'chips', items: ['Timeline', 'Participants', 'Feedback', 'Attendance', 'Rating'] },
    ],
  },
  workshops: {
    eyebrow: 'Workshop',
    title: 'Workshop cards with attendance, materials, and certificates',
    description: 'Use card-driven layouts for capacity, registration status, instructor details, materials, feedback, and certificates.',
    quickAction: 'Create Workshop',
    sections: [
      { eyebrow: 'Cards', title: 'Workshop overview', type: 'chips', items: ['Image', 'Capacity', 'Registered', 'Instructor', 'Status'] },
      { eyebrow: 'Operations', title: 'Workshop detail tabs', type: 'chips', items: ['Attendance', 'Materials', 'Feedback', 'Certificate'] },
    ],
  },
  abstracts: {
    eyebrow: 'Abstract Management',
    title: 'Submitted papers, PDF review, and decision workflow',
    description: 'Search submitted papers, open the PDF viewer, review author information, comments, reviewer assignment, and decision status.',
    quickAction: 'Open Reviewer Queue',
    sections: [
      { eyebrow: 'Pipeline', title: 'Submission grid', type: 'chips', items: ['Submitted Papers', 'Search', 'Reviewer', 'Score', 'Status', 'Accepted', 'Rejected'] },
      { eyebrow: 'Review', title: 'Paper detail view', type: 'chips', items: ['PDF Viewer', 'Author', 'Comments', 'Review', 'Decision'] },
    ],
  },
  reviewers: {
    eyebrow: 'Reviewer Portal',
    title: 'Assigned papers with decision actions and revision flow',
    description: 'Reviewers can score assigned papers, add comments, and choose accept, reject, or revision outcomes.',
    quickAction: 'Assign Reviewers',
    sections: [
      { eyebrow: 'Assigned', title: 'Reviewer workload', type: 'chips', items: ['Assigned Papers', 'Score', 'Comment', 'Accept', 'Reject', 'Revision'] },
      { eyebrow: 'Tracking', title: 'Review status', type: 'chips', items: ['Deadline', 'Average Score', 'Blind Review', 'Decision Matrix'] },
    ],
  },
  reports: {
    eyebrow: 'Reports',
    title: 'Export-ready analytics dashboard with charts and heatmaps',
    description: 'Track participants, attendance, revenue, food, certificates, and sponsors with chart cards and export actions.',
    quickAction: 'Export PDF',
    sections: [
      { eyebrow: 'Cards', title: 'Report dashboard cards', type: 'chips', items: ['Participants', 'Attendance', 'Revenue', 'Food', 'Certificates'] },
      { eyebrow: 'Charts', title: 'Visualization types', type: 'chips', items: ['Pie Chart', 'Line Chart', 'Bar Chart', 'Area Chart', 'Heat Map', 'PDF', 'Excel', 'CSV'] },
    ],
  },
  'ai-analytics': {
    eyebrow: 'AI Analytics',
    title: 'Predictions, peak hours, crowd density, and AI insights',
    description: 'Monitor attendance prediction, food demand, no-show probability, peak hour analysis, crowd density, and institutional trends.',
    quickAction: 'Open AI Insights',
    sections: [
      { eyebrow: 'Predictions', title: 'Prediction cards', type: 'chips', items: ['Attendance Prediction', 'Food Prediction', 'No Show Prediction', 'Peak Hour'] },
      { eyebrow: 'Intelligence', title: 'Insight views', type: 'chips', items: ['Crowd Density', 'Heat Map', 'Country', 'Institution', 'Sessions'] },
    ],
  },
  food: {
    eyebrow: 'Food Service',
    title: 'Meal cards for breakfast, lunch, tea, and dinner collection',
    description: 'Use meal cards to track inside counts, collected meals, remaining stock, pending claims, and service history.',
    quickAction: 'Update Meal Status',
    sections: [
      { eyebrow: 'Meals', title: 'Food cards', type: 'chips', items: ['Breakfast', 'Lunch', 'Tea', 'Dinner'] },
      { eyebrow: 'Tracking', title: 'Service metrics', type: 'chips', items: ['Inside', 'Collected', 'Remaining', 'Pending', 'History'] },
    ],
  },
  accommodation: {
    eyebrow: 'Accommodation',
    title: 'Hotels, rooms, guest arrival, invoice, and transport flow',
    description: 'Manage guest lodging through hotel cards, room details, arrivals, departures, invoices, and linked transport.',
    quickAction: 'Assign Room',
    sections: [
      { eyebrow: 'Hotels', title: 'Accommodation cards', type: 'chips', items: ['Rooms', 'Guests', 'Arrival', 'Departure'] },
      { eyebrow: 'Detail', title: 'Guest stay detail', type: 'chips', items: ['Open', 'Room', 'Guest', 'Invoice', 'Transport'] },
    ],
  },
  transport: {
    eyebrow: 'Transport',
    title: 'Vehicle, driver, pickup, drop, GPS, and live map tracking',
    description: 'Coordinate airport pickup, driver assignment, vehicle status, drop timing, and live route visibility.',
    quickAction: 'Assign Vehicle',
    sections: [
      { eyebrow: 'Fleet', title: 'Transport cards', type: 'chips', items: ['Vehicle', 'Driver', 'Pickup', 'Drop', 'GPS', 'Status'] },
      { eyebrow: 'Live', title: 'Tracking views', type: 'chips', items: ['Map', 'Live Location', 'Route Status', 'Emergency Contact'] },
    ],
  },
  sponsors: {
    eyebrow: 'Sponsors',
    title: 'Sponsor tiers, contracts, booths, invoices, and logos',
    description: 'Handle sponsor relationships across Gold, Silver, Bronze, and Partner packages with linked booths and contracts.',
    quickAction: 'Add Sponsor',
    sections: [
      { eyebrow: 'Packages', title: 'Sponsor tiers', type: 'chips', items: ['Gold', 'Silver', 'Bronze', 'Partners'] },
      { eyebrow: 'Assets', title: 'Sponsor details', type: 'chips', items: ['Company', 'Contract', 'Booth', 'Invoice', 'Logo'] },
    ],
  },
  exhibition: {
    eyebrow: 'Exhibition',
    title: 'Booth grid, visitor metrics, products, and representatives',
    description: 'View exhibition booths through a grid layout and inspect visitors, companies, representatives, and showcased products.',
    quickAction: 'Open Booth Grid',
    sections: [
      { eyebrow: 'Grid', title: 'Booth map', type: 'chips', items: ['A1', 'A2', 'B1', 'B2'] },
      { eyebrow: 'Booth', title: 'Booth detail panel', type: 'chips', items: ['Visitors', 'Representative', 'Company', 'Products'] },
    ],
  },
  finance: {
    eyebrow: 'Finance',
    title: 'Revenue, expense, profit, refunds, and invoice operations',
    description: 'Use finance cards and transaction tables for income, expenses, pending payments, refunds, and invoice control.',
    quickAction: 'Open Transactions',
    sections: [
      { eyebrow: 'Metrics', title: 'Finance cards', type: 'chips', items: ['Revenue', 'Expense', 'Profit', 'Pending', 'Refund'] },
      { eyebrow: 'Ledger', title: 'Finance tools', type: 'chips', items: ['Charts', 'Transactions Table', 'Invoices', 'Payment Status'] },
    ],
  },
  volunteers: {
    eyebrow: 'Volunteers',
    title: 'Volunteer cards, attendance, shifts, tasks, and messages',
    description: 'Track volunteer profiles, attendance, performance, shift assignment, history, and operational communication.',
    quickAction: 'Assign Shift',
    sections: [
      { eyebrow: 'Cards', title: 'Volunteer overview', type: 'chips', items: ['Attendance', 'Tasks', 'Performance', 'Profile'] },
      { eyebrow: 'Profile', title: 'Volunteer profile', type: 'chips', items: ['Photo', 'Shift', 'History', 'Messages'] },
    ],
  },
  notifications: {
    eyebrow: 'Notifications',
    title: 'Unread, system, email, SMS, and event timeline updates',
    description: 'Keep all alerts in a single timeline with filters for unread items, system notices, email, and SMS.',
    quickAction: 'Send Broadcast',
    sections: [
      { eyebrow: 'Channels', title: 'Notification filters', type: 'chips', items: ['All', 'Unread', 'System', 'Email', 'SMS'] },
      { eyebrow: 'Timeline', title: 'Delivery timeline', type: 'chips', items: ['Announcements', 'Alerts', 'Status', 'History'] },
    ],
  },
  medical: {
    eyebrow: 'Medical',
    title: 'Emergency support, medicine, doctors, patients, and history',
    description: 'Organize on-site medical response with patient records, medicine logs, doctor support, and incident history.',
    quickAction: 'Record Case',
    sections: [
      { eyebrow: 'Emergency', title: 'Medical desk views', type: 'chips', items: ['Emergency', 'Medicine', 'Doctors', 'Patients', 'History'] },
      { eyebrow: 'Support', title: 'Medical operations', type: 'chips', items: ['Hospital Referral', 'Severity', 'Timeline', 'Notes'] },
    ],
  },
  security: {
    eyebrow: 'Security',
    title: 'Incidents, visitor logs, lost & found, and emergency timeline',
    description: 'Handle venue security through incident reports, visitor control, lost & found management, and emergency responses.',
    quickAction: 'Open Incident Log',
    sections: [
      { eyebrow: 'Security', title: 'Security cards', type: 'chips', items: ['Incidents', 'Visitors', 'Lost & Found', 'Emergency'] },
      { eyebrow: 'Timeline', title: 'Security timeline', type: 'chips', items: ['Who', 'When', 'Response', 'Status'] },
    ],
  },
  certificates: {
    eyebrow: 'Certificates',
    title: 'Generate, preview, email, download, and bulk issue certificates',
    description: 'Use a structured flow for preview, download, email delivery, and bulk generation of congress certificates.',
    quickAction: 'Generate Certificates',
    sections: [
      { eyebrow: 'Actions', title: 'Certificate workflow', type: 'chips', items: ['Generate', 'Preview', 'Download', 'Email', 'Bulk Generate'] },
      { eyebrow: 'Validation', title: 'Certificate controls', type: 'chips', items: ['QR Verification', 'Template', 'Speaker', 'Participant'] },
    ],
  },
  settings: {
    eyebrow: 'Settings',
    title: 'Congress info, branding, theme, backup, and API security',
    description: 'Centralize congress information, venue setup, branding, theme, email/SMS config, backup, and API settings.',
    quickAction: 'Save Settings',
    sections: [
      { eyebrow: 'Core', title: 'System settings', type: 'chips', items: ['Congress Info', 'Venue', 'Branding', 'Email', 'SMS', 'Theme'] },
      { eyebrow: 'Security', title: 'Advanced settings', type: 'chips', items: ['API', 'Backup', 'Security', 'Roles', 'SMTP'] },
    ],
  },
  profile: {
    eyebrow: 'Profile',
    title: 'User photo, information, password, activity, and sessions',
    description: 'Provide profile editing, password change, role information, session history, and activity tracking.',
    quickAction: 'Edit Profile',
    sections: [
      { eyebrow: 'Identity', title: 'Profile layout', type: 'chips', items: ['Photo', 'Information', 'Password', 'Activity', 'Sessions'] },
      { eyebrow: 'Account', title: 'User controls', type: 'chips', items: ['Role', 'Device', 'Recent Login', 'Permissions'] },
    ],
  },
  audit: {
    eyebrow: 'Audit Log',
    title: 'Time, user, action, IP, browser, and status traceability',
    description: 'Review every critical system action with clear attribution and operational audit history.',
    quickAction: 'Export Audit Log',
    sections: [
      { eyebrow: 'Fields', title: 'Audit columns', type: 'chips', items: ['Time', 'User', 'Action', 'IP', 'Browser', 'Status'] },
      { eyebrow: 'Review', title: 'Audit workflow', type: 'chips', items: ['Filter', 'Investigate', 'Export', 'Security Review'] },
    ],
  },
  'live-monitor': {
    eyebrow: 'Live Event Monitor',
    title: 'Venue map, crowd, scanner, food, service, and emergency status',
    description: 'Monitor live event operations from one view combining venue density, scanner flow, food status, and emergency alerts.',
    quickAction: 'Open Live Feed',
    sections: [
      { eyebrow: 'Live', title: 'Monitor cards', type: 'chips', items: ['Venue Map', 'Crowd', 'Scanner', 'Check-in', 'Service', 'Food', 'Emergency'] },
      { eyebrow: 'Command', title: 'Control room actions', type: 'chips', items: ['Alert', 'Broadcast', 'Escalate', 'Dispatch'] },
    ],
  },
  'ai-health': {
    eyebrow: 'AI Digital Health',
    title: 'Disease AI, ECG AI, X-ray AI, telemedicine, chatbot, and remote monitoring',
    description: 'Showcase the congress special through applied clinical AI demos, telemedicine, chatbot support, and remote monitoring.',
    quickAction: 'Open AI Demo',
    sections: [
      { eyebrow: 'Modules', title: 'AI health cards', type: 'chips', items: ['Disease AI', 'ECG AI', 'X-ray AI', 'Telemedicine', 'Chatbot', 'Remote Monitoring'] },
      { eyebrow: 'Operations', title: 'Live digital health tools', type: 'chips', items: ['Prediction', 'Case Queue', 'Remote Devices', 'Health Analytics'] },
    ],
  },
  'venue-map': {
    eyebrow: 'Smart Venue Map',
    title: 'Interactive venue navigation for halls, registration, medical, food, and exits',
    description: 'Use a venue-first layout to help teams and delegates navigate Hall A, Hall B, registration, medical desk, food court, prayer room, and exits.',
    quickAction: 'Open Live Navigation',
    sections: [
      { eyebrow: 'Map', title: 'Venue nodes', type: 'chips', items: ['Hall A', 'Hall B', 'Registration', 'Medical', 'Food Court', 'Prayer', 'Exit'] },
      { eyebrow: 'Navigation', title: 'Smart wayfinding', type: 'chips', items: ['Live Navigation', 'Emergency Route', 'Booth Locator', 'Accessibility'] },
    ],
  },
  roles: {
    eyebrow: 'User Roles',
    title: 'Role catalog and permission matrix for congress operations',
    description: 'Define access across Super Admin, Admin, Registration, Speaker Team, Volunteer, Security, Food, Medical, and Finance roles.',
    quickAction: 'Open Permission Matrix',
    sections: [
      { eyebrow: 'Roles', title: 'Operational roles', type: 'chips', items: ['Super Admin', 'Admin', 'Registration', 'Speaker Team', 'Volunteer', 'Security', 'Food', 'Medical', 'Finance'] },
      { eyebrow: 'Matrix', title: 'Permission matrix', type: 'chips', items: ['Read', 'Create', 'Approve', 'Export', 'Delete', 'Audit'] },
    ],
  },
}

export function AppRouter() {
  const route = useHashRoute('auth')
  const registrationStats = useCsvData('/data/registration_stats.csv')
  const schedule = useCsvData('/data/schedule.csv')
  const organizersCsv = useCsvData('/data/organizers.csv')
  const auth = useAuth(organizersCsv.rows)

  const isProtectedRoute = route.currentRoute !== 'auth'
  const activeRouteConfig = routes.find((item) => item.key === route.currentRoute)
  const activeScope = activeRouteConfig?.scope || 'all'
  const requiresAuth = isProtectedRoute && route.currentRoute !== 'auth'
  const isRestrictedAdminRoute = activeScope === 'admin' && !auth.isAdmin
  const isRestrictedOrganizerRoute = activeScope === 'organizer' && !auth.isOrganizer && !auth.isAdmin
  const protectedRoute = (!auth.currentUser && requiresAuth) || isRestrictedAdminRoute || isRestrictedOrganizerRoute

  useEffect(() => {
    if (!auth.currentUser && route.currentRoute !== 'auth') {
      route.navigate('auth')
      return
    }

    if (auth.currentUser && route.currentRoute === 'auth') {
      route.navigate('dashboard')
    }
  }, [auth.currentUser, route])

  const currentPage = useMemo(() => {
    if (protectedRoute) {
      return auth.currentUser ? <AccessDeniedPage auth={auth} route={route} /> : <AuthPage auth={auth} />
    }

    switch (route.currentRoute) {
      case 'auth':
        return <AuthPage auth={auth} />
      case 'organizer':
        return <OrganizerPage auth={auth} />
      case 'qr-scanner':
        return <QrScannerPage auth={auth} />
      case 'ai-health':
        return <AiHealthPage auth={auth} />
      case 'admin':
        return <AdminPage auth={auth} />
      case 'participants':
      case 'badge':
      case 'speakers':
      case 'sessions':
      case 'workshops':
      case 'abstracts':
      case 'reviewers':
      case 'reports':
      case 'ai-analytics':
      case 'food':
      case 'accommodation':
      case 'transport':
      case 'sponsors':
      case 'exhibition':
      case 'finance':
      case 'volunteers':
      case 'notifications':
      case 'medical':
      case 'security':
      case 'certificates':
      case 'settings':
      case 'profile':
      case 'audit':
      case 'live-monitor':
      case 'venue-map':
      case 'roles':
        return <ModulePage page={modulePages[route.currentRoute]} auth={auth} pageKey={route.currentRoute} />
      case 'dashboard':
      default:
        return (
          <DashboardPage
            stats={registrationStats.rows}
            schedule={schedule.rows}
            auth={auth}
            route={route}
          />
      )
    }
  }, [auth, protectedRoute, registrationStats.rows, route, schedule.rows])

  if (!auth.currentUser) {
    return <AuthPage auth={auth} />
  }

  return (
    <MainLayout
      auth={auth}
      route={route}
      routes={routes}
      dataStatus={{
        stats: registrationStats.status,
        schedule: schedule.status,
        organizers: organizersCsv.status,
      }}
    >
      {currentPage}
    </MainLayout>
  )
}
