import { EGender } from "@/models/common";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { DatePicker, Form, FormInstance, Input, Modal, ModalProps, Rate, Select, Switch, message } from "antd";
import { useEffect, useState } from "react";

export interface ModalAddTeacherProps extends ModalProps {
  form: FormInstance<any>,
  type: 'edit' | 'create'
}

export default function ModalAddTeacher ({form, type, ...props}: ModalAddTeacherProps) {
  return (
    <Modal {...props} title={type === 'create' ? 'Thêm giáo viên' : 'Chỉnh sửa giáo viên'}>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} style={{ marginTop: 24 }} initialValues={{ gender: EGender.Male }}>
        <Form.Item label="Tên giáo viên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên giáo viên!' }]}>
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
      </Form>
    </Modal>
  );
}
