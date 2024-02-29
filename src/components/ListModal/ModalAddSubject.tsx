import { EGender } from "@/models/common";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { DatePicker, Form, FormInstance, Input, Modal, ModalProps, Rate, Select, Switch, message } from "antd";
import { useEffect, useState } from "react";

export interface ModalAddSubjectProps extends ModalProps {
  form: FormInstance<any>,
  type: 'edit' | 'create'
}

export default function ModalAddSubject ({form, type, ...props}: ModalAddSubjectProps) {
  return (
    <Modal {...props} title={type === 'create' ? 'Thêm môn học' : 'Chỉnh sửa môn học'}>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} style={{ marginTop: 24 }} initialValues={{ gender: EGender.Male }}>
        <Form.Item label="Mã môn học" name="_id" rules={[{ required: true, message: 'Vui lòng nhập mã môn học!' }]}>
          <Input placeholder="Example: MI232" />
        </Form.Item>

        <Form.Item label="Tên môn học" name="title" rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}>
          <Input placeholder="Example: Ngôn ngữ lập trình" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
