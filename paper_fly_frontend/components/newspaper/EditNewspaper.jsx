import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllNewspapers, updateNewspaperPrice } from '../../services/newspaperService';

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
        const newspapers = await getAllNewspapers();
        const found = newspapers.find(n => n.id === parseInt(id));
        
        if (found) {
          setNewspaper(found);
          setPrice(found.price);
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

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error && !newspaper) return <div className="text-center p-5 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Edit Newspaper Price</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      {newspaper && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="font-medium">Newspaper Name: <span className="font-normal">{newspaper.newspaper_name}</span></p>
          </div>
          
          <div className="mb-4">
            <p className="font-medium">Type: <span className="font-normal">{newspaper.type}</span></p>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Saving...' : 'Update Price'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/newspapers')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditNewspaper;
