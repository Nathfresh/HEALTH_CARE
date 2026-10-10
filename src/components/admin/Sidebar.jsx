import React from 'react'
import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/', label: 'Dashboard', icon: 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10' },
  { to: '/patients', label: 'Patients', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1' },
  { to: '/doctors', label: 'Doctors', icon: 'M12 4v3m0 0a4 4 0 100 8 4 4 0 000-8zm0 8v5m-3-2h6' },
  { to: '/appointments', label: 'Appointments', icon: 'M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z' },
  { to: '/billing', label: 'Billing', icon: 'M3 6h18M3 6v12a2 2 0 002 2h14a2 2 0 002-2V6M3 6l2-3h14l2 3M8 12h8m-8 4h5' },
  { to: '/pharmacy', label: 'Pharmacy', icon: 'M10 3h4a1 1 0 011 1v2h3a1 1 0 011 1v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7a1 1 0 011-1h3V4a1 1 0 011-1zm2 7v6m-3-3h6' },
  { to: '/staff', label: 'Staff', icon: 'M17 20h5v-1a4 4 0 00-3-3.87M9 20H4v-1a6 6 0 016-6 6 6 0 016 6v1h-1M9 11a4 4 0 100-8 4 4 0 000 8zm7-8a4 4 0 010 7.5' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-7-4.6-9.3-9A5.5 5.5 0 0112 5.6 5.5 5.5 0 0121.3 12C19 16.4 12 21 12 21z" />
            <path d="M8 12h2.2l1.3-2.5 1.6 4 1.2-1.5H16" />
          </svg>
        </span>
        <div>
          <div className="sidebar__title">MediCare</div>
          <div className="sidebar__subtitle">Admin Console</div>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={item.icon} />
            </svg>
            {item.label && <span className="sidebar__link-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <span className="avatar avatar--sm" aria-hidden="true">
          AO
        </span>
        <div>
          <div className="sidebar__user">Admin Officer</div>
          <div className="sidebar__role">Super Admin</div>
        </div>
      </div>
    </aside>
  )
}
