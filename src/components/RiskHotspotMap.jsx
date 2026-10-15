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
  Bookmark,
  Clock,
  Menu,
  Smartphone,
  Share2,
  Flag,
  Briefcase,
  Star,
  Heart,
  MoreVertical,
  CheckSquare,
  Square,
  CornerDownRight,
  Check,
  Eye,
  Crosshair,
  Volume2
} from 'lucide-react';

// City Center Coordinates
const CITY_CENTERS = {
  kolkata: [22.5726, 88.3639],
  lucknow: [26.9460, 81.0080]
};

// Municipal Boundary Polygons (Red-and-White dashed outline matching Screenshot 2)
const KOLKATA_BOUNDARY = [
  [22.6500, 88.3500],
  [22.6400, 88.4200],
  [22.6000, 88.4400],
  [22.5600, 88.4200],
  [22.5100, 88.4100],
  [22.4600, 88.3800],
  [22.4500, 88.3300],
  [22.5000, 88.3000],
  [22.5500, 88.3200],
  [22.6100, 88.3300],
  [22.6500, 88.3500]
];

const LUCKNOW_CORRIDOR = [
  [26.9630, 80.9950],
  [26.9587, 80.9992],
  [26.9530, 81.0060],
  [26.9450, 81.0130],
  [26.9360, 81.0180],
  [26.9410, 81.0310],
  [26.9480, 81.0420],
  [26.9540, 81.0560]
];

// Rich POIs for Kolkata matching Screenshot 1 & 2
const KOLKATA_POIS = [
  { id: 'kol_poi_1', name: 'Victoria Memorial', category: 'MUSEUMS', type: 'monument', lat: 22.5448, lng: 88.3426, rating: 4.8, desc: 'Iconic marble landmark & cultural hall.' },
  { id: 'kol_poi_2', name: 'Howrah Bridge', category: 'TRANSIT', type: 'transit', lat: 22.5851, lng: 88.3468, rating: 4.7, desc: 'World famous cantilever bridge carrying 100k+ vehicles/day.' },
  { id: 'kol_poi_3', name: 'Science City Kolkata', category: 'THINGS_TO_DO', type: 'amusement', lat: 22.5398, lng: 88.3962, rating: 4.6, desc: 'Largest science centre in Indian subcontinent.' },
  { id: 'kol_poi_4', name: 'Belur Math', category: 'MUSEUMS', type: 'monument', lat: 22.6322, lng: 88.3562, rating: 4.9, desc: 'Headquarters of Ramakrishna Math on Hooghly river.' },
  { id: 'kol_poi_5', name: 'Zoological Garden Alipore', category: 'THINGS_TO_DO', type: 'nature', lat: 22.5350, lng: 88.3325, rating: 4.4, desc: 'Oldest formally stated zoological park in India.' },
  { id: 'kol_poi_6', name: 'Acropolis Mall', category: 'RESTAURANTS', type: 'restaurant', lat: 22.5135, lng: 88.3930, rating: 4.5, desc: 'Premium retail & fine-dining on Rajdanga Main Rd.' },
  { id: 'kol_poi_7', name: 'Peerless Hospital', category: 'PHARMACIES', type: 'hospital', lat: 22.4820, lng: 88.3980, rating: 4.3, desc: '400-bed multispecialty trauma centre on EM Bypass.' },
  { id: 'kol_poi_8', name: 'Narayana Hospital, Chunavati', category: 'PHARMACIES', type: 'hospital', lat: 22.5650, lng: 88.2950, rating: 4.4, desc: 'Super specialty cardiac & emergency healthcare.' },
  { id: 'kol_poi_9', name: 'B Garden Banquet Hall', category: 'HOTELS', type: 'hotel', lat: 22.5020, lng: 88.3120, rating: 4.2, desc: 'Prominent hospitality venue near Botanical Gardens.' },
  { id: 'kol_poi_10', name: 'St. Xavier\'s College (Autonomous)', category: 'MUSEUMS', type: 'education', lat: 22.5492, lng: 88.3585, rating: 4.8, desc: 'Renowned educational institute on Park Street.' }
];

