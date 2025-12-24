import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

interface Property {
  id: number;
  title: string;
  price_per_night: number;
}

interface Reservation {
  id?: number;
  propertyId: number;
  startDate: string;
  endDate: string;
  guestName: string;
  guestEmail: string;
}

interface ReservationFromAPI {
  id?: number;
  property_id: number;
  check_in_date: string;
  check_out_date: string;
  guest_name: string;
  guest_email: string;
}

const calculateTotalPrice = (propertyId: number, startDate: string, endDate: string, properties: Property[]): number => {
  const property = properties.find(p => p.id === propertyId);
  if (!property) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays * property.price_per_night;
};

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Reservation>({
    propertyId: 0,
    startDate: '',
    endDate: '',
    guestName: '',
    guestEmail: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reservationsResponse, propertiesResponse] = await Promise.all([
        fetch('http://localhost:3000/api/reservations'),
        fetch('http://localhost:3000/api/properties')
      ]);

      if (!reservationsResponse.ok || !propertiesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const reservationsData: ReservationFromAPI[] = await reservationsResponse.json();
      const propertiesData = await propertiesResponse.json();

      setReservations(reservationsData.map(r => ({
        id: r.id,
        propertyId: r.property_id,
        startDate: r.check_in_date,
        endDate: r.check_out_date,
        guestName: r.guest_name,
        guestEmail: r.guest_email
      })));
      setProperties(propertiesData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: any = value;
    if (name === 'propertyId') {
      processedValue = parseInt(value, 10) || 0;
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações client-side
    if (!formData.propertyId || !formData.startDate || !formData.endDate || !formData.guestName.trim() || !formData.guestEmail.trim()) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end <= start) {
      setError('A data de término deve ser posterior à data de início.');
      return;
    }

    const totalPrice = calculateTotalPrice(formData.propertyId, formData.startDate, formData.endDate, properties);
    if (totalPrice <= 0) {
      setError('Erro no cálculo do preço total. Verifique as datas e o imóvel selecionado.');
      return;
    }

    try {
      const payload = {
        property_id: formData.propertyId,
        check_in_date: formData.startDate,
        check_out_date: formData.endDate,
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        total_price: totalPrice
      };

      let response;
      if (editingId) {
        response = await fetch(`http://localhost:3000/api/reservations/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('http://localhost:3000/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save reservation');
      }

      fetchData();
      resetForm();
    } catch (err) {
      setError('Failed to save reservation. Please try again.');
    }
  };

  const handleEdit = (reservation: Reservation) => {
    setFormData(reservation);
    setEditingId(reservation.id || null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta reserva?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/reservations/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete reservation');
        }
        fetchData();
      } catch (err) {
        setError('Failed to delete reservation. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      propertyId: 0,
      startDate: '',
      endDate: '',
      guestName: '',
      guestEmail: ''
    });
    setEditingId(null);
  };

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
        Gerenciamento de Reservas
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {editingId ? 'Editar Reserva' : 'Nova Reserva'}
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth required>
                  <InputLabel id="propertyId-label">Imóvel</InputLabel>
                  <Select
                    labelId="propertyId-label"
                    id="propertyId"
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={handleInputChange}
                    label="Imóvel"
                  >
                    <MenuItem value="">
                      <em>Selecione um imóvel</em>
                    </MenuItem>
                    {properties.map(property => (
                      <MenuItem key={property.id} value={property.id}>
                        {property.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Data de Início"
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  label="Data de Término"
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  label="Nome do Hóspede"
                  id="guestName"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Email do Hóspede"
                  id="guestEmail"
                  name="guestEmail"
                  type="email"
                  value={formData.guestEmail}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button type="submit" variant="contained" color="primary">
                    {editingId ? 'Atualizar' : 'Salvar'}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outlined" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lista de Reservas
              </Typography>
              {reservations.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Imóvel</TableCell>
                        <TableCell>Hóspede</TableCell>
                        <TableCell>Período</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reservations.map(reservation => {
                        const property = properties.find(p => p.id === reservation.propertyId);
                        return (
                          <TableRow key={reservation.id}>
                            <TableCell>{property ? property.title : 'N/A'}</TableCell>
                            <TableCell>{reservation.guestName}</TableCell>
                            <TableCell>
                              {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => handleEdit(reservation)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="error"
                                  onClick={() => reservation.id && handleDelete(reservation.id)}
                                >
                                  Excluir
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>Nenhuma reserva cadastrada.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reservations;