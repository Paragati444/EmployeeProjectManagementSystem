import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // सर्चसाठी नवीन स्टेट

  const API_URL = 'http://localhost:9092/api/v1/employees';

  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeData = { name, email };

    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });
      setEditId(null);
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });
    }

    setName('');
    setEmail('');
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      fetchEmployees();
    }
  };

  const handleEdit = (emp) => {
    setName(emp.name);
    setEmail(emp.email);
    setEditId(emp.id);
  };

  // सर्च फिल्टर लॉजिक (नाव किंवा ईमेल जुळतो का ते तपासण्यासाठी)
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header className="header">
        <h2>🚀 Employee Management System</h2>
        <p>Manage your organization's employees efficiently</p>
      </header>

      {/* Form Card */}
      <div className="form-card">
        <h3>{editId ? '✏️ Edit Employee Details' : '➕ Add New Employee'}</h3>
        <form onSubmit={handleSubmit} className="employee-form">
          <input
            type="text"
            placeholder="Enter Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={`btn ${editId ? 'btn-update' : 'btn-add'}`}>
            {editId ? 'Update Employee' : 'Add Employee'}
          </button>
          {editId && (
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={() => { setEditId(null); setName(''); setEmail(''); }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Table Card with Search Bar */}
      <div className="table-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0 }}>📋 Employee Directory</h3>
          {/* सर्च इनपुट बॉक्स */}
          <input
            type="text"
            placeholder="🔍 Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #dcdde1', width: '250px', outline: 'none' }}
          />
        </div>

        <div className="table-responsive">
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>#{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>
                      <button onClick={() => handleEdit(emp)} className="btn-action btn-edit">Edit</button>
                      <button onClick={() => handleDelete(emp.id)} className="btn-action btn-delete">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">No Employees Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;