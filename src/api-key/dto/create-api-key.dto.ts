import { IsNotEmpty, IsString } from 'class-validator';

export class CreateApiKeyDto {
  @IsNotEmpty()
  @IsString()
  readonly data: string;
}
