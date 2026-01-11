import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import LocationPicker from '../components/LocationPicker'
import './PageStyles.css'

const SchoolManagement = () => {
  const { schools, addSchool, updateSchool, deleteSchool, loading, error } = useAppContext()
  const [schoolName, setSchoolName] = useState('')
  const [schoolAddress, setSchoolAddress] = useState('')
  const [schoolLat, setSchoolLat] = useState('')
  const [schoolLng, setSchoolLng] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editLat, setEditLat] = useState('')
  const [editLng, setEditLng] = useState('')
  const [editIsActive, setEditIsActive] = useState(true)
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (schoolName.trim() && !saving) {
      try {
        setSaving(true)
        await addSchool({
          name: schoolName,
          address: schoolAddress,
          lat: schoolLat ? parseFloat(schoolLat) : null,
          lng: schoolLng ? parseFloat(schoolLng) : null,
          isActive: isActive
        })
        setSchoolName('')
        setSchoolAddress('')
        setSchoolLat('')
        setSchoolLng('')
        setIsActive(true)
      } catch (err) {
        alert('Error adding school: ' + err.message)
      } finally {
        setSaving(false)
      }
    }
  }

  const handleModify = (school) => {
    setEditingId(school.id)
    setEditName(school.name || '')
    setEditAddress(school.address || '')
    setEditLat(school.lat?.toString() || '')
    setEditLng(school.lng?.toString() || '')
    setEditIsActive(school.isActive !== undefined ? school.isActive : true)
  }

  const handleSaveEdit = async () => {
    if (!saving) {
      try {
        setSaving(true)
        await updateSchool(editingId, {
          name: editName,
          address: editAddress,
          lat: editLat ? parseFloat(editLat) : null,
          lng: editLng ? parseFloat(editLng) : null,
          isActive: editIsActive
        })
        setEditingId(null)
        setEditName('')
        setEditAddress('')
        setEditLat('')
        setEditLng('')
        setEditIsActive(true)
      } catch (err) {
        alert('Error updating school: ' + err.message)
      } finally {
        setSaving(false)
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditAddress('')
    setEditLat('')
    setEditLng('')
    setEditIsActive(true)
  }

  const handleDelete = async () => {
    if (editingId && !saving) {
      if (window.confirm('Are you sure you want to delete this school?')) {
        try {
          setSaving(true)
          await deleteSchool(editingId)
          setEditingId(null)
          setEditName('')
          setEditAddress('')
        } catch (err) {
          alert('Error deleting school: ' + err.message)
        } finally {
          setSaving(false)
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <h1>School Management</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>School Management</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1>School Management</h1>
      
      <div className="form-section">
        <div className="form-row">
          <input
            type="text"
            placeholder="Enter School Name"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Enter School Address"
            value={schoolAddress}
            onChange={(e) => setSchoolAddress(e.target.value)}
            className="form-input"
          />
        </div>
        <LocationPicker
          initialLat={schoolLat || null}
          initialLng={schoolLng || null}
          onLocationChange={(lat, lng) => {
            setSchoolLat(lat.toString())
            setSchoolLng(lng.toString())
          }}
          label="School Location"
          height="350px"
        />
        <div className="form-row">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>
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
              <th>School ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school.id}>
                <td>{school.id}</td>
                <td>
                  {editingId === school.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    school.name
                  )}
                </td>
                <td>
                  {editingId === school.id ? (
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    school.address
                  )}
                </td>
                <td>
                  {editingId === school.id ? (
                    <input
                      type="number"
                      step="any"
                      value={editLat}
                      onChange={(e) => setEditLat(e.target.value)}
                      className="inline-edit-input"
                      style={{ width: '100px' }}
                    />
                  ) : (
                    school.lat || '-'
                  )}
                </td>
                <td>
                  {editingId === school.id ? (
                    <input
                      type="number"
                      step="any"
                      value={editLng}
                      onChange={(e) => setEditLng(e.target.value)}
                      className="inline-edit-input"
                      style={{ width: '100px' }}
                    />
                  ) : (
                    school.lng || '-'
                  )}
                </td>
                <td>
                  {editingId === school.id ? (
                    <input
                      type="checkbox"
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                    />
                  ) : (
                    school.isActive ? 'Yes' : 'No'
                  )}
                </td>
                <td>
                  {editingId === school.id ? (
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
                    <button onClick={() => handleModify(school)} className="btn btn-small">Modify</button>
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

export default SchoolManagement
