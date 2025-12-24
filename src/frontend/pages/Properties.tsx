import React, { useState, useEffect } from 'react';

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
      <h1 className="mb-4">Cadastro de Imóveis</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>{editingId ? 'Editar Imóvel' : 'Novo Imóvel'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descrição</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Endereço</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price_per_night" className="form-label">Preço por Noite (R$)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price_per_night"
                    name="price_per_night"
                    value={formData.price_per_night}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="bedrooms" className="form-label">Quartos</label>
                  <input
                    type="number"
                    className="form-control"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="amenities" className="form-label">Comodidades (separadas por vírgula)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="amenities"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Atualizar' : 'Salvar'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Lista de Imóveis</h5>
            </div>
            <div className="card-body">
              {properties.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Endereço</th>
                        <th>Preço por Noite</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map(property => (
                        <tr key={property.id}>
                          <td>{property.title}</td>
                          <td>{property.address}</td>
                          <td>R$ {property.price_per_night?.toFixed(2)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleEdit(property)}
                              >
                                Editar
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => property.id && handleDelete(property.id)}
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>Nenhum imóvel cadastrado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;