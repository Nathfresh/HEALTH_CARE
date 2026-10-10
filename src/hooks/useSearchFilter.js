import { useEffect, useMemo, useRef, useState } from 'react'
import { applyQuery, activeFilterChips, countActiveFilters, isEmptyFilterValue } from '../utils/query'

/**
 * State manager for a searchable, filterable, sortable, paginated list.
 *
 * config = {
 *   searchFields: ['name', 'id', ...],
 *   predicates:   { gender: (item, v) => ..., dateRange: (item, {from,to}) => ... },
 *   filterLabels: { gender: 'Gender' },           // human labels for chips
 *   defaultFilters: { gender: 'all', ... },       // reset() returns to these
 *   initialSearch: '',                            // e.g. from a URL query param
 *   defaultSort: { key, dir },
 *   pageSize: 8,
 * }
 */
export function useSearchFilter(items, config = {}) {
  const {
    searchFields = [],
    predicates = {},
    filterLabels = {},
    defaultFilters = {},
    initialSearch = '',
    defaultSort = null,
    pageSize = 8,
  } = config

  const [searchInput, setSearchInput] = useState(initialSearch) // raw input (debounced below)
  const [search, setSearch] = useState(initialSearch)           // applied term
  const [filters, setFilters] = useState(defaultFilters)
  const [sort, setSort] = useState(defaultSort)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(pageSize)

  // Debounce typing → applied search term (250 ms).
  const debounceRef = useRef(null)
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(debounceRef.current)
  }, [searchInput])

  const result = useMemo(
    () => applyQuery(items, { search, searchFields, filters, predicates, sort, page, pageSize: size }),
    [items, search, searchFields, filters, predicates, sort, page, size],
  )

  // Any change to search/filters/sort jumps back to page 1.
  useEffect(() => {
    setPage(1)
  }, [search, filters, sort])

  const setFilter = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value }))

  const patchFilters = (key, patch) =>
    setFilters((f) => ({ ...f, [key]: { ...(f[key] || {}), ...patch } }))

  const removeFilter = (key) =>
    setFilters((f) => ({ ...f, [key]: defaultFilters[key] ?? (typeof f[key] === 'object' && !Array.isArray(f[key]) ? {} : 'all') }))

  const resetFilters = () => setFilters(defaultFilters)

  const toggleSort = (key) =>
    setSort((s) =>
      !s || s.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null,
    )

  return {
    // state
    searchInput,
    search,
    filters,
    sort,
    page,
    pageSize: size,
    // results
    ...result,
    // derived
    activeChips: activeFilterChips(filters, filterLabels),
    activeFilterCount: countActiveFilters(filters),
    hasSearch: search.trim().length > 0,
    // actions
    setSearch: setSearchInput,
    setFilter,
    patchFilter,
    removeFilter,
    resetFilters,
    setSort,
    toggleSort,
    setPage,
    setPageSize: setSize,
    isFilterValueActive: (key) => !isEmptyFilterValue(filters[key]),
  }
}
