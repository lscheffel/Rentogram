import React, { useState, useEffect } from 'react';
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

        setProperties(propertiesData);
        setReservations(reservationsData);
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
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Calendário de Reservas</h5>
            </div>
            <div className="card-body">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={ptBrLocale}
                events={calendarEvents}
                height={600}
                eventClick={(info) => {
                  alert(`Reserva: ${info.event.title}\nPeríodo: ${info.event.start?.toLocaleDateString()} a ${info.event.end?.toLocaleDateString()}`);
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5>Estatísticas</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span>Total de Imóveis</span>
                <span className="badge bg-primary">{properties.length}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Total de Reservas</span>
                <span className="badge bg-success">{reservations.length}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Taxa de Ocupação</span>
                <span className="badge bg-warning">{calculateOccupancyRate()}%</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5>Próximas Reservas</h5>
            </div>
            <div className="card-body">
              {getUpcomingReservations().length > 0 ? (
                <div className="list-group">
                  {getUpcomingReservations().map(reservation => (
                    <div key={reservation.id} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{reservation.guestName}</h6>
                        <small>{new Date(reservation.startDate).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-1">Imóvel ID: {reservation.propertyId}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhuma reserva próxima.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;