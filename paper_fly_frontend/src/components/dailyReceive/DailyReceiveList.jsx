import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Table, Button, Space, Typography, message, Popconfirm, Spin, Alert } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllDailyReceivesByBillId, deleteDailyReceive } from '../../services/dailyReceiveService';

const { Title } = Typography;

const DailyReceiveList = () => {
  const [dailyreceives, setDailyreceives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      message.success('Record deleted successfully');
    } catch (err) {
      setError('Failed to delete the record');
      message.error('Failed to delete the record');
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Newspaper Copies',
      key: 'length',
      render: (_, record) => `${record.newspapers.length} different newspapers`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Link to={`/receive/${record.id}`}>
            <Button icon={<EyeOutlined />} size="small" />
          </Link>
          <Link to={`/receive/edit/${record.id}`}>
            <Button icon={<EditOutlined />} size="small" />
          </Link>
          <Popconfirm
            title="Are you sure you want to delete this record?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) return <div className="flex justify-center items-center h-64 text-lg"><Spin size="large" /></div>;
  if (error) return <Alert message={error} type="error" showIcon />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} style={{ margin: 0 }}>Daily Newspaper Receives Of Week</Title>
        <Link to="/billing/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Add New Receive
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={dailyreceives}
        rowKey="id"
        pagination={false}
        bordered
      />
    </div>
  );
};

export default DailyReceiveList;
