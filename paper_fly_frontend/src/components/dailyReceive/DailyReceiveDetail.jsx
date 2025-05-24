import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDailyRecieveById, deleteDailyRecieve } from '../../../src/services/dailyRecieveService';
import { format } from 'date-fns';

const DailyReceiveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dailyReceipt, setDailyReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyReceipt = async () => {
      try {
        const data = await getDailyRecieveById(id);
        setDailyReceipt(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch daily receipt details');
        setLoading(false);
      }
    };

    fetchDailyReceipt();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteDailyRecieve(id);
        navigate('/daily-receipts');
      } catch (err) {
        setError('Failed to delete the record');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!dailyReceipt) return <div className="not-found">Daily receipt not found</div>;

  return (
    <div className="daily-receipt-detail-container">
      <h1>Daily Receipt Details</h1>
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Receipt #{dailyReceipt.id}</h5>
          <div>
            <Link 
              to={`/daily-receipts/edit/${dailyReceipt.id}`} 
              className="btn btn-warning btn-sm me-2"
            >
              Edit
            </Link>
            <button 
              onClick={handleDelete} 
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Date:</div>
            <div className="col-md-9">{format(new Date(dailyReceipt.date), 'MMMM dd, yyyy')}</div>
          </div>
          
          {dailyReceipt.bill_id && (
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Bill ID:</div>
              <div className="col-md-9">{dailyReceipt.bill_id}</div>
            </div>
          )}
          
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Created At:</div>
            <div className="col-md-9">
              {format(new Date(dailyReceipt.created_at), 'MMMM dd, yyyy HH:mm')}
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Last Updated:</div>
            <div className="col-md-9">
              {format(new Date(dailyReceipt.updated_at), 'MMMM dd, yyyy HH:mm')}
            </div>
          </div>
        </div>
      </div>
      
      <h2>Newspaper Copies</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Newspaper</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {dailyReceipt.newspaperCopies.map((copy, index) => {
            // Find newspaper details if available
            const newspaper = dailyReceipt.newspapers?.find(n => n.id === copy.newspaper_id);
            
            return (
              <tr key={index}>
                <td>{newspaper ? newspaper.name : `Newspaper ID: ${copy.newspaper_id}`}</td>
                <td>{copy.quantity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="mt-3">
        <Link to="/daily-receipts" className="btn btn-secondary">
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default DailyReceiveDetail;
