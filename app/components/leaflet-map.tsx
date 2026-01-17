"use client";

import type { LatLngExpression, Map as LeafletMapInstance } from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

type Theme = "light" | "dark";

type LeafletMapProps = {
  center: LatLngExpression;
  zoom: number;
  theme: Theme;
  onReady?: (map: LeafletMapInstance) => void;
  className?: string;
};

const LIGHT_TILES =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_TILES =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function LeafletMap({
  center,
  zoom,
  theme,
  onReady,
  className
}: LeafletMapProps) {
  return (
    <MapContainer
      className={className}
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      zoomControl={false}
      dragging={false}
      doubleClickZoom={false}
      keyboard={false}
      attributionControl={false}
      tap={false}
    >
      <MapReady onReady={onReady} />
      <TileLayer
        url={theme === "dark" ? DARK_TILES : LIGHT_TILES}
        attribution={ATTRIBUTION}
        subdomains="abcd"
      />
    </MapContainer>
  );
}

function MapReady({ onReady }: { onReady?: (map: LeafletMapInstance) => void }) {
  const map = useMap();

  useEffect(() => {
    onReady?.(map);
  }, [map, onReady]);

  return null;
}
