// @ts-nocheck
import { useRef, useEffect, useState } from 'react'
import maplibregl from 'maplibre-gl'
import styles from "./MapComponent.module.css";

export default function MapComponent() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng] = useState(30.5240501)
  const [lat] = useState(48.4501071)
  const [zoom] = useState(5)

  useEffect(() => {
    if (map.current) return; //stops map from intializing more than once
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL`,
      center: [lng, lat],
      zoom: zoom
    })
  })

  return (
    <div className={styles.mapWrap}>
      <div ref={mapContainer} className={styles.map} />
    </div>
  )
}
