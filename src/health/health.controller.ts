import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  @Get('live')
  live() {
    return { status: 'ok', service: this.config.get<string>('app.serviceName') };
  }

  @Get('ready')
  ready() {
    // Phase 1 has no external dependencies. Database/provider checks are added
    // when those adapters are introduced in later phases.
    return { status: 'ready', service: this.config.get<string>('app.serviceName') };
  }
}
