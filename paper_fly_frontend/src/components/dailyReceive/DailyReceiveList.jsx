import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDailyRecieves, deleteDailyRecieve } from '../../../src/services/dailyRecieveService';
import { format } from 'date-fns';

const DailyReceiveList = () => {
  const [dailyReceipts, setDailyReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyReceipts = async () => {
      try {
        const data = await getAllDailyRecieves();
        setDailyReceipts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch daily receipts');
        setLoading(false);
      }
    };

    fetchDailyReceipts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteDailyRecieve(id);
        setDailyReceipts(dailyReceipts.filter(receipt => receipt.id !== id));
      } catch (err) {
        setError('Failed to delete the record');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="daily-receipts-container">
      <h1>Daily Newspaper Receipts</h1>
      <Link to="/daily-receipts/new" className="btn btn-primary mb-3">
        Add New Receipt
      </Link>
      
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Newspaper Copies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dailyReceipts.map((receipt) => (
            <tr key={receipt.id}>
              <td>{receipt.id}</td>
              <td>{format(new Date(receipt.date), 'yyyy-MM-dd')}</td>
              <td>{receipt.newspaperCopies.length} different newspapers</td>
              <td>
                <Link 
                  to={`/daily-receipts/${receipt.id}`} 
                  className="btn btn-info btn-sm me-2"
                >
                  View
                </Link>
                <Link 
                  to={`/daily-receipts/edit/${receipt.id}`} 
                  className="btn btn-warning btn-sm me-2"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(receipt.id)} 
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyReceiveList;
