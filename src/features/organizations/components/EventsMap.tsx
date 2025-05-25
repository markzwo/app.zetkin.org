import 'leaflet/dist/leaflet.css';
import { FC, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { latLngBounds } from 'leaflet';
import { Box, CircularProgress } from '@mui/material';

import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import BasicMarker from 'features/events/components/LocationModal/BasicMarker';
import { ZetkinEvent } from 'utils/types/zetkin';

interface EventsMapProps {
  events: ZetkinEvent[];
}

const MapWrapper = ({ children }: { children: (map: any) => JSX.Element }) => {
  const map = useMap();
  return children(map);
};

const EventsMap: FC<EventsMapProps> = ({ events }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const eventsByLocation = useMemo(
    () =>
      Object.groupBy(
        events.filter((event) => event.location !== null),
        (event) => event.location.id
      ),
    [events]
  );

  // Calculate bounds to fit all locations
  const bounds = useMemo(() => {
    const locations = Object.values(eventsByLocation).map(
      (events) => events[0].location!
    );
    if (locations.length > 0) {
      return latLngBounds(
        locations.map((location) => [location.lat, location.lng])
      );
    }
    // Default to world view if no locations
    return latLngBounds([
      [75, -170],
      [-60, 180],
    ]);
  }, [eventsByLocation]);

  if (!isClient) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <MapContainer bounds={bounds} style={{ height: '100%', width: '100%' }}>
        <MapWrapper>
          {(map) => {
            // Set initial view to fit all locations
            if (Object.keys(eventsByLocation).length > 0) {
              map.fitBounds(bounds);
            }
            return (
              <>
                <TileLayer
                  attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {Object.entries(eventsByLocation).map(
                  ([locationId, events]) => {
                    const location = events[0].location!;
                    return (
                      <DivIconMarker
                        key={locationId}
                        position={[location.lat, location.lng]}
                      >
                        <BasicMarker color="#1976d2" events={events.length} />
                      </DivIconMarker>
                    );
                  }
                )}
              </>
            );
          }}
        </MapWrapper>
      </MapContainer>
    </Box>
  );
};

export default EventsMap;
