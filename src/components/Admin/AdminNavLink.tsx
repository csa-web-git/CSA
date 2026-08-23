export function AdminNavCreerActivites() {
  return (
    <div style={{ padding: '8px 16px' }}>
      <a
        href="/admin/creer-plusieurs-activites"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--theme-text, #fff)',
          textDecoration: 'none',
          background: 'rgba(255,255,255,0.08)',
        }}
      >
        📅 Créer plusieurs activités
      </a>
    </div>
  )
}