import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAllDailyReceivesByBillId, deleteDailyReceive } from '../../services/dailyReceiveService';

const DailyReceiveList = () => {
  const [dailyreceives, setDailyreceives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const bill_id = useParams().id;

  useEffect(() => {
    const fetchDailyreceives = async () => {
      try {
        const data = await getAllDailyReceivesByBillId(bill_id);
        setDailyreceives(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch daily receives');
        setLoading(false);
      }
    };

    fetchDailyreceives();
  }, [bill_id]);

  const handleDelete = async (id) => {
    try {
      await deleteDailyReceive(id);
      setDailyreceives(dailyreceives.filter(Receive => Receive.id !== id));
      setDeleteConfirm(null);
      
      // Create a notification element
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
      notification.textContent = 'Record deleted successfully';
      document.body.appendChild(notification);
      
      // Remove after 3 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (err) {
      setError('Failed to delete the record');
      
      // Create error notification
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg';
      notification.textContent = 'Failed to delete the record';
      document.body.appendChild(notification);
      
      // Remove after 3 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {error}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">Daily Newspaper Receives Of Week</h2>
        <Link to="/billing/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Receive
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Newspaper Copies</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dailyreceives.map(receive => (
              <tr key={receive.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(receive.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {`${receive.newspapers.length} different newspapers`}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Link to={`/receive/${receive.id}`}>
                      <button className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </Link>
                    <Link to={`/receive/edit/${receive.id}`}>
                      <button className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </Link>
                    <button 
                      onClick={() => setDeleteConfirm(receive.id)}
                      className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {dailyreceives.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-3 text-center text-gray-500">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this record?</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyReceiveList;
