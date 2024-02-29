import ApiClient from "@/configs/axiosConfig"
import { ILoginDto, IRegisterDto } from "@/models/auth"
import { IRegisterStudent } from "@/models/student";
import { IRegisterTeacher } from "@/models/teacher";
import { JWT } from "next-auth/jwt";

class UserService {
  async registerAdmin(data: IRegisterDto) {
    const user = await ApiClient.POST('/auth/admin/register', data)
    return user
  }

  async registerTeacher(data: IRegisterTeacher) {
    const student = await ApiClient.POST('/auth/teacher/register', data)
    return student
  }

  async registerStudent(data: IRegisterDto) {
    const student = await ApiClient.POST('/auth/student/register', data)
    return student
  }

  async loginAdmin(data: ILoginDto) {
    const user = await ApiClient.POST("/auth/admin/login", data);
    return user;
  }

  async loginTeacher(data: ILoginDto) {
    const user = await ApiClient.POST("/auth/teacher/login", data);
    return user;
  }

  async loginStudent(data: ILoginDto) {
    const user = await ApiClient.POST("/auth/student/login", data);
    return user;
  }

  async refreshTokenAdmin(token: JWT) {
    const newToken = await ApiClient.setHeaders({
      authorization: `Refresh ${token.refreshToken}`,
    }).POST("/auth/admin/refresh");

    return {
      ...token,
      ...newToken
    }
  }

  async getListAdmin () {
    return await ApiClient.GET('/user/admin')
  }

  async getListTeacher () {
    return await ApiClient.GET('/user/teacher')
  }

  async getListStudent () {
    return await ApiClient.GET('/user/student')
  }

  async updateAdmin(id: string, data: ILoginDto) {
    return await ApiClient.PUT(`/user/admin/${id}`, data)
  }
  
  async updateTeacher(id: string, data: IRegisterDto) {
    return await ApiClient.PUT(`/user/teacher/${id}`, data)
  }

  async updateStudent(id: string, data: IRegisterStudent) {
    return await ApiClient.PUT(`/user/student/${id}`, data)
  }

  async deleteAdmin(id: string) {
    return await ApiClient.DELETE(`/user/admin/${id}`)
  }

  async deleteTeacher(id: string) {
    return await ApiClient.DELETE(`/user/teacher/${id}`)
  }

  async deleteStudent(id: string) {
    return await ApiClient.DELETE(`/user/student/${id}`)
  }

  async getProfileStudent(id: string) {
    return await ApiClient.GET(`/user/student/${id}`)
  }

  async getTranscriptStudent(studentId: string) {
    return await ApiClient.GET(`/user/student/${studentId}/transcript`)
  }
} 

export default new UserService