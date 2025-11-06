import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminEmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setError("");
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/employees`, {
        headers: { "x-auth-token": token },
      });
      setEmployees(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employees.");
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/employees/${id}`, {
        headers: { "x-auth-token": token },
      });
      fetchEmployees(); // refresh list
    } catch (err) {
      console.error(err);
      setError("Failed to delete employee.");
    }
  };

  return (
    <div className="page-container">
      <h2>Employees</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.username}</td>
                <td>{emp.email}</td>
                <td>{emp.role}</td>
                <td>
                  <button onClick={() => deleteEmployee(emp._id)} style={{ color: "red" }}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
