import { AppstoreOutlined, BookOutlined, CalendarOutlined, ContactsOutlined, DollarOutlined, EnvironmentOutlined, GroupOutlined, TeamOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, LayoutProps, Menu, MenuProps, Row, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useEffect, useState } from 'react';
import { getItem } from '@/models/common';
import HeaderStudentLayout from './HeaderStudentLayout';

const { Sider, Header, Footer, Content } = Layout
const { Text } = Typography

export interface ProfileProps {
}

const listMenuItem: MenuProps['items'] = [
  // getItem('Sinh viên', 'user', <UserOutlined style={{ fontSize: 18 }} />),
  getItem('Đăng ký học', 'register-study', <UserOutlined style={{ fontSize: 18 }} />),
  // getItem('Phiếu báo điểm', 'report-point', <BookOutlined style={{ fontSize: 18 }} />),
  // getItem('Lịch thi', 'schedule', <CalendarOutlined style={{ fontSize: 18 }} />),
  getItem('Bảng điểm', 'transcript', <ContactsOutlined style={{ fontSize: 18 }} />),
];

export default function StudentLayout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKeyMenu, setSelectedKeyMenu] = useState<string>('register-study');
  const router = useRouter()
  
  useEffect(() => {
    const listKey = listMenuItem ? listMenuItem.map(item => item?.key) : []
    for (const key of listKey) {
      if (router.pathname.includes(key as string)) {
        setSelectedKeyMenu(key as string)
        break;
      }
    }
  }, [router.pathname])

  const handleClickMenu = (value: MenuInfo) => {
    if (value.key !== selectedKeyMenu) {
      if (value.key === 'user') {
        router.push({ pathname: `/student` });
      }
      else {
        router.push({ pathname: `/student/${value.key}` });
      }
      setSelectedKeyMenu(value.key);
    }
  };

  return (
    <Layout hasSider style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Sider
        width={240}
        theme="light"
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        style={{
          transition: 'all .3s cubic-bezier(.29,.01,0,1.04)',
          boxShadow: '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <Row align="middle" justify="center" style={{ height: 60, borderBottom: '1px solid #e1e5ea' }}>
          <Link href="/" style={{ fontSize: 28, }}>
            <Text style={{ fontSize: 28 }}>Manage Score</Text>
          </Link>
        </Row>
        <Menu mode="inline" selectedKeys={[selectedKeyMenu]} items={listMenuItem} onClick={handleClickMenu} style={{height: 'fit-content'}}/>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240,
          backgroundColor: '#f6f7f9',
          transition: 'all .3s cubic-bezier(.29,.01,0,1.04)',
        }}
      >
        <HeaderStudentLayout collapsed={collapsed} />
        <Content style={{ marginTop: 60 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
