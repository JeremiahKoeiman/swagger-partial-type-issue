import { PartialType } from "@nestjs/swagger";
/**
 * Uncomment the line below and comment out the line above and run `npm run test:e2e` for the issue to occur
 */
// import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from "./create-todo.dto";

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
