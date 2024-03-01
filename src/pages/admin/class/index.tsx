import ModalAddClass from "@/components/ListModal/ModalAddClass"
import AdminLayout from "@/layouts/AdminLayout/AdminLayout"
import { ClassDto, IClass } from "@/models/class"
import { ITeacher } from "@/models/teacher"
import ClassService from "@/services/ClassService"
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Flex, Form, Modal, Table, TableColumnsType, Tooltip, Typography, message } from "antd"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"


const { Text, Title } = Typography
const { confirm } = Modal

const Class = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false)
  const [listClass, setListClass] = useState<ITeacher[]>([])
  const [openModalAddClass, setOpenModalAddClass] = useState<boolean>(false)
  const [idEditClass, setIdEditClass] = useState<string>('')

  const [form] = Form.useForm()
  const router = useRouter()

  useEffect(() => {
    fetchListClass()
  }, [])

  const fetchListClass = async () => {
    setLoading(true)
    const subjects = await ClassService.getListClass()
    setLoading(false)
    if (subjects) {
      setListClass(subjects)
    }
  }

  const handleEditClass = async (record: IClass) => {
    setIdEditClass(record._id);
    setOpenModalAddClass(true);
    form.setFieldsValue({
      title: record.title,
      teacherId: record.teacher._id,
      subjectId: record.subject._id,
      semesterId: record.semester._id,
      maxQuantityStudent: record.maxQuantityStudent
    });
  };

  const handleDeleteclass = async (record: IClass) => {
    confirm({
      title: 'Bạn có chắc muốn xoá lớp học này không?',
      onOk: async () => {
        const response = await ClassService.deleteClass(record._id);
        if (response?.deletedCount) {
          setListClass((prev) => prev.filter((item) => item._id !== record._id));
          message.success('Xoá lớp học thành công');
        }
      },
    });
  };

  const handleDetailClass = async (record: IClass) => {
    router.push({ pathname: `/admin/class/${record._id}` })
  }

  const columns: TableColumnsType<any> = [
    {
      title: 'Tên lớp học',
      dataIndex: 'title',
    },
    {
      title: 'Giáo viên phụ trách',
      dataIndex: ['teacher', 'name'],
      key: 'teacherName',
    },
    {
      title: 'Môn học',
      dataIndex: ['subject', 'title'],
      key: 'subjectTitle'
    },
    {
      title: 'Số lượng sinh viên',
      dataIndex: 'maxQuantityStudent',
      render: (_, record: IClass) => {
        return `${record.students.length} / ${record.maxQuantityStudent}`
      }
    },
    {
      title: 'Kỳ học',
      dataIndex: ['semester', 'title'],
      key: 'semesterTitle'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Tooltip title='Chi tiết lớp học'>
              <Button icon={<EyeOutlined />} onClick={() => handleDetailClass(record)} />
            </Tooltip>
            <Button icon={<EditOutlined />} onClick={() => handleEditClass(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteclass(record)} />
          </Flex>
        );
      },
      width: 160,
      fixed: 'right'
    },
  ];

  const handleCancelModal = () => {
    setOpenModalAddClass(false);
    setIdEditClass('');
    form.resetFields();
  };

  const handleSubmit = () => {
    setLoadingConfirm(true);
    form
      .validateFields()
      .then(async (values: ClassDto) => {
        let newListClass = [...listClass];
        if (!idEditClass) {
          const newClass = await ClassService.createClass(values);
          if (newClass) {
            newListClass = [newClass, ...newListClass];
          }
        } else {
          const newClass = await ClassService.updateClass(idEditClass, values);
          if (newClass) {
            const index = newListClass.findIndex((item) => item._id === newClass._id);
            newListClass[index] = newClass;
          }
        }
        message.success(idEditClass ? 'Cập nhật lớp học thành công' : 'Thêm lớp học thành công');
        setListClass(newListClass);
        setOpenModalAddClass(false);
        setIdEditClass('');
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
              Danh sách lớp học
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddClass(true)}>
              Thêm lớp học
            </Button>
          </Flex>
          <Table
            loading={loading} 
            pagination={{ showSizeChanger: true }} 
            columns={columns} 
            dataSource={listClass} 
            bordered={false} 
            style={{ width: '100%' }} 
            scroll={{ x: 1024 }}
          />
        </Flex>
      </Flex>
      <ModalAddClass form={form} open={openModalAddClass} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loadingConfirm} type={idEditClass ? 'edit' : 'create'} />
    </>
  );
}

Class.Layout = AdminLayout

export default Class