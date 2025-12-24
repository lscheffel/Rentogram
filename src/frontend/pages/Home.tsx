import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

interface Property {
  id: number;
  title: string;
  description: string;
}

interface Reservation {
  id: number;
  propertyId: number;
  startDate: string;
  endDate: string;
  guestName: string;
}

const Home: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesResponse, reservationsResponse] = await Promise.all([
          fetch('http://localhost:3000/api/properties'),
          fetch('http://localhost:3000/api/reservations')
        ]);

        if (!propertiesResponse.ok || !reservationsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const propertiesData = await propertiesResponse.json();
        const reservationsData = await reservationsResponse.json();

        // Map snake_case to camelCase
        const mappedReservations = reservationsData.map((res: any) => ({
          id: res.id,
          propertyId: res.property_id,
          startDate: res.check_in_date,
          endDate: res.check_out_date,
          guestName: res.guest_name,
        }));

        setProperties(propertiesData);
        setReservations(mappedReservations);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateOccupancyRate = (): number => {
    if (properties.length === 0) return 0;
    const occupiedProperties = new Set(reservations.map(r => r.propertyId));
    return Math.round((occupiedProperties.size / properties.length) * 100);
  };

  const getUpcomingReservations = (): Reservation[] => {
    const today = new Date();
    return reservations
      .filter(r => new Date(r.startDate) >= today)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 5);
  };

  const calendarEvents = reservations.map(reservation => ({
    title: `Reserva: ${reservation.guestName}`,
    start: reservation.startDate,
    end: reservation.endDate,
    allDay: true
  }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Calendário de Reservas
              </Typography>
              <Box sx={{ height: 600 }}>
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  locale={ptBrLocale}
                  events={calendarEvents}
                  height="100%"
                  eventClick={(info) => {
                    alert(`Reserva: ${info.event.title}\nPeríodo: ${info.event.start?.toLocaleDateString()} a ${info.event.end?.toLocaleDateString()}`);
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estatísticas
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Total de Imóveis</Typography>
                <Chip label={properties.length} color="primary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Total de Reservas</Typography>
                <Chip label={reservations.length} color="secondary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Taxa de Ocupação</Typography>
                <Chip label={`${calculateOccupancyRate()}%`} color="warning" />
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Próximas Reservas
              </Typography>
              {getUpcomingReservations().length > 0 ? (
                <List>
                  {getUpcomingReservations().map(reservation => (
                    <ListItem key={reservation.id} divider>
                      <ListItemText
                        primary={reservation.guestName}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              Imóvel ID: {reservation.propertyId}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(reservation.startDate).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Nenhuma reserva próxima.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;