import { useState, useEffect } from 'react';
import type { Entity } from '../types';
import { entityApi } from '../services/api';

/**
 * TEMPLATE: React Component with CRUD Operations
 *
 * ADAPT THIS:
 * 1. Rename component and file (e.g., BookList, RestaurantDashboard)
 * 2. Update Entity type reference
 * 3. Change API service calls
 * 4. Customize form fields
 * 5. Update CSS classes
 */

interface ComponentTemplateProps {
  // Add props if needed
  userId?: number;
  onEntitySelected?: (entity: Entity) => void;
}

function ComponentTemplate({ userId, onEntitySelected }: ComponentTemplateProps) {
  // STATE MANAGEMENT
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  // Form state
  const [formData, setFormData] = useState<Partial<Entity>>({
    name: '',
    description: '',
    status: 'ACTIVE',
  });

  // LOAD DATA
  useEffect(() => {
    loadEntities();
  }, [userId, filter]);

  const loadEntities = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = userId
        ? await entityApi.getByUserId(userId)
        : await entityApi.getAll();

      let data = response.data;

      // Apply filters
      if (filter !== 'ALL') {
        data = data.filter(e => e.status === filter);
      }

      setEntities(data);
    } catch (err) {
      setError('Failed to load entities. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await entityApi.create(formData as Entity);
      setShowModal(false);
      resetForm();
      loadEntities();
    } catch (err) {
      setError('Failed to create entity');
      console.error(err);
    }
  };

  // UPDATE
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntity?.id) return;

    try {
      await entityApi.update(editingEntity.id, formData as Entity);
      setShowModal(false);
      resetForm();
      loadEntities();
    } catch (err) {
      setError('Failed to update entity');
      console.error(err);
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entity?')) return;

    try {
      await entityApi.delete(id);
      loadEntities();
    } catch (err) {
      setError('Failed to delete entity');
      console.error(err);
    }
  };

  // STATUS CHANGE
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await entityApi.updateStatus(id, { status: newStatus });
      loadEntities();
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
    }
  };

  // MODAL HELPERS
  const openCreateModal = () => {
    resetForm();
    setEditingEntity(null);
    setShowModal(true);
  };

  const openEditModal = (entity: Entity) => {
    setFormData(entity);
    setEditingEntity(entity);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'ACTIVE',
    });
    setEditingEntity(null);
  };

  // FORM INPUT HANDLER
  const handleInputChange = (field: keyof Entity, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // RENDER
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="component-template">
      {/* HEADER */}
      <div className="header">
        <h1>Entity Management</h1>
        <button onClick={openCreateModal}>+ New Entity</button>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-card">
          <h3>{entities.length}</h3>
          <p>Total Entities</p>
        </div>
        <div className="stat-card">
          <h3>{entities.filter(e => e.status === 'ACTIVE').length}</h3>
          <p>Active</p>
        </div>
        <div className="stat-card">
          <h3>{entities.filter(e => e.status === 'PENDING').length}</h3>
          <p>Pending</p>
        </div>
      </div>

      {/* ENTITY LIST */}
      <div className="entity-list">
        {entities.length === 0 ? (
          <div className="no-entities">No entities found</div>
        ) : (
          entities.map(entity => (
            <div key={entity.id} className="entity-card">
              <div className="entity-header">
                <h3>{entity.name}</h3>
                <span className={`badge ${entity.status?.toLowerCase()}`}>
                  {entity.status}
                </span>
              </div>

              <p>{entity.description}</p>

              <div className="entity-actions">
                <select
                  value={entity.status}
                  onChange={(e) => handleStatusChange(entity.id!, e.target.value)}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="PENDING">Pending</option>
                </select>

                <button onClick={() => openEditModal(entity)}>Edit</button>
                <button onClick={() => handleDelete(entity.id!)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingEntity ? 'Edit Entity' : 'Create Entity'}</h2>

            <form onSubmit={editingEntity ? handleUpdate : handleCreate}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />

              <textarea
                placeholder="Description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />

              <select
                value={formData.status || 'ACTIVE'}
                onChange={(e) => handleInputChange('status', e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING">Pending</option>
              </select>

              <div className="form-actions">
                <button type="submit">
                  {editingEntity ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComponentTemplate;