import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AxiosClient } from '../../../../service/AxiosClient';
import Cookies from 'js-cookie';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    console.log("values", values);
    try {
      const response = await AxiosClient.post('/login', values);
      if (response.data) {
        message.success('Đăng nhập thành công!');
        // console.log(response.data.user)
        // Cookies.set('user', response.data.user, {
        //   expires: 1, // Cookie expires in 1 day
        //   secure: true, // Cookie is only sent over HTTPS
        //   sameSite: 'Strict' // Prevents CSRF
        // });
        navigate('/admin');
      } else {
        message.error('Sai tên đăng nhập hoặc mật khẩu!');
      }
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      message.error('Đăng nhập thất bại, vui lòng thử lại!');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '50px 0' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Đăng nhập</Title>
      <Form
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="teacherCode"
          rules={[{ required: true, message: 'Vui lòng nhập mã giáo viên!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Mã giáo viên" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
