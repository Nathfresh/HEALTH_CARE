import React from 'react'
import { useSearchParams } from 'react-router-dom'
import ListPage from '../../components/admin/ListPage'
import StatusBadge from '../../components/admin/StatusBadge'
import { FilterSelect, DateRangeFilter, NumberRangeFilter } from '../../components/admin/Filters'
import { useSearchFilter } from '../../hooks/useSearchFilter'
import { patients, doctors, doctorById } from '../../data/mockData'
import { formatDate } from '../../utils/format'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function Patients() {
  const [params] = useSearchParams()

  const q = useSearchFilter(patients, {
    // ── Free-text search: name, patient ID, email, phone, city ────────────
    searchFields: ['name', 'id', 'email', 'phone', 'city'],
    initialSearch: params.get('q') ?? '',
    // ── Filters ────────────────────────────────────────────────────────────
    defaultFilters: {
      status: 'all',
      gender: 'all',
      bloodGroup: 'all',
      doctorId: 'all',
      age: {},
      registered: {},
    },
    filterLabels: {
      status: 'Status',
      gender: 'Gender',
      bloodGroup: 'Blood Group',
      doctorId: 'Assigned Doctor',
      age: 'Age Range',
      registered: 'Registered',
    },
    predicates: {
      status: (p, v) => p.status === v,
      gender: (p, v) => p.gender === v,
      bloodGroup: (p, v) => p.bloodGroup === v,
      doctorId: (p, v) => p.doctorId === v,
      age: (p, { min, max }) => (min == null || min === '' || p.age >= min) && (max == null || max === '' || p.age <= max),
      registered: (p, { from, to }) => (!from || p.registeredDate >= from) && (!to || p.registeredDate <= to),
    },
    defaultSort: { key: 'name', dir: 'asc' },
    pageSize: 8,
  })

  const columns = [
    { key: 'id', label: 'Patient ID', sortable: true },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (p) => (
        <div>
          <div className="cell-strong">{p.name}</div>
          <div className="cell-sub">{p.city}</div>
        </div>
      ),
    },
    { key: 'gender', label: 'Gender' },
    { key: 'age', label: 'Age', sortable: true },
    { key: 'bloodGroup', label: 'Blood' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'doctorId',
      label: 'Assigned Doctor',
      render: (p) => doctorById[p.doctorId]?.name ?? '—',
      noCsv: true,
    },
    { key: 'registeredDate', label: 'Registered', sortable: true, render: (p) => formatDate(p.registeredDate), csv: (p) => p.registeredDate },
    { key: 'lastVisit', label: 'Last Visit', sortable: true, render: (p) => formatDate(p.lastVisit), csv: (p) => p.lastVisit },
    { key: 'status', label: 'Status', render: (p) => <StatusBadge status={p.status} />, csv: (p) => p.status },
  ]

  return (
    <ListPage
      q={q}
      columns={columns}
      rows={q.rows}
      exportName="patients.csv"
      searchPlaceholder="Search by name, ID, email, phone or city…"
    >
      <FilterSelect label="Status" value={q.filters.status} onChange={(v) => q.setFilter('status', v)} options={['Admitted', 'Outpatient', 'Discharged', 'Critical']} />
      <FilterSelect label="Gender" value={q.filters.gender} onChange={(v) => q.setFilter('gender', v)} options={['Male', 'Female']} />
      <FilterSelect label="Blood Group" value={q.filters.bloodGroup} onChange={(v) => q.setFilter('bloodGroup', v)} options={BLOOD_GROUPS} />
      <FilterSelect
        label="Assigned Doctor"
        value={q.filters.doctorId}
        onChange={(v) => q.setFilter('doctorId', v)}
        options={doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.specialty})` }))}
        allLabel="Any doctor"
      />
      <NumberRangeFilter label="Age Range" value={q.filters.age} onPatch={(patch) => q.patchFilter('age', patch)} />
      <DateRangeFilter label="Registered Between" value={q.filters.registered} onPatch={(patch) => q.patchFilter('registered', patch)} />
    </ListPage>
  )
}
