import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewspaperById, updateNewspaperPrice } from '../../services/newspaperService';

const EditNewspaper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [newspaper, setNewspaper] = useState(null);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchNewspaper = async () => {
      try {
        const newspaper = await getNewspaperById(id);
        
        if (newspaper) {
          setNewspaper(newspaper);
          setPrice(newspaper.price);
        } else {
          setError('Newspaper not found');
        }
      } catch (err) {
        setError('Failed to fetch newspaper');
      } finally {
        setLoading(false);
      }
    };

    fetchNewspaper();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (price === '') {
      setError('Price is required');
      return;
    }

    try {
      setSaving(true);
      await updateNewspaperPrice(id, parseInt(price));
      navigate('/newspapers');
    } catch (err) {
      setError('Failed to update newspaper price');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-6">
      <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
    </div>
  );
  
  if (error && !newspaper) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {error}
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6">
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Newspaper Price</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {newspaper && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Newspaper Name</label>
              <p className="text-gray-900">{newspaper.newspaper_name}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Type</label>
              <p className="text-gray-900">{newspaper.type}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="price">Price</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  id="price"
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                type="submit" 
                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={saving}
              >
                {saving && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Update Price
              </button>
              
              <button 
                type="button" 
                onClick={() => navigate('/newspapers')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditNewspaper;
