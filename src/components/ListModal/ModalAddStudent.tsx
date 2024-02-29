import { EGender } from "@/models/common";
import { ISemester } from "@/models/semester";
import SemesterService from "@/services/SemesterService";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { DatePicker, Form, FormInstance, Input, Modal, ModalProps, Rate, Select, Switch, message } from "antd";
import { useEffect, useState } from "react";

export interface ModalAddStudentProps extends ModalProps {
  form: FormInstance<any>,
  type: 'edit' | 'create'
}

export default function ModalAddStudent ({form, type, ...props}: ModalAddStudentProps) {
  const [listSemester, setListSemester] = useState<ISemester[]>([])

  useEffect(() => {
    handleGetListSemester()
  }, [])

  const handleGetListSemester = async () => {
    const semesters = await SemesterService.getListSemester()
    if (semesters) {
      setListSemester(semesters)
    }
  }

  return (
    <Modal {...props} title={type === 'create' ? 'Thêm sinh viên' : 'Chỉnh sửa sinh viên'}>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} style={{ marginTop: 24 }} initialValues={{ gender: EGender.Male }}>
        <Form.Item label="Tên sinh viên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sinh viên!' }]}>
          <Input placeholder="Example: Nguyễn Văn A" />
        </Form.Item>

        <Form.Item 
          label="Email" 
          name="email" 
          rules={[{ type: 'email', message: 'Nhập đúng định dạng email' }, { required: true, message: 'Vui lòng nhập email!' }]}
        >
          <Input placeholder="Example: example@gmail.com" />
        </Form.Item>

        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng điền mật khẩu!' }]}>
          <Input.Password placeholder="Điền mật khẩu" />
        </Form.Item>

        <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
          <Select 
            options={[ 
              { value: EGender.Male, label: 'Nam' },
              { value: EGender.Female, label: 'Nữ' }
            ]} 
          />
        </Form.Item>

        <Form.Item label="Ngày sinh" name="birthday" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
          <DatePicker placeholder="Chọn ngày" style={{ width: '100%' }} format='DD-MM-YYYY' />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
          <Input placeholder="Example: 0847972859" />
        </Form.Item>

        <Form.Item label="Phường / Xã" name="wards">
          <Input placeholder="Nhập phường / xã" />
        </Form.Item>

        <Form.Item label="Quận / Huyện" name="district">
          <Input placeholder="Nhập quận / huyện" />
        </Form.Item>

        <Form.Item label="Tỉnh / Thành phố" name="province">
          <Input placeholder="Nhập tỉnh / thành phố" />
        </Form.Item>

        <Form.Item label="Ngân hàng" name="nameBank" rules={[{ required: true, message: 'Vui lòng điền tên ngân hàng!' }]}>
          <Input placeholder="BIDV" />
        </Form.Item>

        <Form.Item label="Số tài khoản" name="accountNumber" rules={[{ required: true, message: 'Vui lòng điền số tài khoản!' }]}>
          <Input placeholder="Example: 68608062003" />
        </Form.Item>

        <Form.Item label="Chọn kỳ học" name="semesterId" rules={[{ required: true, message: 'Vui lòng chọn kỳ học!' }]}>
          <Select 
            placeholder='Chọn kỳ học'
            options={listSemester.map(item => {
              return {
                label: item.title,
                value: item._id
              }
            })}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
