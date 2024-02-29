import ApiClient from "@/configs/axiosConfig"
import { ClassDto, UpdateScoreDto } from "@/models/class"

class ClassService {
  getListClass = async () => {
    return await ApiClient.GET('/class')
  }

  getClassStudent = async (semesterId: string) => {
    return await ApiClient.GET(`/class/student?semesterId=${semesterId}`)
  }

  getClassTeacher = async (teacherId: string) => {
    return await ApiClient.GET(`/class/teacher?teacherId=${teacherId}`)
  }

  getClassDetail = async (classId: string) => {
    return await ApiClient.GET(`/class/${classId}`)
  }

  createClass = async (data: ClassDto) => {
    return await ApiClient.POST('/class', data)
  }

  registerToClass = async (studentId: string, classId: string) => {
    return await ApiClient.POST('/class/register-to-class', {
      studentId: studentId,
      classId: classId
    })
  }

  updateScore = async(data: UpdateScoreDto) => {
    return await ApiClient.POST('/class/update-score', data)
  }

  cancelRegisterToClass = async (studentId: string, classId: string) => {
    return await ApiClient.POST('/class/cancel-register-to-class', {
      studentId: studentId,
      classId: classId
    })
  }

  updateClass = async (id: string, data: ClassDto) => {
    return await ApiClient.PUT(`/class/${id}`, data)
  }

  deleteClass = async (id: string) => {
    return await ApiClient.DELETE(`/class?id=${id}`)
  }
}

export default new ClassService()