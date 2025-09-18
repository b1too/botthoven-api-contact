import { IsArray, IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContactDto {
  @IsString() @MaxLength(100) first_name!: string;
  @IsString() @MaxLength(100) last_name!: string;
  @IsEmail() email!: string;

  @IsOptional() @IsString() @MaxLength(180) company?: string;
  @IsOptional() @IsString() message?: string;

  @IsOptional() @IsArray() serviceCodes?: string[];
  @IsOptional() @IsArray() serviceIds?: number[];

  @IsOptional() @IsIn(['es','en']) lang?: 'es' | 'en';

  @IsOptional() @IsString() utm_source?: string;
  @IsOptional() @IsString() utm_medium?: string;
  @IsOptional() @IsString() utm_campaign?: string;
}