// Rich POIs for Lucknow matching earlier screenshots
const LUCKNOW_POIS = [
  { id: 'lko_poi_1', name: 'Integral University', category: 'MUSEUMS', type: 'education', lat: 26.9587, lng: 80.9992, rating: 4.4, desc: 'Premier university campus on Kursi Road.' },
  { id: 'lko_poi_2', name: 'Scorpio Club & Resort in Lucknow', category: 'RESTAURANTS', type: 'restaurant', lat: 26.9425, lng: 80.9780, rating: 4.3, desc: 'Luxury resort with acute highway access ramp.' },
  { id: 'lko_poi_3', name: 'MJ Funcity Waterpark & Resort', category: 'THINGS_TO_DO', type: 'amusement', lat: 26.9360, lng: 81.0180, rating: 4.1, desc: 'Major recreational waterpark on Dashauli-Kapasi curve.' },
  { id: 'lko_poi_4', name: 'Samarpan Hospital', category: 'PHARMACIES', type: 'hospital', lat: 26.9120, lng: 81.0185, rating: 4.5, desc: 'Multi-specialty emergency trauma hospital & pharmacy.' },
  { id: 'lko_poi_5', name: 'Kukrail Forest Reserve', category: 'THINGS_TO_DO', type: 'nature', lat: 26.9050, lng: 80.9900, rating: 4.6, desc: 'Protected eco-corridor with winding night road.' }
];

