import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  AlertTriangle,
  Camera,
  Search,
  Compass,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Layers,
  Utensils,
  Hotel,
  Sparkles,
  GraduationCap,
  Bus,
  Pill,
  CreditCard,
  Sun,
  Zap,
  X,
  Navigation,
  Car,
  ShieldAlert,
  Info
} from 'lucide-react';

// Default center: Lucknow Kursi Road / Integral University
const LUCKNOW_CENTER = [26.9460, 81.0080];
const DEFAULT_ZOOM = 14;

// Highlighted accident danger corridor (Red-White dashed polyline matching Screenshot 1 & 2)
const DANGER_CORRIDOR_COORDS = [
  [26.9630, 80.9950], // Kursi Road North
  [26.9587, 80.9992], // Integral University
  [26.9530, 81.0060], // Dashauli Junction
  [26.9450, 81.0130], // Mid-connector
  [26.9360, 81.0180], // MJ Funcity Waterpark & Resort Curve
  [26.9410, 81.0310], // Eastward curve
  [26.9480, 81.0420], // Kapasi
  [26.9540, 81.0560]  // Raiauli connector
];

// Rich POIs for category filters matching Google Maps Lucknow screenshots
const LUCKNOW_POIS = [
  {
    id: 'poi_01',
    name: 'Integral University',
    category: 'MUSEUMS',
    type: 'education',
    lat: 26.9587,
    lng: 80.9992,
    rating: 4.4,
    desc: 'Premier university campus with 15,000+ daily commuter footfall.'
  },
  {
    id: 'poi_02',
    name: 'Scorpio Club & Resort in Lucknow',
    category: 'RESTAURANTS',
    type: 'restaurant',
    lat: 26.9425,
    lng: 80.9780,
    rating: 4.3,
    desc: 'Luxury resort & dine-in on Kursi Road with acute highway access ramp.'
  },
  {
    id: 'poi_03',
    name: 'MJ Funcity Waterpark & Resort',
    category: 'THINGS_TO_DO',
    type: 'amusement',
    lat: 26.9360,
    lng: 81.0180,
    rating: 4.1,
    desc: 'Major recreational waterpark destination. Severe weekend tourist traffic.'
  },
  {
    id: 'poi_04',
    name: 'Samarpan Hospital',
    category: 'PHARMACIES',
    type: 'hospital',
    lat: 26.9120,
    lng: 81.0185,
    rating: 4.5,
    desc: 'Multi-specialty emergency trauma hospital & 24x7 pharmacy.'
  },
  {
    id: 'poi_05',
    name: 'Kukrail Forest Reserve',
    category: 'THINGS_TO_DO',
    type: 'nature',
    lat: 26.9050,
    lng: 80.9900,
    rating: 4.6,
    desc: 'Protected eco-corridor with winding night road & wildlife crossings.'
  },
  {
    id: 'poi_06',
    name: 'Maharishi University of Information Tech',
    category: 'MUSEUMS',
    type: 'education',
    lat: 26.9240,
    lng: 80.9590,
    rating: 4.2,
    desc: 'Higher education institute on Sitapur-Kursi connector.'
  },
  {
    id: 'poi_07',
    name: 'Pinak Adventure Park',
    category: 'THINGS_TO_DO',
    type: 'amusement',
    lat: 26.9470,
    lng: 81.0310,
    rating: 4.0,
    desc: 'Outdoor sports and adventure park near Kapasi.'
  },
  {
    id: 'poi_08',
    name: 'Lotus Portico Dine & Stay',
    category: 'HOTELS',
    type: 'hotel',
    lat: 26.9310,
    lng: 80.9650,
    rating: 4.2,
    desc: 'Boutique hotel & banquet on Kursi Road arterial.'
  },
  {
    id: 'poi_09',
    name: 'Lucknow Outer Ring Road Interchange',
    category: 'TRANSIT',
    type: 'transit',
    lat: 26.9380,
    lng: 81.0250,
    rating: 4.7,
    desc: 'Major expressway interchange with high-speed commercial traffic.'
  },
  {
    id: 'poi_10',
    name: 'State Bank of India ATM (Integral Campus)',
    category: 'ATMS',
    type: 'atm',
    lat: 26.9580,
    lng: 80.9985,
    rating: 4.1,
    desc: '24x7 ATM kiosk & cash deposit machine.'
  }
];

