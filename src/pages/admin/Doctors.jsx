import React from 'react'
import { useSearchParams } from 'react-router-dom'
import ListPage from '../../components/admin/ListPage'
import StatusBadge from '../../components/admin/StatusBadge'
import { FilterSelect, NumberRangeFilter } from '../../components/admin/Filters'
import { useSearchFilter } from '../../hooks/useSearchFilter'
import { doctors, DEPARTMENTS } from '../../data/mockData'

const DEPTS = DEPARTMENTS

export default function Doctors() {
  const [params] = useSearchParams()

  const q = useSearchFilter(doctors, {
    // ── Free-text search: name, specialty, ID, email ──────────────────────
    searchFields: ['name', 'specialty', 'department', 'id', 'email'],
    initialSearch: params.get('q') ?? '',
    // ── Filters ────────────────────────────────────────────────────────────
    defaultFilters: {
      department: 'all',
      status: 'all',
      gender: 'all',
      experience: {},
      minRating: 'all',
    },
    filterLabels: {
      department: 'Department',
      status: 'Status',
      gender: 'Gender',
      experience: 'Experience (yrs)',
      minRating: 'Min Rating',
    },
    predicates: {
      department: (d, v) => d.department === v,
      status: (d, v) => d.status === v,
      gender: (d, v) => d.gender === v,
      experience: (d, { min, max }) => (min == null || min === '' || d.experience >= min) && (max == null || max === '' || d.experience <= max),
      minRating: (d, v) => Number(d.rating) >= Number(v),
    },
    defaultSort: { key: 'name', dir: 'asc' },
    pageSize: 8,
  })

  const columns = [
    { key: 'id', label: 'Doctor ID', sortable: true },
    {
      key: 'name',
      label: 'Doctor',
      sortable: true,
      render: (d) => (
        <div>
          <div className="cell-strong">{d.name}</div>
          <div className="cell-sub">{d.email}</div>
        </div>
      ),
    },
    { key: 'specialty', label: 'Specialty', sortable: true },
    { key: 'experience', label: 'Experience', sortable: true, render: (d) => `${d.experience} yrs` },
    { key: 'patients', label: 'Patients', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true, render: (d) => `★ ${d.rating}` },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status', render: (d) => <StatusBadge status={d.status} />, csv: (d) => d.status },
  ]

  return (
    <ListPage
      q={q}
      columns={columns}
      rows={q.rows}
      exportName="doctors.csv"
      searchPlaceholder="Search by name, specialty, ID or email…"
    >
      <FilterSelect label="Department" value={q.filters.department} onChange={(v) => q.setFilter('department', v)} options={DEPTS} />
      <FilterSelect label="Status" value={q.filters.status} onChange={(v) => q.setFilter('status', v)} options={['Available', 'With Patient', 'In Surgery', 'On Leave']} />
      <FilterSelect label="Gender" value={q.filters.gender} onChange={(v) => q.setFilter('gender', v)} options={['Male', 'Female']} />
      <NumberRangeFilter label="Experience (years)" value={q.filters.experience} onPatch={(patch) => q.patchFilter('experience', patch)} />
      <FilterSelect
        label="Minimum Rating"
        value={q.filters.minRating}
        onChange={(v) => q.setFilter('minRating', v)}
        options={[{ value: '3', label: '3.0 ★ & up' }, { value: '3.5', label: '3.5 ★ & up' }, { value: '4', label: '4.0 ★ & up' }, { value: '4.5', label: '4.5 ★ & up' }]}
        allLabel="Any rating"
      />
    </ListPage>
  )
}
