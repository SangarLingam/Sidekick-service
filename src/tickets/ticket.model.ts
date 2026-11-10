export enum TicketStatus { NEW='new', TRIAGED='triaged', IN_PROGRESS='in_progress', WAITING_FOR_USER='waiting_for_user', RESOLVED='resolved', CLOSED='closed' }
export interface Ticket {
  id: string; tenantId: string; requesterId: string; type: string; title: string; description: string;
  service: string; module?: string; recordId?: string; status: TicketStatus; assignedTeam?: string;
  assignedUserId?: string; attachmentIds: string[]; createdAt: string; updatedAt: string;
  history: Array<{ status: TicketStatus; by: string; at: string; publicNote?: string }>;
}
