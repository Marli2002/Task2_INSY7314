import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";
import './Form.css';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
      return;
    }
    fetchEmployees();
  }, [navigate]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        'https://localhost:5000/api/admin/employees',
        {
          headers: { 
            'x-auth-token': token 
          }
        }
      );
      setEmployees(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete employee: ${email}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://localhost:5000/api/admin/employees/${id}`,
        {
          headers: { 
            'x-auth-token': token 
          }
        }
      );
      alert("Employee deleted successfully");
      fetchEmployees(); // Refresh list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete employee");
    }
  };

  return (
    <>
      <NavBar />
      <div className="full-page">
        <div className="form-container" style={{ maxWidth: '1000px' }}>
          <h2>Employee Management</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            View and manage all employee accounts
          </p>

          {error && <p className="error-msg">{error}</p>}

          <button 
            className="secondary-btn" 
            onClick={() => navigate("/admin/employees/create")}
            style={{ 
              marginBottom: '1.5rem',
              backgroundColor: '#28a745',
              color: 'white'
            }}
          >
            + Create New Employee
          </button>

          {loading ? (
            <p>Loading employees...</p>
          ) : employees.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
              <p>No employees found.</p>
              <p style={{ fontSize: '0.9em' }}>Click "Create New Employee" to add one.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: '#f8f9fa', 
                    borderBottom: '2px solid #dee2e6' 
                  }}>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left',
                      fontWeight: '600'
                    }}>Username</th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left',
                      fontWeight: '600'
                    }}>Email</th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left',
                      fontWeight: '600'
                    }}>Role</th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id} style={{ 
                      borderBottom: '1px solid #eee',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <td style={{ padding: '12px' }}>{emp.username}</td>
                      <td style={{ padding: '12px' }}>{emp.email}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.85em',
                          fontWeight: '500',
                          backgroundColor: emp.role === 'admin' ? '#ffc107' : '#17a2b8',
                          color: 'white'
                        }}>
                          {emp.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button 
                          onClick={() => handleDelete(emp._id, emp.email)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '6px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9em',
                            fontWeight: '500',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button 
            className="secondary-btn" 
            onClick={() => navigate("/admin/dashboard")}
            style={{ marginTop: '1.5rem' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}



/*
References

Axios. n.d. Axios API documentation. Retrieved October 10, 2025, from https://axios-http.com/docs/api_intro

Mozilla Developer Network (MDN). n.d. Using the Web Storage API. Retrieved October 10, 2025, from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

React. n.d. Using the Effect Hook – React documentation. Retrieved October 10, 2025, from https://react.dev/reference/react/hooks#effect-hooks

React. n.d. Lists and Keys – React documentation. Retrieved October 10, 2025, from https://react.dev/learn/rendering-lists
*/