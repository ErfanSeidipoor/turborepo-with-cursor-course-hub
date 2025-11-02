import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

/**
 * TABLE-NAME: sections
 * TABLE-DESCRIPTION: Logical grouping of lessons within a course, organized in a specific order
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - course_id must reference a valid course (foreign key to courses.id)
 *   - order_index defines the sequence of sections within a course
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many-to-one relationship with Course (course_id references courses.id)
 *   - One-to-many relationship with Lesson (lessons reference this section)
 */
@Entity('sections')
export class Section extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Foreign key referencing the course this section belongs to
   */
  @Column({
    type: 'uuid',
    name: 'course_id',
    nullable: false,
  })
  public courseId: string;

  /**
   * COLUMN-DESCRIPTION: Title of the section, required field with max length 255 characters
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'title',
    nullable: false,
  })
  public title: string;

  /**
   * COLUMN-DESCRIPTION: Order index for section sequence within the course, required field
   */
  @Column({
    type: 'integer',
    name: 'order_index',
    nullable: false,
  })
  public orderIndex: number;

  /**
   * RELATIONSHIP: Many-to-one relationship with Course entity
   */
  @ManyToOne(() => Course, (course) => course.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  public course: Course;

  /**
   * RELATIONSHIP: One-to-many relationship with Lesson entity
   */
  @OneToMany(() => Lesson, (lesson) => lesson.section, {
    cascade: false,
    eager: false,
  })
  public lessons: Lesson[];
}
