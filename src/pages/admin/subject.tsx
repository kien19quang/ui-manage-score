import ModalAddSubject from "@/components/ListModal/ModalAddSubject"
import AdminLayout from "@/layouts/AdminLayout/AdminLayout"
import { ISubject, SubjectDto } from "@/models/subject"
import SubjectService from "@/services/SubjectService"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Flex, Form, Modal, Table, TableColumnsType, Typography, message } from "antd"
import { useEffect, useState } from "react"

const { Text, Title } = Typography
const { confirm } = Modal

const Subject = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false)
  const [listSubject, setListSubject] = useState<ISubject[]>([])
  const [openModalAddSubject, setOpenModalAddSubject] = useState<boolean>(false)
  const [idEditSubject, setIdEditSubject] = useState<string>('')

  const [form] = Form.useForm()

  useEffect(() => {
    fetchListSubject()
  }, [])

  const fetchListSubject = async () => {
    setLoading(true)
    const subjects = await SubjectService.getListSubject()
    setLoading(false)
    if (subjects) {
      setListSubject(subjects)
    }
  }

  const handleEditSubject = async (record: ISubject) => {
    setIdEditSubject(record._id);
    setOpenModalAddSubject(true);
    form.setFieldsValue(record);
  };

  const handleDeleteSubject = async (record: ISubject) => {
    confirm({
      title: 'Bạn có chắc muốn xoá môn học này không?',
      onOk: async () => {
        const response = await SubjectService.deleteSubject(record._id);
        if (response?.deletedCount) {
          setListSubject((prev) => prev.filter((item) => item._id !== record._id));
          message.success('Xoá môn học thành công');
        }
      },
    });
  };

  const columns: TableColumnsType<ISubject> = [
    {
      title: 'Mã môn học',
      dataIndex: '_id',
    },
    {
      title: 'Tên môn học',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Button icon={<EditOutlined />} onClick={() => handleEditSubject(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteSubject(record)} />
          </Flex>
        );
      },
      width: 120,
    },
  ];

  const handleCancelModal = () => {
    setOpenModalAddSubject(false);
    setIdEditSubject('');
    form.resetFields();
  };

  const handleSubmit = () => {
    setLoadingConfirm(true);
    form
      .validateFields()
      .then(async (values: SubjectDto) => {
        let newListSubject = [...listSubject];
        if (!idEditSubject) {
          const subject = await SubjectService.createSubject(values);
          if (subject) {
            newListSubject = [subject, ...newListSubject];
          }
        } else {
          const subject = await SubjectService.updateSubject(idEditSubject, values);
          if (subject) {
            const index = newListSubject.findIndex((item) => item._id === subject._id);
            newListSubject[index] = subject;
          }
        }
        message.success(idEditSubject ? 'Cập nhật môn học thành công' : 'Thêm môn học thành công');
        setListSubject(newListSubject);
        setOpenModalAddSubject(false);
        setIdEditSubject('');
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
              Danh sách môn học
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddSubject(true)}>
              Thêm môn học
            </Button>
          </Flex>
          <Table
            loading={loading} 
            pagination={{ showSizeChanger: true }} 
            columns={columns} 
            dataSource={listSubject} 
            bordered={false} 
            style={{ width: '100%' }} 
            scroll={{ x: 1024 }}
          />
        </Flex>
      </Flex>
      <ModalAddSubject form={form} open={openModalAddSubject} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loadingConfirm} type={idEditSubject ? 'edit' : 'create'} />
    </>
  );
}

Subject.Layout = AdminLayout

export default Subject