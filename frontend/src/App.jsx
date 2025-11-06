import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import Logout from "./components/Logout.jsx";
import PaymentsList from "./components/PaymentsList.jsx";
import CreatePayment from "./components/CreatePayment.jsx";

import EmployeePendingPayments from "./components/EmployeePendingPayments.jsx";
import EmployeePaymentHistory from "./components/EmployeePaymentHistory.jsx";  

import AdminDashboard from "./components/AdminDashboard.jsx";
import AdminCreateEmployee from "./components/AdminCreateEmployee.jsx";
import AdminEmployeeList from "./components/AdminEmployeeList.jsx";


function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/logout" element={<Logout />} />

        {/* User Routes */}
        <Route path="/payments/create" element={<CreatePayment />} />
        <Route path="/payments" element={<PaymentsList />} />

        {/* Employee Routes */}
        <Route path="/employee/pending" element={<EmployeePendingPayments />} />
        <Route path="/employee/history" element={<EmployeePaymentHistory />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees/create" element={<AdminCreateEmployee />} />
        <Route path="/admin/employees" element={<AdminEmployeeList />} />
      </Routes>
    </Router>
  );
}

export default App;
