import React from 'react'
import { useSearchParams } from 'react-router-dom'
import ListPage from '../../components/admin/ListPage'
import StatusBadge from '../../components/admin/StatusBadge'
import { FilterSelect, DateRangeFilter } from '../../components/admin/Filters'
import { useSearchFilter } from '../../hooks/useSearchFilter'
import { appointments, DEPARTMENTS, doctors } from '../../data/mockData'
import { formatDate, isToday } from '../../utils/format'

const QUICK_DATES = {
  today: () => {
    const t = new Date().toISOString().slice(0, 10)
    return { from: t, to: t }
  },
  week: () => {
    const now = new Date()
    const end = new Date(now)
    end.setDate(now.getDate() + 7)
    return { from: now.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) }
  },
  past: () => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - 60)
    return { from: start.toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) }
  },
}

export default function Appointments() {
  const [params] = useSearchParams()

  const q = useSearchFilter(appointments, {
    // ── Free-text search: patient, doctor, appointment ID, reason ─────────
    searchFields: ['patientName', 'doctorName', 'id', 'reason'],
    initialSearch: params.get('q') ?? '',
    // ── Filters ────────────────────────────────────────────────────────────
    defaultFilters: {
      status: 'all',
      type: 'all',
      department: 'all',
      doctorId: 'all',
      date: {},
    },
    filterLabels: {
      status: 'Status',
      type: 'Type',
      department: 'Department',
      doctorId: 'Doctor',
      date: 'Date',
    },
    predicates: {
      status: (a, v) => a.status === v,
      type: (a, v) => a.type === v,
      department: (a, v) => a.department === v,
      doctorId: (a, v) => a.doctorId === v,
      date: (a, { from, to }) => (!from || a.date >= from) && (!to || a.date <= to),
    },
    defaultSort: { key: 'date', dir: 'desc' },
    pageSize: 10,
  })

  const columns = [
    { key: 'id', label: 'Appt. ID', sortable: true },
    { key: 'patientName', label: 'Patient', sortable: true, render: (a) => <div className="cell-strong">{a.patientName}</div> },
    { key: 'doctorName', label: 'Doctor', sortable: true },
    { key: 'department', label: 'Department' },
    {
      key: 'date',
      label: 'Date & Time',
      sortable: true,
      render: (a) => (
        <div>
          <div className="cell-strong">{formatDate(a.date)} {isToday(a.date) && <span className="tag-today">Today</span>}</div>
          <div className="cell-sub">{a.time}</div>
        </div>
      ),
      csv: (a) => `${a.date} ${a.time}`,
    },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status', render: (a) => <StatusBadge status={a.status} />, csv: (a) => a.status },
  ]

  return (
    <ListPage
      q={q}
      columns={columns}
      rows={q.rows}
      exportName="appointments.csv"
      searchPlaceholder="Search by patient, doctor, ID or reason…"
    >
      <div className="filter-control filter-control--quick">
        <span className="filter-control__label">Quick date</span>
        <div className="quick-dates">
          <button type="button" className="btn btn--ghost btn--xs" onClick={() => q.setFilter('date', QUICK_DATES.today())}>Today</button>
          <button type="button" className="btn btn--ghost btn--xs" onClick={() => q.setFilter('date', QUICK_DATES.week())}>Next 7 days</button>
          <button type="button" className="btn btn--ghost btn--xs" onClick={() => q.setFilter('date', QUICK_DATES.past())}>Past 60 days</button>
        </div>
      </div>
      <FilterSelect label="Status" value={q.filters.status} onChange={(v) => q.setFilter('status', v)} options={['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No-Show']} />
      <FilterSelect label="Type" value={q.filters.type} onChange={(v) => q.setFilter('type', v)} options={['In-Person', 'Telehealth', 'Follow-Up', 'Emergency']} />
      <FilterSelect label="Department" value={q.filters.department} onChange={(v) => q.setFilter('department', v)} options={DEPARTMENTS} />
      <FilterSelect
        label="Doctor"
        value={q.filters.doctorId}
        onChange={(v) => q.setFilter('doctorId', v)}
        options={doctors.map((d) => ({ value: d.id, label: d.name }))}
        allLabel="Any doctor"
      />
      <DateRangeFilter label="Date Range" value={q.filters.date} onPatch={(patch) => q.patchFilter('date', patch)} />
    </ListPage>
  )
}
