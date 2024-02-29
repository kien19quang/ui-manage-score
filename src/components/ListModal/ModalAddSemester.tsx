import { EGender } from "@/models/common";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { DatePicker, Form, FormInstance, Input, Modal, ModalProps, Rate, Select, Switch, message } from "antd";
import { useEffect, useState } from "react";

export interface ModalAddSemesterProps extends ModalProps {
  form: FormInstance<any>,
  type: 'edit' | 'create'
}

export default function ModalAddSemester ({form, type, ...props}: ModalAddSemesterProps) {
  return (
    <Modal {...props} title={type === 'create' ? 'Thêm kỳ học' : 'Chỉnh sửa kỳ học'}>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} style={{ marginTop: 24 }} initialValues={{ gender: EGender.Male }}>
        <Form.Item label="Tên kỳ học" name="title" rules={[{ required: true, message: 'Vui lòng nhập tên kỳ học!' }]}>
          <Input placeholder="Example: Kỳ 2 nhóm 2" />
        </Form.Item>

        <Form.Item label="Ngày bắt đầu" name="startTime" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu kỳ học!' }]}>
          <DatePicker placeholder="Chọn ngày" format='DD-MM-YYYY' style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Ngày kết thúc" name="endTime" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc kỳ học!' }]}>
          <DatePicker placeholder="Chọn ngày" format='DD-MM-YYYY' style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
