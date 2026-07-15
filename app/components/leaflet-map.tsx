"use client";

import L from "leaflet";
import type { LatLngExpression, Map as LeafletMapInstance } from "leaflet";
import { useEffect, useRef } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up any existing Leaflet instance on this container before initializing.
    // This solves the React Strict Mode double-mount / hot reload issue.
    const container = containerRef.current as any;
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    const map = L.map(containerRef.current, {
      center,
      zoom,
      scrollWheelZoom: false,
      zoomControl: false,
      dragging: false,
      doubleClickZoom: false,
      keyboard: false,
      attributionControl: false,
      tap: false
    });

    mapRef.current = map;

    const tileLayer = L.tileLayer(theme === "dark" ? DARK_TILES : LIGHT_TILES, {
      attribution: ATTRIBUTION,
      subdomains: "abcd"
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    if (onReady) {
      onReady(map);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // theme changes are handled reactively in the secondary useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, zoom, onReady]);

  // Handle theme changes dynamically
  useEffect(() => {
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(theme === "dark" ? DARK_TILES : LIGHT_TILES);
    }
  }, [theme]);

  return <div ref={containerRef} className={className} />;
}
