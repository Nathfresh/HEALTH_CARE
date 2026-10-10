import React from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/admin/Sidebar'
import Header from './components/admin/Header'
import Dashboard from './pages/admin/Dashboard'
import Patients from './pages/admin/Patients'
import Doctors from './pages/admin/Doctors'
import Appointments from './pages/admin/Appointments'
import Billing from './pages/admin/Billing'
import Pharmacy from './pages/admin/Pharmacy'
import Staff from './pages/admin/Staff'

const TITLES = {
  '/': 'Dashboard',
  '/patients': 'Patients',
  '/doctors': 'Doctors',
  '/appointments': 'Appointments',
  '/billing': 'Billing & Invoices',
  '/pharmacy': 'Pharmacy & Inventory',
  '/staff': 'Staff Management',
}

function Shell() {
  const { pathname } = useLocation()
  // Keyed on pathname so each module remounts with its fresh ?q= param.
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout__main">
        <Header title={TITLES[pathname] || 'Dashboard'} />
        <main className="layout__content" key={pathname}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  )
}