export default function RiskHotspotMap({ hotspots = [], onSelectHotspot }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const corridorGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  // States
  const [selectedHotspot, setSelectedHotspot] = useState(hotspots[0] || null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeLayer, setActiveLayer] = useState('hybrid'); // 'hybrid' | 'roadmap' | 'satellite'
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [cctvFrame, setCctvFrame] = useState(0);

  // Dynamic CCTV frame effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCctvFrame(prev => (prev + 1) % 100);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Update selected hotspot when external prop changes
  useEffect(() => {
    if (hotspots.length > 0 && !selectedHotspot) {
      setSelectedHotspot(hotspots[0]);
    }
  }, [hotspots]);

  // Leaflet tile layer configurations
  const getTileUrl = (type) => {
    switch (type) {
      case 'hybrid':
        // Google Hybrid (satellite + streets + labels)
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      case 'roadmap':
        // Google Standard Roadmap with traffic overlay
        return 'https://mt1.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}';
      case 'satellite':
        // Google pure Satellite imagery
        return 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
      default:
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if Leaflet is globally available
    const initLeaflet = () => {
      if (!window.L) {
        // Fallback: check again in 200ms
        setTimeout(initLeaflet, 200);
        return;
      }

      const L = window.L;

      // Prevent re-initialization
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapContainerRef.current, {
        center: LUCKNOW_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: true
      });

      map.attributionControl.setPrefix('Imagery ©2026 Google, Maxar Technologies');

      // Add Tile Layer
      tileLayerRef.current = L.tileLayer(getTileUrl(activeLayer), {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(map);

      // Create Layer Groups
      corridorGroupRef.current = L.layerGroup().addTo(map);
      markersGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);

      // Draw Accident Danger Corridor
      drawDangerCorridor(L, map);
    };

    initLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Tile Layer when activeLayer changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current || !window.L) return;
    const L = window.L;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(getTileUrl(activeLayer), {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(mapInstanceRef.current);
  }, [activeLayer]);

  // Draw the Red-White Danger Corridor Line
  const drawDangerCorridor = (L, map) => {
    if (!corridorGroupRef.current) return;
    corridorGroupRef.current.clearLayers();

    // 1. Thick Base White Stroke
    const baseLine = L.polyline(DANGER_CORRIDOR_COORDS, {
      color: '#ffffff',
      weight: 8,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    });

    // 2. Red Dashed Top Stroke (gives the exact red-and-white dashed hazard effect from Screenshot 1 & 2)
    const dashedDangerLine = L.polyline(DANGER_CORRIDOR_COORDS, {
      color: '#ef4444',
      weight: 6,
      opacity: 1,
      dashArray: '10, 8',
      className: 'danger-corridor-line'
    });

    baseLine.bindTooltip('⚠️ High-Risk Accident Corridor: Kursi Road (Integral Univ to Kapasi Link)', {
      sticky: true,
      className: 'gmap-tooltip'
    });

    corridorGroupRef.current.addLayer(baseLine);
    corridorGroupRef.current.addLayer(dashedDangerLine);
  };

  // Render Markers on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !mapLoaded) return;
    const L = window.L;
    const markersGroup = markersGroupRef.current;
    if (!markersGroup) return;

    markersGroup.clearLayers();

    // 1. Render Accident Blackspots
    hotspots.forEach((h) => {
      const isSelected = selectedHotspot?.id === h.id;
      const riskColor = h.riskLevel === 'Severe' ? '#ef4444' : h.riskLevel === 'High' ? '#f97316' : '#f59e0b';

      const iconHtml = `
        <div class="gmap-marker-pin gmap-marker-hotspot" style="
          width: ${isSelected ? '32px' : '26px'};
          height: ${isSelected ? '32px' : '26px'};
          background: ${riskColor};
          box-shadow: 0 0 16px ${riskColor};
          border: ${isSelected ? '3px solid #fff' : '2px solid #fff'};
        ">
          ${h.currentRiskScore}%
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-icon',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([h.lat, h.lng], { icon: customIcon });

      marker.bindTooltip(`<b>${h.name}</b><br/><span style="color:${riskColor}">Risk: ${h.currentRiskScore}% (${h.riskLevel})</span>`, {
        direction: 'top',
        className: 'gmap-tooltip'
      });

      marker.on('click', () => {
        setSelectedHotspot(h);
        mapInstanceRef.current.panTo([h.lat, h.lng], { animate: true, duration: 0.6 });
      });

      markersGroup.addLayer(marker);
    });

    // 2. Render Category POIs
    const filteredPOIs = LUCKNOW_POIS.filter(poi => {
      if (activeCategory === 'ALL') return true;
      return poi.category === activeCategory;
    });

    filteredPOIs.forEach((poi) => {
      let iconColorClass = 'gmap-marker-education';
      let iconSvg = '';

      switch (poi.type) {
        case 'education':
          iconColorClass = 'gmap-marker-education';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>';
          break;
        case 'restaurant':
          iconColorClass = 'gmap-marker-restaurant';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 11v11"/><path d="M5 2v8a3 3 0 0 0 6 0V2"/><path d="M8 10v12"/></svg>';
          break;
        case 'amusement':
          iconColorClass = 'gmap-marker-amusement';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="2"/></svg>';
          break;
        case 'hospital':
          iconColorClass = 'gmap-marker-hospital';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 6v12"/><path d="M6 12h12"/></svg>';
          break;
        case 'nature':
          iconColorClass = 'gmap-marker-nature';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m8 14-6 6h20l-6-6"/><path d="m10 9-4 5h12l-4-5"/><path d="m12 2-3 7h6z"/><path d="M12 20v2"/></svg>';
          break;
        case 'transit':
          iconColorClass = 'gmap-marker-transit';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M8 15h.01"/><path d="M16 15h.01"/></svg>';
          break;
        default:
          iconColorClass = 'gmap-marker-atm';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>';
      }

      const poiHtml = `
        <div class="gmap-marker-pin ${iconColorClass}" style="width: 28px; height: 28px;">
          ${iconSvg}
        </div>
      `;

      const poiIcon = L.divIcon({
        className: 'custom-poi-leaflet',
        html: poiHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const poiMarker = L.marker([poi.lat, poi.lng], { icon: poiIcon });
      poiMarker.bindTooltip(`<b>${poi.name}</b><br/><span style="color:#94a3b8">${poi.desc}</span>`, {
        direction: 'top',
        className: 'gmap-tooltip'
      });

      poiMarker.on('click', () => {
        mapInstanceRef.current.panTo([poi.lat, poi.lng], { animate: true });
      });

      markersGroup.addLayer(poiMarker);
    });
  }, [hotspots, activeCategory, selectedHotspot, mapLoaded]);

  // D-Pad and Zoom Navigation Handlers
  const handlePan = (direction) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const offset = 140;
    switch (direction) {
      case 'UP': map.panBy([0, -offset], { animate: true }); break;
      case 'DOWN': map.panBy([0, offset], { animate: true }); break;
      case 'LEFT': map.panBy([-offset, 0], { animate: true }); break;
      case 'RIGHT': map.panBy([offset, 0], { animate: true }); break;
      case 'CENTER': map.flyTo(LUCKNOW_CENTER, DEFAULT_ZOOM); break;
      default: break;
    }
  };

  const handleZoom = (delta) => {
    if (!mapInstanceRef.current) return;
    if (delta > 0) mapInstanceRef.current.zoomIn();
    else mapInstanceRef.current.zoomOut();
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);
  };

  // Handle Search Submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    // Search among hotspots and POIs
    const query = searchQuery.toLowerCase();
    const matchedHotspot = hotspots.find(h =>
      h.name.toLowerCase().includes(query) || h.corridor.toLowerCase().includes(query)
    );

    if (matchedHotspot) {
      setSelectedHotspot(matchedHotspot);
      if (onSelectHotspot) onSelectHotspot(matchedHotspot);
      mapInstanceRef.current.flyTo([matchedHotspot.lat, matchedHotspot.lng], 16);
      return;
    }

    const matchedPOI = LUCKNOW_POIS.find(p =>
      p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)
    );

    if (matchedPOI) {
      mapInstanceRef.current.flyTo([matchedPOI.lat, matchedPOI.lng], 16);
    }
  };

  const currentCenter = selectedHotspot
    ? [selectedHotspot.lat, selectedHotspot.lng]
    : LUCKNOW_CENTER;

  const googleMapsExternalUrl = `https://www.google.com/maps/@${currentCenter[0]},${currentCenter[1]},15z/data=!3m1!1e3`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      {/* MAP CANVAS & CONTROLS (8 cols) */}
      <div style={{ gridColumn: 'span 8' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Top Header & Search Bar (Screenshot 2) */}
          <div className="gmap-search-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={22} color="var(--brand-cyan)" />
                  Lucknow Metropolitan Traffic & Accident Corridors
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Interactive Google Satellite Imagery & live telemetry for Kursi Road, Integral University & Ring Road
                </p>
              </div>

              {/* Direct Link to Google Maps */}
              <a
                href={googleMapsExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gmap-open-btn"
                style={{ position: 'static' }}
              >
                <span>Open in Maps</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Google Maps Search Bar */}
            <form onSubmit={handleSearch} className="gmap-search-bar">
              <Search size={18} color="#0284c7" />
              <input
                type="text"
                placeholder="Search Google Maps (e.g., Integral University, Scorpio Club, Kapasi, MJ Funcity)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={16} />
                </button>
              )}
              <div style={{ width: '1px', height: '22px', background: '#cbd5e1' }} />
              <button
                type="button"
                onClick={() => {
                  if (mapInstanceRef.current && selectedHotspot) {
                    mapInstanceRef.current.flyTo([selectedHotspot.lat, selectedHotspot.lng], 16);
                  }
                }}
                title="Get Directions / Navigate to Hotspot"
                style={{ background: '#0284c7', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Navigation size={15} />
              </button>
            </form>

            {/* Quick Category Filter Chips (Screenshot 2) */}
            <div className="gmap-category-row">
              <button
                className={`gmap-category-chip ${activeCategory === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveCategory('ALL')}
              >
                All Corridors
              </button>
              <button
                className={`gmap-category-chip ${activeCategory === 'RESTAURANTS' ? 'active' : ''}`}
                onClick={() => setActiveCategory('RESTAURANTS')}
              >
                <Utensils size={14} color="#ea580c" />
                Restaurants
              </button>
              <button
                className={`gmap-category-chip ${activeCategory === 'HOTELS' ? 'active' : ''}`}
                onClick={() => setActiveCategory('HOTELS')}
              >
                <Hotel size={14} color="#3b82f6" />
                Hotels
              </button>
              <button
                className={`gmap-category-chip ${activeCategory === 'THINGS_TO_DO' ? 'active' : ''}`}
                onClick={() => setActiveCategory('THINGS_TO_DO')}
              >
                <Sparkles size={14} color="#a855f7" />
                Things to do
              </button>
              <button
                className={`gmap-category-chip ${activeCategory === 'MUSEUMS' ? 'active' : ''}`}
                onClick={() => setActiveCategory('MUSEUMS')}
              >
                <GraduationCap size={14} color="#64748b" />
                Universities & Science
              </button>
              <button
                className={`gmap-category-chip ${activeCategory === 'TRANSIT' ? 'active' : ''}`}
                onClick={() => setActiveCategory('TRANSIT')}
              >
                <Bus size={14} color="#0284c7" />
                Transit
              </button>
              <button
                className={`gmap-category-chip ${activeCategory === 'PHARMACIES' ? 'active' : ''}`}
                onClick={() => setActiveCategory('PHARMACIES')}
              >
                <Pill size={14} color="#e11d48" />
                Pharmacies
              </button>
              <button
                className={`gmap-category-chip ${activeCategory === 'ATMS' ? 'active' : ''}`}
                onClick={() => setActiveCategory('ATMS')}
              >
                <CreditCard size={14} color="#10b981" />
                ATMs
              </button>
            </div>
          </div>

          {/* Interactive Leaflet Map Canvas with Google Satellite Layer */}
          <div className={`gmap-leaflet-wrapper ${isFullscreen ? 'fullscreen-mode' : ''}`}>

            {/* Floating Live Traffic & Weather Alert Card (Screenshot 2) */}
            <div className="gmap-alert-card">
              <div className="gmap-alert-card-header">
                <span>Lucknow 32°</span>
                <Sun size={15} color="#eab308" />
              </div>

              <div
                className="gmap-alert-card-body"
                onClick={() => setShowAlertDetails(!showAlertDetails)}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Car size={16} color="#ef4444" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                    Heavy traffic in this area
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Much slower than usual (Kursi Rd - MJ Funcity)
                  </div>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </div>

              {/* Expanded Incident Telemetry Drawer */}
              {showAlertDetails && (
                <div style={{ padding: '12px 14px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '0.74rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Traffic Delay:</span>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>+18 mins delay</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Congestion Index:</span>
                    <span style={{ color: '#ea580c', fontWeight: 700 }}>88% Critical (Severe)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Current Average Speed:</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>14 km/h (Limit: 50 km/h)</span>
                  </div>
                  <div style={{ background: '#eff6ff', padding: '6px 8px', borderRadius: '6px', color: '#1e40af', fontSize: '0.7rem', marginBottom: '8px' }}>
                    💡 <b>Detour recommendation:</b> Divert via Dashauli bypass link to save 12 mins.
                  </div>
                  <button
                    onClick={() => {
                      if (onSelectHotspot && hotspots[2]) {
                        onSelectHotspot(hotspots[2]);
                      }
                    }}
                    style={{
                      width: '100%',
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Zap size={13} />
                    Load in Prediction Studio
                  </button>
                </div>
              )}
            </div>

            {/* Open in Maps Button (Top Right of Map) */}
            <a
              href={googleMapsExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gmap-open-btn"
              title="Open full satellite view in Google Maps"
            >
              <span>Open in Maps</span>
              <ExternalLink size={13} />
            </a>

            {/* Leaflet Map Div */}
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

            {/* Bottom-Left Layers Switcher Thumbnail (Screenshot 1 & 2) */}
            <div
              className="gmap-layers-switch"
              onClick={() => setActiveLayer(activeLayer === 'hybrid' ? 'roadmap' : 'hybrid')}
              title={`Switch to ${activeLayer === 'hybrid' ? 'Map View' : 'Satellite View'}`}
              style={{
                backgroundImage: activeLayer === 'hybrid'
                  ? 'url("https://maps.gstatic.com/tactile/layerswitcher/imagery_light_2x.png")'
                  : 'url("https://maps.gstatic.com/tactile/layerswitcher/satellite_light_2x.png")',
                backgroundColor: '#1e293b'
              }}
            >
              <div className="gmap-layers-label">
                {activeLayer === 'hybrid' ? 'Map' : 'Satellite'}
              </div>
            </div>

            {/* Right-Hand Navigation D-Pad & Zoom Controls Suite (Screenshot 1) */}
            <div className="gmap-controls-group">

              {/* Directional D-Pad Cluster */}
              <div className="gmap-dpad-cluster">
                <button className="gmap-dpad-btn gmap-dpad-up" onClick={() => handlePan('UP')} title="Pan North">
                  <ChevronUp size={18} />
                </button>
                <button className="gmap-dpad-btn gmap-dpad-down" onClick={() => handlePan('DOWN')} title="Pan South">
                  <ChevronDown size={18} />
                </button>
                <button className="gmap-dpad-btn gmap-dpad-left" onClick={() => handlePan('LEFT')} title="Pan West">
                  <ChevronLeft size={18} />
                </button>
                <button className="gmap-dpad-btn gmap-dpad-right" onClick={() => handlePan('RIGHT')} title="Pan East">
                  <ChevronRight size={18} />
                </button>
                <button
                  className="gmap-dpad-center"
                  onClick={() => handlePan('CENTER')}
                  title="Recenter on Integral University & Kursi Road"
                />
              </div>

              {/* Zoom Buttons (+ and -) */}
              <div className="gmap-zoom-cluster">
                <button className="gmap-icon-btn" onClick={() => handleZoom(1)} title="Zoom in">
                  <Plus size={18} />
                </button>
                <button className="gmap-icon-btn" onClick={() => handleZoom(-1)} title="Zoom out">
                  <Minus size={18} />
                </button>
                <button className="gmap-icon-btn" onClick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* HOTSPOT & LIVE CORRIDOR TELEMETRY DRAWER (4 cols) */}
      <div style={{ gridColumn: 'span 4' }}>
        {selectedHotspot ? (
          <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Header with Risk Level */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: selectedHotspot.riskLevel === 'Severe' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                  color: selectedHotspot.riskLevel === 'Severe' ? '#ef4444' : '#f97316',
                  border: `1px solid ${selectedHotspot.riskLevel === 'Severe' ? '#ef4444' : '#f97316'}66`
                }}>
                  {selectedHotspot.riskLevel} Accident Blackspot
                </span>
                <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginTop: '6px' }}>
                  {selectedHotspot.name}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {selectedHotspot.corridor}
                </p>
              </div>

              <div style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: selectedHotspot.riskLevel === 'Severe' ? '#ef4444' : '#f97316',
                fontFamily: 'var(--font-mono)'
              }}>
                {selectedHotspot.currentRiskScore}%
              </div>
            </div>

            {/* Active Alert Banner */}
            {selectedHotspot.activeAlert && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 600 }}>
                  {selectedHotspot.activeAlert}
                </span>
              </div>
            )}

            {/* Real-time Telemetry Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Current Avg Speed</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                  {selectedHotspot.currentAvgSpeed} km/h
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginLeft: '4px' }}>
                    / {selectedHotspot.speedLimit} limit
                  </span>
                </div>
              </div>

              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Daily Volume</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-cyan)' }}>
                  {selectedHotspot.averageDailyVolume.toLocaleString()} veh/day
                </div>
              </div>

              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Historical Crashes</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b' }}>
                  {selectedHotspot.historicalAccidentsCount} recorded
                </div>
              </div>

              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Active IoT Nodes</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981' }}>
                  {selectedHotspot.iotSensorsCount} sensors live
                </div>
              </div>
            </div>

            {/* Simulated Live ITS CCTV Optical Feed */}
            <div style={{
              background: '#090d16',
              borderRadius: '10px',
              padding: '12px',
              border: '1px solid var(--border-subtle)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={15} color="#38bdf8" />
                  <span style={{ fontSize: '0.74rem', color: '#f8fafc', fontWeight: 600 }}>
                    CCTV Cam #04 - Kursi Rd Median
                  </span>
                </div>
                <span style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="status-dot" style={{ background: '#10b981' }} />
                  LIVE (1080p)
                </span>
              </div>

              {/* CCTV Feed Viewport Screen */}
              <div style={{
                height: '110px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #111827 0%, #030712 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                overflow: 'hidden'
              }}>
                {/* Scanlines Effect */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
                  pointerEvents: 'none'
                }} />

                {/* Simulated AI Object Detection Box */}
                <div style={{
                  position: 'absolute',
                  left: `${20 + (cctvFrame * 0.5) % 50}%`,
                  top: '30%',
                  width: '54px',
                  height: '42px',
                  border: '1px solid #ef4444',
                  boxShadow: '0 0 6px rgba(239, 68, 68, 0.5)',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                  padding: '2px'
                }}>
                  <span style={{ fontSize: '8px', background: '#ef4444', color: '#fff', padding: '1px 3px', borderRadius: '2px', fontWeight: 700 }}>
                    BUS 0.94
                  </span>
                </div>

                <div style={{
                  position: 'absolute',
                  left: `${45 + (cctvFrame * 0.3) % 40}%`,
                  top: '45%',
                  width: '38px',
                  height: '28px',
                  border: '1px solid #38bdf8',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '2px'
                }}>
                  <span style={{ fontSize: '8px', background: '#38bdf8', color: '#000', padding: '1px 3px', borderRadius: '2px', fontWeight: 700 }}>
                    CAR 0.98
                  </span>
                </div>

                {/* HUD Overlay */}
                <div style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '9px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  ISO 800 | F/2.8 | AI RISK: HIGH
                </div>
                <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '9px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                  UTC+5:30 14:22:04
                </div>
              </div>
            </div>

            {/* Primary Hazard Factor */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px'
            }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Dominant Hazard Attribution:
              </span>
              <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f8fafc', marginTop: '4px' }}>
                {selectedHotspot.primaryHazardFactor}
              </p>
            </div>

            {/* Action button to load into ML Prediction Studio */}
            <button
              onClick={() => {
                if (onSelectHotspot) onSelectHotspot(selectedHotspot);
              }}
              style={{
                marginTop: 'auto',
                background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-cyan) 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
            >
              <Zap size={16} />
              Run ML Accident Prediction on this Spot
            </button>

          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Select a hotspot or POI from the map to inspect live corridor telemetry
          </div>
        )}
      </div>
    </div>
  );
}
