import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { envSchema } from './config/env.schema';
import { HealthModule } from './health/health.module';
import { TicketsModule } from './tickets/tickets.module';
import { SkillsModule } from './skills/skills.module';
import { DatabaseModule } from './database/database.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (raw) => envSchema.parse(raw),
      load: [() => configuration(envSchema.parse(process.env))],
    }),
    DatabaseModule,
    HealthModule,
    TicketsModule,
    SkillsModule,
    RequestsModule,
  ],
})
export class AppModule {}
