import React from 'react'

// Status → tone map covering every entity status used across admin pages.
const TONES = {
  // appointments
  Scheduled: 'info',
  'In Progress': 'accent',
  Completed: 'success',
  Cancelled: 'neutral',
  'No-Show': 'warning',
  // patients
  Admitted: 'accent',
  Outpatient: 'info',
  Discharged: 'neutral',
  Critical: 'danger',
  // doctors
  Available: 'success',
  'With Patient': 'accent',
  'In Surgery': 'warning',
  'On Leave': 'neutral',
  // billing
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'danger',
  'Partially Paid': 'info',
  Refunded: 'neutral',
  // pharmacy
  'In Stock': 'success',
  'Low Stock': 'warning',
  'Out of Stock': 'danger',
  // staff
  Active: 'success',
  Inactive: 'neutral',
}

export default function StatusBadge({ status }) {
  const tone = TONES[status] || 'neutral'
  return <span className={`badge badge--${tone}`}>{status}</span>
}
