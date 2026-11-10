import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Requester, RequestIdentity } from '../common/requester.decorator';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus } from './ticket.model';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}
  @Post() create(@Body() dto: CreateTicketDto, @Requester() identity: RequestIdentity) { return this.tickets.create(dto, identity); }
  @Get() list(@Requester() identity: RequestIdentity) { return this.tickets.list(identity); }
  @Get(':id') get(@Param('id') id: string, @Requester() identity: RequestIdentity) { return this.tickets.get(id, identity); }
  @Patch(':id/status') status(@Param('id') id: string, @Body() body: { status: TicketStatus; publicNote?: string }, @Requester() identity: RequestIdentity) {
    return this.tickets.transition(id, body.status, identity, body.publicNote);
  }
}
