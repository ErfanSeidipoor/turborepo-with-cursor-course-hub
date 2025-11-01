import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

/**
 * TABLE-NAME: instructors
 * TABLE-DESCRIPTION: Stores instructor-specific details and statistics. The existence of a record in this table implicitly grants Instructor privileges to the associated user.
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - user_id is the primary key and foreign key to users.id (one-to-one relationship)
 *   - rating must be between 0.00 and 9.99 (enforced by NUMERIC(3,2))
 *   - bio and rating are optional fields
 * TABLE-RELATIONSHIPS:
 *   - One-to-one relationship with users table (required)
 *   - user_id CASCADE delete: deleting a user will delete their instructor record
 */
@Entity('instructors')
export class Instructor {
  /**
   * COLUMN-DESCRIPTION: Primary key and foreign key to users table, establishing one-to-one relationship
   */
  @Column({
    type: 'uuid',
    primary: true,
    name: 'user_id',
  })
  public userId: string;

  /**
   * COLUMN-DESCRIPTION: Biography or description of the instructor, stored as text for unlimited length
   */
  @Column({
    type: 'text',
    nullable: true,
    name: 'bio',
  })
  public bio: string | null;

  /**
   * COLUMN-DESCRIPTION: Instructor rating from 0.00 to 9.99, stored as NUMERIC(3,2) for precision
   */
  @Column({
    type: 'numeric',
    precision: 3,
    scale: 2,
    nullable: true,
    name: 'rating',
  })
  public rating: number | null;

  /**
   * COLUMN-DESCRIPTION: Timestamp when the instructor record was created
   */
  @Column({
    type: 'timestamptz',
    default: () => 'now()',
    name: 'created_at',
  })
  public createdAt: Date;

  /**
   * COLUMN-DESCRIPTION: Timestamp when the instructor record was last updated
   */
  @Column({
    type: 'timestamptz',
    default: () => 'now()',
    name: 'updated_at',
  })
  public updatedAt: Date;

  /**
   * COLUMN-DESCRIPTION: Timestamp for soft delete functionality, null if not deleted
   */
  @Column({
    type: 'timestamptz',
    nullable: true,
    default: null,
    name: 'deleted_at',
  })
  public deletedAt: Date | null;

  /**
   * COLUMN-DESCRIPTION: One-to-one relationship to the user entity, CASCADE delete on user deletion
   */
  @OneToOne(() => User, (user) => user.instructor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;
}
