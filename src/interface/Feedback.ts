import { Employee } from './Employee';

export interface Feedback {
  id: number;
  feedbackText: string;
  createdAt: Date;
  employee: Employee;
  owner: Employee;
}
