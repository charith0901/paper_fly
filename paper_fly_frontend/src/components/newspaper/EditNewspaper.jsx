import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewspaperById, updateNewspaperPrice } from '../../services/newspaperService';
import { Form, Input, Button, Card, Typography, Space, Spin, Alert, InputNumber } from 'antd';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

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
        const newspaper = await getNewspaperById(id);
        
        if (newspaper) {
          setNewspaper(newspaper);
          setPrice(newspaper.price);
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

  const handleSubmit = async () => {
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

  if (loading) return <div style={{ textAlign: 'center', padding: 24 }}><Spin size="large" /></div>;
  if (error && !newspaper) return <Alert message={error} type="error" showIcon />;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <Card>
        <Title level={2}>Edit Newspaper Price</Title>
        
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        
        {newspaper && (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Newspaper Name">
              <Text>{newspaper.newspaper_name}</Text>
            </Form.Item>
            
            <Form.Item label="Type">
              <Text>{newspaper.type}</Text>
            </Form.Item>
            
            <Form.Item 
              label="Price" 
              rules={[{ required: true, message: 'Please input the price!' }]}
            >
              <InputNumber
                value={price}
                onChange={setPrice}
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
                  loading={saving}
                  icon={<SaveOutlined />}
                >
                  Update Price
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
        )}
      </Card>
    </div>
  );
};

export default EditNewspaper;
