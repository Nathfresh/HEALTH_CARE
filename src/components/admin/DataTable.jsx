import React from 'react'

/**
 * Generic sortable data table.
 * columns: [{ key, label, sortable?, render?(row), className?, width? }]
 */
export default function DataTable({ columns, rows, sort, onToggleSort, keyField = 'id', emptyMessage = 'No records found.' }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => {
              const sorted = sort && sort.key === col.key
              return (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={[col.sortable ? 'sortable' : '', sorted ? 'sorted' : ''].join(' ')}
                  aria-sort={sorted ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {col.sortable ? (
                    <button type="button" className="table__sort-btn" onClick={() => onToggleSort(col.key)}>
                      {col.label}
                      <span className={`table__sort-arrow ${sorted ? `is-${sort.dir}` : ''}`}>
                        {sorted ? (sort.dir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row[keyField]}>
                {columns.map((col) => (
                  <td key={col.key} className={col.className || ''}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
