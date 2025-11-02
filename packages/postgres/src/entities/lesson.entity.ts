import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Progress } from './progress.entity';
import { Section } from './section.entity';

/**
 * TABLE-NAME: lessons
 * TABLE-DESCRIPTION: Individual learning content unit (video, quiz, article) within a section
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - section_id must reference a valid section (foreign key to sections.id)
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many-to-one relationship with Section (section_id references sections.id)
 *   - One-to-many relationship with Progress (progress records reference this lesson)
 */
@Entity('lessons')
export class Lesson extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Foreign key referencing the section this lesson belongs to
   */
  @Column({
    type: 'uuid',
    name: 'section_id',
    nullable: false,
  })
  public sectionId: string;

  /**
   * COLUMN-DESCRIPTION: Title of the lesson, required field with max length 255 characters
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'title',
    nullable: false,
  })
  public title: string;

  /**
   * COLUMN-DESCRIPTION: URL to the lesson content (video, article, etc.), can be null
   */
  @Column({
    type: 'text',
    name: 'content_url',
    nullable: true,
  })
  public contentUrl: string | null;

  /**
   * RELATIONSHIP: Many-to-one relationship with Section entity
   */
  @ManyToOne(() => Section, (section) => section.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'section_id' })
  public section: Section;

  /**
   * RELATIONSHIP: One-to-many relationship with Progress entity
   */
  @OneToMany(() => Progress, (progress) => progress.lesson, {
    cascade: false,
    eager: false,
  })
  public progress: Progress[];
}
