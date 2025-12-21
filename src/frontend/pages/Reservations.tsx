import React, { useState, useEffect } from 'react';

interface Property {
  id: number;
  title: string;
}

interface Reservation {
  id?: number;
  propertyId: number;
  startDate: string;
  endDate: string;
  guestName: string;
  guestEmail: string;
}

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

      const reservationsData = await reservationsResponse.json();
      const propertiesData = await propertiesResponse.json();

      setReservations(reservationsData);
      setProperties(propertiesData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (editingId) {
        response = await fetch(`http://localhost:3000/api/reservations/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch('http://localhost:3000/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
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
      <h1 className="mb-4">Gerenciamento de Reservas</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>{editingId ? 'Editar Reserva' : 'Nova Reserva'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="propertyId" className="form-label">Imóvel</label>
                  <select
                    className="form-select"
                    id="propertyId"
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um imóvel</option>
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>{property.title}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="startDate" className="form-label">Data de Início</label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="endDate" className="form-label">Data de Término</label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="guestName" className="form-label">Nome do Hóspede</label>
                  <input
                    type="text"
                    className="form-control"
                    id="guestName"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="guestEmail" className="form-label">Email do Hóspede</label>
                  <input
                    type="email"
                    className="form-control"
                    id="guestEmail"
                    name="guestEmail"
                    value={formData.guestEmail}
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
              <h5>Lista de Reservas</h5>
            </div>
            <div className="card-body">
              {reservations.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Imóvel</th>
                        <th>Hóspede</th>
                        <th>Período</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map(reservation => {
                        const property = properties.find(p => p.id === reservation.propertyId);
                        return (
                          <tr key={reservation.id}>
                            <td>{property ? property.title : 'N/A'}</td>
                            <td>{reservation.guestName}</td>
                            <td>{new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() => handleEdit(reservation)}
                                >
                                  Editar
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => reservation.id && handleDelete(reservation.id)}
                                >
                                  Excluir
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>Nenhuma reserva cadastrada.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;