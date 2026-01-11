import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import LocationPicker from '../components/LocationPicker'
import './PageStyles.css'

const ParentManagement = () => {
  const { schools, vehicles, parents, addParent, updateParent, deleteParent, getVehiclesBySchool, loading, error } = useAppContext()
  const [formData, setFormData] = useState({
    name: '',
    parentName: '',
    mobileNumber: '',
    mobileNumber2: '',
    school: '',
    vehicleNumber: '',
    pickUpLat: '',
    pickUpLng: '',
    shiftID: ''
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
          parentName: formData.parentName,
          parentMobile1: formData.mobileNumber,
          parentMobile2: formData.mobileNumber2,
          school: formData.school,
          vehicleNumber: formData.vehicleNumber,
          pickUpLat: formData.pickUpLat ? parseFloat(formData.pickUpLat) : null,
          pickUpLng: formData.pickUpLng ? parseFloat(formData.pickUpLng) : null,
          shiftID: formData.shiftID
        })
        setFormData({
          name: '',
          parentName: '',
          mobileNumber: '',
          mobileNumber2: '',
          school: '',
          vehicleNumber: '',
          pickUpLat: '',
          pickUpLng: '',
          shiftID: ''
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
          parentName: editData.parentName,
          parentMobile1: editData.parentMobile1 || editData.mobileNumber,
          parentMobile2: editData.parentMobile2 || editData.mobileNumber2 || '',
          school: editData.school,
          vehicleNumber: editData.vehicleNumber,
          pickUpLat: editData.pickUpLat ? parseFloat(editData.pickUpLat) : null,
          pickUpLng: editData.pickUpLng ? parseFloat(editData.pickUpLng) : null,
          shiftID: editData.shiftID || ''
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
            placeholder="Student Name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
          />
          <input
            type="text"
            name="parentName"
            placeholder="Parent Name"
            value={formData.parentName}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            name="mobileNumber"
            placeholder="Parent Mobile 1"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className="form-input"
          />
          <input
            type="text"
            name="mobileNumber2"
            placeholder="Parent Mobile 2 (Optional)"
            value={formData.mobileNumber2}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <LocationPicker
          initialLat={formData.pickUpLat || null}
          initialLng={formData.pickUpLng || null}
          onLocationChange={(lat, lng) => {
            setFormData({
              ...formData,
              pickUpLat: lat.toString(),
              pickUpLng: lng.toString()
            })
          }}
          label="Pickup Location"
          height="350px"
        />
        <div className="form-row">
          <input
            type="text"
            name="shiftID"
            placeholder="Shift ID (Optional)"
            value={formData.shiftID}
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
              <th>Student Name</th>
              <th>Parent Name</th>
              <th>Mobile 1</th>
              <th>Mobile 2</th>
              <th>School</th>
              <th>Vehicle Number</th>
              <th>Pickup Lat</th>
              <th>Pickup Lng</th>
              <th>Shift ID</th>
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
                      value={editData.parentName || ''}
                      onChange={(e) => handleEditChange('parentName', e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    parent.parentName || ''
                  )}
                </td>
                <td>
                  {editingId === parent.id ? (
                    <input
                      type="text"
                      value={editData.parentMobile1 || editData.mobileNumber || ''}
                      onChange={(e) => handleEditChange('parentMobile1', e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    parent.parentMobile1 || parent.mobileNumber || ''
                  )}
                </td>
                <td>
                  {editingId === parent.id ? (
                    <input
                      type="text"
                      value={editData.parentMobile2 || editData.mobileNumber2 || ''}
                      onChange={(e) => handleEditChange('parentMobile2', e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    parent.parentMobile2 || ''
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
                    <input
                      type="number"
                      step="any"
                      value={editData.pickUpLat?.toString() || ''}
                      onChange={(e) => handleEditChange('pickUpLat', e.target.value)}
                      className="inline-edit-input"
                      style={{ width: '100px' }}
                    />
                  ) : (
                    parent.pickUpLat || '-'
                  )}
                </td>
                <td>
                  {editingId === parent.id ? (
                    <input
                      type="number"
                      step="any"
                      value={editData.pickUpLng?.toString() || ''}
                      onChange={(e) => handleEditChange('pickUpLng', e.target.value)}
                      className="inline-edit-input"
                      style={{ width: '100px' }}
                    />
                  ) : (
                    parent.pickUpLng || '-'
                  )}
                </td>
                <td>
                  {editingId === parent.id ? (
                    <input
                      type="text"
                      value={editData.shiftID || ''}
                      onChange={(e) => handleEditChange('shiftID', e.target.value)}
                      className="inline-edit-input"
                      style={{ width: '80px' }}
                    />
                  ) : (
                    parent.shiftID || '-'
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

