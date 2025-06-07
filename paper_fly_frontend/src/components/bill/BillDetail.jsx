import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBillById } from '../../services/billService';
import DailyReceiveList from '../dailyReceive/DailyReceiveList';

const BillDetail = () => {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const data = await getBillById(id);
        setBill(data);
      } catch (error) {
        console.error('Failed to fetch bill details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!bill) {
    return <div className="text-center text-red-500">Bill not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b p-4 sm:p-6 bg-gray-50">
          <h2 className="text-2xl font-bold">Bill Details</h2>
          <div className="flex mt-3 sm:mt-0">
            <Link to="/bills" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to List
            </Link>
            <Link to={`/bills/edit/${id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </Link>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded p-4">
              <div className="mb-2">
                <span className="font-medium text-gray-700">Bill Number:</span>
                <span className="ml-2">{bill.id}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Initial Cost:</span>
                <span className="ml-2">Rs.{bill.initialCost.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">To be Paid:</span>
                <span className="ml-2">Rs.{bill.payment.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Date:</span>
                <span className="ml-2">{new Date(bill.startDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="border rounded p-4">
              <div className="mb-2">
                <span className="font-medium text-gray-700">Profit:</span>
                <span className="ml-2">Rs.{bill.profit.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Unsold Cost:</span>
                <span className="ml-2">Rs.{bill.unsoldCost.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium inline-block
                  ${bill.status === 'paid' ? 'bg-green-100 text-green-800' : 
                    bill.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {bill.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <DailyReceiveList />
      </div>
    </div>
  );
};

export default BillDetail;
