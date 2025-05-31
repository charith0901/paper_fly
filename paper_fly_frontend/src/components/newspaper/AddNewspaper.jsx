import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNewspaper } from '../../services/newspaperService';
import { Form, Input, Button, Select, Card, Typography, InputNumber, Alert, Space } from 'antd';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const AddNewspaper = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await addNewspaper({
        newspaper_name: values.newspaper_name,
        type: values.type,
        price: values.price
      });
      navigate('/newspapers');
    } catch (err) {
      setError('Failed to add newspaper');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <Card>
        <Title level={2}>Add New Newspaper</Title>
        
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        
        <Form 
          form={form}
          layout="vertical" 
          onFinish={handleSubmit}
          initialValues={{ type: 'daily' }}
        >
          <Form.Item
            name="newspaper_name"
            label="Newspaper Name"
            rules={[{ required: true, message: 'Please input newspaper name!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select newspaper type!' }]}
          >
            <Select>
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input the price!' }]}
          >
            <InputNumber 
              min={0}
              formatter={value => `$ ${value}`}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
              >
                Add Newspaper
              </Button>
              
              <Button 
                onClick={() => navigate('/newspapers')}
                icon={<RollbackOutlined />}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddNewspaper;
