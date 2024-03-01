import ModalEditScore from "@/components/ListModal/ModalEditScore"
import AdminLayout from "@/layouts/AdminLayout/AdminLayout"
import TeacherLayout from "@/layouts/TeacherLayout/TeacherLayout"
import { IClass, UpdateScoreDto } from "@/models/class"
import { IStudent } from "@/models/student"
import { ISubject } from "@/models/subject"
import ClassService from "@/services/ClassService"
import { EditOutlined, LeftOutlined } from "@ant-design/icons"
import { Button, Flex, Form, Modal, Table, TableColumnsType, Tooltip, Typography, message } from "antd"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const { Text, Title } = Typography
const { confirm } = Modal

const DetailClass = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false)
  const [infoClass, setInfoClass] = useState<IClass>();
  const [listStudentInClass, setListStudentInClass] = useState<IStudent[]>([])
  const [openModalEditScore, setOpenModalEditScore] = useState<boolean>(false)
  const [idEditScoreStudent, setIdEditScoreStudent] = useState<string>('')

  const router = useRouter()
  const classId = router.query?.id
  const [form] = Form.useForm()

  useEffect(() => {
    if (classId) {
      fetchListStudentInClass()
    }
  }, [classId])

  const fetchListStudentInClass = async () => {
    setLoading(true)
    const classInstance = await ClassService.getClassDetail(classId as any)
    setLoading(false)
    if (classInstance?.students) {
      setInfoClass(classInstance)
      setListStudentInClass(classInstance.students)
    }
  }

  const handleEditScore = (record: IStudent) => {
    setOpenModalEditScore(true)
    setIdEditScoreStudent(record._id)
    const score = infoClass?.scores.find(item => item.studentId === record._id)
    form.setFieldsValue(score)
  }

  const columns: TableColumnsType<IStudent> = [
    {
      title: 'Mã sinh viên',
      dataIndex: '_id'
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber'
    },
    {
      title: 'Điểm quá trình',
      render: (_, record: IStudent) => {
        const score = infoClass?.scores.find(item => item.studentId === record._id)

        return score?.processScore || '--'
      }
    },
    {
      title: 'Điểm cuối kì',
      render: (_, record: IStudent) => {
        const score = infoClass?.scores.find(item => item.studentId === record._id)

        return score?.score || '--'
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: IStudent) => {
        return (
          <Flex gap={16}>
            <Tooltip placement='top' title='Sửa điểm'>
              <Button icon={<EditOutlined />} onClick={() => handleEditScore(record)} />
            </Tooltip>
          </Flex>
        );
      },
      width: 80,
      align: 'center'
    },
  ];

  const handleCancelModal = () => {
    setOpenModalEditScore(false);
    setIdEditScoreStudent('');
    form.resetFields();
  };

  const handleSubmit = () => {
    setLoadingConfirm(true);
    form
      .validateFields()
      .then(async (values: UpdateScoreDto) => {
        const classInstance = await ClassService.updateScore({ ...values, classId: infoClass?._id as any, studentId: idEditScoreStudent })
        if (classInstance) {
          setInfoClass(classInstance)
          setListStudentInClass(classInstance.students)
        }
        message.success('Cập nhật điểm thành công');
        // setListStudentInClass(newListSubject);
        setOpenModalEditScore(false);
        setIdEditScoreStudent('');
        form.resetFields();
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.error) {
          message.error(error?.response?.data?.error);
        } else {
          message.error('Vui lòng điền đầy đủ thông tin');
        }
      })
      .finally(() => {
        setLoadingConfirm(false);
      });
  };

  return (
    <>
      <Flex vertical style={{ width: '100%', height: '100%', padding: 24 }} justify="center" align="center" gap={16}>
        <Flex gap={12} style={{ width: '100%', cursor: 'pointer' }} justify='start' className="hover-color-primary" onClick={() => router.push('/teacher')}>
          <LeftOutlined />
          Danh sách lớp
        </Flex>
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
              Danh sách sinh viên 
            </Title>
          </Flex>
          <Table
            loading={loading} 
            pagination={{ showSizeChanger: true }} 
            columns={columns} 
            dataSource={listStudentInClass} 
            bordered={false} 
            style={{ width: '100%' }} 
            scroll={{ x: 1024 }}
          />
        </Flex>
      </Flex>
      <ModalEditScore form={form} open={openModalEditScore} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loadingConfirm} />
    </>
  );
}

DetailClass.Layout = AdminLayout

export default DetailClass