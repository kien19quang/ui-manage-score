import StudentLayout from "@/layouts/StudentLayout/StudentLayout";
import { Avatar, Card, Descriptions, DescriptionsProps, Divider, Flex, Spin, Tabs, TabsProps, Typography } from "antd";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { IUSer } from "../../../global";
import { stringToColor } from "@/utils";
import dayjs from "dayjs";

const { Text, Title } = Typography

export interface IStudentProps {
}

const Student = (props: IStudentProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [activeKey, setActiveKey] = useState<string>('overview')

  const { data } = useSession()
  const user = data?.user as IUSer

  const itemsDescriptionInfo: DescriptionsProps['items'] = [
    {
      key: 'name',
      label: 'Họ và tên',
      children: <Text>{user?.name}</Text>,
    },
    {
      key: 'gender',
      label: 'Giới tính',
      children: <Text>Nữ</Text>,
    },
    {
      key: 'birthday',
      label: 'Ngày sinh',
      children: <Text>14 Sep 2003</Text>,
    },
    {
      key: 'phoneNumber',
      label: 'Số điện thoại',
      children: <Text>089318298493</Text>,
    },
    {
      key: 'nation',
      label: 'Quốc gia',
      children: <Text>Việt Nam</Text>,
      span: 24
    },
    {
      key: 'email',
      label: 'Email',
      children: <Text>{user?.email}</Text>,
      span: 24
    }
  ];

  const itemsDescriptionAddress: DescriptionsProps['items'] = [
    {
      key: 'wards',
      label: 'Phường/Xã',
      children: <Text>Phu Luong</Text>,
      span: 24
    },
    {
      key: 'district',
      label: 'Quận/Huyện',
      children: <Text>Hà Đông</Text>,
      span: 24
    },
    {
      key: 'province',
      label: 'Thành phố/ Tỉnh',
      children: <Text>Hà Nội</Text>,
      span: 24
    },
    {
      key: 'nation',
      label: 'Quốc gia',
      children: <Text>Việt Nam</Text>,
      span: 24
    }
  ];

  const itemsDescriptionBank: DescriptionsProps['items'] = [
    {
      key: 'name',
      label: 'Tên ngân hàng',
      children: <Text>BIDV</Text>,
      span: 12
    },
    {
      key: 'nameAccount',
      label: 'Tên tài khoản',
      children: <Text>Duong Thi Thuy Linh</Text>,
      span: 12
    },
    {
      key: 'accountNumber',
      label: 'Số tài khoản',
      children: <Text>012913010400</Text>,
    },
  ];

  const itemsTab: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Tổng quan',
      children: (
        <Flex vertical gap={16}>
          <Card title={<Title level={3} style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Thông tin cá nhân</Title>} bordered={false} style={{ width: '100%' }}> 
            <Descriptions items={itemsDescriptionInfo} />
          </Card>

          <Card title={<Title level={3} style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Địa chỉ</Title>} bordered={false} style={{ width: '100%' }}> 
            <Descriptions items={itemsDescriptionAddress} />
          </Card>

          <Card title={<Title level={3} style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Tài khoản ngân hàng</Title>} bordered={false} style={{ width: '100%' }}> 
            <Descriptions items={itemsDescriptionBank} />
          </Card>
        </Flex>
      ),
    },
  ];

  return (
    <Flex vertical style={{ width: '100%', height: '100%', padding: 24 }} gap={24}>
      <Flex gap={24}>
        <Spin spinning={loading}>
          <Flex style={{ padding: 20, borderRadius: 8, backgroundColor: 'white', width: 300 }}>
            <Flex vertical gap={16} style={{ width: '100%' }}>
              <Flex vertical gap={16} align='center'>
                <Avatar style={{ backgroundColor: stringToColor(user?.name as string), cursor: 'pointer' }} size={32}>
                  {user?.name.at(0)}
                </Avatar>
                <Flex vertical gap={4} align='center'>
                  <Title level={3} style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
                    {user?.name}
                  </Title>
      
                  <Text style={{ color: '#687588' }}>{user?._id}</Text>
                </Flex>
              </Flex>

              <Divider style={{ margin: 0 }} />

              <Flex vertical gap={12}>
                <Flex gap={4}>
                  <Text style={{ fontWeight: 500 }}>Email:</Text>
                  <Text ellipsis={{ tooltip: true }} style={{ flex: 1 }}>{user?.email}</Text>
                </Flex>
                <Flex gap={4}>
                  <Text style={{ fontWeight: 500 }}>Ngày tạo:</Text>
                  <Text>{dayjs(user?.createdAt).format('DD/MM/YYYY')}</Text>
                </Flex>
                <Flex gap={4}>
                  <Text style={{ fontWeight: 500 }}>Ngày cập nhật:</Text>
                  <Text>{dayjs(user?.updatedAt).format('DD/MM/YYYY')}</Text>
                </Flex>
                <Flex gap={4}>
                  <Text style={{ fontWeight: 500 }}>Lớp:</Text>
                  <Text>TI34h4</Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Spin>

        <Flex style={{ padding: 20, borderRadius: 8, flex: 1 }}>
          <Tabs items={itemsTab} activeKey={activeKey} onChange={key => setActiveKey(key)} style={{ width: '100%' }} />
        </Flex>
      </Flex>
    </Flex>
  );
}

Student.Layout = StudentLayout

export default Student