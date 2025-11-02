import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';
import {
  DatabaseCreateTable,
  DatabaseCreateForeignKey,
  DatabaseDropForeignKey,
} from './utils';

export class CreateEnrollmentsReviewsProgressTables1762069722000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enrollments table
    await DatabaseCreateTable(queryRunner, 'enrollments', [
      {
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'course_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'enrollment_date',
        type: 'timestamptz',
        default: 'now()',
        isNullable: false,
      },
      {
        name: 'completion_status',
        type: 'numeric',
        precision: 5,
        scale: 2,
        default: 0,
        isNullable: false,
      },
    ]);

    // Create unique constraint on (user_id, course_id) to ensure one enrollment per user per course
    await queryRunner.createIndex(
      'enrollments',
      new TableIndex({
        name: 'IDX_ENROLLMENT_USER_COURSE',
        columnNames: ['user_id', 'course_id'],
        isUnique: true,
      }),
    );

    // Create foreign keys for enrollments table
    await DatabaseCreateForeignKey(
      queryRunner,
      'enrollments',
      'users',
      'user_id',
    );
    await DatabaseCreateForeignKey(
      queryRunner,
      'enrollments',
      'courses',
      'course_id',
    );

    // Create course_reviews table
    await DatabaseCreateTable(queryRunner, 'course_reviews', [
      {
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'course_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'rating',
        type: 'smallint',
        isNullable: false,
      },
      {
        name: 'review_text',
        type: 'text',
        isNullable: true,
      },
    ]);

    // Create foreign keys for course_reviews table
    await DatabaseCreateForeignKey(
      queryRunner,
      'course_reviews',
      'users',
      'user_id',
    );
    await DatabaseCreateForeignKey(
      queryRunner,
      'course_reviews',
      'courses',
      'course_id',
    );

    // Create progress table
    await DatabaseCreateTable(queryRunner, 'progress', [
      {
        name: 'enrollment_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'lesson_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'is_completed',
        type: 'boolean',
        default: false,
        isNullable: false,
      },
      {
        name: 'last_watched_time',
        type: 'integer',
        default: 0,
        isNullable: false,
      },
    ]);

    // Create foreign key from progress to enrollments
    await DatabaseCreateForeignKey(
      queryRunner,
      'progress',
      'enrollments',
      'enrollment_id',
    );

    // Create foreign key from progress to lessons
    await DatabaseCreateForeignKey(
      queryRunner,
      'progress',
      'lessons',
      'lesson_id',
    );

    // Create unique index on progress to prevent duplicate lesson tracking per enrollment
    await queryRunner.createIndex(
      'progress',
      new TableIndex({
        name: 'IDX_PROGRESS_ENROLLMENT_LESSON',
        columnNames: ['enrollment_id', 'lesson_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop unique index on progress
    await queryRunner.dropIndex('progress', 'IDX_PROGRESS_ENROLLMENT_LESSON');

    // Drop foreign keys from progress table
    await DatabaseDropForeignKey(
      queryRunner,
      'progress',
      'lessons',
      'lesson_id',
    );
    await DatabaseDropForeignKey(
      queryRunner,
      'progress',
      'enrollments',
      'enrollment_id',
    );

    // Drop foreign keys from course_reviews table
    await DatabaseDropForeignKey(
      queryRunner,
      'course_reviews',
      'courses',
      'course_id',
    );
    await DatabaseDropForeignKey(
      queryRunner,
      'course_reviews',
      'users',
      'user_id',
    );

    // Drop foreign keys from enrollments table
    await DatabaseDropForeignKey(
      queryRunner,
      'enrollments',
      'courses',
      'course_id',
    );
    await DatabaseDropForeignKey(
      queryRunner,
      'enrollments',
      'users',
      'user_id',
    );

    // Drop unique index on enrollments
    await queryRunner.dropIndex('enrollments', 'IDX_ENROLLMENT_USER_COURSE');

    // Drop tables (in reverse order of creation)
    await queryRunner.dropTable('progress');
    await queryRunner.dropTable('course_reviews');
    await queryRunner.dropTable('enrollments');
  }
}
