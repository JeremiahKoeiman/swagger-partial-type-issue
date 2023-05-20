import { IsOptional, IsString } from "class-validator";

export class CreateTodoDto {
  @IsString()
  public readonly title: string;

  @IsString()
  @IsOptional()
  public readonly description?: string;
}
