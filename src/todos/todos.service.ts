import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "./entities/todo.entity";
import { Repository } from "typeorm";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { isObjectEmpty } from "../common/util/functions";

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>
  ) {}

  public async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    if (isObjectEmpty(updateTodoDto)) {
      throw new BadRequestException();
    }

    const todo = await this.todoRepository.preload({
      id: +id,
      ...updateTodoDto,
    });

    if (!todo) {
      throw new NotFoundException();
    }

    return this.todoRepository.save(todo);
  }
}
