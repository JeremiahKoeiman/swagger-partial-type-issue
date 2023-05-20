import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { todos } from "../../util/todos";

export class CreateTodoTable1681915514582 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "todo",
        columns: [
          {
            name: "id",
            primaryKeyConstraintName: "id",
            type: "int",
            isPrimary: true,
            generationStrategy: "increment",
            isNullable: false,
            isGenerated: true,
          },
          {
            name: "title",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "description",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.manager.save(todos);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("todo");
  }
}
