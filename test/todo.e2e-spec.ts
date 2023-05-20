import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Todo } from "../src/todos/entities/todo.entity";
import { TodosModule } from "../src/todos/todos.module";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { testDataSourceOptions } from "../config/test.ormconfig";
import { Repository } from "typeorm";
import * as request from "supertest";
import { CreateTodoDto } from "../src/todos/dto/create-todo.dto";
import { UpdateTodoDto } from "../src/todos/dto/update-todo.dto";
import { todos } from "../src/common/util/todos";

describe("TodoController (e2e)", () => {
  let app: INestApplication;
  let repository: Repository<Todo>;
  let moduleFixture: TestingModule;
  let server: any;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => testDataSourceOptions,
        }),
        TodosModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
      })
    );
    await app.init();

    repository = moduleFixture.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  beforeEach(async () => {
    server = app.getHttpServer();
    await repository.save(todos);
  });

  afterEach(async () => {
    await repository.clear();
  });

  describe("/todos (POST)", () => {
    it("should create new todo", async () => {
      const newTodo: CreateTodoDto = {
        title: "new todo",
        description: "This is a newly created todo",
      };

      await request(server)
        .post("/todos")
        .send(newTodo)
        .expect((response: request.Response) => {
          expect(response.statusCode).toBe(HttpStatus.CREATED);
          expect(response.body).toEqual(expect.objectContaining(newTodo));
        });
    });

    it("should throw BadRequestException when invalid property is passed to request", async () => {
      const invalidTodo = {
        title: "new todo",
        description: "This is a newly created todo",
        yeet: "This is an invalid property that shouldn't exists on dto",
      } as unknown as CreateTodoDto;

      const errorMsg = {
        statusCode: 400,
        message: ["property yeet should not exist"],
        error: "Bad Request",
      };

      await request(server)
        .post("/todos")
        .send(invalidTodo)
        .expect((response: request.Response) => {
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
          expect(response.body).toMatchObject(errorMsg);
        });
    });

    it("should throw BadRequestException when wrong type is used for a property", async () => {
      const invalidTodo = {
        title: 12,
        description: "This is a newly created todo",
      } as unknown as CreateTodoDto;

      const errorMsg = {
        statusCode: 400,
        message: ["title must be a string"],
        error: "Bad Request",
      };

      await request(server)
        .post("/todos")
        .send(invalidTodo)
        .expect((response: request.Response) => {
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
          expect(response.body).toMatchObject(errorMsg);
        });
    });
  });

  describe("/todos/:id (PUT)", () => {
    it("should update todo with id 3", async () => {
      const requestBody = {
        title: "This is the updated title of the todo",
      };

      const todo = todos.find((todo: Todo) => todo.id === 3);

      const updatedTodo = {
        id: todo.id,
        title: requestBody.title,
        description: todo.description,
      } as unknown as UpdateTodoDto;

      await request(server)
        .put("/todos/3")
        .send(requestBody)
        .expect((response: request.Response) => {
          const { body } = response;
          const responseData = {
            id: body.id,
            title: body.title,
            description: body.description,
          } as unknown as Todo;

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(updatedTodo).toMatchObject(responseData);
        });
    });

    it("should throw NotFoundException when todo with id isn't found", async () => {
      const requestBody: UpdateTodoDto = {
        title: "This todo doesn't exists",
      };

      await request(server)
        .put("/todos/30")
        .send(requestBody)
        .expect((response: request.Response) => {
          expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
          expect(response.body).toStrictEqual(
            new NotFoundException().getResponse()
          );
        });
    });

    it("should throw BadRequestException when request payload is an empty object", async () => {
      await request(server)
        .put("/todos/1")
        .send({} as UpdateTodoDto)
        .expect((response: request.Response) => {
          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
          console.log(response.body);
          expect(response.body).toStrictEqual(
            new BadRequestException().getResponse()
          );
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
