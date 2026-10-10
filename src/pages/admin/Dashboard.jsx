import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../../components/admin/StatusBadge'
import { patients, doctors, appointments, invoices, medications } from '../../data/mockData'
import { formatNaira } from '../../utils/query'
import { formatDate, isToday } from '../../utils/format'

const APPT_TABS = ['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No-Show']

export default function Dashboard() {
  const [tab, setTab] = useState('All')

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const todays = appointments.filter((a) => a.date === today)
    const outstanding = invoices
      .filter((i) => ['Pending', 'Overdue', 'Partially Paid'].includes(i.status))
      .reduce((s, i) => s + i.amount, 0)
    const stockAlerts = medications.filter((m) => m.stockStatus !== 'In Stock').length
    return {
      patients: patients.length,
      doctors: doctors.filter((d) => d.status === 'Available').length,
      doctorsTotal: doctors.length,
      todays: todays.length,
      outstanding,
      stockAlerts,
    }
  }, [])

  const todaysAppointments = useMemo(() => {
    const rows = appointments.filter((a) => isToday(a.date)).sort((a, b) => a.time.localeCompare(b.time))
    return tab === 'All' ? rows : rows.filter((a) => a.status === tab)
  }, [tab])

  const lowStock = medications.filter((m) => m.stockStatus !== 'In Stock').slice(0, 6)

  return (
    <div className="dashboard">
      <div className="stat-row">
        <Link to="/patients" className="stat-card stat-card--link">
          <div className="stat-card__label">Total Patients</div>
          <div className="stat-card__value">{stats.patients}</div>
          <div className="stat-card__sub">View & search patients →</div>
        </Link>
        <Link to="/appointments" className="stat-card stat-card--link">
          <div className="stat-card__label">Appointments Today</div>
          <div className="stat-card__value">{stats.todays}</div>
          <div className="stat-card__sub">Filter by status & date →</div>
        </Link>
        <Link to="/billing" className="stat-card stat-card--link stat-card--warn">
          <div className="stat-card__label">Outstanding Billing</div>
          <div className="stat-card__value">{formatNaira(stats.outstanding)}</div>
          <div className="stat-card__sub">Pending + overdue invoices →</div>
        </Link>
        <Link to="/pharmacy" className="stat-card stat-card--link stat-card--danger">
          <div className="stat-card__label">Pharmacy Alerts</div>
          <div className="stat-card__value">{stats.stockAlerts}</div>
          <div className="stat-card__sub">Low / out-of-stock items →</div>
        </Link>
      </div>

      <div className="dashboard__grid">
        <section className="card">
          <div className="card__head">
            <h2>Today's Appointments</h2>
            {/* Status quick-filter tabs */}
            <div className="tabs" role="tablist" aria-label="Filter today's appointments by status">
              {APPT_TABS.map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  type="button"
                  className={`tabs__tab ${tab === t ? 'is-active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todaysAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="table__empty">
                      No appointments{tab !== 'All' ? ` with status “${tab}”` : ''} today.
                    </td>
                  </tr>
                ) : (
                  todaysAppointments.map((a) => (
                    <tr key={a.id}>
                      <td className="cell-strong">{a.time}</td>
                      <td>{a.patientName}</td>
                      <td>{a.doctorName}</td>
                      <td>{a.type}</td>
                      <td><StatusBadge status={a.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="card__head">
            <h2>Stock Alerts</h2>
            <Link className="link" to="/pharmacy">
              Manage pharmacy →
            </Link>
          </div>
          <ul className="alert-list">
            {lowStock.map((m) => (
              <li key={m.id} className="alert-list__item">
                <div>
                  <div className="cell-strong">{m.name}</div>
                  <div className="cell-sub">{m.sku} · {formatDate(m.expiry)}</div>
                </div>
                <StatusBadge status={m.stockStatus} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
