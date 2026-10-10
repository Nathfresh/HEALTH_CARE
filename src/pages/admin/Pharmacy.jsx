import React from 'react'
import { useSearchParams } from 'react-router-dom'
import ListPage from '../../components/admin/ListPage'
import StatusBadge from '../../components/admin/StatusBadge'
import { FilterSelect, DateRangeFilter } from '../../components/admin/Filters'
import { useSearchFilter } from '../../hooks/useSearchFilter'
import { medications } from '../../data/mockData'
import { formatNaira } from '../../utils/query'
import { formatDate, daysUntil } from '../../utils/format'

export default function Pharmacy() {
  const [params] = useSearchParams()

  const q = useSearchFilter(medications, {
    // ── Free-text search: drug name, category, SKU, supplier ──────────────
    searchFields: ['name', 'category', 'sku', 'supplier'],
    initialSearch: params.get('q') ?? '',
    // ── Filters ────────────────────────────────────────────────────────────
    defaultFilters: {
      category: 'all',
      stockStatus: 'all',
      expiringSoon: 'all',
      expiry: {},
    },
    filterLabels: {
      category: 'Category',
      stockStatus: 'Stock Status',
      expiringSoon: 'Expiry Risk',
      expiry: 'Expiry Date',
    },
    predicates: {
      category: (m, v) => m.category === v,
      stockStatus: (m, v) => m.stockStatus === v,
      expiringSoon: (m, v) => {
        const days = daysUntil(m.expiry)
        if (v === 'expired') return days < 0
        if (v === '90') return days >= 0 && days <= 90
        if (v === 'ok') return days > 90
        return true
      },
      expiry: (m, { from, to }) => (!from || m.expiry >= from) && (!to || m.expiry <= to),
    },
    defaultSort: { key: 'name', dir: 'asc' },
    pageSize: 10,
  })

  const columns = [
    { key: 'sku', label: 'SKU', sortable: true },
    {
      key: 'name',
      label: 'Medication',
      sortable: true,
      render: (m) => (
        <div>
          <div className="cell-strong">{m.name}</div>
          <div className="cell-sub">{m.supplier}</div>
        </div>
      ),
    },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      className: 'cell-num',
      render: (m) => (
        <span className={m.stockStatus === 'Low Stock' ? 'text-warn' : m.stockStatus === 'Out of Stock' ? 'text-danger' : ''}>
          {m.stock} <span className="cell-sub">/ reorder at {m.reorderLevel}</span>
        </span>
      ),
    },
    { key: 'unitPrice', label: 'Unit Price', sortable: true, className: 'cell-num', render: (m) => formatNaira(m.unitPrice), csv: (m) => m.unitPrice },
    {
      key: 'expiry',
      label: 'Expiry',
      sortable: true,
      render: (m) => {
        const d = daysUntil(m.expiry)
        const tone = d < 0 ? 'text-danger' : d <= 90 ? 'text-warn' : ''
        return (
          <span className={tone}>
            {formatDate(m.expiry)}
            {d < 0 && <span className="cell-sub"> · expired</span>}
            {d >= 0 && d <= 90 && <span className="cell-sub"> · {d}d left</span>}
          </span>
        )
      },
      csv: (m) => m.expiry,
    },
    { key: 'stockStatus', label: 'Status', render: (m) => <StatusBadge status={m.stockStatus} />, csv: (m) => m.stockStatus },
  ]

  return (
    <ListPage
      q={q}
      columns={columns}
      rows={q.rows}
      exportName="pharmacy.csv"
      searchPlaceholder="Search by drug name, category, SKU or supplier…"
    >
      <FilterSelect
        label="Category"
        value={q.filters.category}
        onChange={(v) => q.setFilter('category', v)}
        options={['Analgesic', 'Antibiotic', 'Antihistamine', 'Antimalarial', 'Cardiovascular', 'Diabetes', 'Respiratory', 'Supplement']}
      />
      <FilterSelect label="Stock Status" value={q.filters.stockStatus} onChange={(v) => q.setFilter('stockStatus', v)} options={['In Stock', 'Low Stock', 'Out of Stock']} />
      <FilterSelect
        label="Expiry Risk"
        value={q.filters.expiringSoon}
        onChange={(v) => q.setFilter('expiringSoon', v)}
        options={[
          { value: 'expired', label: 'Already expired' },
          { value: '90', label: 'Expires ≤ 90 days' },
          { value: 'ok', label: 'Expires > 90 days' },
        ]}
        allLabel="Any expiry"
      />
      <DateRangeFilter label="Expiry Between" value={q.filters.expiry} onPatch={(patch) => q.patchFilter('expiry', patch)} />
    </ListPage>
  )
}
