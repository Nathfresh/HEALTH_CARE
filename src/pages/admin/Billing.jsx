import React from 'react'
import { useSearchParams } from 'react-router-dom'
import ListPage from '../../components/admin/ListPage'
import StatusBadge from '../../components/admin/StatusBadge'
import { FilterSelect, DateRangeFilter, NumberRangeFilter } from '../../components/admin/Filters'
import { useSearchFilter } from '../../hooks/useSearchFilter'
import { invoices } from '../../data/mockData'
import { formatNaira } from '../../utils/query'
import { formatDate } from '../../utils/format'

export default function Billing() {
  const [params] = useSearchParams()

  const q = useSearchFilter(invoices, {
    // ── Free-text search: invoice ID, patient, description ────────────────
    searchFields: ['id', 'patientName', 'description'],
    initialSearch: params.get('q') ?? '',
    // ── Filters ────────────────────────────────────────────────────────────
    defaultFilters: {
      status: 'all',
      method: 'all',
      issued: {},
      amount: {},
    },
    filterLabels: {
      status: 'Payment Status',
      method: 'Payment Method',
      issued: 'Issue Date',
      amount: 'Amount (₦)',
    },
    predicates: {
      status: (inv, v) => inv.status === v,
      method: (inv, v) => inv.method === v,
      issued: (inv, { from, to }) => (!from || inv.issueDate >= from) && (!to || inv.issueDate <= to),
      amount: (inv, { min, max }) => (min == null || min === '' || inv.amount >= min) && (max == null || max === '' || inv.amount <= max),
    },
    defaultSort: { key: 'issueDate', dir: 'desc' },
    pageSize: 10,
  })

  // Headline totals over the FILTERED set (react to search + filters).
  const filteredTotal = q.rows.reduce((s, i) => s + i.amount, 0)
  const outstanding = q.rows.filter((i) => i.status === 'Pending' || i.status === 'Overdue' || i.status === 'Partially Paid').reduce((s, i) => s + i.amount, 0)

  const columns = [
    { key: 'id', label: 'Invoice #', sortable: true },
    { key: 'patientName', label: 'Patient', sortable: true, render: (i) => <div className="cell-strong">{i.patientName}</div> },
    { key: 'description', label: 'Description' },
    { key: 'issueDate', label: 'Issued', sortable: true, render: (i) => formatDate(i.issueDate), csv: (i) => i.issueDate },
    { key: 'dueDate', label: 'Due', render: (i) => formatDate(i.dueDate), csv: (i) => i.dueDate },
    { key: 'amount', label: 'Amount', sortable: true, className: 'cell-num', render: (i) => formatNaira(i.amount), csv: (i) => i.amount },
    { key: 'method', label: 'Method' },
    { key: 'status', label: 'Status', render: (i) => <StatusBadge status={i.status} />, csv: (i) => i.status },
  ]

  return (
    <>
      <div className="stat-row stat-row--two">
        <div className="stat-card">
          <div className="stat-card__label">Filtered billings</div>
          <div className="stat-card__value">{q.total}</div>
          <div className="stat-card__sub">total value {formatNaira(filteredTotal)}</div>
        </div>
        <div className="stat-card stat-card--warn">
          <div className="stat-card__label">Outstanding in view</div>
          <div className="stat-card__value">{formatNaira(outstanding)}</div>
          <div className="stat-card__sub">pending + overdue + partially paid</div>
        </div>
      </div>

      <ListPage
        q={q}
        columns={columns}
        rows={q.rows}
        exportName="billing.csv"
        searchPlaceholder="Search by invoice #, patient or description…"
      >
        <FilterSelect label="Payment Status" value={q.filters.status} onChange={(v) => q.setFilter('status', v)} options={['Paid', 'Pending', 'Overdue', 'Partially Paid', 'Refunded']} />
        <FilterSelect label="Payment Method" value={q.filters.method} onChange={(v) => q.setFilter('method', v)} options={['Card', 'Cash', 'Insurance', 'Bank Transfer']} allLabel="Any method" />
        <NumberRangeFilter label="Amount Range (₦)" value={q.filters.amount} onPatch={(patch) => q.patchFilter('amount', patch)} step={500} />
        <DateRangeFilter label="Issued Between" value={q.filters.issued} onPatch={(patch) => q.patchFilter('issued', patch)} />
      </ListPage>
    </>
  )
}
