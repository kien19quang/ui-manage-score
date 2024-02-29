import StudentLayout from "@/layouts/StudentLayout/StudentLayout"
import { IClassStudent } from "@/models/class"
import { IStudent } from "@/models/student"
import ClassService from "@/services/ClassService"
import UserService from "@/services/UserService"
import { Button, Flex, Modal, Select, Table, TableColumnsType, Typography } from "antd"
import { InferGetStaticPropsType, NextPageContext } from "next"
import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"

const { Text, Title } = Typography
const { confirm } = Modal

const RegisterStudy = (props: InferGetStaticPropsType<typeof getServerSideProps>) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false)
  const [listClassStudent, setListClassStudent] = useState<IClassStudent[]>([])

  const { student } = props

  useEffect(() => {
    if (student._id) {
      handleGetClassStudent()
    }
  }, [student._id])

  const handleGetClassStudent = async () => {
    setLoading(true)
    const response = await ClassService.getClassStudent(student.semester._id)
    setLoading(false)
    if (response) {
      setListClassStudent(response)
    }
  }

  const handleRegisterToClass = (record: IClassStudent) => {
    confirm({
      title: 'Bạn có muốn đăng ký lớp học này?',
      onOk: async () => {
        setLoadingRegister(true)
        const response = await ClassService.registerToClass(student._id, record._id);
        setLoadingRegister(false)
        if (response) {
          const newListClassStudent = [...listClassStudent]
          const findIndex = newListClassStudent.findIndex(item => item._id === record._id);
          if (findIndex !== -1) {
            newListClassStudent[findIndex] = response;
          }

          setListClassStudent(newListClassStudent)
        }
      }
    })
  }

  const handleCancelRegisterToClass = (record: IClassStudent) => {
    confirm({
      title: 'Bạn có chắc muốn huỷ lớp học này?',
      onOk: async () => {
        setLoadingRegister(true)
        const response = await ClassService.cancelRegisterToClass(student._id, record._id);
        setLoadingRegister(false)
        if (response) {
          const newListClassStudent = [...listClassStudent]
          const findIndex = newListClassStudent.findIndex(item => item._id === record._id);
          if (findIndex !== -1) {
            newListClassStudent[findIndex] = response;
          }

          setListClassStudent(newListClassStudent)
        }
      }
    })
  }

  const columns: TableColumnsType<IClassStudent> = [
    {
      title: 'Tên lớp',
      key: 'title',
      dataIndex: 'title'
    },
    {
      title: 'Giáo viên phụ trách',
      key: 'teacher',
      dataIndex: ['teacher', 'name'],
    },
    {
      title: 'Số lượng sinh viên đăng ký',
      key: 'quantity',
      render: (_, record: IClassStudent) => {
        return `${record.students.length} / ${record.maxQuantityStudent}`
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: IClassStudent) => {
        if (record.students.includes(student._id)) {
          return (
            <Button danger onClick={() => handleCancelRegisterToClass(record)} loading={loadingRegister}>
              Huỷ đăng ký
            </Button>
          )
        }
        return (
          <Button type='primary' disabled={record.students.length === record.maxQuantityStudent} onClick={() => handleRegisterToClass(record)} loading={loadingRegister}>
            Đăng ký học
          </Button>
        )
      },
      width: 120,
      align: 'center'
    }
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
          maxWidth: 1200,
          width: '100%',
          margin: '0 40px'
        }}
      >
        <Flex justify="space-between" align="center">
          <Title level={3} style={{ margin: 0, fontSize: 20 }}>
            Danh sách lớp học có thể đăng ký
          </Title>
        </Flex>

        <Table loading={loading} pagination={{ showSizeChanger: true }} columns={columns} dataSource={listClassStudent} bordered={false} style={{ width: '100%' }} />
      </Flex>
    </Flex>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      }
    }
  }

  const studentProfile = await UserService.getProfileStudent(session.user._id)
  console.log(studentProfile)

  return {
    props: { 
      student: studentProfile as IStudent
    }
  }
}

RegisterStudy.Layout = StudentLayout

export default RegisterStudy