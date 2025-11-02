import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

/**
 * TABLE-NAME: instructors
 * TABLE-DESCRIPTION: Stores instructor-specific details and statistics for users with instructor privileges. The existence of a record in this table implicitly grants instructor role to the associated user.
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - user_id must be unique (one user can have only one instructor record)
 *   - user_id is a foreign key to users table with CASCADE delete
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - One-to-one relationship with User (user_id references users.id)
 */
@Entity('instructors')
export class Instructor extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Foreign key referencing the user ID, unique constraint ensures one instructor record per user
   */
  @Column({
    type: 'uuid',
    name: 'user_id',
    unique: true,
    nullable: false,
  })
  public userId: string;

  /**
   * COLUMN-DESCRIPTION: Biographical information about the instructor, can be null
   */
  @Column({
    type: 'text',
    name: 'bio',
    nullable: true,
  })
  public bio: string | null;

  /**
   * COLUMN-DESCRIPTION: Instructor rating on a scale with precision 3 and scale 2 (e.g., 4.50), can be null
   */
  @Column({
    type: 'numeric',
    precision: 3,
    scale: 2,
    name: 'rating',
    nullable: true,
  })
  public rating: number | null;

  /**
   * RELATIONSHIP: One-to-one relationship with User entity
   */
  @OneToOne(() => User, (user) => user.instructor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;
}
