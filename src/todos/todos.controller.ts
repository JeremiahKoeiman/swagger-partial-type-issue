import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { TodosService } from "./todos.service";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { Todo } from "./entities/todo.entity";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { todos } from "../common/util/todos";

@ApiTags("Todos")
@Controller("todos")
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiCreatedResponse({
    schema: { example: todos[0] },
  })
  @ApiBadRequestResponse({
    schema: { example: new BadRequestException().getResponse() },
  })
  @Post()
  public create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @ApiOkResponse({
    schema: { example: todos[0] },
  })
  @ApiNotFoundResponse({
    schema: { example: new NotFoundException().getResponse() },
  })
  @ApiBadRequestResponse({
    schema: { example: new BadRequestException().getResponse() },
  })
  @Put(":id")
  public update(
    @Param("id") id: string,
    @Body() updateTodoDto: UpdateTodoDto
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }
}
