import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import './PageStyles.css'

const SchoolManagement = () => {
  const { schools, setSchools } = useAppContext()
  const [schoolName, setSchoolName] = useState('')
  const [schoolAddress, setSchoolAddress] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editAddress, setEditAddress] = useState('')

  const handleAdd = () => {
    if (schoolName.trim()) {
      const newSchool = {
        id: schools.length > 0 ? Math.max(...schools.map(s => s.id)) + 1 : 1,
        name: schoolName,
        address: schoolAddress.trim() || 'Address not provided'
      }
      setSchools([...schools, newSchool])
      setSchoolName('')
      setSchoolAddress('')
    }
  }

  const handleModify = (school) => {
    setEditingId(school.id)
    setEditName(school.name)
    setEditAddress(school.address)
  }

  const handleSaveEdit = () => {
    setSchools(schools.map(school =>
      school.id === editingId
        ? { ...school, name: editName, address: editAddress }
        : school
    ))
    setEditingId(null)
    setEditName('')
    setEditAddress('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditAddress('')
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
          <button onClick={handleAdd} className="btn btn-primary">Add</button>
          <button className="btn btn-secondary">Show All</button>
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
                      <button onClick={handleSaveEdit} className="btn btn-small btn-success">Save</button>
                      <button onClick={handleCancelEdit} className="btn btn-small btn-cancel">Cancel</button>
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
