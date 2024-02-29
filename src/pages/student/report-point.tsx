import StudentLayout from "@/layouts/StudentLayout/StudentLayout"
import { ISubjectScore } from "@/models/student"
import { Flex, Select, Table, TableColumnsType, Typography } from "antd"
import { useState } from "react"

const { Text, Title } = Typography

const ReportPoint = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listSubjectScore, setListSubjectScore] = useState<ISubjectScore[]>([])

  const columns: TableColumnsType<ISubjectScore> = [
    {
      title: 'Mã môn học',
      dataIndex: ['subject', '_id'],
      key: '_id',
    },
    {
      title: 'Tên môn học',
      dataIndex: ['subject', 'title'],
      key: 'title',
      width: 250,
    },
    {
      title: 'Giáo viên',
      dataIndex: 'teacherName',
      key: 'teacherName'
    },
    {
      title: 'Điểm quá trình',
      key: 'pointProcess',
      dataIndex: 'pointProcess',
    },
    {
      title: 'Điểm cuối kì',
      key: 'finalPoint',
      dataIndex: 'finalPoint',
    },
    {
      title: 'Tổng điểm',
      key: 'score',
      dataIndex: 'score',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
    }
  ];

  return (
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
          maxWidth: 1200,
          width: '100%',
          margin: '0 40px'
        }}
      >
        <Flex justify="space-between" align="center">
          <Title level={3} style={{ margin: 0, fontSize: 20 }}>
            Học kỳ
          </Title>

          <Select placeholder='Chọn học kỳ' style={{ width: 250 }} />
        </Flex>

        <Table loading={loading} pagination={{ showSizeChanger: true }} columns={columns} dataSource={listSubjectScore} bordered={false} style={{ width: '100%' }} />
      </Flex>
    </Flex>
  )
}

ReportPoint.Layout = StudentLayout
export default ReportPoint