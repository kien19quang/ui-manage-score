export interface ISemester {
  _id: string;
  title: string;
  startTime: Date;
  endTime: Date;
}

export interface SemesterDto {
  title: string;
  startTime: Date;
  endTime: Date
}