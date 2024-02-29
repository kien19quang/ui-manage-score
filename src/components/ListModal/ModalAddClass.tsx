import { EGender } from "@/models/common";
import { ISemester } from "@/models/semester";
import { ISubject } from "@/models/subject";
import { ITeacher } from "@/models/teacher";
import SemesterService from "@/services/SemesterService";
import SubjectService from "@/services/SubjectService";
import UserService from "@/services/UserService";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { DatePicker, Form, FormInstance, Input, InputNumber, Modal, ModalProps, Rate, Select, Switch, message } from "antd";
import { useEffect, useState } from "react";

export interface ModalAddClassProps extends ModalProps {
  form: FormInstance<any>,
  type: 'edit' | 'create'
}

export default function ModalAddClass ({form, type, ...props}: ModalAddClassProps) {
  const [listTeacher, setListTeacher] = useState<ITeacher[]>([])
  const [listSubject, setListSubject] = useState<ISubject[]>([])
  const [listSemester, setListSemester] = useState<ISemester[]>([])

  useEffect(() => {
    initOption()
  }, [])

  const initOption = async () => {
    const [teachers, subjects, semesters] = await Promise.all([
      UserService.getListTeacher(),
      SubjectService.getListSubject(),
      SemesterService.getListSemester()
    ])

    if (teachers) {
      setListTeacher(teachers)
    }
    if (subjects) {
      setListSubject(subjects)
    }
    if (semesters) {
      setListSemester(semesters)
    }
  }

  return (
    <Modal {...props} title={type === 'create' ? 'Thêm lớp học' : 'Chỉnh sửa lớp học'}>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} style={{ marginTop: 24 }} initialValues={{ gender: EGender.Male }}>
        <Form.Item label="Tên lớp học" name="title" rules={[{ required: true, message: 'Vui lòng nhập tên lớp học!' }]}>
          <Input placeholder="Example: Tin DC.1" />
        </Form.Item>

        <Form.Item label="Số lượng sinh viên" name="maxQuantityStudent" rules={[{ required: true, message: 'Vui lòng nhập số lượng sinh viên!' }]}>
          <InputNumber placeholder='Nhập số lượng sinh viên' style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Chọn giáo viên" name="teacherId" rules={[{ required: true, message: 'Vui lòng chọn giáo viên!' }]}>
          <Select 
            placeholder='Chọn giáo viên'
            options={listTeacher.map(item => {
              return {
                label: item.name,
                value: item._id
              }
            })}
          />
        </Form.Item>

        <Form.Item label="Chọn môn học" name="subjectId" rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
          <Select 
            placeholder='Chọn môn học'
            options={listSubject.map(item => {
              return {
                label: item.title,
                value: item._id
              }
            })}
          />
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
