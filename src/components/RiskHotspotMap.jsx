import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Volume2,
  ShieldAlert,
  Activity,
  Gauge,
  FileText,
  RefreshCw,
  Radio,
  Sliders,
  SlidersHorizontal,
  Download,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

import { exportHotspotsToCSV } from '../utils/csvExport';
import {
  DEFAULT_HOTSPOTS,
  convertPoiToHotspot,
  createCustomCoordinateHotspot
} from '../data/hotspotsData';

// City Center Coordinates
const CITY_CENTERS = {
  kolkata: [22.5726, 88.3639],
  lucknow: [26.9460, 81.0080]
};

// Municipal Boundary Polygons (Red-and-White dashed outline matching Google Maps inspection view)
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

// Rich POIs for Kolkata
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

// Rich POIs for Lucknow
const LUCKNOW_POIS = [
  { id: 'lko_poi_1', name: 'Integral University', category: 'MUSEUMS', type: 'education', lat: 26.9587, lng: 80.9992, rating: 4.4, desc: 'Premier university campus on Kursi Road.' },
  { id: 'lko_poi_2', name: 'Scorpio Club & Resort in Lucknow', category: 'RESTAURANTS', type: 'restaurant', lat: 26.9425, lng: 80.9780, rating: 4.3, desc: 'Luxury resort with acute highway access ramp.' },
  { id: 'lko_poi_3', name: 'MJ Funcity Waterpark & Resort', category: 'THINGS_TO_DO', type: 'amusement', lat: 26.9360, lng: 81.0180, rating: 4.1, desc: 'Major recreational waterpark on Dashauli-Kapasi curve.' },
  { id: 'lko_poi_4', name: 'Samarpan Hospital', category: 'PHARMACIES', type: 'hospital', lat: 26.9120, lng: 81.0185, rating: 4.5, desc: 'Multi-specialty emergency trauma hospital & pharmacy.' },
  { id: 'lko_poi_5', name: 'Kukrail Forest Reserve', category: 'THINGS_TO_DO', type: 'nature', lat: 26.9050, lng: 80.9900, rating: 4.6, desc: 'Protected eco-corridor with winding night road.' }
];

