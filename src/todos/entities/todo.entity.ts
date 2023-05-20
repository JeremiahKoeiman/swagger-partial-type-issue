import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ nullable: true })
  public description?: string;

  constructor(partial: Partial<Todo>) {
    Object.assign(this, partial);
  }
}
