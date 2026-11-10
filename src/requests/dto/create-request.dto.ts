import { IsArray, IsEnum, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum SupportRequestType { SERVICE = 'SERVICE', ACCESS = 'ACCESS', FEATURE = 'FEATURE', CHANGE_OWNER = 'CHANGE_OWNER', DELETE_RECORD = 'DELETE_RECORD' }
export class RequestTargetDto {
  @IsString() @MinLength(1) service!: string;
  @IsString() @MinLength(1) entityType!: string;
  @IsString() @MinLength(1) recordId!: string;
}
export class CreateRequestDto {
  @IsEnum(SupportRequestType) type!: SupportRequestType;
  @IsString() @MinLength(3) @MaxLength(180) title!: string;
  @IsString() @MinLength(1) @MaxLength(10000) description!: string;
  @IsString() service!: string;
  @IsOptional() @IsString() module?: string;
  @IsOptional() @IsString() reason?: string;
  @IsOptional() @IsString() proposedOwner?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => RequestTargetDto) targets?: RequestTargetDto[];
}
