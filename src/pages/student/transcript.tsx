import StudentLayout from "@/layouts/StudentLayout/StudentLayout"
import { ITranscript } from "@/models/student"
import UserService from "@/services/UserService"
import { Flex, Select, Spin, Table, TableColumnsType, Typography } from "antd"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const { Text, Title } = Typography

const Transcript = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listTranscript, setListTranscript] = useState<ITranscript[]>([])
  const { data } = useSession()

  useEffect(() => {
    if (data?.user._id) {
      fetchTranscriptStudent()
    }
  }, [data?.user._id])

  const fetchTranscriptStudent = async () => {
    setLoading(true)
    const response = await UserService.getTranscriptStudent(data?.user._id as any)
    setLoading(false)
    if (response) {
      setListTranscript(response)
    }
  }

  const columns: TableColumnsType<ITranscript> = [
    {
      title: 'Mã môn học',
      dataIndex: ['subject', '_id'],
      key: '_id',
    },
    {
      title: 'Môn học',
      dataIndex: ['subject', 'title'],
      key: 'title',
      width: 250,
    },
    {
      title: 'Kỳ học',
      dataIndex: ['semester', 'title']
    },
    {
      title: 'Điểm quá trình',
      key: 'processScore',
      dataIndex: 'processScore',
    },
    {
      title: 'Điểm cuối kỳ',
      key: 'score',
      dataIndex: 'score',
    },
    {
      title: 'Điểm tổng kết',
      render: (_, record: ITranscript) => {
        if (record.processScore && record.score) {
          return ((record.processScore* 0.3) + (record.score * 0.7)).toFixed(2)
        }
        return '--'
      }
    }
  ];

  return (
    <Flex gap={24} style={{ width: '100%', padding: 24 }}>
      <Flex
        justify="center"
        vertical
        style={{
          padding: 20,
          borderRadius: 16,
          backgroundColor: 'white',
          boxShadow: '0px 6px 9px 0px rgba(156, 156, 156, 0.10), 0px 3px 2px 0px rgba(156, 156, 156, 0.08)',
          gap: 24,
          flex: 1
        }}
      >
        <Flex align="center" gap={16}>
          <Title level={3} style={{ margin: 0, fontSize: 20 }}>
            Bảng điểm
          </Title>
        </Flex>
        <Table loading={loading} pagination={{ showSizeChanger: true }} columns={columns} dataSource={listTranscript} bordered={false} style={{ width: '100%' }} />
      </Flex>
    </Flex>
  )
}

Transcript.Layout = StudentLayout

export default Transcript