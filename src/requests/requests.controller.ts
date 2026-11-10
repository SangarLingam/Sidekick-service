import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RequestStatus } from '@prisma/client';
import { Requester, RequestIdentity } from '../common/requester.decorator';
import { CreateRequestDto } from './dto/create-request.dto';
import { TransitionRequestDto } from './dto/transition-request.dto';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requests: RequestsService) {}
  @Post() create(@Body() dto: CreateRequestDto, @Requester() user: RequestIdentity) { return this.requests.create(dto, user); }
  @Get() list(@Requester() user: RequestIdentity) { return this.requests.list(user); }
  @Get(':id') get(@Param('id') id: string, @Requester() user: RequestIdentity) { return this.requests.get(id, user); }
  @Patch(':id/status') transition(@Param('id') id: string, @Body() dto: TransitionRequestDto, @Requester() user: RequestIdentity) {
    return this.requests.transition(id, dto.status as RequestStatus, user);
  }
}
