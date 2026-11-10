import { IsArray, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export enum TicketType { SUPPORT = 'support', BUG = 'bug', INCIDENT = 'incident' }
export class CreateTicketDto {
  @IsEnum(TicketType) type!: TicketType;
  @IsString() @MinLength(3) @MaxLength(180) title!: string;
  @IsString() @MinLength(1) @MaxLength(10000) description!: string;
  @IsString() service!: string;
  @IsOptional() @IsString() module?: string;
  @IsOptional() @IsString() recordId?: string;
  @IsOptional() @IsArray() attachmentIds?: string[];
}
