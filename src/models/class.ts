import { ISemester } from "./semester";
import { IStudent } from "./student";
import { ISubject } from "./subject";
import { ITeacher } from "./teacher";


export interface IClass {
  _id: string;
  title: string;
  subject: ISubject;
  teacher: ITeacher;
  semester: ISemester;
  students: IStudent[]
  maxQuantityStudent: number;
  scores: IScrore[];
}

export interface ClassDto {
  title: string;
  subjectId: string;
  teacherId: string;
  semesterId: string;
  maxQuantityStudent: number;
}

export interface IClassStudent {
  _id: string;
  title: string;
  teacher: ITeacher;
  maxQuantityStudent: number;
  students: string[]
}

export interface IClassTeacher {
  _id: string;
  title: string;
  maxQuantityStudent: number;
  students: string[]
  subject: ISubject
}

export interface UpdateScoreDto {
  classId: string;
  studentId: string;
  score: string;
  processScore: string;
}

export interface IScrore {
  studentId: string;
  score: number;
  processScore: number
}