// Export the currently FILTERED rows to a CSV download (admin convenience).
export function exportCsv(filename, columns, rows) {
  const escape = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const header = columns.map((c) => escape(c.label)).join(',')
  const body = rows.map((row) =>
    columns
      .map((c) => escape(c.csv ? c.csv(row) : row[c.key]))
      .join(','),
  )
  const blob = new Blob([`${header}\n${body.join('\n')}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
