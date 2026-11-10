import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RequestStatus } from '@prisma/client';
import { RequestIdentity } from '../common/requester.decorator';
import { PrismaService } from '../database/prisma.service';
import { CreateRequestDto, SupportRequestType } from './dto/create-request.dto';

const staffRoles = ['support_admin', 'support_agent', 'platform_admin'];
@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRequestDto, identity: RequestIdentity) {
    if ([SupportRequestType.CHANGE_OWNER, SupportRequestType.DELETE_RECORD].includes(dto.type)) {
      if (!dto.reason?.trim()) throw new ForbiddenException('A reason is required for record changes');
      if (!dto.targets?.length) throw new ForbiddenException('Select at least one record');
      const unique = new Set(dto.targets.map(t => `${t.service}:${t.entityType}:${t.recordId}`));
      if (unique.size !== dto.targets.length) throw new ForbiddenException('Duplicate target records are not allowed');
      if (dto.type === SupportRequestType.CHANGE_OWNER && !dto.proposedOwner?.trim()) {
        throw new ForbiddenException('A proposed owner is required');
      }
    }
    return this.prisma.supportRequest.create({
      data: {
        tenantId: identity.tenantId,
        requesterId: identity.userId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        service: dto.service,
        module: dto.module,
        reason: dto.reason,
        proposedOwner: dto.proposedOwner,
        targets: dto.targets?.length ? { create: dto.targets } : undefined,
      },
      include: { targets: true },
    });
  }

  async list(identity: RequestIdentity) {
    const staff = identity.roles.some(role => staffRoles.includes(role));
    return this.prisma.supportRequest.findMany({
      where: { tenantId: identity.tenantId, ...(staff ? {} : { requesterId: identity.userId }) },
      include: { targets: true }, orderBy: { updatedAt: 'desc' },
    });
  }

  async get(id: string, identity: RequestIdentity) {
    const request = await this.prisma.supportRequest.findFirst({
      where: { id, tenantId: identity.tenantId }, include: { targets: true },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (request.requesterId !== identity.userId && !identity.roles.some(role => staffRoles.includes(role))) {
      throw new ForbiddenException();
    }
    return request;
  }

  async transition(id: string, status: RequestStatus, identity: RequestIdentity) {
    const request = await this.get(id, identity);
    if (!identity.roles.some(role => staffRoles.includes(role))) throw new ForbiddenException('Support role required');
    const transitions: Record<RequestStatus, RequestStatus[]> = {
      SUBMITTED: ['UNDER_REVIEW', 'CANCELLED'],
      UNDER_REVIEW: ['AWAITING_APPROVAL', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'CANCELLED'],
      AWAITING_APPROVAL: ['APPROVED', 'REJECTED', 'CANCELLED'],
      APPROVED: ['IN_PROGRESS', 'CANCELLED'],
      REJECTED: [], IN_PROGRESS: ['COMPLETED', 'PARTIALLY_COMPLETED', 'FAILED'],
      COMPLETED: [], PARTIALLY_COMPLETED: ['IN_PROGRESS', 'COMPLETED', 'FAILED'], FAILED: ['IN_PROGRESS'], CANCELLED: [],
    };
    if (!transitions[request.status].includes(status)) throw new ForbiddenException(`Invalid request transition ${request.status} -> ${status}`);
    return this.prisma.supportRequest.update({ where: { id }, data: { status }, include: { targets: true } });
  }
}
