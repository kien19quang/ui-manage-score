import ModalAddTeacher from "@/components/ListModal/ModalAddTeacher"
import AdminLayout from "@/layouts/AdminLayout/AdminLayout"
import { EGender } from "@/models/common"
import { IRegisterTeacher, ITeacher } from "@/models/teacher"
import UserService from "@/services/UserService"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Flex, Form, Modal, Table, TableColumnsType, Typography, message } from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

const { Text, Title } = Typography
const { confirm } = Modal

const Teacher = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false)
  const [listTeacher, setListTeacher] = useState<ITeacher[]>([])
  const [openModalAddTeacher, setOpenModalAddTeacher] = useState<boolean>(false)
  const [idEditTeacher, setIdEditTeacher] = useState<string>('')

  const [form] = Form.useForm()

  useEffect(() => {
    fetchListTeacher()
  }, [])

  const fetchListTeacher = async () => {
    setLoading(true)
    const teachers = await UserService.getListTeacher()
    setLoading(false)
    if (teachers) {
      setListTeacher(teachers)
    }
  }

  const handleEditTeacher = async (record: ITeacher) => {
    setIdEditTeacher(record._id);
    setOpenModalAddTeacher(true);
    form.setFieldsValue({
      ...record,
      birthday: dayjs(record.birthday)
    });
  };

  const handleDeleteTeacher = async (record: ITeacher) => {
    confirm({
      title: 'Bạn có chắc muốn xoá giáo viên này không?',
      onOk: async () => {
        const response = await UserService.deleteTeacher(record._id);
        if (response?.deletedCount) {
          setListTeacher((prev) => prev.filter((item) => item._id !== record._id));
          message.success('Xoá giáo viên thành công');
        }
      },
    });
  };

  const columns: TableColumnsType<ITeacher> = [
    {
      title: 'Mã giáo viên',
      dataIndex: '_id',
      fixed: 'left'
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      fixed: 'left'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      render: value => value === EGender.Male ? 'Nam' : 'Nữ'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      render: value => dayjs(value).format('DD-MM-YYYY')
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Button icon={<EditOutlined />} onClick={() => handleEditTeacher(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteTeacher(record)} />
          </Flex>
        );
      },
      width: 120,
      fixed: 'right'
    },
  ];

  const handleCancelModal = () => {
    setOpenModalAddTeacher(false);
    setIdEditTeacher('');
    form.resetFields();
  };

  const handleSubmit = () => {
    setLoadingConfirm(true);
    form
      .validateFields()
      .then(async (values: IRegisterTeacher) => {
        let newListTeacher = [...listTeacher];
        if (!idEditTeacher) {
          const teacher = await UserService.registerTeacher(values);
          if (teacher) {
            newListTeacher = [teacher, ...newListTeacher];
          }
        } else {
          const teacher = await UserService.updateTeacher(idEditTeacher, values);
          if (teacher) {
            const index = newListTeacher.findIndex((item) => item._id === teacher._id);
            newListTeacher[index] = teacher;
          }
        }
        message.success(idEditTeacher ? 'Cập nhật giáo viên thành công' : 'Thêm giáo viên thành công');
        setListTeacher(newListTeacher);
        setOpenModalAddTeacher(false);
        setIdEditTeacher('');
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
              Danh sách giáo viên
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddTeacher(true)}>
              Thêm giáo viên
            </Button>
          </Flex>
          <Table
            loading={loading} 
            pagination={{ showSizeChanger: true }} 
            columns={columns} 
            dataSource={listTeacher} 
            bordered={false} 
            style={{ width: '100%' }} 
            scroll={{ x: 1024 }}
          />
        </Flex>
      </Flex>
      <ModalAddTeacher form={form} open={openModalAddTeacher} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loadingConfirm} type={idEditTeacher ? 'edit' : 'create'} />
    </>
  );
}

Teacher.Layout = AdminLayout

export default Teacher