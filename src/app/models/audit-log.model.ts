export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  details: string;
  createdAt: Date;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
