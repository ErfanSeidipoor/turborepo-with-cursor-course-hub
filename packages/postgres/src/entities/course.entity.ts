import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoursesStatusEnum } from '@repo/enums';
import { BaseEntity } from './base.entity';
import { CourseReview } from './course-review.entity';
import { Enrollment } from './enrollment.entity';
import { Instructor } from './instructor.entity';
import { Section } from './section.entity';

/**
 * TABLE-NAME: courses
 * TABLE-DESCRIPTION: Stores main catalog of available courses. All courses are free.
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - instructor_id must reference a valid instructor (foreign key to instructors.id)
 *   - status must be one of the CoursesStatusEnum values
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many-to-one relationship with Instructor (instructor_id references instructors.id)
 *   - One-to-many relationship with Section (sections reference this course)
 *   - One-to-many relationship with Enrollment (enrollments reference this course)
 *   - One-to-many relationship with CourseReview (course reviews reference this course)
 */
@Entity('courses')
export class Course extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Foreign key referencing the instructor who created this course
   */
  @Column({
    type: 'uuid',
    name: 'instructor_id',
    nullable: false,
  })
  public instructorId: string;

  /**
   * COLUMN-DESCRIPTION: Title of the course, required field with max length 255 characters
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'title',
    nullable: false,
  })
  public title: string;

  /**
   * COLUMN-DESCRIPTION: Detailed description of the course content, can be null
   */
  @Column({
    type: 'text',
    name: 'description',
    nullable: true,
  })
  public description: string | null;

  /**
   * COLUMN-DESCRIPTION: Current status of the course (Draft, Review, Published, Archived, Deleted), defaults to Draft
   */
  @Column({
    type: 'enum',
    name: 'status',
    enum: CoursesStatusEnum,
    default: CoursesStatusEnum.DRAFT,
    nullable: false,
  })
  public status: CoursesStatusEnum;

  /**
   * RELATIONSHIP: Many-to-one relationship with Instructor entity
   */
  @ManyToOne(() => Instructor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instructor_id' })
  public instructor: Instructor;

  /**
   * RELATIONSHIP: One-to-many relationship with Section entity
   */
  @OneToMany(() => Section, (section) => section.course, {
    cascade: false,
    eager: false,
  })
  public sections: Section[];

  /**
   * RELATIONSHIP: One-to-many relationship with Enrollment entity
   */
  @OneToMany(() => Enrollment, (enrollment) => enrollment.course, {
    cascade: false,
    eager: false,
  })
  public enrollments: Enrollment[];

  /**
   * RELATIONSHIP: One-to-many relationship with CourseReview entity
   */
  @OneToMany(() => CourseReview, (courseReview) => courseReview.course, {
    cascade: false,
    eager: false,
  })
  public courseReviews: CourseReview[];
}
