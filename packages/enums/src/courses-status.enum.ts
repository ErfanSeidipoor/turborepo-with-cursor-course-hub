/**
 * CoursesStatusEnum
 *
 * Represents the possible status values for a course in the courses table.
 */
export enum CoursesStatusEnum {
  /**
   * DRAFT - Course is being created and is not yet ready for review
   */
  DRAFT = 'Draft',

  /**
   * REVIEW - Course is submitted for review by administrators
   */
  REVIEW = 'Review',

  /**
   * PUBLISHED - Course is approved and publicly available to students
   */
  PUBLISHED = 'Published',

  /**
   * ARCHIVED - Course is no longer actively offered but remains visible
   */
  ARCHIVED = 'Archived',

  /**
   * DELETED - Course is marked for deletion (soft delete)
   */
  DELETED = 'Deleted',
}
