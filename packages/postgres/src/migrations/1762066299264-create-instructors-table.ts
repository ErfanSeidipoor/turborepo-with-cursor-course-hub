import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  DatabaseCreateTable,
  DatabaseCreateForeignKey,
  DatabaseDropForeignKey,
} from './utils';

export class CreateInstructorsTable1762066299264 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create instructors table
    await DatabaseCreateTable(queryRunner, 'instructors', [
      {
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
        isUnique: true,
      },
      {
        name: 'bio',
        type: 'text',
        isNullable: true,
      },
      {
        name: 'rating',
        type: 'numeric',
        precision: 3,
        scale: 2,
        isNullable: true,
      },
    ]);

    // Create foreign key relationship to users table
    await DatabaseCreateForeignKey(
      queryRunner,
      'instructors',
      'users',
      'user_id',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key before dropping table
    await DatabaseDropForeignKey(
      queryRunner,
      'instructors',
      'users',
      'user_id',
    );

    // Drop instructors table
    await queryRunner.dropTable('instructors');
  }
}
