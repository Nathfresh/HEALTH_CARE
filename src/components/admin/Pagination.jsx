import React from 'react'

/** Classic pager: page-size selector, range caption and prev/next controls. */
export default function Pagination({ page, totalPages, total, pageSize, onPage, onPageSize }) {
  if (total === 0) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  return (
    <div className="pagination">
      <span className="pagination__info">
        Showing <strong>{from}–{to}</strong> of <strong>{total}</strong>
      </span>
      <div className="pagination__controls">
        <label className="pagination__size">
          Rows
          <select value={pageSize} onChange={(e) => onPageSize(Number(e.target.value))}>
            {[5, 8, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn--ghost" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          ← Prev
        </button>
        <span className="pagination__page">
          Page {page} / {totalPages}
        </span>
        <button type="button" className="btn btn--ghost" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
          Next →
        </button>
      </div>
    </div>
  )
}
