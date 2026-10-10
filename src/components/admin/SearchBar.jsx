import React from 'react'

/**
 * Debounced search box with icon, clear button and result count caption.
 * Parent owns the value via the useSearchFilter hook.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  total,
  shown,
  autoFocus = false,
}) {
  return (
    <div className="searchbar">
      <div className="searchbar__field">
        <svg className="searchbar__icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.8-3.8" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          className="searchbar__input"
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button type="button" className="searchbar__clear" onClick={() => onChange('')} aria-label="Clear search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>
      {typeof total === 'number' && (
        <span className="searchbar__count">
          {shown} of {total} result{total === 1 ? '' : 's'}
        </span>
      )}
    </div>
  )
}
