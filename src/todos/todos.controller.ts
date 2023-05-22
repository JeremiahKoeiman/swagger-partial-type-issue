import { Body, Controller, Param, Put } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { Todo } from "./entities/todo.entity";

@Controller("todos")
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Put(":id")
  public update(
    @Param("id") id: string,
    @Body() updateTodoDto: UpdateTodoDto
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }
}
