import ApiClient from "@/configs/axiosConfig"
import { SubjectDto } from "@/models/subject"

class SubjectService {
  getListSubject = async () => {
    return await ApiClient.GET('/subject')
  }

  createSubject = async (data: SubjectDto) => {
    return await ApiClient.POST('/subject', data)
  }

  updateSubject = async (id: string, data: SubjectDto) => {
    return await ApiClient.PUT(`/subject/${id}`, data)
  }

  deleteSubject = async (id: string) => {
    return await ApiClient.DELETE(`/subject?id=${id}`)
  }
}

export default new SubjectService()