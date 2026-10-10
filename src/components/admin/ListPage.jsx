import React, { useState } from 'react'
import SearchBar from './SearchBar'
import FilterChips from './FilterChips'
import DataTable from './DataTable'
import Pagination from './Pagination'
import { exportCsv } from '../../utils/csv'

/**
 * Shared scaffolding for every admin list page:
 *   ┌ toolbar: [ search ] [ filters toggle (n) ] [ export CSV ] ┐
 *   │ collapsible filter panel (children slot)                  │
 *   │ active filter chips                                       │
 *   │ sortable data table                                       │
 *   └ pagination                                                ┘
 *
 * `q` is the single useSearchFilter() instance returned by the hook.
 */
export default function ListPage({
  q,
  columns,
  rows,
  children,               // filter controls
  exportName = 'export.csv',
  emptyMessage = 'No records match your search or filters.',
  keyField = 'id',
  searchPlaceholder,
}) {
  const [showFilters, setShowFilters] = useState(false)

  const handleExport = () =>
    exportCsv(exportName, columns.filter((c) => !c.noCsv), q.rows)

  return (
    <section className="card listpage">
      <div className="listpage__toolbar">
        <SearchBar
          value={q.searchInput}
          onChange={q.setSearch}
          placeholder={searchPlaceholder}
          total={q.total}
          shown={q.rows.length}
        />
        <div className="listpage__toolbar-actions">
          <button
            type="button"
            className={`btn btn--ghost ${showFilters ? 'is-open' : ''}`}
            onClick={() => setShowFilters((s) => !s)}
            aria-expanded={showFilters}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 6h16M7 12h10m-7 6h4" />
            </svg>
            Filters
            {q.activeFilterCount > 0 && <span className="btn__count">{q.activeFilterCount}</span>}
          </button>
          <button type="button" className="btn btn--ghost" onClick={handleExport} title="Export filtered rows to CSV">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {showFilters && <div className="filter-panel">{children}</div>}

      <FilterChips
        chips={q.activeChips}
        search={q.search}
        onRemove={q.removeFilter}
        onClearSearch={() => q.setSearch('')}
        onClearAll={() => {
          q.resetFilters()
          q.setSearch('')
        }}
      />

      <DataTable
        columns={columns}
        rows={rows}
        sort={q.sort}
        onToggleSort={q.toggleSort}
        keyField={keyField}
        emptyMessage={emptyMessage}
      />

      <Pagination
        page={q.page}
        totalPages={q.totalPages}
        total={q.total}
        pageSize={q.pageSize}
        onPage={q.setPage}
        onPageSize={q.setPageSize}
      />
    </section>
  )
}
