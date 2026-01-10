import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import './PageStyles.css'

const ParentManagement = () => {
  const { schools, vehicles, parents, addParent, updateParent, deleteParent, getVehiclesBySchool, loading, error } = useAppContext()
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    school: '',
    vehicleNumber: ''
  })

  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'school' && { vehicleNumber: '' }) // Reset vehicle when school changes
    })
  }

  const handleAdd = async () => {
    if (formData.name && formData.mobileNumber && formData.school && formData.vehicleNumber && !saving) {
      try {
        setSaving(true)
        await addParent({
          name: formData.name,
          mobileNumber: formData.mobileNumber,
          school: formData.school,
          vehicleNumber: formData.vehicleNumber
        })
        setFormData({
          name: '',
          mobileNumber: '',
          school: '',
          vehicleNumber: ''
        })
      } catch (err) {
        alert('Error adding parent: ' + err.message)
      } finally {
        setSaving(false)
      }
    }
  }

  const handleModify = (parent) => {
    setEditingId(parent.id)
    setEditData({ ...parent })
  }

  const handleSaveEdit = async () => {
    if (!saving) {
      try {
        setSaving(true)
        await updateParent(editingId, {
          name: editData.name,
          mobileNumber: editData.mobileNumber,
          school: editData.school,
          vehicleNumber: editData.vehicleNumber
        })
        setEditingId(null)
        setEditData({})
      } catch (err) {
        alert('Error updating parent: ' + err.message)
      } finally {
        setSaving(false)
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = async () => {
    if (editingId && !saving) {
      if (window.confirm('Are you sure you want to delete this parent/student?')) {
        try {
          setSaving(true)
          await deleteParent(editingId)
          setEditingId(null)
          setEditData({})
        } catch (err) {
          alert('Error deleting parent: ' + err.message)
        } finally {
          setSaving(false)
        }
      }
    }
  }

  const handleEditChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
      ...(field === 'school' && { vehicleNumber: '' }) // Reset vehicle when school changes
    })
  }

  const availableVehicles = formData.school ? getVehiclesBySchool(formData.school) : []
  const editAvailableVehicles = editData.school ? getVehiclesBySchool(editData.school) : []

  if (loading) {
    return (
      <div className="page-container">
        <h1>Parent / Student Assignment</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>Parent / Student Assignment</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1>Parent / Student Assignment</h1>
      
      <div className="form-section parent-form">
        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
          />
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <select
            name="school"
            value={formData.school}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">Select School</option>
            {schools.map((school) => (
              <option key={school.id} value={school.name}>{school.name}</option>
            ))}
          </select>
          <select
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleInputChange}
            className="form-input"
            disabled={!formData.school}
          >
            <option value="">Select Vehicle Number</option>
            {availableVehicles.map((vehicle, idx) => (
              <option key={idx} value={vehicle}>{vehicle}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button onClick={handleAdd} className="btn btn-primary" disabled={saving}>
            {saving ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Parent ID</th>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>School</th>
              <th>Vehicle Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent) => (
              <tr key={parent.id}>
                <td>{parent.id}</td>
                <td>
                  {editingId === parent.id ? (
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    parent.name
                  )}
                </td>
                <td>
                  {editingId === parent.id ? (
                    <input
                      type="text"
                      value={editData.mobileNumber || ''}
                      onChange={(e) => handleEditChange('mobileNumber', e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    parent.mobileNumber
                  )}
                </td>
                <td>
                  {editingId === parent.id ? (
                    <select
                      value={editData.school || ''}
                      onChange={(e) => handleEditChange('school', e.target.value)}
                      className="inline-edit-input"
                    >
                      {schools.map((school) => (
                        <option key={school.id} value={school.name}>{school.name}</option>
                      ))}
                    </select>
                  ) : (
                    parent.school
                  )}
                </td>
                <td>
                  {editingId === parent.id ? (
                    <select
                      value={editData.vehicleNumber || ''}
                      onChange={(e) => handleEditChange('vehicleNumber', e.target.value)}
                      className="inline-edit-input"
                      disabled={!editData.school}
                    >
                      <option value="">Select Vehicle</option>
                      {editAvailableVehicles.map((vehicle, idx) => (
                        <option key={idx} value={vehicle}>{vehicle}</option>
                      ))}
                    </select>
                  ) : (
                    parent.vehicleNumber
                  )}
                </td>
                <td>
                  {editingId === parent.id ? (
                    <div className="edit-actions">
                      <button onClick={handleSaveEdit} className="btn btn-small btn-success" disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={handleCancelEdit} className="btn btn-small btn-cancel" disabled={saving}>Cancel</button>
                      <button onClick={handleDelete} className="btn btn-small btn-cancel" disabled={saving}>
                        {saving ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleModify(parent)} className="btn btn-small">Modify</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ParentManagement

