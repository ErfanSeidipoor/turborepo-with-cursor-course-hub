import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Instructor } from './instructor.entity';

/**
 * TABLE-NAME: users
 * TABLE-DESCRIPTION: Stores user authentication credentials and basic user information. Access control is implicit based on the existence of an associated instructors record.
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - email must be unique across all users
 *   - password is excluded from default queries (select: false)
 *   - inherits id (UUID), createdAt, and updatedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - One-to-one relationship with instructors table (optional)
 *   - Base entity for user-related entities (children, activities, etc.)
 */
@Entity('users')
export class User extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Unique email address for user authentication, maximum 255 characters
   */
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    name: 'email',
  })
  public email: string;

  /**
   * COLUMN-DESCRIPTION: Hashed password for user authentication, excluded from default queries for security
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'password',
    select: false,
  })
  public password: string;

  /**
   * COLUMN-DESCRIPTION: Optional one-to-one relationship with instructor profile. If present, user has instructor privileges.
   */
  @OneToOne(() => Instructor, (instructor) => instructor.user, {
    cascade: false,
    eager: false,
  })
  public instructor?: Instructor;
}
