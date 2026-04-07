export class UpdateAssignmentDto {
  taskId?: string;
  dueDate?: Date;
  estimatedTime?: number;
  status?: 'Todo' | 'InProgress' | 'Submitted' | 'Reviewed';
  skillIds?: string[];
}
