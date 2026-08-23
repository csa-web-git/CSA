'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import { HexColorPicker } from 'react-colorful'

export const ColorPickerField: React.FC<{ path: string; field: { label?: string } }> = ({
  path,
  field,
}) => {
  const { value, setValue } = useField<string>({ path })

  // État local pour le picker — évite de spammer setValue à chaque pixel
  const [localColor, setLocalColor] = useState(
    typeof value === 'string' && value.startsWith('#') ? value : '#cccccc',
  )

  // Sync si la valeur Payload change depuis l'extérieur (reset, load)
  useEffect(() => {
    if (typeof value === 'string' && value.startsWith('#')) {
      setLocalColor(value)
    }
  }, [value])

  const handleChange = (c: string) => {
    setLocalColor(c) // mise à jour locale immédiate (fluide)
    setValue(c) // sync Payload
  }

  return (
    <div className="field-type" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label" htmlFor={path}>
        {field.label ?? 'Couleur'}
      </label>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
        <HexColorPicker color={localColor} onChange={handleChange} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 8,
              backgroundColor: localColor,
              border: '1px solid var(--theme-elevation-150)',
            }}
          />
          <input
            id={path}
            type="text"
            value={localColor}
            onChange={(e) => handleChange(e.target.value)}
            style={{
              width: 100,
              padding: '0.4rem 0.5rem',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: 4,
              fontFamily: 'monospace',
              fontSize: 13,
            }}
            placeholder="#RRGGBB"
          />
        </div>
      </div>
    </div>
  )
}

export default ColorPickerField
