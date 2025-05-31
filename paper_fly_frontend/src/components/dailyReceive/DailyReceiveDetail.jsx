import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDailyReceiveById, deleteDailyReceive } from '../../services/dailyReceiveService';

const DailyReceiveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dailyReceive, setDailyReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyReceipt = async () => {
      try {
        const data = await getDailyReceiveById(id);
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
        await deleteDailyReceive(id);
        navigate('/daily-receipts');
      } catch (err) {
        setError('Failed to delete the record');
      }
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>;
  if (!dailyReceive) return <div className="text-center py-8 text-gray-500">Daily receipt not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Daily Receipt Details</h1>
      
      <div className="bg-gray-50 rounded shadow mb-6">
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h5 className="text-lg font-semibold text-gray-700">Receipt #{dailyReceive.id}</h5>
          <div>
            <Link 
              to={`/daily-receipts/edit/${dailyReceive.id}`} 
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-3 py-1 rounded mr-2 text-sm transition"
            >
              Edit
            </Link>
            <button 
              onClick={handleDelete} 
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded text-sm transition"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="flex mb-3">
            <div className="w-1/3 font-medium text-gray-600">Date:</div>
            <div className="w-2/3">{new Date(dailyReceive.date).toLocaleDateString()}</div>
          </div>
          
          {dailyReceive.bill_id && (
            <div className="flex mb-3">
              <div className="w-1/3 font-medium text-gray-600">Bill ID:</div>
              <div className="w-2/3">{dailyReceive.bill_id}</div>
            </div>
          )}
          
          <div className="flex mb-3">
            <div className="w-1/3 font-medium text-gray-600">Created At:</div>
            <div className="w-2/3">
              {new Date(dailyReceive.created_at).toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex mb-3">
            <div className="w-1/3 font-medium text-gray-600">Last Updated:</div>
            <div className="w-2/3">
              {new Date(dailyReceive.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-3 text-gray-700">Newspaper Copies</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left bg-gray-100 text-gray-700 font-medium">Newspaper</th>
              <th className="px-4 py-2 border-b text-left bg-gray-100 text-gray-700 font-medium">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {dailyReceive.newspapersStock.map((copy, index) => {
              const newspaper = dailyReceive.newspapersStock?.find(n => n.id === copy.id);
              console.log('Newspaper:', newspaper);
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{newspaper ? newspaper.newspaper.newspaper_name : `Newspaper ID: ${copy.id}`}</td>
                  <td className="px-4 py-2 border-b">{copy.initialCopies}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded transition"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default DailyReceiveDetail;
