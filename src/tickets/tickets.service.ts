import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TicketStatus } from '@prisma/client';
import { RequestIdentity } from '../common/requester.decorator';
import { PrismaService } from '../database/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

const supportRoles = ['support_admin', 'support_agent', 'platform_admin'];

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTicketDto, identity: RequestIdentity) {
    return this.prisma.ticket.create({
      data: {
        tenantId: identity.tenantId,
        requesterId: identity.userId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        service: dto.service,
        module: dto.module,
        recordId: dto.recordId,
        attachmentIds: dto.attachmentIds ?? [],
        history: { create: { status: TicketStatus.NEW, actorId: identity.userId } },
      },
      include: { history: { orderBy: { createdAt: 'asc' } } },
    });
  }

  async list(identity: RequestIdentity) {
    const support = identity.roles.some((role) => supportRoles.includes(role));
    return this.prisma.ticket.findMany({
      where: { tenantId: identity.tenantId, ...(support ? {} : { requesterId: identity.userId }) },
      include: { history: { orderBy: { createdAt: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async get(id: string, identity: RequestIdentity) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, tenantId: identity.tenantId },
      include: { history: { orderBy: { createdAt: 'asc' } }, comments: { orderBy: { createdAt: 'asc' } } },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.requesterId !== identity.userId && !identity.roles.some((role) => supportRoles.includes(role))) {
      throw new ForbiddenException();
    }
    return ticket;
  }

  async transition(id: string, status: TicketStatus, identity: RequestIdentity, publicNote?: string) {
    const ticket = await this.get(id, identity);
    if (!identity.roles.some((role) => supportRoles.includes(role))) {
      throw new ForbiddenException('Support role required');
    }
    const allowed: Record<TicketStatus, TicketStatus[]> = {
      NEW: ['TRIAGED'],
      TRIAGED: ['IN_PROGRESS', 'WAITING_FOR_USER'],
      IN_PROGRESS: ['WAITING_FOR_USER', 'RESOLVED'],
      WAITING_FOR_USER: ['IN_PROGRESS', 'RESOLVED'],
      RESOLVED: ['CLOSED', 'IN_PROGRESS'],
      CLOSED: ['IN_PROGRESS'],
    };
    if (!allowed[ticket.status].includes(status)) {
      throw new ForbiddenException(`Invalid transition ${ticket.status} -> ${status}`);
    }
    return this.prisma.$transaction(async (tx) => {
      await tx.ticket.update({ where: { id }, data: { status } });
      await tx.ticketEvent.create({ data: { ticketId: id, status, actorId: identity.userId, publicNote } });
      return tx.ticket.findUniqueOrThrow({
        where: { id }, include: { history: { orderBy: { createdAt: 'asc' } } },
      });
    });
  }
}
