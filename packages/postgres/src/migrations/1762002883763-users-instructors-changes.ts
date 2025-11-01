import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

/**
 * Migration: UsersInstructorsChanges
 *
 * Changes:
 * 1. Rename 'username' column to 'email' in the users table
 * 2. Create instructors table with:
 *    - user_id (UUID, PK, FK to users.id)
 *    - bio (TEXT)
 *    - rating (NUMERIC(3,2))
 *
 * This migration modifies the users table to use email instead of username
 * and creates the instructors table for instructor-specific data.
 * Note: instructors table uses user_id as primary key (one-to-one with users)
 */
export class UsersInstructorsChanges1762002883763
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Rename username column to email in users table
    await queryRunner.renameColumn('users', 'username', 'email');

    // Step 2: Create instructors table with user_id as primary key
    await queryRunner.createTable(
      new Table({
        name: 'instructors',
        columns: [
          {
            name: 'user_id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'bio',
            type: 'text',
            isNullable: true,
            default: null,
          },
          {
            name: 'rating',
            type: 'numeric',
            precision: 3,
            scale: 2,
            isNullable: true,
            default: null,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
            default: null,
          },
        ],
      }),
      true,
    );

    // Step 3: Create foreign key from instructors.user_id to users.id
    await queryRunner.createForeignKey(
      'instructors',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Drop instructors table (FK will be dropped automatically)
    await queryRunner.dropTable('instructors');

    // Step 2: Rename email column back to username in users table
    await queryRunner.renameColumn('users', 'email', 'username');
  }
}