// Curated Hotels Carousel data
const HOTEL_CAROUSEL_DATA = {
  kolkata: [
    { id: 'h1', name: 'The Samilton Hotel', price: '₹4,013', rating: 4.1, reviews: '1,353', stars: '3-star hotel', lat: 22.5360, lng: 88.3540, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80' },
    { id: 'h2', name: 'Hyatt Regency Kolkata', price: '₹10,490', rating: 4.4, reviews: '88,875', stars: '5-star hotel', lat: 22.5710, lng: 88.4040, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&q=80' },
    { id: 'h3', name: 'The Oberoi Grand', price: '₹12,500', rating: 4.7, reviews: '14,200', stars: '5-star heritage', lat: 22.5600, lng: 88.3520, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&q=80' }
  ],
  lucknow: [
    { id: 'hl1', name: 'Scorpio Resort Villas', price: '₹3,450', rating: 4.2, reviews: '940', stars: 'Resort stay', lat: 26.9425, lng: 80.9780, img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&q=80' },
    { id: 'hl2', name: 'Taj Mahal Hotel Lucknow', price: '₹9,800', rating: 4.8, reviews: '5,120', stars: '5-star luxury', lat: 26.8520, lng: 80.9380, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80' },
    { id: 'hl3', name: 'Lotus Portico Dine & Stay', price: '₹2,800', rating: 4.0, reviews: '420', stars: 'Boutique stay', lat: 26.9200, lng: 80.9850, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&q=80' }
  ]
};

export default function RiskHotspotMap({ hotspots = [], onSelectHotspot }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const boundaryGroupRef = useRef(null);
  const customPinGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Shell State
  const [activeCity, setActiveCity] = useState('kolkata'); // 'kolkata' | 'lucknow'
  const [activeNavTab, setActiveNavTab] = useState('hotspots'); // 'hotspots' | 'saved' | 'recents' | 'explore' | 'city_info'
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [savedSubTab, setSavedSubTab] = useState('lists'); // 'lists' | 'labeled' | 'maps'
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL'); // 'ALL' | 'SEVERE' | 'HIGH' | 'MODERATE'
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeLayer, setActiveLayer] = useState('hybrid'); // 'hybrid' | 'roadmap' | 'satellite'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStreetView, setShowStreetView] = useState(false);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [cctvFrame, setCctvFrame] = useState(0);
  const [cctvMode, setCctvMode] = useState('optical'); // 'optical' | 'thermal' | 'yolo'
  const [isSimulatingIncident, setIsSimulatingIncident] = useState(false);
  const [expandedListId, setExpandedListId] = useState('list_1');
  const [customPinCoord, setCustomPinCoord] = useState(null);

  // Safe Hotspots - Fallback to comprehensive embedded dataset if prop is empty
  const safeHotspots = useMemo(() => {
    return (hotspots && hotspots.length > 0) ? hotspots : DEFAULT_HOTSPOTS;
  }, [hotspots]);

  // Filter hotspots for the active city
  const cityHotspots = useMemo(() => {
    return safeHotspots.filter(h => {
      if (activeCity === 'kolkata') {
        return h.city?.toLowerCase() === 'kolkata' || (h.id && h.id.includes('kol'));
      }
      return h.city?.toLowerCase() === 'lucknow' || (!h.city && (!h.id || !h.id.includes('kol')));
    });
  }, [safeHotspots, activeCity]);

  // Selected Hotspot for telemetry inspection drawer
  const [selectedHotspot, setSelectedHotspot] = useState(() => {
    return cityHotspots.length > 0 ? cityHotspots[0] : DEFAULT_HOTSPOTS[0];
  });

  // Keep selectedHotspot aligned when city changes
  useEffect(() => {
    if (cityHotspots.length > 0) {
      const match = cityHotspots.find(h => h.id === selectedHotspot?.id);
      if (!match) {
        setSelectedHotspot(cityHotspots[0]);
      }
    }
  }, [activeCity, cityHotspots]);

  // Saved Lists State
  const [savedLists, setSavedLists] = useState([
    {
      id: 'list_1',
      name: 'Want to go',
      icon: '⛳',
      color: '#16a34a',
      count: 2,
      places: [
        { name: 'Howrah Bridge Approach', desc: 'Strand Road bottleneck', city: 'kolkata', lat: 22.5851, lng: 88.3468, risk: 92 },
        { name: 'Victoria Memorial', desc: 'Historic cultural precinct', city: 'kolkata', lat: 22.5448, lng: 88.3426, risk: 45 }
      ]
    },
    {
      id: 'list_2',
      name: 'Travel plans',
      icon: '🧳',
      color: '#0284c7',
      count: 2,
      places: [
        { name: 'Kona Expressway Gateway', desc: 'Santragachi Overpass', city: 'kolkata', lat: 22.5815, lng: 88.2825, risk: 78 },
        { name: 'Kursi Road Corridor', desc: 'Integral Univ arterial link', city: 'lucknow', lat: 26.9587, lng: 80.9992, risk: 84 }
      ]
    },
    {
      id: 'list_3',
      name: 'Starred places',
      icon: '⭐',
      color: '#f59e0b',
      count: 3,
      places: [
        { name: 'Science City Interchange', desc: 'EM Bypass Junction', city: 'kolkata', lat: 22.5398, lng: 88.3962, risk: 82 },
        { name: 'Park Circus 7-Point', desc: 'Maa Flyover exit ramp', city: 'kolkata', lat: 22.5414, lng: 88.3683, risk: 89 },
        { name: 'MJ Funcity Waterpark', desc: 'Dashauli-Kapasi S-curve', city: 'lucknow', lat: 26.9360, lng: 81.0180, risk: 88 }
      ]
    },
    {
      id: 'list_4',
      name: 'Favorites',
      icon: '❤️',
      color: '#ef4444',
      count: 3,
      places: [
        { name: 'Taratala Freight Link', desc: 'Diamond Harbour Road', city: 'kolkata', lat: 22.5112, lng: 88.3075, risk: 86 },
        { name: 'Kukrail Forest Way', desc: 'Jankipuram East ring road', city: 'lucknow', lat: 26.9050, lng: 80.9900, risk: 46 },
        { name: 'Scorpio Club Junction', desc: 'Kursi Road Turnoff', city: 'lucknow', lat: 26.9425, lng: 80.9780, risk: 68 }
      ]
    },
    {
      id: 'list_5',
      name: 'Saved places',
      icon: '🔖',
      color: '#0d9488',
      count: 2,
      places: [
        { name: 'Peerless Hospital Trauma', desc: 'EM Bypass South Ext', city: 'kolkata', lat: 22.4820, lng: 88.3980, risk: 58 },
        { name: 'Samarpan Hospital', desc: 'Dewan Road Connector', city: 'lucknow', lat: 26.9120, lng: 81.0185, risk: 76 }
      ]
    }
  ]);

  // Recents State
  const [recentItems, setRecentItems] = useState([
    {
      id: 'rec_1',
      name: 'Howrah Bridge Approach',
      subtitle: 'Strand Road, Kolkata',
      img: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=100&q=80',
      checked: true,
      city: 'kolkata',
      lat: 22.5851,
      lng: 88.3468,
      hotspotId: 'hs_kol_01'
    },
    {
      id: 'rec_2',
      name: 'Park Circus 7-Point Crossing',
      subtitle: 'Maa Flyover Ramp, Kolkata',
      img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=100&q=80',
      checked: false,
      city: 'kolkata',
      lat: 22.5414,
      lng: 88.3683,
      hotspotId: 'hs_kol_02'
    },
    {
      id: 'rec_3',
      name: 'Integral University Corridor',
      subtitle: 'Kursi Road, Lucknow',
      img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&q=80',
      checked: false,
      city: 'lucknow',
      lat: 26.9587,
      lng: 80.9992,
      hotspotId: 'hs_01'
    },
    {
      id: 'rec_4',
      name: 'MJ Funcity Waterpark Curve',
      subtitle: 'Dashauli - Kapasi Rd, Lucknow',
      img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=100&q=80',
      checked: false,
      city: 'lucknow',
      lat: 26.9360,
      lng: 81.0180,
      hotspotId: 'hs_03'
    }
  ]);

  // Dynamic CCTV frame timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCctvFrame(prev => (prev + 1) % 100);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

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
      customPinGroupRef.current = L.layerGroup().addTo(map);

      // Map Click Handler: Click anywhere to inspect coordinates
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setCustomPinCoord([lat, lng]);
        const customSpot = createCustomCoordinateHotspot(lat, lng, activeCity === 'kolkata' ? 'Kolkata' : 'Lucknow');
        setSelectedHotspot(customSpot);
      });

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

  // Render Municipal Boundary or Danger Corridor
  const renderBoundaries = (L, map) => {
    if (!boundaryGroupRef.current) return;
    boundaryGroupRef.current.clearLayers();

    if (activeCity === 'kolkata') {
      const whiteBoundary = L.polygon(KOLKATA_BOUNDARY, {
        color: '#ffffff',
        weight: 6,
        fillColor: '#ef4444',
        fillOpacity: 0.05,
        lineCap: 'round'
      });

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

  // Render Custom Pin on map click
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !customPinGroupRef.current) return;
    const L = window.L;
    const group = customPinGroupRef.current;
    group.clearLayers();

    if (customPinCoord) {
      const pinHtml = `
        <div class="gmap-marker-pin gmap-marker-custom-coord" style="width: 32px; height: 32px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="22" x2="18" y1="12" y2="12"/>
            <line x1="6" x2="2" y1="12" y2="12"/>
            <line x1="12" x2="12" y1="6" y2="2"/>
            <line x1="12" x2="12" y1="22" y2="18"/>
          </svg>
        </div>
      `;

      const customDivIcon = L.divIcon({
        className: 'custom-coord-leaflet-pin',
        html: pinHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const pinMarker = L.marker(customPinCoord, { icon: customDivIcon });
      pinMarker.bindTooltip('<b>Custom Survey Point</b><br/>Click to inspect spatial risk telemetry', {
        direction: 'top',
        className: 'gmap-tooltip'
      });
      group.addLayer(pinMarker);
    }
  }, [customPinCoord]);

  // Render Markers on Map (Hotspots + POIs)
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !mapLoaded) return;
    const L = window.L;
    const markersGroup = markersGroupRef.current;
    if (!markersGroup) return;

    markersGroup.clearLayers();

    // 1. Render Hotspot Markers
    cityHotspots.forEach((h) => {
      const isSelected = selectedHotspot?.id === h.id;
      const riskColor = h.riskLevel === 'Severe' ? '#ef4444' : h.riskLevel === 'High' ? '#f97316' : '#f59e0b';

      const iconHtml = `
        <div class="gmap-marker-pin gmap-marker-hotspot ${isSelected ? 'gmap-marker-selected' : ''}" style="
          width: ${isSelected ? '36px' : '28px'};
          height: ${isSelected ? '36px' : '28px'};
          background: ${riskColor};
          box-shadow: 0 0 ${isSelected ? '22px' : '12px'} ${riskColor};
          border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
          color: #ffffff;
          font-weight: 800;
          font-size: ${isSelected ? '12px' : '10px'};
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          ${h.currentRiskScore}%
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-icon',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([h.lat, h.lng], { icon: customIcon });

      marker.bindTooltip(`<b>${h.name}</b><br/><span style="color:${riskColor}; font-weight:700">Risk: ${h.currentRiskScore}% (${h.riskLevel})</span><br/><span style="font-size:10px; color:#cbd5e1">Click to inspect live telemetry</span>`, {
        direction: 'top',
        className: 'gmap-tooltip'
      });

      marker.on('click', () => {
        setSelectedHotspot(h);
        setCustomPinCoord(null);
        mapInstanceRef.current.flyTo([h.lat, h.lng], 15, { animate: true, duration: 0.7 });
      });

      markersGroup.addLayer(marker);
    });

    // 2. Render POIs Markers (Clicking any POI inspects it!)
    const pois = activeCity === 'kolkata' ? KOLKATA_POIS : LUCKNOW_POIS;
    const filteredPOIs = pois.filter(p => activeCategory === 'ALL' || p.category === activeCategory);

    filteredPOIs.forEach((poi) => {
      const isSelected = selectedHotspot?.name === poi.name || selectedHotspot?.id === `poi_inspect_${poi.id}`;
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
        <div class="gmap-marker-pin ${iconColorClass} ${isSelected ? 'gmap-marker-selected' : ''}" style="
          width: ${isSelected ? '32px' : '26px'};
          height: ${isSelected ? '32px' : '26px'};
          border: ${isSelected ? '3px solid #38bdf8' : '2px solid #ffffff'};
        ">
          ${iconSvg}
        </div>
      `;

      const poiIcon = L.divIcon({
        className: 'custom-poi-leaflet',
        html: poiHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const poiMarker = L.marker([poi.lat, poi.lng], { icon: poiIcon });
      poiMarker.bindTooltip(`<b>${poi.name}</b><br/><span style="color:#94a3b8">${poi.desc}</span><br/><span style="color:#38bdf8; font-size:10px">Click to inspect location telemetry</span>`, {
        direction: 'top',
        className: 'gmap-tooltip'
      });

      poiMarker.on('click', () => {
        const inspectedPoi = convertPoiToHotspot(poi, activeCity === 'kolkata' ? 'Kolkata' : 'Lucknow');
        setSelectedHotspot(inspectedPoi);
        setCustomPinCoord(null);
        mapInstanceRef.current.flyTo([poi.lat, poi.lng], 15, { animate: true, duration: 0.7 });
      });

      markersGroup.addLayer(poiMarker);
    });
  }, [cityHotspots, activeCategory, selectedHotspot, mapLoaded, activeCity]);

  // Pan & Zoom Handlers
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

  // Select location and fly map to coordinates
  const selectAndFocusLocation = (loc) => {
    if (loc.city && loc.city.toLowerCase() !== activeCity) {
      setActiveCity(loc.city.toLowerCase());
    }

    // Check if it's already a full hotspot in safeHotspots
    const fullHs = safeHotspots.find(h => h.name.toLowerCase() === loc.name.toLowerCase() || h.id === loc.hotspotId);
    if (fullHs) {
      setSelectedHotspot(fullHs);
    } else {
      // Synthesize a full location profile
      const synthetic = {
        id: `loc_${Date.now()}`,
        name: loc.name,
        corridor: loc.desc || loc.subtitle || `${loc.name}, ${activeCity.toUpperCase()}`,
        city: loc.city || activeCity,
        lat: loc.lat,
        lng: loc.lng,
        currentRiskScore: loc.risk || 68,
        riskLevel: (loc.risk || 68) >= 80 ? 'Severe' : (loc.risk || 68) >= 60 ? 'High' : 'Moderate',
        historicalAccidentsCount: Math.round((loc.risk || 68) * 0.32),
        averageDailyVolume: 58000,
        speedLimit: 50,
        currentAvgSpeed: 34,
        weatherStatus: 'Clear',
        roadSurface: 'Dry',
        roadType: 'Corridor',
        timeOfDay: 'Live Observation',
        activeAlert: (loc.risk || 68) > 75 ? `High Traffic Volume near ${loc.name}` : null,
        cctvActive: true,
        cctvCameraId: `CAM-${activeCity === 'kolkata' ? 'KOL' : 'LKO'}-LOC-01`,
        iotSensorsCount: 7,
        pavementFriction: 0.68,
        primaryHazardFactor: `High Urban Activity & Arterial Merging at ${loc.name}`,
        secondaryFactors: [
          { name: 'Vehicle Merging Discrepancy', pct: 40 },
          { name: 'Pedestrian Density', pct: 35 },
          { name: 'Curb Parking Spillover', pct: 25 }
        ],
        recommendedMitigations: [
          'Dynamic speed limit monitoring',
          'Deploy pedestrian crossing priority',
          'Signal green corridor optimization'
        ]
      };
      setSelectedHotspot(synthetic);
    }

    setCustomPinCoord(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 15, { animate: true, duration: 0.8 });
    }
  };

  // Add Hotspot to Saved List
  const handleSaveToList = (listId, hotspotName) => {
    setSavedLists(prev => prev.map(l => {
      if (l.id === listId) {
        const placeExists = l.places.some(p => (p.name || p) === hotspotName);
        if (!placeExists) {
          const newPlace = {
            name: hotspotName,
            desc: selectedHotspot?.corridor || 'Saved location',
            city: activeCity,
            lat: selectedHotspot?.lat || CITY_CENTERS[activeCity][0],
            lng: selectedHotspot?.lng || CITY_CENTERS[activeCity][1],
            risk: selectedHotspot?.currentRiskScore || 70
          };
          return { ...l, count: l.count + 1, places: [newPlace, ...l.places] };
        }
      }
      return l;
    }));
  };

  // Toggle Recent Selection
  const toggleRecentItem = (id) => {
    setRecentItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Export Safety Telemetry Report
  const handleExportReport = () => {
    if (!selectedHotspot) return;
    const reportData = {
      location: selectedHotspot.name,
      corridor: selectedHotspot.corridor,
      city: selectedHotspot.city || activeCity,
      coordinates: { lat: selectedHotspot.lat, lng: selectedHotspot.lng },
      riskScore: selectedHotspot.currentRiskScore,
      riskLevel: selectedHotspot.riskLevel,
      currentSpeed: `${selectedHotspot.currentAvgSpeed} km/h`,
      speedLimit: `${selectedHotspot.speedLimit} km/h`,
      dailyVolume: selectedHotspot.averageDailyVolume,
      historicalAccidents: selectedHotspot.historicalAccidentsCount,
      pavementFriction: selectedHotspot.pavementFriction,
      activeAlert: selectedHotspot.activeAlert || 'None',
      primaryHazardFactor: selectedHotspot.primaryHazardFactor,
      recommendedMitigations: selectedHotspot.recommendedMitigations || [],
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ITS-Safety-Report-${selectedHotspot.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export Hotspots Corridor Risk Registry to CSV
  const handleExportHotspotsCSV = () => {
    const listToExport = filteredHotspots && filteredHotspots.length > 0 ? filteredHotspots : cityHotspots;
    exportHotspotsToCSV(listToExport, `traffic_hotspots_${activeCity}_${Date.now()}.csv`);
  };

  // Filtered Hotspots based on Search & Risk Level
  const filteredHotspots = useMemo(() => {
    return cityHotspots.filter(h => {
      const matchesSearch = !searchQuery ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.corridor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'ALL' ||
        (riskFilter === 'SEVERE' && h.riskLevel === 'Severe') ||
        (riskFilter === 'HIGH' && h.riskLevel === 'High') ||
        (riskFilter === 'MODERATE' && (h.riskLevel === 'Moderate' || h.riskLevel === 'Low'));
      return matchesSearch && matchesRisk;
    });
  }, [cityHotspots, searchQuery, riskFilter]);

  // Effective Telemetry Data with Incident Simulation Surge
  const effectiveTelemetry = useMemo(() => {
    if (!selectedHotspot) return null;
    if (!isSimulatingIncident) return selectedHotspot;

    return {
      ...selectedHotspot,
      currentRiskScore: Math.min(99, selectedHotspot.currentRiskScore + 16),
      riskLevel: 'Severe',
      currentAvgSpeed: Math.max(8, Math.round(selectedHotspot.currentAvgSpeed * 0.45)),
      pavementFriction: 0.28,
      weatherStatus: 'Monsoon Downpour',
      roadSurface: 'Flooded / Hydroplaning Hazard',
      activeAlert: '🚨 CRITICAL INCIDENT SIMULATION: Heavy Vehicle Aquaplaning & Multi-Lane Blockage!'
    };
  }, [selectedHotspot, isSimulatingIncident]);

  const currentCenter = selectedHotspot ? [selectedHotspot.lat, selectedHotspot.lng] : CITY_CENTERS[activeCity];
  const googleMapsExternalUrl = `https://www.google.com/maps/@${currentCenter[0]},${currentCenter[1]},14z/data=!3m1!1e3`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>

      {/* FULL GOOGLE MAPS SHELL (8 Cols) */}
      <div style={{ gridColumn: 'span 8' }}>
        <div className={`gmap-full-shell ${isFullscreen ? 'fullscreen-mode' : ''}`}>

          {/* 1. Left-most Icon Strip (Navigation Drawer Tabs) */}
          <div className="gmap-nav-strip">
            <button
              className="gmap-strip-btn"
              title="Toggle Navigation Menu"
              onClick={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
            >
              <Menu size={20} />
            </button>

            {/* Dedicated Hotspots Selector Tab */}
            <button
              className={`gmap-strip-btn ${activeNavTab === 'hotspots' ? 'active' : ''}`}
              onClick={() => { setActiveNavTab('hotspots'); setIsDrawerCollapsed(false); }}
              title="Risk Hotspots & Corridors"
            >
              <div className="gmap-strip-icon-wrap" style={{ position: 'relative' }}>
                <ShieldAlert size={18} />
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ef4444'
                }} />
              </div>
              <span>Hotspots</span>
            </button>

            {/* Explore Tab */}
            <button
              className={`gmap-strip-btn ${activeNavTab === 'explore' ? 'active' : ''}`}
              onClick={() => { setActiveNavTab('explore'); setIsDrawerCollapsed(false); }}
              title="Explore POIs & Amenities"
            >
              <div className="gmap-strip-icon-wrap">
                <Compass size={18} />
              </div>
              <span>Explore</span>
            </button>

            {/* Saved Tab */}
            <button
              className={`gmap-strip-btn ${activeNavTab === 'saved' ? 'active' : ''}`}
              onClick={() => { setActiveNavTab('saved'); setIsDrawerCollapsed(false); }}
              title="Saved Lists & Blackspots"
            >
              <div className="gmap-strip-icon-wrap">
                <Bookmark size={18} />
              </div>
              <span>Saved</span>
            </button>

            {/* Recents Tab */}
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

            {/* Overview Tab */}
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

            {/* City Quick Switcher Thumbnail */}
            <div
              className="gmap-strip-city-thumb"
              onClick={() => {
                const nextCity = activeCity === 'kolkata' ? 'lucknow' : 'kolkata';
                setActiveCity(nextCity);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo(CITY_CENTERS[nextCity], nextCity === 'kolkata' ? 12 : 14);
                }
              }}
              title={`Active: ${activeCity.toUpperCase()} (Click to toggle)`}
            >
              <img
                src={activeCity === 'kolkata'
                  ? 'https://images.unsplash.com/photo-1558431382-27e303142255?w=100&q=80'
                  : 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=100&q=80'}
                alt={activeCity}
              />
            </div>

            {/* Mobile / Get App */}
            <button className="gmap-strip-btn" title="ITS Companion App" onClick={() => alert('Mobile ITS Companion App connection verified!')}>
              <Smartphone size={18} />
              <span style={{ fontSize: '9px' }}>Get app</span>
            </button>
          </div>

          {/* 2. Sliding Drawer (Hotspots, Saved, Recents, Explore, City Info) */}
          <div className={`gmap-sliding-drawer ${isDrawerCollapsed ? 'collapsed' : ''}`}>

            {/* Collapse/Expand Chevron Tab Button */}
            <button
              className="gmap-drawer-collapse-btn"
              onClick={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
              title={isDrawerCollapsed ? "Expand Drawer" : "Collapse Drawer"}
            >
              {isDrawerCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* ================= VIEW 1: DEDICATED HOTSPOTS & LOCATIONS SELECTOR ================= */}
            {activeNavTab === 'hotspots' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
                {/* Search Bar inside Drawer */}
                <div className="gmap-drawer-header">
                  <div className="gmap-drawer-search">
                    <Search size={16} color="#0284c7" />
                    <input
                      type="text"
                      placeholder={`Search ${activeCity === 'kolkata' ? 'Kolkata' : 'Lucknow'} blackspots...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Risk Level Filter Chips */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px', overflowX: 'auto', paddingBottom: '2px' }}>
                    {[
                      { id: 'ALL', label: `All (${cityHotspots.length})` },
                      { id: 'SEVERE', label: 'Severe (80%+)', color: '#ef4444' },
                      { id: 'HIGH', label: 'High (60-79%)', color: '#f97316' },
                      { id: 'MODERATE', label: 'Moderate', color: '#f59e0b' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setRiskFilter(f.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '14px',
                          border: riskFilter === f.id ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                          background: riskFilter === f.id ? '#e0f2fe' : '#f8fafc',
                          color: riskFilter === f.id ? '#0284c7' : '#475569',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hotspots Card List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
                    Click any hotspot to inspect telemetry ({filteredHotspots.length})
                  </div>

                  {filteredHotspots.map((hs) => {
                    const isSelected = selectedHotspot?.id === hs.id;
                    const riskColor = hs.riskLevel === 'Severe' ? '#ef4444' : hs.riskLevel === 'High' ? '#f97316' : '#f59e0b';

                    return (
                      <div
                        key={hs.id}
                        className={`gmap-hotspot-item ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedHotspot(hs);
                          setCustomPinCoord(null);
                          if (mapInstanceRef.current) {
                            mapInstanceRef.current.flyTo([hs.lat, hs.lng], 15, { animate: true, duration: 0.7 });
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                                {hs.name}
                              </span>
                              {isSelected && (
                                <span style={{ background: '#0284c7', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                  ✓
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px' }}>
                              {hs.corridor}
                            </div>
                          </div>

                          <div style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: `${riskColor}18`,
                            border: `1px solid ${riskColor}44`,
                            color: riskColor,
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '48px'
                          }}>
                            <span>{hs.currentRiskScore}%</span>
                            <span style={{ fontSize: '9px', fontWeight: 700 }}>{hs.riskLevel}</span>
                          </div>
                        </div>

                        {/* Speed and Volume Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.71rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '6px', marginTop: '2px' }}>
                          <span>Speed: <b>{hs.currentAvgSpeed} km/h</b> / {hs.speedLimit} limit</span>
                          <span>Crashes: <b style={{ color: '#ef4444' }}>{hs.historicalAccidentsCount}</b></span>
                        </div>

                        {hs.activeAlert && (
                          <div style={{ fontSize: '0.68rem', color: '#b91c1c', background: '#fef2f2', padding: '3px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <AlertTriangle size={11} color="#ef4444" />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {hs.activeAlert}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Tip */}
                <div style={{ padding: '10px 16px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Crosshair size={13} color="#0284c7" />
                  <span>Tip: You can also click anywhere on the map to survey exact coordinates!</span>
                </div>
              </div>
            )}

            {/* ================= VIEW 2: SAVED LISTS & PLACES ================= */}
            {activeNavTab === 'saved' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
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

                {/* + New List Pill Button */}
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

                {/* Saved Lists Rows */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {savedSubTab === 'lists' && savedLists.map((list) => {
                    const isExpanded = expandedListId === list.id;
                    return (
                      <div key={list.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <div
                          className="gmap-list-item"
                          onClick={() => setExpandedListId(isExpanded ? null : list.id)}
                        >
                          <div className="gmap-list-icon" style={{ background: `${list.color}18`, color: list.color }}>
                            {list.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{list.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Private · {list.count} places</div>
                          </div>
                          <button
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                            title="Add currently selected location to this list"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedHotspot) {
                                handleSaveToList(list.id, selectedHotspot.name);
                                alert(`Saved "${selectedHotspot.name}" to "${list.name}"!`);
                              }
                            }}
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>

                        {/* Expanded Places in List */}
                        {isExpanded && (
                          <div style={{ background: '#f8fafc', padding: '6px 16px 12px 64px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {list.places.length === 0 ? (
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No locations added yet. Click ⋮ to add current hotspot.</div>
                            ) : (
                              list.places.map((place, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => selectAndFocusLocation(typeof place === 'string' ? { name: place, lat: CITY_CENTERS[activeCity][0], lng: CITY_CENTERS[activeCity][1] } : place)}
                                  style={{
                                    padding: '8px 10px',
                                    borderRadius: '6px',
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s'
                                  }}
                                >
                                  <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                                      {typeof place === 'string' ? place : place.name}
                                    </div>
                                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                                      Click to inspect live telemetry
                                    </div>
                                  </div>
                                  <CornerDownRight size={14} color="#0284c7" />
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Labeled Tab: High-priority ITS Facilities */}
                  {savedSubTab === 'labeled' && (
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        Command & Surveillance Hubs
                      </div>
                      {[
                        { name: 'Kolkata Central ITS Command', desc: 'Lalbazar Police HQ, Kolkata', lat: 22.5697, lng: 88.3512, city: 'kolkata', risk: 42 },
                        { name: 'North River Patrol Dispatch Base', desc: 'Howrah Foreshore Rd', lat: 22.5920, lng: 88.3410, city: 'kolkata', risk: 75 },
                        { name: 'Lucknow Integrated Traffic Control Center', desc: 'Gomti Nagar, Lucknow', lat: 26.8500, lng: 80.9950, city: 'lucknow', risk: 38 },
                        { name: 'Kursi Road Incident Response Unit', desc: 'Dashauli Highway Gate', lat: 26.9530, lng: 81.0060, city: 'lucknow', risk: 82 }
                      ].map((item, i) => (
                        <div
                          key={i}
                          onClick={() => selectAndFocusLocation(item)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            marginBottom: '8px',
                            background: '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Maps Tab: Specialized Overlays */}
                  {savedSubTab === 'maps' && (
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        Accident & Safety Maps (2026 Layer Catalog)
                      </div>
                      {[
                        { title: 'High-Density Collision Corridors 2026', layers: '14 Blackspots Active' },
                        { title: 'Monsoon Waterlogging & Hydroplaning Risk Zones', layers: '8 Drainage Hotspots' },
                        { title: 'Night Express Commercial Freight Route Speeding', layers: 'Outer Ring Road Patrol' }
                      ].map((m, i) => (
                        <div key={i} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '8px', background: '#f8fafc' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{m.title}</div>
                          <div style={{ fontSize: '0.7rem', color: '#0284c7', marginTop: '2px' }}>{m.layers} · Synced with ITS</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= VIEW 3: RECENTS ================= */}
            {activeNavTab === 'recents' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
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
                  Click any recent location to inspect live telemetry
                </div>

                {/* Recents Items List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {recentItems.map((item) => (
                    <div
                      key={item.id}
                      className="gmap-recent-item"
                      onClick={() => selectAndFocusLocation(item)}
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

                {/* Bottom Action Bar */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => alert('Selected recent locations saved to your favorites!')}
                      style={{ padding: '6px 12px', borderRadius: '16px', background: '#0284c7', color: '#fff', border: 'none', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Bookmark size={13} />
                      Save
                    </button>
                    <button
                      onClick={() => alert('Location coordinates copied to clipboard')}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Share2 size={14} color="#475569" />
                    </button>
                  </div>
                  <span
                    style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => setRecentItems(prev => prev.map(i => ({ ...i, checked: true })))}
                  >
                    Select all
                  </span>
                </div>
              </div>
            )}

            {/* ================= VIEW 4: CITY & CORRIDOR OVERVIEW ================= */}
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
                      onClick={() => setActiveNavTab('hotspots')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Quick Action Grid */}
                <div className="gmap-action-grid">
                  <button className="gmap-circle-action" onClick={() => alert('Optimal safety route calculated avoiding top 3 blackspots!')}>
                    <div className="action-icon"><Navigation size={17} /></div>
                    <span>Directions</span>
                  </button>
                  <button className="gmap-circle-action" onClick={() => alert(`Saved ${activeCity.toUpperCase()} to your Favorites!`)}>
                    <div className="action-icon"><Bookmark size={17} /></div>
                    <span>Save</span>
                  </button>
                  <button className="gmap-circle-action" onClick={() => setActiveNavTab('hotspots')}>
                    <div className="action-icon"><ShieldAlert size={17} /></div>
                    <span>Hotspots</span>
                  </button>
                  <button className="gmap-circle-action" onClick={() => alert('Corridor safety report sent to mobile device!')}>
                    <div className="action-icon"><Smartphone size={17} /></div>
                    <span>Send to phone</span>
                  </button>
                  <button className="gmap-circle-action" onClick={() => alert('Link copied to clipboard!')}>
                    <div className="action-icon"><Share2 size={17} /></div>
                    <span>Share</span>
                  </button>
                </div>

                {/* Quick Facts Section */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Quick facts</div>
                  <p style={{ color: '#475569', lineHeight: 1.5 }}>
                    {activeCity === 'kolkata'
                      ? "Kolkata (formerly Calcutta) is the capital of India's West Bengal state. Known for high-density transit corridors including Howrah Bridge, Park Circus 7-Point, and the EM Bypass. ITS monitoring covers 7 critical blackspots."
                      : "Lucknow is the capital of Uttar Pradesh, with major high-speed accident surveillance corridors along Kursi Road, Outer Ring Road, and the Dashauli-Kapasi curve."}
                  </p>
                </div>

                {/* Hotels Carousel */}
                <div className="gmap-carousel-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>Hotels & Transit Points</span>
                    <span style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 600 }}>Click to inspect</span>
                  </div>
                  <div className="gmap-carousel-scroll">
                    {HOTEL_CAROUSEL_DATA[activeCity].map((hotel) => (
                      <div
                        key={hotel.id}
                        className="gmap-carousel-card"
                        onClick={() => selectAndFocusLocation({
                          name: hotel.name,
                          desc: `${hotel.stars} · Near high-transit corridor`,
                          city: activeCity,
                          lat: hotel.lat,
                          lng: hotel.lng,
                          risk: 45
                        })}
                      >
                        <img src={hotel.img} alt={hotel.name} />
                        <div className="gmap-carousel-card-body">
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {hotel.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            ★ {hotel.rating} ({hotel.reviews})
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
                      onClick={() => {
                        setSelectedHotspot(hs);
                        setCustomPinCoord(null);
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo([hs.lat, hs.lng], 15, { animate: true });
                        }
                      }}
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

            {/* ================= VIEW 5: EXPLORE & CATEGORIES ================= */}
            {activeNavTab === 'explore' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px', background: '#ffffff' }}>
                <div className="gmap-drawer-search" style={{ marginBottom: '14px' }}>
                  <Search size={16} color="#0284c7" />
                  <input
                    type="text"
                    placeholder={`Search ${activeCity.toUpperCase()} POIs...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Filter Locations by Category
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  {[
                    { id: 'ALL', label: 'All POIs', icon: MapPin },
                    { id: 'TRANSIT', label: 'Transit Hubs', icon: Bus },
                    { id: 'MUSEUMS', label: 'Colleges & Museums', icon: GraduationCap },
                    { id: 'PHARMACIES', label: 'Hospitals', icon: Pill },
                    { id: 'RESTAURANTS', label: 'Restaurants', icon: Utensils },
                    { id: 'HOTELS', label: 'Hotels', icon: Hotel },
                    { id: 'THINGS_TO_DO', label: 'Attractions', icon: Sparkles }
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

                {/* POI List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {(activeCity === 'kolkata' ? KOLKATA_POIS : LUCKNOW_POIS)
                    .filter(p => activeCategory === 'ALL' || p.category === activeCategory)
                    .map((poi) => (
                      <div
                        key={poi.id}
                        onClick={() => {
                          const inspected = convertPoiToHotspot(poi, activeCity === 'kolkata' ? 'Kolkata' : 'Lucknow');
                          setSelectedHotspot(inspected);
                          setCustomPinCoord(null);
                          if (mapInstanceRef.current) {
                            mapInstanceRef.current.flyTo([poi.lat, poi.lng], 15, { animate: true });
                          }
                        }}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          marginBottom: '8px',
                          background: selectedHotspot?.name === poi.name ? '#e0f2fe' : '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{poi.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{poi.desc}</div>
                        <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600, marginTop: '4px' }}>
                          ★ {poi.rating} · Click to inspect telemetry
                        </div>
                      </div>
                    ))}
                </div>

                {/* City Switcher Banner */}
                <div style={{ marginTop: 'auto', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Active City Region:</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setActiveCity('kolkata')}
                      style={{
                        flex: 1,
                        padding: '7px',
                        borderRadius: '6px',
                        border: 'none',
                        background: activeCity === 'kolkata' ? '#0284c7' : '#e2e8f0',
                        color: activeCity === 'kolkata' ? '#fff' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      Kolkata
                    </button>
                    <button
                      onClick={() => setActiveCity('lucknow')}
                      style={{
                        flex: 1,
                        padding: '7px',
                        borderRadius: '6px',
                        border: 'none',
                        background: activeCity === 'lucknow' ? '#0284c7' : '#e2e8f0',
                        color: activeCity === 'lucknow' ? '#fff' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.78rem',
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

            {/* Floating Live Traffic Alert Card (Clicking it focuses the alert hotspot!) */}
            <div className="gmap-alert-card">
              <div className="gmap-alert-card-header">
                <span>{activeCity === 'kolkata' ? 'Kolkata 31°C' : 'Lucknow 32°C'}</span>
                <Sun size={15} color="#eab308" />
              </div>

              <div
                className="gmap-alert-card-body"
                onClick={() => {
                  setShowAlertDetails(!showAlertDetails);
                  // Focus the primary alert hotspot
                  const alertSpot = cityHotspots.find(h => h.activeAlert) || cityHotspots[0];
                  if (alertSpot) {
                    setSelectedHotspot(alertSpot);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([alertSpot.lat, alertSpot.lng], 15, { animate: true });
                    }
                  }
                }}
                style={{ cursor: 'pointer' }}
                title="Click to view & inspect this active traffic blackspot"
              >
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
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>+24 mins delay</span>
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

            {/* Bottom-Left Layers Switcher Thumbnail */}
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

            {/* Floating Commute / Drive Time Bar */}
            <div className="gmap-drivetime-bar">
              <span style={{ color: '#0284c7' }}>6 hr ▾</span>
              <span>🚶</span>
              <span>🚗</span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                Zoom out to see drive time
              </span>
            </div>

            {/* Floating Street View 360 Thumbnail */}
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

            {/* Right-Hand Navigation D-Pad & Zoom Controls Suite */}
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
        {effectiveTelemetry ? (
          <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>

            {/* Header with Risk Badge & Location Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: effectiveTelemetry.riskLevel === 'Severe' ? 'rgba(239, 68, 68, 0.2)' : effectiveTelemetry.riskLevel === 'High' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: effectiveTelemetry.riskLevel === 'Severe' ? '#ef4444' : effectiveTelemetry.riskLevel === 'High' ? '#f97316' : '#f59e0b',
                    border: `1px solid ${effectiveTelemetry.riskLevel === 'Severe' ? '#ef4444' : effectiveTelemetry.riskLevel === 'High' ? '#f97316' : '#f59e0b'}66`
                  }}>
                    {effectiveTelemetry.riskLevel} Blackspot
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--brand-cyan)', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                    {effectiveTelemetry.city || activeCity.toUpperCase()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginTop: '6px', fontWeight: 800, lineHeight: 1.3 }}>
                  {effectiveTelemetry.name}
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {effectiveTelemetry.corridor}
                </p>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  📍 {effectiveTelemetry.lat.toFixed(4)}°N, {effectiveTelemetry.lng.toFixed(4)}°E · Live ITS Feed
                </div>
              </div>

              {/* Large Risk Gauge Ring */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: `radial-gradient(circle, #0b1120 60%, ${effectiveTelemetry.riskLevel === 'Severe' ? '#ef444433' : '#f9731633'} 100%)`,
                border: `3px solid ${effectiveTelemetry.riskLevel === 'Severe' ? '#ef4444' : effectiveTelemetry.riskLevel === 'High' ? '#f97316' : '#f59e0b'}`,
                boxShadow: `0 0 16px ${effectiveTelemetry.riskLevel === 'Severe' ? '#ef444466' : '#f9731666'}`,
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: effectiveTelemetry.riskLevel === 'Severe' ? '#ef4444' : '#f97316',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {effectiveTelemetry.currentRiskScore}%
                </span>
                <span style={{ fontSize: '8px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Risk Index
                </span>
              </div>
            </div>

            {/* Quick Feature Action Bar: Run Prediction, Simulate Incident, Export */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => setIsSimulatingIncident(!isSimulatingIncident)}
                style={{
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: isSimulatingIncident ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                  background: isSimulatingIncident ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSimulatingIncident ? '#f87171' : '#e2e8f0',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Activity size={13} color={isSimulatingIncident ? '#ef4444' : '#38bdf8'} />
                <span>{isSimulatingIncident ? 'Reset Simulation' : 'Simulate Incident'}</span>
              </button>

              <button
                onClick={handleExportReport}
                style={{
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#e2e8f0',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                title="Download JSON Telemetry Safety Audit"
              >
                <Download size={13} color="#10b981" />
                <span>Export Audit</span>
              </button>

              <button
                onClick={handleExportHotspotsCSV}
                style={{
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  background: 'rgba(56, 189, 248, 0.08)',
                  color: 'var(--brand-cyan)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                title="Export all corridor hotspots to CSV dataset"
              >
                <FileSpreadsheet size={13} color="var(--brand-cyan)" />
                <span>Export CSV ({filteredHotspots.length})</span>
              </button>
            </div>

            {/* Active Alert Banner or Incident Simulation Banner */}
            {effectiveTelemetry.activeAlert && (
              <div className={isSimulatingIncident ? 'incident-sim-active' : ''} style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '9px 11px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700, lineHeight: 1.3 }}>
                  {effectiveTelemetry.activeAlert}
                </span>
              </div>
            )}

            {/* Telemetry 4-Metric Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {/* Metric 1: Current Speed vs Limit */}
              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Velocity & Flow</span>
                  <Gauge size={12} color="#38bdf8" />
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                  {effectiveTelemetry.currentAvgSpeed} km/h
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginLeft: '4px', fontWeight: 500 }}>
                    / {effectiveTelemetry.speedLimit} max
                  </span>
                </div>
                <div className="telemetry-progress-bg">
                  <div
                    className="telemetry-progress-fill"
                    style={{
                      width: `${Math.min(100, (effectiveTelemetry.currentAvgSpeed / effectiveTelemetry.speedLimit) * 100)}%`,
                      background: (effectiveTelemetry.currentAvgSpeed / effectiveTelemetry.speedLimit) > 1.1 ? '#ef4444' : (effectiveTelemetry.currentAvgSpeed / effectiveTelemetry.speedLimit) < 0.4 ? '#f97316' : '#10b981'
                    }}
                  />
                </div>
              </div>

              {/* Metric 2: Daily Traffic Volume */}
              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Daily Volume</span>
                  <Car size={12} color="#38bdf8" />
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--brand-cyan)', marginTop: '2px' }}>
                  {effectiveTelemetry.averageDailyVolume?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                  Vehicles / 24 hr cycle
                </div>
              </div>

              {/* Metric 3: Historical Crashes */}
              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Accident Log</span>
                  <AlertCircle size={12} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                  {effectiveTelemetry.historicalAccidentsCount} Crashes
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                  Reported by Municipal Traffic
                </div>
              </div>

              {/* Metric 4: Pavement Skid Resistance */}
              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Pavement Grip (μ)</span>
                  <SlidersHorizontal size={12} color="#10b981" />
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: effectiveTelemetry.pavementFriction < 0.4 ? '#ef4444' : '#10b981', marginTop: '2px' }}>
                  μ = {effectiveTelemetry.pavementFriction?.toFixed(2) || '0.65'}
                </div>
                <div className="telemetry-progress-bg">
                  <div
                    className="telemetry-progress-fill"
                    style={{
                      width: `${(effectiveTelemetry.pavementFriction || 0.65) * 100}%`,
                      background: effectiveTelemetry.pavementFriction < 0.4 ? '#ef4444' : '#10b981'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Live Optical & Thermal CCTV Feed */}
            <div style={{
              background: '#090d16',
              borderRadius: '10px',
              padding: '12px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={14} color="#38bdf8" />
                  <span style={{ fontSize: '0.72rem', color: '#f8fafc', fontWeight: 700 }}>
                    {effectiveTelemetry.cctvCameraId || 'CAM-METRO-01'}
                  </span>
                </div>

                {/* CCTV Mode Toggles */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['optical', 'thermal', 'yolo'].map(m => (
                    <button
                      key={m}
                      onClick={() => setCctvMode(m)}
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: 'none',
                        background: cctvMode === m ? '#0284c7' : '#1e293b',
                        color: '#ffffff',
                        fontSize: '9px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* CCTV Video Monitor Canvas */}
              <div style={{
                height: '115px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #111827 0%, #030712 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }} className={cctvMode === 'thermal' ? 'cctv-thermal-mode' : ''}>
                {/* CRT Scanlines */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 1px, transparent 1px, transparent 2px)',
                  pointerEvents: 'none'
                }} />

                {/* YOLO Bounding Box 1: Bus / Truck */}
                {(cctvMode === 'yolo' || cctvMode === 'optical') && (
                  <div
                    className="cctv-yolo-box"
                    style={{
                      left: `${18 + (cctvFrame * 0.45) % 52}%`,
                      top: '25%',
                      width: '58px',
                      height: '45px',
                      borderColor: '#ef4444',
                      boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)'
                    }}
                  >
                    <span className="cctv-yolo-label" style={{ background: '#ef4444' }}>
                      BUS 0.94
                    </span>
                  </div>
                )}

                {/* YOLO Bounding Box 2: Commuter Car */}
                {(cctvMode === 'yolo' || cctvMode === 'optical') && (
                  <div
                    className="cctv-yolo-box"
                    style={{
                      left: `${58 - (cctvFrame * 0.35) % 45}%`,
                      top: '42%',
                      width: '42px',
                      height: '34px',
                      borderColor: '#38bdf8',
                      boxShadow: '0 0 6px rgba(56, 189, 248, 0.4)'
                    }}
                  >
                    <span className="cctv-yolo-label" style={{ background: '#0284c7' }}>
                      CAR 0.98
                    </span>
                  </div>
                )}

                {/* CCTV Camera HUD Metadata */}
                <div style={{ position: 'absolute', top: '5px', left: '8px', fontSize: '9px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  ISO 800 · 30 FPS · 1080p
                </div>
                <div style={{ position: 'absolute', bottom: '5px', right: '8px', fontSize: '9px', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  ● REC {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Dominant Hazard Factor & Secondary Risk Attribution */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '11px'
            }}>
              <span style={{ fontSize: '0.66rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                Dominant Hazard Attribution:
              </span>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', marginTop: '3px', lineHeight: 1.3 }}>
                {effectiveTelemetry.primaryHazardFactor}
              </p>

              {effectiveTelemetry.secondaryFactors && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {effectiveTelemetry.secondaryFactors.map((sf, i) => (
                    <div key={i} style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span>{sf.name}</span>
                        <span style={{ color: '#38bdf8', fontWeight: 700 }}>{sf.pct}%</span>
                      </div>
                      <div className="telemetry-progress-bg" style={{ height: '4px' }}>
                        <div className="telemetry-progress-fill" style={{ width: `${sf.pct}%`, background: 'var(--brand-cyan)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Run Prediction Studio Primary CTA Button */}
            <button
              onClick={() => {
                if (onSelectHotspot) onSelectHotspot(effectiveTelemetry);
              }}
              style={{
                marginTop: 'auto',
                background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-cyan) 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontWeight: 800,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(56, 189, 248, 0.4)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 22px rgba(56, 189, 248, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(56, 189, 248, 0.4)';
              }}
            >
              <Zap size={16} />
              Run ML Accident Prediction on this Spot
            </button>

          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <MapPin size={36} color="#38bdf8" />
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700 }}>Select a Hotspot or Location</h4>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '240px' }}>
              Click any red blackspot marker on the map, choose from the Hotspots drawer, or tap anywhere to inspect live ITS telemetry.
            </p>
            <button
              onClick={() => {
                if (cityHotspots.length > 0) setSelectedHotspot(cityHotspots[0]);
              }}
              style={{
                padding: '8px 16px',
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Inspect Top Blackspot
            </button>
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
            width: '820px',
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
                <span>🔄 360° Panoramic Inspection · Drag or pan to view lane geometry</span>
              </div>
            </div>

            <div style={{ padding: '14px 20px', background: '#0b1120', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                Captured by Municipal ITS Camera Network & Google Street View Imagery
              </span>
              <button
                onClick={() => setShowStreetView(false)}
                style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
