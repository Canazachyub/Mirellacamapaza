import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { SEDES } from '@/utils/constants';
import type { Sede } from '@/types';

// Fix para el icono de marcador de Leaflet
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const primaryIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapComponentProps {
  sedes?: Sede[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const MapComponent = ({
  sedes = SEDES,
  center = [-15.870420, -69.999016],
  zoom = 8,
  height = '400px',
}: MapComponentProps) => {
  return (
    <div style={{ height }} className="rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sedes.map((sede) => (
          <Marker
            key={sede.id}
            position={[sede.lat, sede.lng]}
            icon={sede.esPrincipal ? primaryIcon : customIcon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-secondary-900 mb-1">
                  {sede.nombre}
                </h3>
                <p className="text-sm text-secondary-600 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {sede.direccion}
                </p>
                {sede.referencia && (
                  <p className="text-xs text-secondary-500 mb-2">
                    Ref: {sede.referencia}
                  </p>
                )}
                {sede.googleMapsUrl && (
                  <a
                    href={sede.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Navigation className="w-4 h-4" />
                    Abrir en Google Maps
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
