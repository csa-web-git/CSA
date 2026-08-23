'use client'

import { useEffect } from 'react'

const LAT = 50.643188   // ← remplace par ta latitude
const LNG = 5.568706   // ← remplace par ta longitude
const ZOOM = 16

export function MapCSA() {
  useEffect(() => {
    let map: any

    async function initMap() {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      if ((document.getElementById('map-csa') as any)?._leaflet_id) return

      map = L.map('map-csa').setView([LAT, LNG], ZOOM)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map)

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })

      L.marker([LAT, LNG], { icon })
        .addTo(map)
        .bindPopup('Centre Social Autogéré')
        .openPopup()
    }

    initMap()

    return () => {
      map?.remove()
    }
  }, [])

  return <div id="map-csa" className="h-80 w-full rounded-md overflow-hidden z-0" />
}