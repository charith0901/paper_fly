import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBillById } from '../../services/billService';
import { Card, Descriptions, Button, Spin } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
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
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  if (!bill) {
    return <div>Bill not found</div>;
  }

  return (
    <Card
      title="Bill Details"
      extra={
        <div>
          <Link to="/bills">
            <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 8 }}>
              Back to List
            </Button>
          </Link>
          <Link to={`/bills/edit/${id}`}>
            <Button type="primary" icon={<EditOutlined />}>
              Edit
            </Button>
          </Link>
        </div>
      }
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Bill Number">{bill.id}</Descriptions.Item>
        <Descriptions.Item label="Initial Cost">Rs.{bill.initialCost.toFixed(2) || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="To be Paid">Rs.{bill.payment.toFixed(2) || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Profit">Rs.{bill.profit.toFixed(2) || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Unsold Cost">Rs.{bill.unsoldCost.toFixed(2) || 'N/A'}  </Descriptions.Item>
        <Descriptions.Item label="Date">{new Date(bill.startDate).toLocaleDateString()}</Descriptions.Item>
        <Descriptions.Item label="Status">{bill.status}</Descriptions.Item>
      </Descriptions>

      <DailyReceiveList />

    </Card>
  );
};

export default BillDetail;
