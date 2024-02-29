import ModalAddSemester from "@/components/ListModal/ModalAddSemester"
import AdminLayout from "@/layouts/AdminLayout/AdminLayout"
import { ISemester, SemesterDto } from "@/models/semester"
import SemesterService from "@/services/SemesterService"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Flex, Form, Modal, Table, TableColumnsType, Typography, message } from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"


const { Text, Title } = Typography
const { confirm } = Modal

const Semester = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false)
  const [listSemester, setListSemester] = useState<ISemester[]>([])
  const [openModalAddSemester, setOpenModalAddSemester] = useState<boolean>(false)
  const [idEditSemester, setIdEditSemester] = useState<string>('')

  const [form] = Form.useForm()

  useEffect(() => {
    fetchListSemester()
  }, [])

  const fetchListSemester = async () => {
    setLoading(true)
    const subjects = await SemesterService.getListSemester()
    setLoading(false)
    if (subjects) {
      setListSemester(subjects)
    }
  }

  const handleEditSemester = async (record: ISemester) => {
    setIdEditSemester(record._id);
    setOpenModalAddSemester(true);
    form.setFieldsValue({
      ...record,
      startTime: dayjs(record.startTime),
      endTime: dayjs(record.endTime)
    });
  };

  const handleDeleteSemester = async (record: ISemester) => {
    confirm({
      title: 'Bạn có chắc muốn xoá kỳ học này không?',
      onOk: async () => {
        const response = await SemesterService.deleteSemester(record._id);
        if (response?.deletedCount) {
          setListSemester((prev) => prev.filter((item) => item._id !== record._id));
          message.success('Xoá kỳ học thành công');
        }
      },
    });
  };

  const columns: TableColumnsType<ISemester> = [
    {
      title: 'Kỳ học',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      render: value => dayjs(value).format('DD-MM-YYYY')
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      render: value => dayjs(value).format('DD-MM-YYYY')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Button icon={<EditOutlined />} onClick={() => handleEditSemester(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteSemester(record)} />
          </Flex>
        );
      },
      width: 120,
    },
  ];

  const handleCancelModal = () => {
    setOpenModalAddSemester(false);
    setIdEditSemester('');
    form.resetFields();
  };

  const handleSubmit = () => {
    setLoadingConfirm(true);
    form
      .validateFields()
      .then(async (values: SemesterDto) => {
        let newListSemester = [...listSemester];
        if (!idEditSemester) {
          const semester = await SemesterService.createSemester(values);
          if (semester) {
            newListSemester = [semester, ...newListSemester];
          }
        } else {
          const semester = await SemesterService.updateSemester(idEditSemester, values);
          if (semester) {
            const index = newListSemester.findIndex((item) => item._id === semester._id);
            newListSemester[index] = semester;
          }
        }
        message.success(idEditSemester ? 'Cập nhật kỳ học thành công' : 'Thêm kỳ học thành công');
        setListSemester(newListSemester);
        setOpenModalAddSemester(false);
        setIdEditSemester('');
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
              Danh sách kỳ học
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddSemester(true)}>
              Thêm kỳ học
            </Button>
          </Flex>
          <Table
            loading={loading} 
            pagination={{ showSizeChanger: true }} 
            columns={columns} 
            dataSource={listSemester} 
            bordered={false} 
            style={{ width: '100%' }} 
            scroll={{ x: 1024 }}
          />
        </Flex>
      </Flex>
      <ModalAddSemester form={form} open={openModalAddSemester} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loadingConfirm} type={idEditSemester ? 'edit' : 'create'} />
    </>
  );
}

Semester.Layout = AdminLayout

export default Semester