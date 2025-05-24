import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNewspaper } from '../../services/newspaperService';

const AddNewspaper = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newspaper_name: '',
    type: 'daily',
    price: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? (value === '' ? '' : parseInt(value)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.newspaper_name || !formData.type || formData.price === '') {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await addNewspaper(formData);
      navigate('/newspapers');
    } catch (err) {
      setError('Failed to add newspaper');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Add New Newspaper</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Newspaper Name</label>
          <input
            type="text"
            name="newspaper_name"
            value={formData.newspaper_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Adding...' : 'Add Newspaper'}
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
    </div>
  );
};

export default AddNewspaper;
