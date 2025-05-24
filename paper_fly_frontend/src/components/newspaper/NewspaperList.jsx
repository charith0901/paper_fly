import React, { useState, useEffect } from 'react';
import { getAllNewspapers, deleteNewspaper } from '../../services/newspaperService';
import { Link } from 'react-router-dom';

const NewspaperList = () => {
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewspapers = async () => {
    try {
      setLoading(true);
      const data = await getAllNewspapers();
      setNewspapers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch newspapers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewspapers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this newspaper?')) {
      try {
        await deleteNewspaper(id);
        fetchNewspapers(); // Refresh the list
      } catch (err) {
        setError('Failed to delete newspaper');
      }
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Newspapers</h1>
        <Link
          to={"/billing/newspapers"}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Billing
        </Link>
        <Link 
          to="/newspapers/add" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Newspaper
        </Link>
      </div>

      {newspapers.length === 0 ? (
        <p className="text-center">No newspapers found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Type</th>
                <th className="py-2 px-4 border">Price</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newspapers.map((newspaper) => (
                <tr key={newspaper.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{newspaper.id}</td>
                  <td className="py-2 px-4 border">{newspaper.newspaper_name}</td>
                  <td className="py-2 px-4 border">{newspaper.type}</td>
                  <td className="py-2 px-4 border">${newspaper.price}</td>
                  <td className="py-2 px-4 border">
                    <Link 
                      to={`/newspapers/edit/${newspaper.id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(newspaper.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
    </div>
  );
};

export default NewspaperList;