// Curated Hotels Carousel data (Screenshot 2)
const HOTEL_CAROUSEL_DATA = {
  kolkata: [
    { id: 'h1', name: 'The Samilton Hotel', price: '₹4,013', rating: 4.1, reviews: '1,353', stars: '3-star hotel', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80' },
    { id: 'h2', name: 'Hyatt Regency Kolkata', price: '₹10,490', rating: 4.4, reviews: '88,875', stars: '5-star hotel', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&q=80' },
    { id: 'h3', name: 'The Oberoi Grand', price: '₹12,500', rating: 4.7, reviews: '14,200', stars: '5-star heritage', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&q=80' }
  ],
  lucknow: [
    { id: 'hl1', name: 'Scorpio Resort Villas', price: '₹3,450', rating: 4.2, reviews: '940', stars: 'Resort stay', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&q=80' },
    { id: 'hl2', name: 'Taj Mahal Hotel Lucknow', price: '₹9,800', rating: 4.8, reviews: '5,120', stars: '5-star luxury', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80' },
    { id: 'hl3', name: 'Lotus Portico Dine & Stay', price: '₹2,800', rating: 4.0, reviews: '420', stars: 'Boutique stay', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&q=80' }
  ]
};

export default function RiskHotspotMap({ hotspots = [], onSelectHotspot }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const boundaryGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Shell State
  const [activeCity, setActiveCity] = useState('kolkata'); // 'kolkata' | 'lucknow'
  const [activeNavTab, setActiveNavTab] = useState('saved'); // 'explore' | 'saved' | 'recents' | 'city_info'
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [savedSubTab, setSavedSubTab] = useState('lists'); // 'lists' | 'labeled' | 'maps'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeLayer, setActiveLayer] = useState('hybrid'); // 'hybrid' | 'roadmap' | 'satellite'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStreetView, setShowStreetView] = useState(false);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [cctvFrame, setCctvFrame] = useState(0);

  // Saved Lists State (Screenshot 1)
  const [savedLists, setSavedLists] = useState([
    { id: 'list_1', name: 'Want to go', icon: '⛳', color: '#16a34a', count: 2, places: ['Howrah Bridge Approach', 'Victoria Memorial'] },
    { id: 'list_2', name: 'Travel plans', icon: '🧳', color: '#0284c7', count: 1, places: ['Kolkata Corridor Patrol'] },
    { id: 'list_3', name: 'Starred places', icon: '⭐', color: '#f59e0b', count: 3, places: ['Science City Interchange', 'Integral University', 'Park Circus 7-Point'] },
    { id: 'list_4', name: 'Favorites', icon: '❤️', color: '#ef4444', count: 4, places: ['Howrah Bridge', 'Kukrail Forest', 'MJ Funcity', 'Taratala Freight Link'] },
    { id: 'list_5', name: 'Saved places', icon: '🔖', color: '#0d9488', count: 2, places: ['Peerless Hospital', 'Scorpio Club'] }
  ]);

  // Recents State (Screenshot 2)
  const [recentItems, setRecentItems] = useState([
    { id: 'rec_1', name: 'Kolkata', subtitle: 'Kolkata, West Bengal', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=100&q=80', checked: true, city: 'kolkata' },
    { id: 'rec_2', name: 'Howrah Bridge Approach', subtitle: 'Strand Road, Kolkata', img: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=100&q=80', checked: false, city: 'kolkata' },
    { id: 'rec_3', name: 'Integral University Corridor', subtitle: 'Kursi Road, Lucknow', img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&q=80', checked: false, city: 'lucknow' }
  ]);

  // Selected Hotspot for detail drawer
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Dynamic CCTV frame effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCctvFrame(prev => (prev + 1) % 100);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Filter hotspots by current city
  const cityHotspots = hotspots.filter(h => {
    if (activeCity === 'kolkata') return h.city === 'Kolkata' || h.id.includes('kol');
    return !h.city || h.city === 'Lucknow' || !h.id.includes('kol');
  });

  useEffect(() => {
    if (cityHotspots.length > 0 && (!selectedHotspot || selectedHotspot.city !== (activeCity === 'kolkata' ? 'Kolkata' : 'Lucknow'))) {
      setSelectedHotspot(cityHotspots[0]);
    }
  }, [activeCity, hotspots]);

  // Tile URL getter
  const getTileUrl = (type) => {
    switch (type) {
      case 'hybrid':
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      case 'roadmap':
        return 'https://mt1.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}';
      case 'satellite':
        return 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
      default:
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initLeaflet = () => {
      if (!window.L) {
        setTimeout(initLeaflet, 200);
        return;
      }

      const L = window.L;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const center = CITY_CENTERS[activeCity];
      const zoom = activeCity === 'kolkata' ? 12 : 14;

      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: true
      });

      map.attributionControl.setPrefix('Imagery ©2026 Google, Maxar Technologies');

      tileLayerRef.current = L.tileLayer(getTileUrl(activeLayer), {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(map);

      boundaryGroupRef.current = L.layerGroup().addTo(map);
      markersGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);

      renderBoundaries(L, map);
    };

    initLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeCity]);

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

  // Render Municipal Boundary or Danger Corridor (Screenshot 2 Red-White dashed boundary)
  const renderBoundaries = (L, map) => {
    if (!boundaryGroupRef.current) return;
    boundaryGroupRef.current.clearLayers();

    if (activeCity === 'kolkata') {
      // 1. White Base Outline
      const whiteBoundary = L.polygon(KOLKATA_BOUNDARY, {
        color: '#ffffff',
        weight: 6,
        fillColor: '#ef4444',
        fillOpacity: 0.05,
        lineCap: 'round'
      });

      // 2. Red Dashed Overlay (Matches Screenshot 2 Kolkata boundary)
      const dashedBoundary = L.polygon(KOLKATA_BOUNDARY, {
        color: '#ef4444',
        weight: 4,
        fill: false,
        dashArray: '10, 8',
        className: 'danger-corridor-line'
      });

      whiteBoundary.bindTooltip('<b>Kolkata Municipal Corporation</b><br/>High-Density Accident Surveillance Zone', {
        className: 'gmap-tooltip'
      });

      boundaryGroupRef.current.addLayer(whiteBoundary);
      boundaryGroupRef.current.addLayer(dashedBoundary);
    } else {
      // Lucknow Kursi Road Hazard Corridor
      const baseLine = L.polyline(LUCKNOW_CORRIDOR, {
        color: '#ffffff',
        weight: 8,
        opacity: 0.95
      });
      const dashedLine = L.polyline(LUCKNOW_CORRIDOR, {
        color: '#ef4444',
        weight: 6,
        dashArray: '10, 8',
        className: 'danger-corridor-line'
      });
      boundaryGroupRef.current.addLayer(baseLine);
      boundaryGroupRef.current.addLayer(dashedLine);
    }
  };

  // Render Markers on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !mapLoaded) return;
    const L = window.L;
    const markersGroup = markersGroupRef.current;
    if (!markersGroup) return;

    markersGroup.clearLayers();

    // 1. Hotspots
    cityHotspots.forEach((h) => {
      const isSelected = selectedHotspot?.id === h.id;
      const riskColor = h.riskLevel === 'Severe' ? '#ef4444' : h.riskLevel === 'High' ? '#f97316' : '#f59e0b';

      const iconHtml = `
        <div class="gmap-marker-pin gmap-marker-hotspot" style="
          width: ${isSelected ? '34px' : '28px'};
          height: ${isSelected ? '34px' : '28px'};
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
        iconSize: [34, 34],
        iconAnchor: [17, 17]
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

    // 2. City POIs
    const pois = activeCity === 'kolkata' ? KOLKATA_POIS : LUCKNOW_POIS;
    const filteredPOIs = pois.filter(p => activeCategory === 'ALL' || p.category === activeCategory);

    filteredPOIs.forEach((poi) => {
      let iconColorClass = 'gmap-marker-education';
      let iconSvg = '';

      switch (poi.type) {
        case 'monument':
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
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><circle cx="12" cy="12" r="2"/></svg>';
          break;
        case 'hospital':
          iconColorClass = 'gmap-marker-hospital';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 6v12"/><path d="M6 12h12"/></svg>';
          break;
        case 'nature':
          iconColorClass = 'gmap-marker-nature';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m8 14-6 6h20l-6-6"/><path d="m10 9-4 5h12l-4-5"/><path d="M12 20v2"/></svg>';
          break;
        case 'transit':
          iconColorClass = 'gmap-marker-transit';
          iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M8 15h.01"/></svg>';
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
  }, [cityHotspots, activeCategory, selectedHotspot, mapLoaded, activeCity]);

  // Navigation Pan & Zoom Handlers
  const handlePan = (direction) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const offset = 140;
    switch (direction) {
      case 'UP': map.panBy([0, -offset], { animate: true }); break;
      case 'DOWN': map.panBy([0, offset], { animate: true }); break;
      case 'LEFT': map.panBy([-offset, 0], { animate: true }); break;
      case 'RIGHT': map.panBy([offset, 0], { animate: true }); break;
      case 'CENTER': map.flyTo(CITY_CENTERS[activeCity], activeCity === 'kolkata' ? 12 : 14); break;
      default: break;
    }
  };

  const handleZoom = (delta) => {
    if (!mapInstanceRef.current) return;
    if (delta > 0) mapInstanceRef.current.zoomIn();
    else mapInstanceRef.current.zoomOut();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
    }, 200);
  };

  // Add Hotspot to Saved List
  const handleSaveToList = (listId, hotspotName) => {
    setSavedLists(prev => prev.map(l => {
      if (l.id === listId && !l.places.includes(hotspotName)) {
        return { ...l, count: l.count + 1, places: [hotspotName, ...l.places] };
      }
      return l;
    }));
  };

  // Toggle Recent Selection
  const toggleRecentItem = (id) => {
    setRecentItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const currentCenter = selectedHotspot ? [selectedHotspot.lat, selectedHotspot.lng] : CITY_CENTERS[activeCity];
  const googleMapsExternalUrl = `https://www.google.com/maps/@${currentCenter[0]},${currentCenter[1]},14z/data=!3m1!1e3`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>

      {/* FULL GOOGLE MAPS SHELL (8 Cols) */}
      <div style={{ gridColumn: 'span 8' }}>
        <div className={`gmap-full-shell ${isFullscreen ? 'fullscreen-mode' : ''}`}>

          {/* 1. Left-most Icon Strip (Screenshot 1 & 2) */}
          <div className="gmap-nav-strip">
            <button className="gmap-strip-btn" title="Menu" onClick={() => setIsDrawerCollapsed(!isDrawerCollapsed)}>
              <Menu size={20} />
            </button>

            <button
              className={`gmap-strip-btn ${activeNavTab === 'explore' ? 'active' : ''}`}
              onClick={() => { setActiveNavTab('explore'); setIsDrawerCollapsed(false); }}
              title="Explore & Search"
            >
              <div className="gmap-strip-icon-wrap">
                <Compass size={18} />
              </div>
              <span>Explore</span>
            </button>

            <button
              className={`gmap-strip-btn ${activeNavTab === 'saved' ? 'active' : ''}`}
              onClick={() => { setActiveNavTab('saved'); setIsDrawerCollapsed(false); }}
              title="Saved Lists"
            >
              <div className="gmap-strip-icon-wrap">
                <Bookmark size={18} />
              </div>
              <span>Saved</span>
            </button>

            <button
              className={`gmap-strip-btn ${activeNavTab === 'recents' ? 'active' : ''}`}
              onClick={() => { setActiveNavTab('recents'); setIsDrawerCollapsed(false); }}
              title="Recents"
            >
              <div className="gmap-strip-icon-wrap">
                <Clock size={18} />
              </div>
              <span>Recents</span>
            </button>

            <button
              className={`gmap-strip-btn ${activeNavTab === 'city_info' ? 'active' : ''}`}
              onClick={() => { setActiveNavTab('city_info'); setIsDrawerCollapsed(false); }}
              title="City Overview & Facts"
            >
              <div className="gmap-strip-icon-wrap">
                <MapPin size={18} />
              </div>
              <span>Overview</span>
            </button>

            {/* City Quick Switcher Thumbnail (Screenshot 1 & 2) */}
            <div
              className="gmap-strip-city-thumb"
              onClick={() => {
                const nextCity = activeCity === 'kolkata' ? 'lucknow' : 'kolkata';
                setActiveCity(nextCity);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo(CITY_CENTERS[nextCity], nextCity === 'kolkata' ? 12 : 14);
                }
              }}
              title={`Switch City: Currently ${activeCity.toUpperCase()} (Click to toggle)`}
            >
              <img
                src={activeCity === 'kolkata'
                  ? 'https://images.unsplash.com/photo-1558431382-27e303142255?w=100&q=80'
                  : 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=100&q=80'}
                alt={activeCity}
              />
            </div>

            {/* Mobile / Get App */}
            <button className="gmap-strip-btn" title="Get App" onClick={() => alert('Mobile ITS Companion App link sent!')}>
              <Smartphone size={18} />
              <span style={{ fontSize: '9px' }}>Get app</span>
            </button>
          </div>

          {/* 2. Sliding Drawer (Saved, Recents, Explore, City Info) */}
          <div className={`gmap-sliding-drawer ${isDrawerCollapsed ? 'collapsed' : ''}`}>

            {/* Collapse/Expand Chevron Tab Button */}
            <button
              className="gmap-drawer-collapse-btn"
              onClick={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
              title={isDrawerCollapsed ? "Expand Drawer" : "Collapse Drawer"}
            >
              {isDrawerCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* ================= VIEW: SAVED LISTS (Screenshot 1) ================= */}
            {activeNavTab === 'saved' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Search Bar inside Drawer */}
                <div className="gmap-drawer-header">
                  <div className="gmap-drawer-search">
                    <Search size={16} color="#0284c7" />
                    <input
                      type="text"
                      placeholder="Search Google Maps"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-tabs: Lists, Labeled, Maps */}
                <div className="gmap-subtabs">
                  <button
                    className={`gmap-subtab-btn ${savedSubTab === 'lists' ? 'active' : ''}`}
                    onClick={() => setSavedSubTab('lists')}
                  >
                    Lists
                  </button>
                  <button
                    className={`gmap-subtab-btn ${savedSubTab === 'labeled' ? 'active' : ''}`}
                    onClick={() => setSavedSubTab('labeled')}
                  >
                    Labeled
                  </button>
                  <button
                    className={`gmap-subtab-btn ${savedSubTab === 'maps' ? 'active' : ''}`}
                    onClick={() => setSavedSubTab('maps')}
                  >
                    Maps
                  </button>
                </div>

                {/* + New List Pill Button (Screenshot 1) */}
                <button
                  className="gmap-new-list-btn"
                  onClick={() => {
                    const name = prompt('Enter new list name:');
                    if (name) {
                      setSavedLists(prev => [...prev, { id: `list_${Date.now()}`, name, icon: '📌', color: '#0284c7', count: 0, places: [] }]);
                    }
                  }}
                >
                  <Plus size={16} />
                  <span>New list</span>
                </button>

                {/* Saved Lists Rows (Screenshot 1) */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {savedLists.map((list) => (
                    <div key={list.id} className="gmap-list-item">
                      <div className="gmap-list-icon" style={{ background: `${list.color}18`, color: list.color }}>
                        {list.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{list.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Private · {list.count} places</div>
                      </div>
                      <button
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        title="Add selected hotspot to this list"
                        onClick={() => {
                          if (selectedHotspot) {
                            handleSaveToList(list.id, selectedHotspot.name);
                            alert(`Saved "${selectedHotspot.name}" to "${list.name}"!`);
                          }
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= VIEW: RECENTS (Screenshot 2) ================= */}
            {activeNavTab === 'recents' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="gmap-drawer-header">
                  <div className="gmap-drawer-search">
                    <Search size={16} color="#0284c7" />
                    <input
                      type="text"
                      placeholder={`Search nearby ${activeCity === 'kolkata' ? 'Kolkata' : 'Lucknow'}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Crosshair size={16} color="#0284c7" style={{ cursor: 'pointer' }} />
                  </div>
                </div>

                <div style={{ padding: '14px 16px 8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Recents ⓘ</h3>
                </div>

                <div style={{ padding: '0 16px 8px 16px', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                  Last 3 days ({recentItems.length})
                </div>

                {/* Recents Items List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {recentItems.map((item) => (
                    <div
                      key={item.id}
                      className="gmap-recent-item"
                      onClick={() => {
                        if (item.city !== activeCity) {
                          setActiveCity(item.city);
                        }
                      }}
                    >
                      <img src={item.img} alt={item.name} className="gmap-recent-thumb" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.subtitle}</div>
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); toggleRecentItem(item.id); }}>
                        {item.checked ? <CheckSquare size={18} color="#0284c7" /> : <Square size={18} color="#94a3b8" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Action Bar (Screenshot 2) */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => alert('Selected recent places saved!')}
                      style={{ padding: '6px 12px', borderRadius: '16px', background: '#0284c7', color: '#fff', border: 'none', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Bookmark size={13} />
                      Save
                    </button>
                    <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Share2 size={14} color="#475569" />
                    </button>
                    <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Navigation size={14} color="#0284c7" />
                    </button>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, cursor: 'pointer' }} onClick={() => setRecentItems(prev => prev.map(i => ({ ...i, checked: true })))}>
                    Select all
                  </span>
                </div>
              </div>
            )}

            {/* ================= VIEW: CITY & CORRIDOR OVERVIEW (Screenshot 2 Middle Card) ================= */}
            {activeNavTab === 'city_info' && (
              <div className="gmap-city-overview">
                <div className="gmap-city-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                        {activeCity === 'kolkata' ? 'Kolkata' : 'Lucknow'}
                      </h2>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {activeCity === 'kolkata' ? 'West Bengal' : 'Uttar Pradesh'}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveNavTab('explore')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Quick Action Grid (Directions, Save, Nearby, Send to phone, Share) */}
                <div className="gmap-action-grid">
                  <button className="gmap-circle-action" onClick={() => alert('Route Directions calculation engaged!')}>
                    <div className="action-icon"><Navigation size={17} /></div>
                    <span>Directions</span>
                  </button>
                  <button className="gmap-circle-action" onClick={() => alert(`Saved ${activeCity.toUpperCase()} to your Favorites!`)}>
                    <div className="action-icon"><Bookmark size={17} /></div>
                    <span>Save</span>
                  </button>
                  <button className="gmap-circle-action" onClick={() => setActiveCategory('ALL')}>
                    <div className="action-icon"><Crosshair size={17} /></div>
                    <span>Nearby</span>
                  </button>
                  <button className="gmap-circle-action" onClick={() => alert('Corridor report sent to mobile!')}>
                    <div className="action-icon"><Smartphone size={17} /></div>
                    <span>Send to phone</span>
                  </button>
                  <button className="gmap-circle-action" onClick={() => alert('Link copied to clipboard!')}>
                    <div className="action-icon"><Share2 size={17} /></div>
                    <span>Share</span>
                  </button>
                </div>

                {/* Quick Facts Section (Screenshot 2) */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Quick facts</div>
                  <p style={{ color: '#475569', lineHeight: 1.5 }}>
                    {activeCity === 'kolkata'
                      ? "Kolkata (formerly Calcutta) is the capital of India's West Bengal state. Founded as an East India Company trading post, it was India's capital under the British Raj until 1911. Known for high-density transit corridors including Howrah Bridge and the EM Bypass."
                      : "Lucknow is the capital city of Uttar Pradesh, renowned for its heritage architecture and rapidly expanding metropolitan expressways including Kursi Road and the Outer Ring Road accident surveillance network."}
                  </p>
                </div>

                {/* Hotels Carousel (Screenshot 2) */}
                <div className="gmap-carousel-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>Hotels</span>
                    <span style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 600, cursor: 'pointer' }}>View more hotels</span>
                  </div>
                  <div className="gmap-carousel-scroll">
                    {HOTEL_CAROUSEL_DATA[activeCity].map((hotel) => (
                      <div key={hotel.id} className="gmap-carousel-card">
                        <img src={hotel.img} alt={hotel.name} />
                        <div className="gmap-carousel-card-body">
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {hotel.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            ★ {hotel.rating} ({hotel.reviews}) · {hotel.stars}
                          </div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
                            {hotel.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Corridors Patrol Section */}
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem', marginBottom: '8px' }}>
                    Surveillance Blackspots ({cityHotspots.length})
                  </div>
                  {cityHotspots.map((hs) => (
                    <div
                      key={hs.id}
                      onClick={() => setSelectedHotspot(hs)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: selectedHotspot?.id === hs.id ? '#e0f2fe' : '#f8fafc',
                        border: '1px solid #e2e8f0',
                        marginBottom: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{hs.name}</span>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: hs.riskLevel === 'Severe' ? '#ef4444' : '#f97316' }}>
                          {hs.currentRiskScore}%
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{hs.corridor}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= VIEW: EXPLORE & CATEGORIES ================= */}
            {activeNavTab === 'explore' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px' }}>
                <div className="gmap-drawer-search" style={{ marginBottom: '14px' }}>
                  <Search size={16} color="#0284c7" />
                  <input
                    type="text"
                    placeholder={`Search ${activeCity.toUpperCase()} locations & blackspots...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Quick Filter POIs
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  {[
                    { id: 'ALL', label: 'All Corridors', icon: MapPin },
                    { id: 'RESTAURANTS', label: 'Restaurants', icon: Utensils },
                    { id: 'HOTELS', label: 'Hotels', icon: Hotel },
                    { id: 'THINGS_TO_DO', label: 'Things to do', icon: Sparkles },
                    { id: 'MUSEUMS', label: 'Universities', icon: GraduationCap },
                    { id: 'TRANSIT', label: 'Transit Links', icon: Bus },
                    { id: 'PHARMACIES', label: 'Hospitals', icon: Pill },
                    { id: 'ATMS', label: 'ATMs', icon: CreditCard }
                  ].map((cat) => {
                    const IconComp = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: activeCategory === cat.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                          background: activeCategory === cat.id ? '#e0f2fe' : '#ffffff',
                          color: '#0f172a',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <IconComp size={14} color="#0284c7" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* City Quick Switcher Banner */}
                <div style={{ marginTop: 'auto', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Active City Region:</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setActiveCity('kolkata')}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: activeCity === 'kolkata' ? '#0284c7' : '#e2e8f0',
                        color: activeCity === 'kolkata' ? '#fff' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.76rem',
                        cursor: 'pointer'
                      }}
                    >
                      Kolkata
                    </button>
                    <button
                      onClick={() => setActiveCity('lucknow')}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: activeCity === 'lucknow' ? '#0284c7' : '#e2e8f0',
                        color: activeCity === 'lucknow' ? '#fff' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.76rem',
                        cursor: 'pointer'
                      }}
                    >
                      Lucknow
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Main Map Canvas Viewport */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

            {/* Floating Live Traffic Alert Card (Screenshot 2) */}
            <div className="gmap-alert-card">
              <div className="gmap-alert-card-header">
                <span>{activeCity === 'kolkata' ? 'Kolkata 31°' : 'Lucknow 32°'}</span>
                <Sun size={15} color="#eab308" />
              </div>

              <div className="gmap-alert-card-body" onClick={() => setShowAlertDetails(!showAlertDetails)}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Car size={16} color="#ef4444" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                    Heavy traffic in this area
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {activeCity === 'kolkata' ? 'Howrah Bridge / EM Bypass' : 'Kursi Road - MJ Funcity'}
                  </div>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </div>

              {showAlertDetails && (
                <div style={{ padding: '12px 14px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '0.74rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Traffic Delay:</span>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>+22 mins delay</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Congestion Index:</span>
                    <span style={{ color: '#ea580c', fontWeight: 700 }}>92% Critical</span>
                  </div>
                  <div style={{ background: '#eff6ff', padding: '6px 8px', borderRadius: '6px', color: '#1e40af', fontSize: '0.7rem', marginTop: '6px' }}>
                    💡 <b>Detour recommendation:</b> Divert via Kona Expressway / Belghoria Link.
                  </div>
                </div>
              )}
            </div>

            {/* Top Right "Open in Maps" external link */}
            <a
              href={googleMapsExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gmap-open-btn"
              title="Open full Google Maps satellite in new tab"
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
              title={`Switch to ${activeLayer === 'hybrid' ? 'Roadmap View' : 'Satellite View'}`}
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

            {/* Floating Commute / Drive Time Bar (Screenshot 2 Bottom-Right) */}
            <div className="gmap-drivetime-bar">
              <span style={{ color: '#0284c7' }}>6 hr ▾</span>
              <span>🚶</span>
              <span>🚗</span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                Zoom out to see drive time
              </span>
            </div>

            {/* Floating Street View 360 Thumbnail (Screenshot 2 Bottom-Right) */}
            <div
              className="gmap-streetview-thumb"
              onClick={() => setShowStreetView(true)}
              style={{
                backgroundImage: activeCity === 'kolkata'
                  ? 'url("https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80")'
                  : 'url("https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=200&q=80")'
              }}
              title="Click to open 360 Street View Panorama"
            >
              <div className="gmap-streetview-badge">
                <span>🔄 360°</span>
              </div>
            </div>

            {/* Right-Hand Navigation D-Pad & Zoom Controls Suite (Screenshot 1) */}
            <div className="gmap-controls-group" style={{ bottom: '90px' }}>
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
                <button className="gmap-dpad-center" onClick={() => handlePan('CENTER')} title="Recenter City" />
              </div>

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

      {/* 4. Telemetry & Live CCTV Inspection Drawer (4 Cols) */}
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

            {/* Telemetry Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Current Speed</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                  {selectedHotspot.currentAvgSpeed} km/h
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginLeft: '4px' }}>
                    / {selectedHotspot.speedLimit} max
                  </span>
                </div>
              </div>

              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Daily Volume</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-cyan)' }}>
                  {selectedHotspot.averageDailyVolume?.toLocaleString()} veh/day
                </div>
              </div>

              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Historical Crashes</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b' }}>
                  {selectedHotspot.historicalAccidentsCount} logged
                </div>
              </div>

              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>IoT Sensors</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981' }}>
                  {selectedHotspot.iotSensorsCount} online
                </div>
              </div>
            </div>

            {/* Simulated Live CCTV Feed */}
            <div style={{
              background: '#090d16',
              borderRadius: '10px',
              padding: '12px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={15} color="#38bdf8" />
                  <span style={{ fontSize: '0.74rem', color: '#f8fafc', fontWeight: 600 }}>
                    ITS Optical CCTV Cam
                  </span>
                </div>
                <span style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="status-dot" style={{ background: '#10b981' }} />
                  LIVE (1080p)
                </span>
              </div>

              <div style={{
                height: '110px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #111827 0%, #030712 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
                  pointerEvents: 'none'
                }} />

                <div style={{
                  position: 'absolute',
                  left: `${20 + (cctvFrame * 0.5) % 50}%`,
                  top: '30%',
                  width: '54px',
                  height: '42px',
                  border: '1px solid #ef4444',
                  boxShadow: '0 0 6px rgba(239, 68, 68, 0.5)',
                  borderRadius: '2px',
                  padding: '2px'
                }}>
                  <span style={{ fontSize: '8px', background: '#ef4444', color: '#fff', padding: '1px 3px', borderRadius: '2px', fontWeight: 700 }}>
                    BUS 0.94
                  </span>
                </div>

                <div style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '9px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  ISO 800 | {activeCity.toUpperCase()} ITS
                </div>
              </div>
            </div>

            {/* Dominant Hazard Factor */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px'
            }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Primary Hazard Attribution:
              </span>
              <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f8fafc', marginTop: '4px' }}>
                {selectedHotspot.primaryHazardFactor}
              </p>
            </div>

            {/* Run Prediction Studio Button */}
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
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)'
              }}
            >
              <Zap size={16} />
              Run ML Accident Prediction on this Spot
            </button>

          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Select a hotspot or location to inspect live telemetry
          </div>
        )}
      </div>

      {/* 360 Street View Interactive Modal */}
      {showStreetView && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            width: '800px',
            maxWidth: '95vw',
            background: '#0f172a',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ padding: '14px 20px', background: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} color="#38bdf8" />
                <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                  360° Street View Panoramic Inspection — {selectedHotspot ? selectedHotspot.name : (activeCity === 'kolkata' ? 'Howrah Bridge, Kolkata' : 'Kursi Road, Lucknow')}
                </span>
              </div>
              <button
                onClick={() => setShowStreetView(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              height: '420px',
              position: 'relative',
              backgroundImage: activeCity === 'kolkata'
                ? 'url("https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&q=80")'
                : 'url("https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                background: 'rgba(0,0,0,0.65)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '24px',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem'
              }}>
                <span>🔄 Drag to rotate 360° inspection angle</span>
              </div>
            </div>

            <div style={{ padding: '14px 20px', background: '#0b1120', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                Captured by Google Street View & Municipal ITS Camera Network
              </span>
              <button
                onClick={() => setShowStreetView(false)}
                style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
