// ---------------------------------------------------------------------------
// Generic search / filter / sort / paginate engine.
// Every admin list page funnels through this, mirroring the query contract a
// REST backend would expose (?search=&status=&from=&to=&sort=&page=).
// ---------------------------------------------------------------------------

export const normalize = (v) => String(v ?? '').toLowerCase().trim()

/**
 * True when `term` matches any of `fields` on `item`.
 * Fields support nested paths ("doctor.name") and array values.
 */
export function matchesSearch(item, term, fields = []) {
  const q = normalize(term)
  if (!q) return true
  return fields.some((path) => {
    const value = path.split('.').reduce((o, k) => (o == null ? o : o[k]), item)
    if (value == null) return false
    const hay = Array.isArray(value) ? value.join(' ') : String(value)
    return hay.toLowerCase().includes(q)
  })
}

/**
 * Run the full pipeline.
 * @param items     source array
 * @param opts.search        free-text search term
 * @param opts.searchFields  list of item fields the term applies to
 * @param opts.filters       { key: value } map
 * @param opts.predicates    { key: (item, value) => boolean } — a filter is
 *                           skipped when its value is empty/"all"/null.
 * @param opts.sort          { key, dir } — null to keep source order
 * @param opts.page          1-based page number
 * @param opts.pageSize      rows per page (0 disables pagination)
 */
export function applyQuery(items, opts = {}) {
  const {
    search = '',
    searchFields = [],
    filters = {},
    predicates = {},
    sort = null,
    page = 1,
    pageSize = 0,
  } = opts

  let rows = items.filter((item) => matchesSearch(item, search, searchFields))

  for (const [key, value] of Object.entries(filters)) {
    const predicate = predicates[key]
    if (!predicate) continue
    if (isEmptyFilterValue(value)) continue
    rows = rows.filter((item) => predicate(item, value))
  }

  if (sort && sort.key) rows = sortRows(rows, sort.key, sort.dir)

  const total = rows.length
  if (pageSize > 0) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const safePage = Math.min(Math.max(1, page), totalPages)
    return {
      rows: rows.slice((safePage - 1) * pageSize, safePage * pageSize),
      total,
      page: safePage,
      totalPages,
      pageSize,
    }
  }
  return { rows, total, page: 1, totalPages: 1, pageSize: total }
}

export function isEmptyFilterValue(value) {
  if (value == null) return true
  if (value === '' || value === 'all') return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && !Array.isArray(value)) {
    return Object.values(value).every((v) => v == null || v === '')
  }
  return false
}

export function sortRows(rows, key, dir = 'asc') {
  const mul = dir === 'desc' ? -1 : 1
  return [...rows].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul
    return String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' }) * mul
  })
}

/** Count how many filters are currently active (for the chip row + badge). */
export function countActiveFilters(filters = {}) {
  return Object.values(filters).filter((v) => !isEmptyFilterValue(v)).length
}

/** Describe active filters as chips: [{ key, label, value, display }] */
export function activeFilterChips(filters = {}, labels = {}) {
  return Object.entries(filters)
    .filter(([, v]) => !isEmptyFilterValue(v))
    .map(([key, value]) => ({
      key,
      label: labels[key] || key,
      value,
      display: formatChipValue(value),
    }))
}

function formatChipValue(value) {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, v]) => v != null && v !== '')
      .map(([k, v]) => `${k}: ${v}`)
      .join(' · ')
  }
  return String(value)
}

export const formatNaira = (n) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)
