import SignInBanner from '@/assets/images/SignInBanner.svg';
import { Ornament } from '@/components/Icons';
import { ILoginDto } from '@/models/auth';
import { ERole } from '@/models/common';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Row, Typography, message } from 'antd';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

const { Text, Title } = Typography;

const SignIn = () => {
  const router = useRouter()
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false)

  const login = useCallback(async () => {
    try {
      setLoading(true)
      form
        .validateFields()
        .then(async (values: ILoginDto) => {
          const response = await signIn('credentials', {
            ...values,
            redirect: false,
            callbackUrl: '/',
            role: ERole.student
          });
          if (response?.error) {
            return message.warning(response.error)
          }
          console.log(response)

          router.push({ pathname: '/' })
        })
        .catch((error) => {
          console.log(error)
          if (error?.response?.data?.error) {
            message.error(error?.response?.data?.error)
          }
          else {
            message.error('Vui lòng điền đầy đủ thông tin');
          }
        })
        .finally(() => {
          setLoading(false)
        });

    } catch (error) {
      console.log(error);
    }
  }, [form, router]);

  return (
    <Row style={{ flexWrap: 'nowrap', height: '100vh' }}>
      <Row style={{ width: '50%', maxWidth: 720, flexDirection: 'column', flexWrap: 'nowrap' }}>
        <Row style={{ height: '70%', width: '100%' }}>
          <Image src={SignInBanner} alt="Robot" style={{ objectFit: 'cover', width: '100%', height: '100%' }} priority={true} />
        </Row>
        <Row style={{ height: '30%', flexDirection: 'column', padding: 24, borderTop: '5px solid #27A376', backgroundColor: '#111827', flexWrap: 'nowrap' }} justify="center">
          {/* <Row onClick={() => router.push({ pathname: '/dashboard' })} style={{ cursor: 'pointer' }}>
            <Image style={{ width: 120, height: 54 }} src={LogoGCook} alt='Logo GCook' priority={true} />
          </Row> */}

          <Row style={{ flexDirection: 'column', gap: 12, paddingLeft: 12 }}>
            <Title level={1} style={{ margin: 0, fontSize: 32, color: 'white' }}>
              Chào mừng đến với Manage Score
            </Title>
          </Row>
        </Row>
      </Row>

      <Row style={{ flexGrow: 1, padding: 24, flexDirection: 'column' }}>
        <Row style={{ flexDirection: 'column', flexGrow: 1, position: 'relative' }} justify="center" align="middle">
          <Row style={{ flexDirection: 'column', gap: 32 }} align="middle">
            <Title level={3} style={{ margin: 0, fontSize: 20 }}>
              Đăng nhập với vai trò ?
            </Title>

            <Flex gap={12} vertical style={{ width: 200 }}>
              <Button block onClick={() => router.push({ pathname: '/auth/signin/admin' })}>Quản trị viên</Button>
              <Button block onClick={() => router.push({ pathname: '/auth/signin/teacher' })}>Giáo viên</Button>
              <Button block onClick={() => router.push({ pathname: '/auth/signin/student' })}>Sinh viên</Button>
            </Flex>
          </Row>
        </Row>

        <Row justify="center" style={{ gap: 10 }}>
          <Text style={{ color: '#A0AEC0' }}>© 2023 Manage Score . Alrights reserved.</Text>

          <Text>Terms & Conditions</Text>

          <Text>Privacy Policy</Text>
        </Row>
      </Row>
    </Row>
  );
};

export default SignIn;
