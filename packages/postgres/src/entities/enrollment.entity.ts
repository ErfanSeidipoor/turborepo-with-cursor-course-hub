import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from './user.entity';

/**
 * TABLE-NAME: enrollments
 * TABLE-DESCRIPTION: Records a student's active registration in a course. Serves as a junction table between users and courses.
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - Composite primary key on (user_id, course_id) ensures one enrollment per user per course
 *   - user_id must reference a valid user (foreign key to users.id)
 *   - course_id must reference a valid course (foreign key to courses.id)
 *   - completion_status is a percentage (0-100) with 2 decimal places
 * TABLE-RELATIONSHIPS:
 *   - Many-to-one relationship with User (user_id references users.id)
 *   - Many-to-one relationship with Course (course_id references courses.id)
 *   - One-to-many relationship with Progress (progress records reference this enrollment)
 */
@Entity('enrollments')
export class Enrollment {
  /**
   * COLUMN-DESCRIPTION: Foreign key referencing the user who enrolled in the course, part of composite primary key
   */
  @PrimaryColumn({
    type: 'uuid',
    name: 'user_id',
  })
  public userId: string;

  /**
   * COLUMN-DESCRIPTION: Foreign key referencing the course the user enrolled in, part of composite primary key
   */
  @PrimaryColumn({
    type: 'uuid',
    name: 'course_id',
  })
  public courseId: string;

  /**
   * COLUMN-DESCRIPTION: Timestamp when the user enrolled in the course
   */
  @Column({
    type: 'timestamptz',
    name: 'enrollment_date',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  public enrollmentDate: Date;

  /**
   * COLUMN-DESCRIPTION: Course completion percentage (0-100) with 2 decimal places, defaults to 0
   */
  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    name: 'completion_status',
    default: 0,
    nullable: false,
  })
  public completionStatus: number;

  /**
   * COLUMN-DESCRIPTION: Timestamp when the enrollment record was created
   */
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  public createdAt: Date;

  /**
   * COLUMN-DESCRIPTION: Timestamp when the enrollment record was last updated
   */
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  public updatedAt: Date;

  /**
   * COLUMN-DESCRIPTION: Timestamp when the enrollment record was soft deleted, null if not deleted
   */
  @DeleteDateColumn({
    type: 'timestamptz',
    default: () => `null`,
    name: 'deleted_at',
  })
  public deletedAt: Date | null;

  /**
   * RELATIONSHIP: Many-to-one relationship with User entity
   */
  @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  /**
   * RELATIONSHIP: Many-to-one relationship with Course entity
   */
  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  public course: Course;

  /**
   * RELATIONSHIP: One-to-many relationship with Progress entity
   */
  @OneToMany('Progress', (progress: any) => progress.enrollment, {
    cascade: false,
    eager: false,
  })
  public progress: any[];
}
