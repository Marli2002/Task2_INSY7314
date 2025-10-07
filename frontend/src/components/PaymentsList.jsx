import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Form.css';

export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with API call
    setPayments([
      { id: 1, recipient: "Alice", amount: 100 },
      { id: 2, recipient: "Bob", amount: 200 },
    ]);
  }, []);

  return (
    <div className="full-page">
      <div className="form-container">
        <h2>Existing Payments</h2>
        <ul>
          {payments.map((p) => (
            <li key={p.id}>
              {p.recipient} - ${p.amount}
            </li>
          ))}
        </ul>
        <button className="secondary-btn" onClick={() => navigate("/payments/create")}>
          Create Payment
        </button>
      </div>
    </div>
  );
}
