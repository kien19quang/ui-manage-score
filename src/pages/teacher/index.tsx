import TeacherLayout from "@/layouts/TeacherLayout/TeacherLayout"
import { IClassTeacher } from "@/models/class"
import ClassService from "@/services/ClassService"
import { EyeOutlined } from "@ant-design/icons"
import { Button, Flex, Table, TableColumnsType, Typography } from "antd"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const { Text, Title } = Typography

const TeacherHome = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listClassTeacher, setListClassTeacer] = useState<IClassTeacher[]>([])
  const { data } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (data?.user._id) {
      handleGetListClassTeacher()
    }
  }, [data?.user._id])

  const handleGetListClassTeacher = async () => {
    setLoading(true)
    const response = await ClassService.getClassTeacher(data?.user._id as string)
    setLoading(false)
    if (response) {
      setListClassTeacer(response)
    }
  }

  const handleDetailClass = async (record: IClassTeacher) => {
    router.push({ pathname: `/teacher/class/${record._id}` })
  }

  const columns: TableColumnsType<IClassTeacher> = [
    {
      title: 'Tên lớp học',
      dataIndex: 'title',
    },
    {
      title: 'Môn học',
      dataIndex: ['subject', 'title']
    },
    {
      title: 'Số sinh viên',
      dataIndex: 'maxQuantityStudent',
      render: (value, record: IClassTeacher) => {
        return `${record.students.length} / ${value}`
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Button icon={<EyeOutlined />} onClick={() => handleDetailClass(record)} />
          </Flex>
        );
      },
      width: 80,
      align: 'center'
    },
  ];

  return (
    <Flex vertical style={{ width: '100%', height: '100%', padding: 24 }} justify="center" align="center">
      <Flex
        justify="center"
        vertical
        style={{
          padding: 20,
          borderRadius: 16,
          backgroundColor: 'white',
          boxShadow: '0px 6px 9px 0px rgba(156, 156, 156, 0.10), 0px 3px 2px 0px rgba(156, 156, 156, 0.08)',
          gap: 24,
          width: '100%',
          margin: '0 40px'
        }}
      >
        <Flex justify="space-between" align="center">
          <Title level={3} style={{ margin: 0, fontSize: 20 }}>
            Danh sách lớp học phụ trách
          </Title>
        </Flex>
        <Table
          loading={loading} 
          pagination={{ showSizeChanger: true }} 
          columns={columns} 
          dataSource={listClassTeacher} 
          bordered={false} 
          style={{ width: '100%' }} 
          scroll={{ x: 1024 }}
        />
      </Flex>
    </Flex>
  )
}

TeacherHome.Layout = TeacherLayout

export default TeacherHome