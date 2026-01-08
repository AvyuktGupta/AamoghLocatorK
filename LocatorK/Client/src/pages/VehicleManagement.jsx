import React, { useState } from 'react'
import './PageStyles.css'

const VehicleManagement = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    schoolName: '',
    ownerName: '',
    driverName: '',
    driverMobile: ''
  })
  
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      vehicleNumber: 'DL-01-AB-1234',
      owner: 'John Doe',
      schoolName: 'Greenwood High School',
      driverName: 'Rajesh Kumar',
      driverMobile: '9876543210'
    },
    {
      id: 2,
      vehicleNumber: 'DL-02-CD-5678',
      owner: 'Jane Smith',
      schoolName: 'Sunshine Elementary',
      driverName: 'Amit Singh',
      driverMobile: '9876543211'
    }
  ])

  const [schools] = useState([
    'Greenwood High School',
    'Sunshine Elementary',
    'City Public School'
  ])

  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAdd = () => {
    if (formData.vehicleNumber && formData.schoolName) {
      const newVehicle = {
        id: vehicles.length + 1,
        vehicleNumber: formData.vehicleNumber,
        owner: formData.ownerName,
        schoolName: formData.schoolName,
        driverName: formData.driverName,
        driverMobile: formData.driverMobile
      }
      setVehicles([...vehicles, newVehicle])
      setFormData({
        vehicleNumber: '',
        schoolName: '',
        ownerName: '',
        driverName: '',
        driverMobile: ''
      })
    }
  }

  const handleModify = (vehicle) => {
    setEditingId(vehicle.id)
    setEditData({ ...vehicle })
  }

  const handleSaveEdit = () => {
    setVehicles(vehicles.map(vehicle =>
      vehicle.id === editingId ? { ...editData, id: editingId } : vehicle
    ))
    setEditingId(null)
    setEditData({})
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value })
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
            {schools.map((school, idx) => (
              <option key={idx} value={school}>{school}</option>
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
          <button onClick={handleAdd} className="btn btn-primary">Add</button>
          <button onClick={() => console.log('Show All')} className="btn btn-secondary">Show All</button>
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
                      value={editData.owner || ''}
                      onChange={(e) => handleEditChange('owner', e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    vehicle.owner
                  )}
                </td>
                <td>
                  {editingId === vehicle.id ? (
                    <select
                      value={editData.schoolName || ''}
                      onChange={(e) => handleEditChange('schoolName', e.target.value)}
                      className="inline-edit-input"
                    >
                      {schools.map((school, idx) => (
                        <option key={idx} value={school}>{school}</option>
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
                      <button onClick={handleSaveEdit} className="btn btn-small btn-success">Save</button>
                      <button onClick={handleCancelEdit} className="btn btn-small btn-cancel">Cancel</button>
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

