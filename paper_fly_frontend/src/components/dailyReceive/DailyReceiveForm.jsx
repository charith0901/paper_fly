import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createDailyReceive, getDailyReceiveById, updateDailyReceive } from '../../services/dailyReceiveService';
import { getAllNewspapers } from '../../services/newspaperService';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  InputNumber,
  Space,
  Typography,
  Alert,
  Spin,
  Card,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const DailyReceiveForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form] = Form.useForm();
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewspapers = async () => {
      try {
        const response = await getAllNewspapers();
        setNewspapers(response);
      } catch (err) {
        setError('Failed to fetch newspapers');
      }
    };

    const fetchDailyReceiveData = async () => {
      if (isEditing) {
        try {
          const data = await getDailyReceiveById(id);
          const mappedStock = data.newspapersStock.map(item => ({
            newspaper_id: item.newspaperId || item.newspaper_id,
            initialCopies: item.quantity || item.initialCopies || 0,
            soldCopies: item.soldCopies || 0,
          }));

          form.setFieldsValue({
            date: dayjs(data.date),
            newspapersStock: mappedStock,
            bill_id: data.bill_id,
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
    // eslint-disable-next-line
  }, [id, isEditing]);

  const handleFinish = async (values) => {
    setError(null);
    // Validate soldCopies <= initialCopies
    for (const copy of values.newspapersStock) {
      if (copy.soldCopies > copy.initialCopies) {
        setError('Sold copies cannot exceed initial copies');
        return;
      }
    }
    const payload = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
    };
    try {
      if (isEditing) {
        await updateDailyReceive(id, payload);
      } else {
        await createDailyReceive(payload);
      }
      window.history.back();
    } catch (err) {
      setError('Failed to save daily receive record');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <Title level={2}>{isEditing ? 'Edit Daily Receipt' : 'Add New Daily Receipt'}</Title>
        {error && (
          <Alert message={error} type="error" showIcon className="mb-4" />
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            date: dayjs(),
            newspapersStock: [{ newspaper_id: '', initialCopies: 1, soldCopies: 0 }],
            bill_id: '',
          }}
        >
          <Form.Item
            label={<label htmlFor="date-picker">Date</label>}
            name="date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker id="date-picker" style={{ width: '100%' }} aria-label="Date" />
          </Form.Item>

          <Form.Item
            label={<label htmlFor="bill-id-input">Bill ID (Optional)</label>}
            name="bill_id"
          >
            <Input id="bill-id-input" placeholder="Bill ID" aria-label="Bill ID" disabled={true} />
          </Form.Item>

          <Form.List name="newspapersStock">
            {(fields, { add, remove }) => (
              <>
                <Title level={4} style={{ marginTop: 24 }}>Newspaper Copies</Title>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'newspaper_id']}
                      rules={[{ required: true, message: 'Select newspaper' }]}
                      label={<label htmlFor={`newspaper-select-${key}`}>Newspaper</label>}
                    >
                      <Select
                        id={`newspaper-select-${key}`}
                        placeholder="Select Newspaper"
                        style={{ width: 200 }}
                        aria-label="Newspaper"
                      >
                        {newspapers.map((newspaper) => (
                          <Option key={newspaper.id} value={newspaper.id}>
                            {newspaper.newspaper_name} - {newspaper.type}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'initialCopies']}
                      rules={[{ required: true, message: 'Enter quantity' }]}
                      label={<label htmlFor={`initial-copies-input-${key}`}>Initial Copies</label>}
                    >
                      <InputNumber
                        id={`initial-copies-input-${key}`}
                        min={1}
                        placeholder="Quantity"
                        style={{ width: 120 }}
                        aria-label="Initial Copies"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'soldCopies']}
                      initialValue={0}
                      rules={[
                        { required: false },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const initial = getFieldValue(['newspapersStock', name, 'initialCopies']);
                            if (value === undefined || value <= initial) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Sold copies cannot exceed initial copies'));
                          },
                        }),
                      ]}
                      label={<label htmlFor={`sold-copies-input-${key}`}>Sold Copies</label>}
                    >
                      <InputNumber
                        id={`sold-copies-input-${key}`}
                        min={0}
                        placeholder="Sold Copies"
                        style={{ width: 120 }}
                        aria-label="Sold Copies"
                      />
                    </Form.Item>
                    <Button
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                      disabled={fields.length === 1}
                      danger
                      aria-label="Remove Newspaper"
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    style={{ width: '100%' }}
                    aria-label="Add Another Newspaper"
                  >
                    Add Another Newspaper
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Space style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" aria-label={isEditing ? 'Update Receipt' : 'Create Receipt'}>
              {isEditing ? 'Update' : 'Create'} Receipt
            </Button>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => window.history.back()}
              aria-label="Cancel"
            >
              Cancel
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default DailyReceiveForm;
