import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Todo } from "../src/todos/entities/todo.entity";
import { TodosModule } from "../src/todos/todos.module";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { testDataSourceOptions } from "../config/test.ormconfig";
import { Repository } from "typeorm";
import * as request from "supertest";
import { UpdateTodoDto } from "../src/todos/dto/update-todo.dto";

describe("TodoController (e2e)", () => {
  let app: INestApplication;
  let repository: Repository<Todo>;
  let moduleFixture: TestingModule;
  let server: any;
  const todos = [
    new Todo({
      id: 1,
      title: "title 1",
      description: "description 1",
    }),
    new Todo({
      id: 2,
      title: "title 2",
      description: "description 2",
    }),
    new Todo({
      id: 3,
      title: "title 3",
      description: "description 3",
    }),
    new Todo({
      id: 4,
      title: "title 4",
      description: "description 4",
    }),
  ];

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

  describe("/todos/:id (PUT)", () => {
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
