const STATUS_MAP = {
  PENDING:            'badge-yellow',
  ACCEPTED:           'badge-green',
  REJECTED:           'badge-red',
  CANCELLED:          'badge-gray',
  TRANSPORT_ASSIGNED: 'badge-blue',
  PICKED_UP:          'badge-blue',
  IN_TRANSIT:         'badge-blue',
  DELIVERED:          'badge-green',
  COMPLETED:          'badge-green',
  AVAILABLE:          'badge-green',
  SOLD_OUT:           'badge-red',
  INACTIVE:           'badge-gray',
  FARMER:             'badge-green',
  BUYER:              'badge-blue',
  TRANSPORTER:        'badge-yellow',
  ADMIN:              'badge-red',
  ACTIVE:             'badge-green',
  DISABLED:           'badge-red',
  PAID:               'badge-green',
  FAILED:             'badge-red',
}

export default function StatusBadge({ status }) {
  const cls = STATUS_MAP[status] || 'badge-gray'
  return <span className={cls}>{status?.replace(/_/g, ' ')}</span>
}
