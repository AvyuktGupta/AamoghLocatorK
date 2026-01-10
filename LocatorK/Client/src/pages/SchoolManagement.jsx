import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import './PageStyles.css'

const SchoolManagement = () => {
  const { schools, addSchool, updateSchool, deleteSchool, loading, error } = useAppContext()
  const [schoolName, setSchoolName] = useState('')
  const [schoolAddress, setSchoolAddress] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (schoolName.trim() && !saving) {
      try {
        setSaving(true)
        await addSchool(schoolName, schoolAddress)
        setSchoolName('')
        setSchoolAddress('')
      } catch (err) {
        alert('Error adding school: ' + err.message)
      } finally {
        setSaving(false)
      }
    }
  }

  const handleModify = (school) => {
    setEditingId(school.id)
    setEditName(school.name)
    setEditAddress(school.address)
  }

  const handleSaveEdit = async () => {
    if (!saving) {
      try {
        setSaving(true)
        await updateSchool(editingId, {
          name: editName,
          address: editAddress
        })
        setEditingId(null)
        setEditName('')
        setEditAddress('')
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
