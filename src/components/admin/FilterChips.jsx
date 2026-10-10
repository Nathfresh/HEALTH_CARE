import React from 'react'

/**
 * Row of removable chips for every active filter + a "Clear all" action.
 * `chips` comes from useSearchFilter().activeChips.
 */
export default function FilterChips({ chips, onRemove, onClearAll, search, onClearSearch }) {
  const hasSearch = Boolean(search && search.trim())
  if (chips.length === 0 && !hasSearch) return null

  return (
    <div className="chips" role="status" aria-label="Active search and filters">
      {hasSearch && (
        <span className="chip chip--search">
          Search: “{search.trim()}”
          <button type="button" onClick={onClearSearch} aria-label="Clear search">
            ✕
          </button>
        </span>
      )}
      {chips.map((chip) => (
        <span key={chip.key} className="chip">
          <strong>{chip.label}:</strong> {chip.display}
          <button type="button" onClick={() => onRemove(chip.key)} aria-label={`Clear ${chip.label} filter`}>
            ✕
          </button>
        </span>
      ))}
      <button type="button" className="chips__clear" onClick={onClearAll}>
        Clear all
      </button>
    </div>
  )
}
