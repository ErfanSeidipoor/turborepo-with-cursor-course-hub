import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  DatabaseCreateTable,
  DatabaseCreateForeignKey,
  DatabaseDropForeignKey,
} from './utils';

export class CreateCoursesSectionsLessonsTables1762068074743
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create courses table
    await DatabaseCreateTable(queryRunner, 'courses', [
      {
        name: 'instructor_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'title',
        type: 'varchar',
        length: '255',
        isNullable: false,
      },
      {
        name: 'description',
        type: 'text',
        isNullable: true,
      },
      {
        name: 'status',
        type: 'enum',
        enum: ['Draft', 'Review', 'Published', 'Archived', 'Deleted'],
        isNullable: false,
        default: "'Draft'",
      },
    ]);

    // Create foreign key from courses to instructors (via user_id)
    await DatabaseCreateForeignKey(
      queryRunner,
      'courses',
      'instructors',
      'instructor_id',
    );

    // Create sections table
    await DatabaseCreateTable(queryRunner, 'sections', [
      {
        name: 'course_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'title',
        type: 'varchar',
        length: '255',
        isNullable: false,
      },
      {
        name: 'order_index',
        type: 'integer',
        isNullable: false,
      },
    ]);

    // Create foreign key from sections to courses
    await DatabaseCreateForeignKey(
      queryRunner,
      'sections',
      'courses',
      'course_id',
    );

    // Create lessons table
    await DatabaseCreateTable(queryRunner, 'lessons', [
      {
        name: 'section_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'title',
        type: 'varchar',
        length: '255',
        isNullable: false,
      },
      {
        name: 'content_url',
        type: 'text',
        isNullable: true,
      },
    ]);

    // Create foreign key from lessons to sections
    await DatabaseCreateForeignKey(
      queryRunner,
      'lessons',
      'sections',
      'section_id',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first (in reverse order)
    await DatabaseDropForeignKey(
      queryRunner,
      'lessons',
      'sections',
      'section_id',
    );
    await DatabaseDropForeignKey(
      queryRunner,
      'sections',
      'courses',
      'course_id',
    );
    await DatabaseDropForeignKey(
      queryRunner,
      'courses',
      'instructors',
      'instructor_id',
    );

    // Drop tables (in reverse order of creation)
    await queryRunner.dropTable('lessons');
    await queryRunner.dropTable('sections');
    await queryRunner.dropTable('courses');
  }
}
