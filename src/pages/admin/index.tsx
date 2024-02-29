import StudentLayout from "@/layouts/StudentLayout/StudentLayout";
import { Avatar, Button, Card, Descriptions, DescriptionsProps, Divider, Flex, Form, Modal, Spin, Table, TableColumnsType, Tabs, TabsProps, Typography, message } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { IUSer } from "../../../global";
import { stringToColor } from "@/utils";
import dayjs from "dayjs";
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { IRegisterStudent, IStudent } from "@/models/student";
import UserService from "@/services/UserService";
import ModalAddStudent from "@/components/ListModal/ModalAddStudent";
import { EGender } from "@/models/common";

const { Text, Title } = Typography
const { confirm } = Modal

export interface IStudentProps {
}

const Admin = (props: IStudentProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false)
  const [listStudent, setListStudent] = useState<IStudent[]>([])
  const [openModalAddStudent, setOpenModalAddStudent] = useState<boolean>(false)
  const [idEditStudent, setIdEditStudent] = useState<string>('')

  const [form] = Form.useForm()

  useEffect(() => {
    fetchListStudent()
  }, [])

  const fetchListStudent = async () => {
    setLoading(true)
    const students = await UserService.getListStudent()
    setLoading(false)
    if (students) {
      setListStudent(students)
    }
  }

  const handleEditStudent = async (record: IStudent) => {
    setIdEditStudent(record._id);
    setOpenModalAddStudent(true);
    form.setFieldsValue({
      ...record,
      birthday: dayjs(record.birthday)
    });
  };

  const handleDeleteUser = async (record: IStudent) => {
    confirm({
      title: 'Bạn có chắc muốn xoá sinh viên này không?',
      onOk: async () => {
        const response = await UserService.deleteStudent(record._id);
        if (response?.deletedCount) {
          setListStudent((prev) => prev.filter((item) => item._id !== record._id));
          message.success('Xoá sinh viên thành công');
        }
      },
    });
  };

  const columns: TableColumnsType<IStudent> = [
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
      title: 'Kỳ học',
      dataIndex: ['semester', 'title']
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Phường / Xã',
      dataIndex: 'wards',
    },
    {
      title: 'Quận / Huyện',
      dataIndex: 'district'
    },
    {
      title: 'Thành phố / Tỉnh',
      dataIndex: 'province'
    },
    {
      title: 'Ngân hàng',
      dataIndex: 'nameBank'
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'accountNumber'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Button icon={<EditOutlined />} onClick={() => handleEditStudent(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteUser(record)} />
          </Flex>
        );
      },
      width: 120,
      fixed: 'right'
    },
  ];

  const handleCancelModal = () => {
    setOpenModalAddStudent(false);
    setIdEditStudent('');
    form.resetFields();
  };

  const handleSubmit = () => {
    setLoadingConfirm(true);
    form
      .validateFields()
      .then(async (values: IRegisterStudent) => {
        let newListStudent = [...listStudent];
        if (!idEditStudent) {
          const student = await UserService.registerStudent(values);
          if (student) {
            newListStudent = [student, ...newListStudent];
          }
        } else {
          const student = await UserService.updateStudent(idEditStudent, values);
          if (student) {
            const index = newListStudent.findIndex((item) => item._id === student._id);
            newListStudent[index] = student;
          }
        }
        message.success(idEditStudent ? 'Cập nhật sinh viên thành công' : 'Thêm sinh viên thành công');
        setListStudent(newListStudent);
        setOpenModalAddStudent(false);
        setIdEditStudent('');
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
              Danh sách sinh viên
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddStudent(true)}>
              Thêm sinh viên
            </Button>
          </Flex>
          <Table 
            loading={loading} 
            pagination={{ showSizeChanger: true }} 
            columns={columns} 
            dataSource={listStudent} 
            bordered={false} 
            style={{ width: '100%' }} 
            scroll={{ x: 1800 }}
          />
        </Flex>
      </Flex>
      <ModalAddStudent form={form} open={openModalAddStudent} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loadingConfirm} type={idEditStudent ? 'edit' : 'create'} centered />
    </>
  );
}

Admin.Layout = AdminLayout

export default Admin