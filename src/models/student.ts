import { ISemester } from "./semester";
import { ISubject } from "./subject";
import { ITeacher } from "./teacher";

export interface ISubjectScore {
  subject: ISubject,
  score: number;
  status: string;
}

export interface ISubjectSchedule {
  subject: ISubject,
  examDay: Date,
  examSession: number;
}

export interface ITranscript {
  subject: ISubject,
  teacher: ITeacher,
  semester: ISemester,
  student: IStudent,
  score: number;
  processScore: number;
}

export interface IStudent {
  _id: string;
  name: string;
  email: string;
  gender: string;
  birthday: Date;
  phoneNumber: string;
  wards: string;
  district: string;
  province: string;
  nameBank: string;
  accountNumber: string;
  password: string;
  semester: ISemester
}

export interface IRegisterStudent {
  name: string;
  email: string;
  gender: string;
  birthday: Date;
  phoneNumber: string;
  wards: string;
  district: string;
  province: string;
  nameBank: string;
  accountNumber: string;
  password: string;
}