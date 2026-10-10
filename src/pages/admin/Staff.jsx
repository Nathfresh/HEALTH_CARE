import React from 'react'
import { useSearchParams } from 'react-router-dom'
import ListPage from '../../components/admin/ListPage'
import StatusBadge from '../../components/admin/StatusBadge'
import { FilterSelect, DateRangeFilter } from '../../components/admin/Filters'
import { useSearchFilter } from '../../hooks/useSearchFilter'
import { staff, DEPARTMENTS } from '../../data/mockData'
import { formatDate } from '../../utils/format'

const ROLES = ['Administrator', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician', 'Accountant']

export default function Staff() {
  const [params] = useSearchParams()

  const q = useSearchFilter(staff, {
    // ── Free-text search: name, staff ID, email, phone ────────────────────
    searchFields: ['name', 'id', 'email', 'phone'],
    initialSearch: params.get('q') ?? '',
    // ── Filters ────────────────────────────────────────────────────────────
    defaultFilters: {
      role: 'all',
      department: 'all',
      status: 'all',
      joined: {},
    },
    filterLabels: {
      role: 'Role',
      department: 'Department',
      status: 'Status',
      joined: 'Joined',
    },
    predicates: {
      role: (s, v) => s.role === v,
      department: (s, v) => s.department === v,
      status: (s, v) => s.status === v,
      joined: (s, { from, to }) => (!from || s.joinDate >= from) && (!to || s.joinDate <= to),
    },
    defaultSort: { key: 'name', dir: 'asc' },
    pageSize: 10,
  })

  const columns = [
    { key: 'id', label: 'Staff ID', sortable: true },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (s) => (
        <div>
          <div className="cell-strong">{s.name}</div>
          <div className="cell-sub">{s.email}</div>
        </div>
      ),
    },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'joinDate', label: 'Joined', sortable: true, render: (s) => formatDate(s.joinDate), csv: (s) => s.joinDate },
    { key: 'status', label: 'Status', render: (s) => <StatusBadge status={s.status} />, csv: (s) => s.status },
  ]

  return (
    <ListPage
      q={q}
      columns={columns}
      rows={q.rows}
      exportName="staff.csv"
      searchPlaceholder="Search by name, staff ID, email or phone…"
    >
      <FilterSelect label="Role" value={q.filters.role} onChange={(v) => q.setFilter('role', v)} options={ROLES} />
      <FilterSelect label="Department" value={q.filters.department} onChange={(v) => q.setFilter('department', v)} options={DEPARTMENTS} />
      <FilterSelect label="Status" value={q.filters.status} onChange={(v) => q.setFilter('status', v)} options={['Active', 'On Leave', 'Inactive']} />
      <DateRangeFilter label="Joined Between" value={q.filters.joined} onPatch={(patch) => q.patchFilter('joined', patch)} />
    </ListPage>
  )
}
