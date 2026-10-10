# HEALTH_CARE — MediCare Admin Console

Admin dashboard for a health-care management system (capstone project).
Built with **React 18 + Vite**, using a mock data layer shaped to mirror a real
REST API contract.

## Quick start

```bash
npm install
npm run dev        # dev server on http://localhost:5173
npm run build      # production build to dist/
```

## Modules

| Route | Module |
| --- | --- |
| `#/` | Dashboard (KPIs, today's appointments with status tabs, stock alerts) |
| `#/patients` | Patients |
| `#/doctors` | Doctors |
| `#/appointments` | Appointments |
| `#/billing` | Billing & invoices |
| `#/pharmacy` | Pharmacy & inventory |
| `#/staff` | Staff management |

Every module ships a full admin search & filter stack: debounced free-text
search, collapsible filter panel (selects, date ranges, numeric ranges),
removable active-filter chips, sortable columns, pagination with row-size
selector, CSV export of the filtered set, plus a global cross-entity search in
the header. See [`docs/ADMIN_SEARCH_FILTER_SPEC.md`](docs/ADMIN_SEARCH_FILTER_SPEC.md)
for the complete feature inventory.

## Structure

```
src/
  components/admin/   SearchBar, Filters, FilterChips, DataTable, Pagination,
                      StatusBadge, ListPage scaffold, Sidebar, Header
  data/mockData.js    seeded demo data (patients, doctors, appointments,
                      invoices, medications, staff)
  hooks/useSearchFilter.js   search/filter/sort/paginate state hook
  pages/admin/        one page per module
  utils/query.js      pure query engine (search → filter → sort → paginate)
  utils/csv.js        CSV export of filtered rows
```
