'use client'

import { useState, useEffect } from 'react'

type Category = { id: string; nom: string; couleur?: string }
type ResultEntry = { date: string; ok: boolean; titre?: string; error?: string }

const input: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #555',
  borderRadius: 6,
  fontSize: 14,
  boxSizing: 'border-box',
  background: '#1a1a1a',
  color: '#ffffff',
}

const label: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  marginBottom: 4,
  fontSize: 13,
  color: '#ffffff',
}

const fieldWrap: React.CSSProperties = { marginBottom: 16 }

const sectionStyle: React.CSSProperties = {
  background: '#2a2a2a',
  borderRadius: 8,
  padding: 20,
  marginBottom: 24,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  marginBottom: 16,
  color: '#ffffff',
}

const btn = (variant: 'primary' | 'secondary' | 'danger' = 'primary'): React.CSSProperties => ({
  padding: '8px 16px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 13,
  background: variant === 'primary' ? '#4a9eff' : variant === 'danger' ? '#d32f2f' : '#444',
  color: '#ffffff',
})

export default function CreerPlusieursActivites() {
  const [categories, setCategories] = useState<Category[]>([])
  const [dates, setDates] = useState<string[]>([''])
  const [form, setForm] = useState({
    titre: '',
    heureDebut: '',
    heureFin: '',
    lieu: '',
    organisateurs: '',
    descriptionCourte: '',
    categorie: '',
    afficherActivitePonctuelle: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [results, setResults] = useState<ResultEntry[]>([])

  useEffect(() => {
    fetch('/api/categories?limit=50')
      .then((r) => r.json())
      .then((data) => setCategories(data.docs ?? []))
      .catch(() => {})
  }, [])

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }))

  const addDate = () => setDates((d) => [...d, ''])
  const removeDate = (i: number) => setDates((d) => d.filter((_, idx) => idx !== i))
  const updateDate = (i: number, val: string) =>
    setDates((d) => d.map((v, idx) => (idx === i ? val : v)))

  const validDates = dates.filter((d) => d.trim() !== '')

  async function handleSubmit() {
    if (!form.titre || !form.heureDebut || !form.heureFin || !form.lieu || validDates.length === 0)
      return

    setStatus('loading')
    setResults([])

    const res: ResultEntry[] = []

    for (const date of validDates) {
      const heureDebut = new Date(`${date}T${form.heureDebut}:00`).toISOString()
      const heureFin = new Date(`${date}T${form.heureFin}:00`).toISOString()

      try {
        const r = await fetch('/api/activites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titre: form.titre,
            date: new Date(date).toISOString(),
            heureDebut,
            heureFin,
            lieu: form.lieu,
            organisateurs: form.organisateurs || undefined,
            descriptionCourte: form.descriptionCourte || undefined,
            ...(form.categorie ? { categorie: form.categorie } : {}),
            afficherActivitePonctuelle: form.afficherActivitePonctuelle,
          }),
        })

        if (r.ok) {
          const doc = await r.json()
          res.push({ date, ok: true, titre: doc.doc?.titre })
        } else {
          const err = await r.json()
          res.push({ date, ok: false, error: err.errors?.[0]?.message ?? 'Erreur inconnue' })
        }
      } catch {
        res.push({ date, ok: false, error: 'Erreur réseau' })
      }
    }

    setResults(res)
    setStatus('done')
  }

  const canSubmit =
    form.titre && form.heureDebut && form.heureFin && form.lieu && validDates.length > 0

  return (
    <div style={{ padding: 32, maxWidth: 700, color: '#ffffff' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: '#ffffff' }}>
        Créer plusieurs activités
      </h1>
      <p style={{ color: '#aaa', marginBottom: 28, fontSize: 14 }}>
        Remplis les informations communes, puis ajoute toutes les dates voulues. Une activité
        distincte sera créée pour chaque date.
      </p>

      {/* ── Champs communs ── */}
      <div style={sectionStyle}>
        <h2 style={sectionTitle}>Informations communes</h2>

        <div style={fieldWrap}>
          <label style={label}>Titre *</label>
          <input style={input} value={form.titre} onChange={(e) => set('titre', e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={label}>Heure de début *</label>
            <input
              type="time"
              style={input}
              value={form.heureDebut}
              onChange={(e) => set('heureDebut', e.target.value)}
            />
          </div>
          <div>
            <label style={label}>Heure de fin *</label>
            <input
              type="time"
              style={input}
              value={form.heureFin}
              onChange={(e) => set('heureFin', e.target.value)}
            />
          </div>
        </div>

        <div style={fieldWrap}>
          <label style={label}>Lieu *</label>
          <input style={input} value={form.lieu} onChange={(e) => set('lieu', e.target.value)} />
        </div>

        <div style={fieldWrap}>
          <label style={label}>Organisateurs</label>
          <input
            style={input}
            value={form.organisateurs}
            onChange={(e) => set('organisateurs', e.target.value)}
          />
        </div>

        <div style={fieldWrap}>
          <label style={label}>Description courte</label>
          <textarea
            style={{ ...input, minHeight: 72, resize: 'vertical' }}
            value={form.descriptionCourte}
            onChange={(e) => set('descriptionCourte', e.target.value)}
          />
        </div>

        <div style={fieldWrap}>
          <label style={label}>Catégorie</label>
          <select
            style={input}
            value={form.categorie}
            onChange={(e) => set('categorie', e.target.value)}
          >
            <option value="">— Aucune —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            id="afficher"
            checked={form.afficherActivitePonctuelle}
            onChange={(e) => set('afficherActivitePonctuelle', e.target.checked)}
          />
          <label htmlFor="afficher" style={{ fontSize: 13, cursor: 'pointer', color: '#fff' }}>
            Afficher sur la page Activités (coup de pub)
          </label>
        </div>
      </div>

      {/* ── Sélection des dates ── */}
      <div style={sectionStyle}>
        <h2 style={sectionTitle}>
          Dates ({validDates.length} sélectionnée{validDates.length > 1 ? 's' : ''})
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {dates.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="date"
                style={{ ...input, flex: 1 }}
                value={d}
                onChange={(e) => updateDate(i, e.target.value)}
              />
              {dates.length > 1 && (
                <button style={btn('danger')} onClick={() => removeDate(i)}>
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button style={btn('secondary')} onClick={addDate}>
          + Ajouter une date
        </button>
      </div>

      {/* ── Soumission ── */}
      <button
        style={{
          ...btn('primary'),
          opacity: canSubmit ? 1 : 0.4,
          width: '100%',
          padding: '12px',
          fontSize: 15,
        }}
        onClick={handleSubmit}
        disabled={!canSubmit || status === 'loading'}
      >
        {status === 'loading'
          ? 'Création en cours…'
          : `Créer ${validDates.length} activité${validDates.length > 1 ? 's' : ''}`}
      </button>

      {/* ── Résultats ── */}
      {status === 'done' && results.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2 style={sectionTitle}>Résultats</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 6,
                  background: r.ok ? '#1b3a1f' : '#3a1b1b',
                  border: `1px solid ${r.ok ? '#4caf50' : '#f44336'}`,
                  fontSize: 13,
                  color: '#fff',
                }}
              >
                <span>{r.ok ? '✅' : '❌'}</span>
                <span style={{ fontWeight: 600 }}>{r.date}</span>
                {r.ok ? (
                  <span style={{ color: '#81c784' }}>Créée avec succès</span>
                ) : (
                  <span style={{ color: '#e57373' }}>{r.error}</span>
                )}
              </div>
            ))}
          </div>
          {results.every((r) => r.ok) && (
            <p style={{ marginTop: 12, fontSize: 13, color: '#81c784', fontWeight: 600 }}>
              ✅ Toutes les activités ont été créées.{' '}
              <a href="/admin/collections/activites" style={{ color: '#81c784' }}>
                Voir dans Payload →
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  )
}