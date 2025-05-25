import { FC } from 'react';
import { Box, Fab } from '@mui/material';
import { Map, List } from '@mui/icons-material';

interface EventsViewToggleProps {
  isMapView: boolean;
  onToggle: () => void;
  show: boolean;
}

const EventsViewToggle: FC<EventsViewToggleProps> = ({
  isMapView,
  onToggle,
  show,
}) => {
  if (!show) {
    return null;
  }

  return (
    <Box
      sx={{
        bottom: 16,
        position: 'fixed',
        right: 16,
        zIndex: 1000,
      }}
    >
      <Fab
        color="primary"
        onClick={onToggle}
        size="medium"
        variant="extended"
      >
        {isMapView ? (
          <>
            <List sx={{ mr: 1 }} />
            List
          </>
        ) : (
          <>
            <Map sx={{ mr: 1 }} />
            Map
          </>
        )}
      </Fab>
    </Box>
  );
};

export default EventsViewToggle; 