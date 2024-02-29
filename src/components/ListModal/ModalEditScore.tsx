import { EGender } from "@/models/common";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { DatePicker, Form, FormInstance, Input, InputNumber, Modal, ModalProps, Rate, Select, Switch, message } from "antd";
import { useEffect, useState } from "react";

export interface ModalEditScoreProps extends ModalProps {
  form: FormInstance<any>,
}

export default function ModalEditScore ({form, ...props}: ModalEditScoreProps) {
  return (
    <Modal {...props} title='Chỉnh sửa điểm'>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} style={{ marginTop: 24 }}>
        <Form.Item label="Điểm quá trình" name="processScore">
          <InputNumber style={{ width: '100%' }} placeholder='Nhập điểm quá trình' />
        </Form.Item>

        <Form.Item label="Điểm cuối kỳ" name="score">
          <InputNumber style={{ width: '100%' }} placeholder='Nhập điểm cuối kỳ' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
