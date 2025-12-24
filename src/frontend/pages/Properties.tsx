import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
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
  id?: number;
  title: string;
  description: string;
  address: string;
  price_per_night: number;
  bedrooms?: number;
  bathrooms?: number;
  max_guests?: number;
  amenities?: string;
  image_url?: string;
}

type FormData = Omit<Property, 'amenities'> & { amenities: string };

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    address: '',
    price_per_night: 0,
    bedrooms: 0,
    bathrooms: 0,
    max_guests: 1,
    amenities: '',
    image_url: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load properties. Please try again later.');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: any = value;
    if (['price_per_night', 'bedrooms', 'bathrooms', 'max_guests'].includes(name)) {
      processedValue = parseFloat(value) || 0;
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação client-side
    if (!formData.title.trim() || !formData.description.trim() || !formData.address.trim() || formData.price_per_night <= 0) {
      setError('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    if (!formData.amenities.trim()) {
      setError('Adicione pelo menos uma comodidade.');
      return;
    }

    try {
      // Omitir campos opcionais vazios
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          if (['bedrooms', 'bathrooms', 'max_guests', 'amenities', 'image_url'].includes(key)) {
            return value !== '' && value !== 0;
          }
          return true;
        })
      );
      let response;
      if (editingId) {
        response = await fetch(`http://localhost:3000/api/properties/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('http://localhost:3000/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save property');
      }

      fetchProperties();
      resetForm();
    } catch (err) {
      setError('Failed to save property. Please try again.');
    }
  };

  const handleEdit = (property: Property) => {
    setFormData({
      ...property,
      amenities: property.amenities || ''
    });
    setEditingId(property.id || null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/properties/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete property');
        }
        fetchProperties();
      } catch (err) {
        setError('Failed to delete property. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      address: '',
      price_per_night: 0,
      bedrooms: 0,
      bathrooms: 0,
      max_guests: 1,
      amenities: '',
      image_url: ''
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
        Cadastro de Imóveis
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {editingId ? 'Editar Imóvel' : 'Novo Imóvel'}
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Título"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Descrição"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  required
                  fullWidth
                />
                <TextField
                  label="Endereço"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Preço por Noite (R$)"
                  id="price_per_night"
                  name="price_per_night"
                  type="number"
                  value={formData.price_per_night}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                  fullWidth
                />
                <TextField
                  label="Quartos"
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  inputProps={{ min: 0 }}
                  fullWidth
                />
                <TextField
                  label="Comodidades (separadas por vírgula)"
                  id="amenities"
                  name="amenities"
                  value={formData.amenities}
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
                Lista de Imóveis
              </Typography>
              {properties.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Título</TableCell>
                        <TableCell>Endereço</TableCell>
                        <TableCell>Preço por Noite</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {properties.map(property => (
                        <TableRow key={property.id}>
                          <TableCell>{property.title}</TableCell>
                          <TableCell>{property.address}</TableCell>
                          <TableCell>R$ {property.price_per_night?.toFixed(2)}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="secondary"
                                onClick={() => handleEdit(property)}
                              >
                                Editar
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => property.id && handleDelete(property.id)}
                              >
                                Excluir
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>Nenhum imóvel cadastrado.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Properties;