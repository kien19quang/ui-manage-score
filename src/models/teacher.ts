import { EGender } from "./common";

export interface ITeacher {
  _id: string;
  name: string;
  gender: EGender;
  birthday: Date;
  phoneNumber: string;
  email: string;
  address: string;
}

export interface IRegisterTeacher {
  name: string;
  gender: EGender;
  birthday: Date;
  phoneNumber: string;
  email: string;
  address: string;
  password: string;
}