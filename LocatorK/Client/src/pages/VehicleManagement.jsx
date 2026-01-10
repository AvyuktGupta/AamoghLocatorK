import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import './PageStyles.css'

const VehicleManagement = () => {
  const { schools, vehicles, addVehicle, updateVehicle, deleteVehicle, loading, error } = useAppContext()
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    schoolName: '',
    ownerName: '',
    driverName: '',
    driverMobile: ''
  })

  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAdd = async () => {
    if (formData.vehicleNumber && formData.schoolName && !saving) {
      try {
        setSaving(true)
        await addVehicle({
          vehicleNumber: formData.vehicleNumber,
          ownerName: formData.ownerName,
          schoolName: formData.schoolName,
          driverName: formData.driverName,
          driverMobile: formData.driverMobile
        })
        setFormData({
          vehicleNumber: '',
          schoolName: '',
          ownerName: '',
          driverName: '',
          driverMobile: ''
        })
      } catch (err) {
        alert('Error adding vehicle: ' + err.message)
      } finally {
        setSaving(false)
      }
    }
  }

  const handleModify = (vehicle) => {
    setEditingId(vehicle.id)
    setEditData({ ...vehicle })
  }

  const handleSaveEdit = async () => {
    if (!saving) {
      try {
        setSaving(true)
        await updateVehicle(editingId, {
          vehicleNumber: editData.vehicleNumber,
          ownerName: editData.owner,
          schoolName: editData.schoolName,
          driverName: editData.driverName,
          driverMobile: editData.driverMobile
        })
        setEditingId(null)
        setEditData({})
      } catch (err) {
        alert('Error updating vehicle: ' + err.message)
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
      if (window.confirm('Are you sure you want to delete this vehicle?')) {
        try {
          setSaving(true)
          await deleteVehicle(editingId)
          setEditingId(null)
          setEditData({})
        } catch (err) {
          alert('Error deleting vehicle: ' + err.message)
        } finally {
          setSaving(false)
        }
      }
    }
  }

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value })
  }

  if (loading) {
    return (
      <div className="page-container">
        <h1>Vehicle Management</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>Vehicle Management</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1>Vehicle Management</h1>
      
      <div className="form-section vehicle-form">
        <div className="form-row">
          <input
            type="text"
            name="vehicleNumber"
            placeholder="Vehicle Number"
            value={formData.vehicleNumber}
            onChange={handleInputChange}
            className="form-input"
          />
          <select
            name="schoolName"
            value={formData.schoolName}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">Select School Name</option>
            {schools.map((school) => (
              <option key={school.id} value={school.name}>{school.name}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <input
            type="text"
            name="ownerName"
            placeholder="Owner Name"
            value={formData.ownerName}
            onChange={handleInputChange}
            className="form-input"
          />
          <input
            type="text"
            name="driverName"
            placeholder="Driver Name"
            value={formData.driverName}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            name="driverMobile"
            placeholder="Driver Mobile Number"
            value={formData.driverMobile}
            onChange={handleInputChange}
            className="form-input"
          />
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
              <th>Vehicle ID</th>
              <th>Vehicle Number</th>
              <th>Owner</th>
              <th>School Name</th>
              <th>Driver Name</th>
              <th>Driver Mobile Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td>
                  {editingId === vehicle.id ? (
                    <input
                      type="text"
                      value={editData.vehicleNumber || ''}
                      onChange={(e) => handleEditChange('vehicleNumber', e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    vehicle.vehicleNumber
                  )}
                </td>
                <td>
                  {editingId === vehicle.id ? (
                    <input
                      type="text"
                      value={editData.ownerName || editData.owner || ''}
                      onChange={(e) => handleEditChange('owner', e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    vehicle.ownerName || vehicle.owner || ''
                  )}
                </td>
                <td>
                  {editingId === vehicle.id ? (
                    <select
                      value={editData.schoolName || ''}
                      onChange={(e) => handleEditChange('schoolName', e.target.value)}
                      className="inline-edit-input"
                    >
                      {schools.map((school) => (
                        <option key={school.id} value={school.name}>{school.name}</option>
                      ))}
                    </select>
                  ) : (
                    vehicle.schoolName
                  )}
                </td>
                <td>
                  {editingId === vehicle.id ? (
                    <input
                      type="text"
                      value={editData.driverName || ''}
                      onChange={(e) => handleEditChange('driverName', e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    vehicle.driverName
                  )}
                </td>
                <td>
                  {editingId === vehicle.id ? (
                    <input
                      type="text"
                      value={editData.driverMobile || ''}
                      onChange={(e) => handleEditChange('driverMobile', e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    vehicle.driverMobile
                  )}
                </td>
                <td>
                  {editingId === vehicle.id ? (
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
                    <button onClick={() => handleModify(vehicle)} className="btn btn-small">Modify</button>
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

export default VehicleManagement

