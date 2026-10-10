# Admin Search & Filter — Feature Specification

> **Note on source:** the Figma file (`Capstone-project`, node 1698-1257) is not
> publicly accessible without a Figma login, so this spec implements the complete
> set of search & filter features standard to a health-care admin console.
> Every feature below is isolated behind one engine (`src/utils/query.js` +
> `src/hooks/useSearchFilter.js`), so aligning labels/options with the exact
> Figma frames later is a per-page config change, not a rewrite.

## 0. Shared engine (all pages)

| Feature | Detail |
| --- | --- |
| Free-text search | Debounced (250 ms), multi-field, case/diacritic-insensitive matching; live “x of y results” count |
| Filter panel | Collapsible; shows an active-filter count badge on the toggle button |
| Active filter chips | One removable chip per active filter + search chip + “Clear all” |
| Column sorting | Click header to cycle asc → desc → off; `aria-sort` exposed |
| Pagination | Prev/next, “Showing a–b of n”, rows-per-page selector (5/8/10/20/50) |
| CSV export | Exports the **currently filtered** rows |
| Deep links | Global search navigates to `/module?q=term` so a search can be shared/bookmarked |

## 1. Global search (header, every screen)

- One box searching **Patients, Doctors, Appointments, Pharmacy** simultaneously.
- Grouped dropdown (max 4 per group), opens on focus, closes on outside click / Escape.
- Selecting a result → routes to that module with the term pre-filled.
- Per-group “Search all …” action.

## 2. Patients (`#/patients`)

- **Search fields:** name, patient ID, email, phone, city.
- **Filters:**
  - Status — Admitted / Outpatient / Discharged / Critical
  - Gender — Male / Female
  - Blood group — A±, B±, AB±, O±
  - Assigned doctor — dropdown of all doctors
  - Age range — min/max numeric
  - Registered between — date range (from/to, cross-validated)
- **Sortable:** ID, name, age, registered date, last visit.

## 3. Doctors (`#/doctors`)

- **Search fields:** name, specialty/department, doctor ID, email.
- **Filters:**
  - Department — 8 clinical departments
  - Status — Available / With Patient / In Surgery / On Leave
  - Gender
  - Experience — years min/max range
  - Minimum rating — 3.0★ / 3.5★ / 4.0★ / 4.5★ & up
- **Sortable:** ID, name, specialty, experience, patient load, rating.

## 4. Appointments (`#/appointments`)

- **Search fields:** patient name, doctor name, appointment ID, reason.
- **Filters:**
  - Status — Scheduled / In Progress / Completed / Cancelled / No-Show
  - Type — In-Person / Telehealth / Follow-Up / Emergency
  - Department
  - Doctor
  - Date range + **quick presets**: Today · Next 7 days · Past 60 days
- **Sortable:** ID, patient, doctor, date/time.

## 5. Billing (`#/billing`)

- **Search fields:** invoice number, patient name, description.
- **Filters:**
  - Payment status — Paid / Pending / Overdue / Partially Paid / Refunded
  - Payment method — Card / Cash / Insurance / Bank Transfer
  - Amount range — ₦ min/max
  - Issued between — date range
- **Reactive summary cards:** filtered billing count/value + outstanding amount
  (pending + overdue + partial) computed over the filtered set.
- **Sortable:** invoice #, patient, issue date, amount.

## 6. Pharmacy / Inventory (`#/pharmacy`)

- **Search fields:** drug name, category, SKU, supplier.
- **Filters:**
  - Category — Analgesic, Antibiotic, Antihistamine, Antimalarial, Cardiovascular, Diabetes, Respiratory, Supplement
  - Stock status — In Stock / Low Stock (≤ reorder level) / Out of Stock
  - Expiry risk — already expired · expires ≤ 90 days · expires > 90 days
  - Expiry between — date range
- **Sortable:** SKU, name, category, stock, unit price, expiry.

## 7. Staff (`#/staff`)

- **Search fields:** name, staff ID, email, phone.
- **Filters:**
  - Role — Administrator, Doctor, Nurse, Receptionist, Pharmacist, Lab Technician, Accountant
  - Department
  - Status — Active / On Leave / Inactive
  - Joined between — date range
- **Sortable:** ID, name, role, department, join date.

## 8. Dashboard (`#/`)

- KPI cards linking into each module’s search/filter workspace.
- Today’s appointments with **status quick-filter tabs** (All/Scheduled/In Progress/Completed/Cancelled/No-Show).
- Stock-alert feed (low/out-of-stock).

## Architecture

```
src/utils/query.js          → applyQuery(): search → filters → sort → paginate (pure, backend-shaped)
src/hooks/useSearchFilter.js → per-page state (debounce, chips, reset, page-size)
src/components/admin/*      → SearchBar, Filters (select/date-range/number-range),
                               FilterChips, DataTable, Pagination, ListPage scaffold
src/pages/admin/*           → each page declares searchFields + predicates + filter UI
```

Swap the mock data import in each page for an API call that accepts the same
`{ search, filters, sort, page, pageSize }` payload and no UI code changes.
