import ApiClient from "@/configs/axiosConfig"
import { SemesterDto } from "@/models/semester"

class SemesterService {
  getListSemester = async () => {
    return await ApiClient.GET('/semester')
  }

  createSemester = async (data: SemesterDto) => {
    return await ApiClient.POST('/semester', data)
  }

  updateSemester = async (id: string, data: SemesterDto) => {
    return await ApiClient.PUT(`/semester/${id}`, data)
  }

  deleteSemester = async (id: string) => {
    return await ApiClient.DELETE(`/semester?id=${id}`)
  }
}

export default new SemesterService()