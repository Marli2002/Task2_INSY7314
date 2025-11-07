import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EmployeeLogin from "./components/EmployeeLogin.jsx";
import EmployeePendingPayments from "./components/EmployeePendingPayments.jsx";
import EmployeePaymentHistory from "./components/EmployeePaymentHistory.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import EmployeeList from "./components/EmployeeList.jsx";
import CreateEmployee from "./components/CreateEmployee.jsx";
import EmployeeDashboard from "./components/EmployeeDashboard.jsx";
import Logout from "./components/Logout.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<EmployeeLogin />} />
        
        {/* These already have NavBar inside them */}
        <Route path="/employee/pending" element={<EmployeePendingPayments />} />
        <Route path="/employee/history" element={<EmployeePaymentHistory />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<EmployeeList />} />
        <Route path="/admin/employees/create" element={<CreateEmployee />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;