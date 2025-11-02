import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Enrollment } from './enrollment.entity';
import { Lesson } from './lesson.entity';

/**
 * TABLE-NAME: progress
 * TABLE-DESCRIPTION: Tracks a student's completion status for each lesson within an enrollment
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - Composite foreign key (user_id, course_id) references enrollments
 *   - lesson_id must reference a valid lesson (foreign key to lessons.id)
 *   - Unique constraint on (user_id, course_id, lesson_id) to prevent duplicate progress records
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many-to-one relationship with Enrollment (user_id, course_id references enrollments)
 *   - Many-to-one relationship with Lesson (lesson_id references lessons.id)
 */
@Entity('progress')
export class Progress extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Foreign key referencing the user (part of composite FK to enrollments)
   */
  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: false,
  })
  public userId: string;

  /**
   * COLUMN-DESCRIPTION: Foreign key referencing the course (part of composite FK to enrollments)
   */
  @Column({
    type: 'uuid',
    name: 'course_id',
    nullable: false,
  })
  public courseId: string;

  /**
   * COLUMN-DESCRIPTION: Foreign key referencing the lesson being tracked
   */
  @Column({
    type: 'uuid',
    name: 'lesson_id',
    nullable: false,
  })
  public lessonId: string;

  /**
   * COLUMN-DESCRIPTION: Boolean flag indicating whether the lesson has been completed, defaults to false
   */
  @Column({
    type: 'boolean',
    name: 'is_completed',
    default: false,
    nullable: false,
  })
  public isCompleted: boolean;

  /**
   * COLUMN-DESCRIPTION: Number of seconds the user has watched of the lesson content, defaults to 0
   */
  @Column({
    type: 'integer',
    name: 'last_watched_time',
    default: 0,
    nullable: false,
  })
  public lastWatchedTime: number;

  /**
   * RELATIONSHIP: Many-to-one relationship with Enrollment entity (composite foreign key)
   */
  @ManyToOne(() => Enrollment, (enrollment) => enrollment.progress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    { name: 'user_id', referencedColumnName: 'userId' },
    { name: 'course_id', referencedColumnName: 'courseId' },
  ])
  public enrollment: Enrollment;

  /**
   * RELATIONSHIP: Many-to-one relationship with Lesson entity
   */
  @ManyToOne(() => Lesson, (lesson) => lesson.progress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_id' })
  public lesson: Lesson;
}
