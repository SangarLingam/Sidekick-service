import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RequestIdentity } from '../common/requester.decorator';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket, TicketStatus } from './ticket.model';

@Injectable()
export class TicketsService {
  private readonly tickets = new Map<string, Ticket>();
  create(dto: CreateTicketDto, identity: RequestIdentity): Ticket {
    const now = new Date().toISOString();
    const ticket: Ticket = { ...dto, id: `TKT-${randomUUID()}`, tenantId: identity.tenantId,
      requesterId: identity.userId, status: TicketStatus.NEW, attachmentIds: dto.attachmentIds ?? [],
      createdAt: now, updatedAt: now, history: [{ status: TicketStatus.NEW, by: identity.userId, at: now }] };
    this.tickets.set(ticket.id, ticket); return ticket;
  }
  list(identity: RequestIdentity): Ticket[] {
    return [...this.tickets.values()].filter(t => t.tenantId === identity.tenantId &&
      (t.requesterId === identity.userId || identity.roles.some(r => ['support_admin','support_agent','platform_admin'].includes(r))));
  }
  get(id: string, identity: RequestIdentity): Ticket {
    const ticket = this.tickets.get(id);
    if (!ticket || ticket.tenantId !== identity.tenantId) throw new NotFoundException('Ticket not found');
    if (ticket.requesterId !== identity.userId && !identity.roles.some(r => ['support_admin','support_agent','platform_admin'].includes(r))) throw new ForbiddenException();
    return ticket;
  }
  transition(id: string, status: TicketStatus, identity: RequestIdentity, publicNote?: string): Ticket {
    const ticket = this.get(id, identity);
    if (!identity.roles.some(r => ['support_admin','support_agent','platform_admin'].includes(r))) throw new ForbiddenException('Support role required');
    const allowed: Record<TicketStatus, TicketStatus[]> = {
      [TicketStatus.NEW]: [TicketStatus.TRIAGED], [TicketStatus.TRIAGED]: [TicketStatus.IN_PROGRESS, TicketStatus.WAITING_FOR_USER],
      [TicketStatus.IN_PROGRESS]: [TicketStatus.WAITING_FOR_USER, TicketStatus.RESOLVED],
      [TicketStatus.WAITING_FOR_USER]: [TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED],
      [TicketStatus.RESOLVED]: [TicketStatus.CLOSED, TicketStatus.IN_PROGRESS], [TicketStatus.CLOSED]: [TicketStatus.IN_PROGRESS],
    };
    if (!allowed[ticket.status].includes(status)) throw new ForbiddenException(`Invalid transition ${ticket.status} -> ${status}`);
    const now = new Date().toISOString(); ticket.status = status; ticket.updatedAt = now;
    ticket.history.push({ status, by: identity.userId, at: now, publicNote }); return ticket;
  }
}
