import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBills, deleteBill } from '../../services/billService';
import { Table, Button, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const data = await getAllBills();
      setBills(data);
    } catch (error) {
      message.error('Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (bill) => {
    setBillToDelete(bill);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await deleteBill(billToDelete._id);
      message.success('Bill deleted successfully');
      fetchBills();
    } catch (error) {
      message.error('Failed to delete bill');
    } finally {
      setDeleteModalVisible(false);
      setBillToDelete(null);
    }
  };

  const columns = [
    {
      title: 'Bill Number',
      dataIndex: 'billNumber',
      key: 'billNumber',
      render: (_,record) => `${record.id}`,
    },
    {
      title: 'InitialCost',
      dataIndex: 'initialCost',
      key: 'initialCost',
      render: (_,record) => `$${record.initialCost.toFixed(2)}`,
    },
    {
      title: 'Date Range',
      dataIndex: 'date',
      key: 'date',
      render: (_,record) => `${new Date(record.startDate).toLocaleDateString()} - ${new Date(record.endDate).toLocaleDateString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Link to={`/bills/${record.id}`}>
            <Button type="primary" icon={<EyeOutlined />} size="small" style={{ marginRight: 8 }} />
          </Link>
          <Link to={`/bills/edit/${record.id}`}>
            <Button type="default" icon={<EditOutlined />} size="small" style={{ marginRight: 8 }} />
          </Link>
          <Button 
            type="danger" 
            icon={<DeleteOutlined />} 
            size="small" 
            onClick={() => showDeleteConfirm(record)} 
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Bills</h1>
        <Link to="/bills/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Add New Bill
          </Button>
        </Link>
      </div>
      
      <Table 
        dataSource={bills} 
        columns={columns} 
        rowKey="id" 
        loading={loading} 
      />

      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Yes, Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this bill?</p>
        {billToDelete && (
          <p>Bill Number: {billToDelete.billNumber}</p>
        )}
      </Modal>
    </div>
  );
};

export default BillList;
