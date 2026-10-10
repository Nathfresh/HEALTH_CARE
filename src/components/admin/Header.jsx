import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { patients, doctors, appointments, medications } from '../../data/mockData'
import { normalize } from '../../utils/query'

/**
 * Global admin search — one box that searches across Patients, Doctors,
 * Appointments and Pharmacy, grouped by entity. Picking a result routes to
 * that module with the term pre-filled (`/patients?q=…`).
 */
export default function Header({ title }) {
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const navigate = useNavigate()

  const groups = useMemo(() => {
    const q = normalize(term)
    if (q.length < 2) return []
    const cap = 4
    return [
      {
        label: 'Patients',
        route: '/patients',
        items: patients.filter((p) => `${p.name} ${p.id} ${p.phone}`.toLowerCase().includes(q)).slice(0, cap),
        render: (p) => `${p.name} · ${p.id}`,
      },
      {
        label: 'Doctors',
        route: '/doctors',
        items: doctors.filter((d) => `${d.name} ${d.specialty} ${d.id}`.toLowerCase().includes(q)).slice(0, cap),
        render: (d) => `${d.name} · ${d.specialty}`,
      },
      {
        label: 'Appointments',
        route: '/appointments',
        items: appointments.filter((a) => `${a.patientName} ${a.doctorName} ${a.id}`.toLowerCase().includes(q)).slice(0, cap),
        render: (a) => `${a.id} · ${a.patientName} → ${a.doctorName}`,
      },
      {
        label: 'Pharmacy',
        route: '/pharmacy',
        items: medications.filter((m) => `${m.name} ${m.category} ${m.sku}`.toLowerCase().includes(q)).slice(0, cap),
        render: (m) => `${m.name} · ${m.sku}`,
      },
    ].filter((g) => g.items.length > 0)
  }, [term])

  // Close the dropdown on outside click / Escape.
  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const go = (route, q) => {
    setOpen(false)
    setTerm('')
    navigate(`${route}?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="header">
      <h1 className="header__title">{title}</h1>

      <div className="globalsearch" ref={boxRef}>
        <svg className="globalsearch__icon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.8-3.8" strokeLinecap="round" />
        </svg>
        <input
          className="globalsearch__input"
          placeholder="Global search — patients, doctors, appointments, drugs…"
          aria-label="Global search"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
        />
        {open && normalize(term).length >= 2 && (
          <div className="globalsearch__panel" role="listbox" aria-label="Global search results">
            {groups.length === 0 && <div className="globalsearch__empty">No matches for “{term.trim()}”.</div>}
            {groups.map((g) => (
              <div key={g.route} className="globalsearch__group">
                <div className="globalsearch__group-label">{g.label}</div>
                {g.items.map((item) => (
                  <button key={item.id} type="button" className="globalsearch__item" onClick={() => go(g.route, term)}>
                    {g.render(item)}
                  </button>
                ))}
                <button type="button" className="globalsearch__more" onClick={() => go(g.route, term)}>
                  Search all {g.label.toLowerCase()} for “{term.trim()}” →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <span className="header__date">
        {new Date().toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
    </header>
  )
}
