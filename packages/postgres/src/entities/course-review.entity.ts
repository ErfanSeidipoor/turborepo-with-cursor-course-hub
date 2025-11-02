import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Course } from './course.entity';
import { User } from './user.entity';

/**
 * TABLE-NAME: course_reviews
 * TABLE-DESCRIPTION: Stores student feedback, ratings, and text reviews for courses
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - user_id must reference a valid user (foreign key to users.id)
 *   - course_id must reference a valid course (foreign key to courses.id)
 *   - rating must be between 1 and 5 (smallint)
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many-to-one relationship with User (user_id references users.id)
 *   - Many-to-one relationship with Course (course_id references courses.id)
 */
@Entity('course_reviews')
export class CourseReview extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Foreign key referencing the user who wrote the review
   */
  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: false,
  })
  public userId: string;

  /**
   * COLUMN-DESCRIPTION: Foreign key referencing the course being reviewed
   */
  @Column({
    type: 'uuid',
    name: 'course_id',
    nullable: false,
  })
  public courseId: string;

  /**
   * COLUMN-DESCRIPTION: Rating score from 1 to 5, required field
   */
  @Column({
    type: 'smallint',
    name: 'rating',
    nullable: false,
  })
  public rating: number;

  /**
   * COLUMN-DESCRIPTION: Text content of the review, optional field
   */
  @Column({
    type: 'text',
    name: 'review_text',
    nullable: true,
  })
  public reviewText: string | null;

  /**
   * RELATIONSHIP: Many-to-one relationship with User entity
   */
  @ManyToOne(() => User, (user) => user.courseReviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  /**
   * RELATIONSHIP: Many-to-one relationship with Course entity
   */
  @ManyToOne(() => Course, (course) => course.courseReviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  public course: Course;
}
