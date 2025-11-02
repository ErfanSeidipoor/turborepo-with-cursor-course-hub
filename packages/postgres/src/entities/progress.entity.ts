import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Enrollment } from './enrollment.entity';
import { Lesson } from './lesson.entity';

/**
 * TABLE-NAME: progress
 * TABLE-DESCRIPTION: Tracks a student's completion status for each lesson within an enrollment
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - enrollment_id must reference a valid enrollment (foreign key to enrollments.id)
 *   - lesson_id must reference a valid lesson (foreign key to lessons.id)
 *   - Unique constraint on (enrollment_id, lesson_id) to prevent duplicate progress records
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many-to-one relationship with Enrollment (enrollment_id references enrollments.id)
 *   - Many-to-one relationship with Lesson (lesson_id references lessons.id)
 */
@Entity('progress')
@Index('IDX_PROGRESS_ENROLLMENT_LESSON', ['enrollmentId', 'lessonId'], {
  unique: true,
})
export class Progress extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Foreign key referencing the enrollment
   */
  @Column({
    type: 'uuid',
    name: 'enrollment_id',
    nullable: false,
  })
  public enrollmentId: string;

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
   * RELATIONSHIP: Many-to-one relationship with Enrollment entity
   */
  @ManyToOne(() => Enrollment, (enrollment) => enrollment.progress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'enrollment_id' })
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
