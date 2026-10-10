import React from 'react'

/** Labeled select used as a single-value filter. */
export function FilterSelect({ label, value, onChange, options, allLabel = 'All' }) {
  return (
    <label className="filter-control">
      <span className="filter-control__label">{label}</span>
      <select className="filter-control__select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="all">{allLabel}</option>
        {options.map((o) => {
          const val = typeof o === 'object' ? o.value : o
          const text = typeof o === 'object' ? o.label : o
          return (
            <option key={val} value={val}>
              {text}
            </option>
          )
        })}
      </select>
    </label>
  )
}

/** Pair of date inputs (from/to) used as a range filter. */
export function DateRangeFilter({ label, value = {}, onPatch }) {
  return (
    <div className="filter-control">
      <span className="filter-control__label">{label}</span>
      <div className="filter-control__dates">
        <input
          type="date"
          aria-label={`${label} from`}
          value={value.from || ''}
          max={value.to || undefined}
          onChange={(e) => onPatch({ from: e.target.value })}
        />
        <span className="filter-control__sep">→</span>
        <input
          type="date"
          aria-label={`${label} to`}
          value={value.to || ''}
          min={value.from || undefined}
          onChange={(e) => onPatch({ to: e.target.value })}
        />
      </div>
    </div>
  )
}

/** Pair of number inputs (min/max) used as a numeric range filter. */
export function NumberRangeFilter({ label, value = {}, onPatch, placeholderFrom = 'Min', placeholderTo = 'Max', step = 1 }) {
  return (
    <div className="filter-control">
      <span className="filter-control__label">{label}</span>
      <div className="filter-control__dates">
        <input
          type="number"
          min="0"
          step={step}
          aria-label={`${label} minimum`}
          placeholder={placeholderFrom}
          value={value.min ?? ''}
          onChange={(e) => onPatch({ min: e.target.value === '' ? '' : Number(e.target.value) })}
        />
        <span className="filter-control__sep">–</span>
        <input
          type="number"
          min="0"
          step={step}
          aria-label={`${label} maximum`}
          placeholder={placeholderTo}
          value={value.max ?? ''}
          onChange={(e) => onPatch({ max: e.target.value === '' ? '' : Number(e.target.value) })}
        />
      </div>
    </div>
  )
}
