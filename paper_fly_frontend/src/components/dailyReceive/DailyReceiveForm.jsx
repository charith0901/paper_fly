import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createDailyRecieve, getDailyRecieveById, updateDailyRecieve } from '../../../src/services/dailyRecieveService';
import axios from 'axios';

const DailyReceiveForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    newspaperCopies: [{ newspaper_id: '', quantity: '' }],
    bill_id: null
  });
  
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewspapers = async () => {
      try {
        // Assuming you have a service to fetch all newspapers
        const response = await axios.get('/api/newspapers');
        setNewspapers(response.data);
      } catch (err) {
        setError('Failed to fetch newspapers');
      }
    };
    
    const fetchDailyReceiveData = async () => {
      if (isEditing) {
        try {
          const data = await getDailyRecieveById(id);
          setFormData({
            date: new Date(data.date).toISOString().split('T')[0],
            newspaperCopies: data.newspaperCopies,
            bill_id: data.bill_id
          });
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch daily receive data');
          setLoading(false);
        }
      }
    };

    fetchNewspapers();
    fetchDailyReceiveData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNewspaperChange = (index, field, value) => {
    const updatedCopies = [...formData.newspaperCopies];
    updatedCopies[index] = {
      ...updatedCopies[index],
      [field]: field === 'quantity' ? parseInt(value, 10) : value
    };
    setFormData({
      ...formData,
      newspaperCopies: updatedCopies
    });
  };

  const addNewspaperRow = () => {
    setFormData({
      ...formData,
      newspaperCopies: [...formData.newspaperCopies, { newspaper_id: '', quantity: '' }]
    });
  };

  const removeNewspaperRow = (index) => {
    const updatedCopies = formData.newspaperCopies.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      newspaperCopies: updatedCopies
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    for (const copy of formData.newspaperCopies) {
      if (!copy.newspaper_id || !copy.quantity) {
        setError('Please fill all newspaper details');
        return;
      }
    }

    try {
      if (isEditing) {
        await updateDailyRecieve(id, formData);
      } else {
        await createDailyRecieve(formData);
      }
      navigate('/daily-receipts');
    } catch (err) {
      setError('Failed to save daily receive record');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="daily-receive-form-container">
      <h1>{isEditing ? 'Edit Daily Receipt' : 'Add New Daily Receipt'}</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="bill_id" className="form-label">Bill ID (Optional)</label>
          <input
            type="text"
            className="form-control"
            id="bill_id"
            name="bill_id"
            value={formData.bill_id || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="newspaper-copies-section">
          <h3>Newspaper Copies</h3>
          
          {formData.newspaperCopies.map((copy, index) => (
            <div key={index} className="row mb-3">
              <div className="col">
                <select
                  className="form-select"
                  value={copy.newspaper_id}
                  onChange={(e) => handleNewspaperChange(index, 'newspaper_id', e.target.value)}
                  required
                >
                  <option value="">Select Newspaper</option>
                  {newspapers.map((newspaper) => (
                    <option key={newspaper.id} value={newspaper.id}>
                      {newspaper.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Quantity"
                  value={copy.quantity}
                  onChange={(e) => handleNewspaperChange(index, 'quantity', e.target.value)}
                  min="1"
                  required
                />
              </div>
              
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeNewspaperRow(index)}
                  disabled={formData.newspaperCopies.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={addNewspaperRow}
          >
            Add Another Newspaper
          </button>
        </div>
        
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update' : 'Create'} Receipt
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/daily-receipts')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyReceiveForm;
