import React, { useState, useEffect } from 'react';
import { getAllNewspapers, deleteNewspaper } from '../../services/newspaperService';
import { Link } from 'react-router-dom';
import { Table, Button, Space, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const NewspaperList = () => {
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNewspapers = async () => {
    try {
      setLoading(true);
      const data = await getAllNewspapers();
      setNewspapers(data);
    } catch (err) {
      message.error('Failed to fetch newspapers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewspapers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteNewspaper(id);
      message.success('Newspaper deleted');
      fetchNewspapers();
    } catch (err) {
      message.error('Failed to delete newspaper');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'newspaper_name',
      key: 'newspaper_name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <>
            <Link to={`/newspapers/edit/${record.id}`}>
              <Button icon={<EditOutlined />} type="primary" size="small">
                Edit
              </Button>
            </Link>
            <Popconfirm
              title="Are you sure you want to delete this newspaper?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger size="small">
                Delete
              </Button>
            </Popconfirm>
          </>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Newspapers</Title>
        <Space>
          <Link to="/bills">
            <Button icon={<DollarOutlined />} type="default">
              Billing
            </Button>
          </Link>
          <Link to="/newspapers/add">
            <Button icon={<PlusOutlined />} type="primary">
              Add New Newspaper
            </Button>
          </Link>
        </Space>
      </Space>
      <Table
        columns={columns}
        dataSource={newspapers}
        rowKey="id"
        loading={loading}
        locale={{ emptyText: 'No newspapers found' }}
        bordered
      />
    </div>
  );
};

export default NewspaperList;
