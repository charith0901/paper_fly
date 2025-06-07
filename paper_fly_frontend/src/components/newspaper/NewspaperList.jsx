import React, { useState, useEffect } from 'react';
import { getAllNewspapers, deleteNewspaper } from '../../services/newspaperService';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

const NewspaperList = () => {
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchNewspapers = async () => {
    try {
      setLoading(true);
      const data = await getAllNewspapers();
      setNewspapers(data);
    } catch (err) {
      showToast('Failed to fetch newspapers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewspapers();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: '' });
    }, 3000);
  };

  const handleDelete = async (id) => {
    try {
      await deleteNewspaper(id);
      showToast('Newspaper deleted', 'success');
      fetchNewspapers();
      setDeleteConfirmId(null);
    } catch (err) {
      showToast('Failed to delete newspaper', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Custom Toast notification with Tailwind */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out transform">
          <div className={`px-4 py-3 rounded-lg shadow-lg ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            } flex items-center`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold">Newspapers</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link to="/bills" className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <DollarSign className="h-5 w-5 mr-1" />
            <span>Billing</span>
          </Link>
          <Link to="/newspapers/add" className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Plus className="h-5 w-5 mr-1" />
            <span>Add New Newspaper</span>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="shadow  border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newspapers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No newspapers found</td>
                  </tr>
                ) : (
                  newspapers.map(newspaper => (
                    <tr key={newspaper.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{newspaper.newspaper_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{newspaper.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">Rs.{newspaper.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <Link
                          to={`/newspapers/edit/${newspaper.id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                        <button
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => setDeleteConfirmId(newspaper.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Modal with Tailwind */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this newspaper? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
                onClick={() => handleDelete(deleteConfirmId)}
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

export default NewspaperList;
