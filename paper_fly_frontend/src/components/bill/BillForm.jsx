import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBill } from '../../services/billService';
import { Form, InputNumber, Button, DatePicker, Card, message } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';

const BillForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        totalIncome: 0,
        totalExpense: 0
      };

      await createBill(formattedValues);
      message.success('Bill created successfully');
      navigate('/bills');
    } catch (error) {
      message.error('Failed to create bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title="Create New Bill"
      extra={
        <Link to="/bills">
          <Button icon={<ArrowLeftOutlined />}>
            Back to List
          </Button>
        </Link>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please select start date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please enter amount' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="Enter amount"
          />
        </Form.Item>

        <Form.Item
          name="profitRate"
          label="Profit Rate (%)"
          rules={[{ required: true, message: 'Please enter profit rate' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={100}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            placeholder="Enter profit rate percentage"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            icon={<SaveOutlined />}
          >
            Create Bill
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BillForm;
