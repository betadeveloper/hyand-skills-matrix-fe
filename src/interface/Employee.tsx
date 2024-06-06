enum CareerLevel {
  JUNIOR,
  MID,
  SENIOR,
  LEAD,
  PRINCIPAL,
}

export interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  careerLevel?: CareerLevel;
}
