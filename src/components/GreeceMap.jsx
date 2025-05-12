import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PropTypes from 'prop-types';

function MapController({ targetBounds }) {
  const map = useMap();
  const [lastBounds, setLastBounds] = useState(null);

  useEffect(() => {
    if (targetBounds && map) {
      const isValidBounds = targetBounds.every(coord => 
        coord[0] >= 34.8 && coord[0] <= 41.7 &&
        coord[1] >= 19.4 && coord[1] <= 29.6
      );

      if (isValidBounds && !isSameBounds(targetBounds, lastBounds)) {
        map.flyToBounds(targetBounds, {
          animate: true,
          duration: 1.5,
          padding: [80, 80],
          maxZoom: 14
        });
        setLastBounds(targetBounds);
      }
    }
  }, [targetBounds, map, lastBounds]);

  return null;
}

function isSameBounds(b1, b2) {
  if (!b1 || !b2) return false;
  return b1[0][0].toFixed(4) === b2[0][0].toFixed(4) && 
         b1[0][1].toFixed(4) === b2[0][1].toFixed(4) &&
         b1[1][0].toFixed(4) === b2[1][0].toFixed(4) &&
         b1[1][1].toFixed(4) === b2[1][1].toFixed(4);
}

const darkIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const spreadCoordinates = (articles) => {
  const coordGroups = {};
  const bounds = [
    [34.8, 19.4],
    [41.7, 29.6]
  ];

  articles.forEach(article => {
    const key = `${article.lat.toFixed(4)}_${article.lng.toFixed(4)}`;
    coordGroups[key] = coordGroups[key] || [];
    coordGroups[key].push(article);
  });

  return Object.values(coordGroups).flatMap(group => {
    if (group.length === 1) return group;
    
    const radius = 0.002;
    return group.map((article, idx) => {
      const angle = (idx * (2 * Math.PI)) / group.length;
      return {
        ...article,
        lat: Math.min(bounds[1][0], Math.max(bounds[0][0], 
          article.lat + (radius * Math.cos(angle))
        )),
        lng: Math.min(bounds[1][1], Math.max(bounds[0][1], 
          article.lng + (radius * Math.sin(angle))
        ))
      };
    });
  });
};

const GreeceMap = ({ articles, targetBounds }) => {
  const center = [39.0, 22.0];
  const bounds = [
    [34.8, 19.4],
    [41.7, 29.6]
  ];

  const [mapHeight, setMapHeight] = useState("600px");
  
  useEffect(() => {
    const updateMapHeight = () => {
      const height = window.innerWidth < 768 ? '70vh' : '600px';
      setMapHeight(height);
    };
    
    updateMapHeight();
    window.addEventListener('resize', updateMapHeight);
    return () => window.removeEventListener('resize', updateMapHeight);
  }, []);

  const validArticles = spreadCoordinates(
    articles
      .map(article => ({
        ...article,
        lat: parseFloat(article.lat),
        lng: parseFloat(article.lng),
        subLocation: Array.isArray(article.subLocation) ? 
          article.subLocation : 
          (article.subLocation ? [article.subLocation] : [])
      }))
      .filter(article => 
        article.lat >= bounds[0][0] &&
        article.lat <= bounds[1][0] &&
        article.lng >= bounds[0][1] &&
        article.lng <= bounds[1][1]
      )
  );

  return (
    <div className="map-container relative w-full">
      <MapContainer 
        center={center} 
        zoom={6} 
        style={{ height: mapHeight, width: '100%' }}
        className="z-0 rounded-lg"
        minZoom={6}
        maxBounds={bounds}
        touchZoom={true}
        tap={false}
        inertia={true}
        inertiaDeceleration={3000}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          className="map-tiles"
        />
        
        {targetBounds && <MapController targetBounds={targetBounds} />}
        
        {validArticles.map(article => (
          <Marker
            icon={darkIcon}
            key={`${article.subcategory}-${article.id}-${article.slug}`}
            position={[article.lat, article.lng]}
            eventHandlers={{
              mouseover: (e) => {
                const marker = e.target;
                marker.openPopup();
                
                if (marker._popupCloseTimeout) {
                  clearTimeout(marker._popupCloseTimeout);
                  delete marker._popupCloseTimeout;
                }

                const popupEl = marker.getPopup()?.getElement();
                if (popupEl) {
                  const onPopupEnter = () => {
                    clearTimeout(marker._popupCloseTimeout);
                    marker.openPopup();
                  };
                  const onPopupLeave = () => marker.closePopup();
                  
                  popupEl.addEventListener('mouseenter', onPopupEnter);
                  popupEl.addEventListener('mouseleave', onPopupLeave);
                  popupEl._cleanup = () => {
                    popupEl.removeEventListener('mouseenter', onPopupEnter);
                    popupEl.removeEventListener('mouseleave', onPopupLeave);
                  };
                }
              },
              mouseout: (e) => {
                const marker = e.target;
                marker._popupCloseTimeout = setTimeout(() => {
                  const popupEl = marker.getPopup()?.getElement();
                  if (popupEl?._cleanup) {
                    popupEl._cleanup();
                    delete popupEl._cleanup;
                  }
                  marker.closePopup();
                }, 200);
              },
              click: (e) => {
                const marker = e.target;
                if (marker._popupCloseTimeout) {
                  clearTimeout(marker._popupCloseTimeout);
                  delete marker._popupCloseTimeout;
                }
              }
            }}
          >
          <Popup 
  className="custom-popup"
  closeButton={false}
  autoClose={false}
  closeOnClick={false}
>
  <div className="w-[200px]">
    {/* Image Section */}
    {article.imageUrl && (
      <div className="w-full overflow-hidden mb-0">
        <img 
          src={article.imageUrl}
          alt={article.image?.alt || article.title}
          className="w-full h-32 object-cover rounded-t"
          onError={(e) => {
            e.target.src = '/default-image.webp';
          }}
        />
      </div>
    )}
    
    {/* Content Section */}
    <div className="p-2 bg-n-8 rounded-b">
      <h3 className="font-bold text-white text-sm mb-1 text-center">
        {article.title}
      </h3>
      
      {/* Link */}
      <a 
        href={`/${article.category}/${article.subcategory}/${article.slug}`}
        className="text-purple-500 hover:text-purple-100 hover:underline text-xs block w-full text-center mt-1"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        Δείτε το άρθρο →
      </a>
    </div>
  </div>
</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

GreeceMap.propTypes = {
  articles: PropTypes.array.isRequired,
  targetBounds: PropTypes.array
};

export default GreeceMap;