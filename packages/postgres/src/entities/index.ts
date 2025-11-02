import { BaseEntity } from './base.entity';
import { Course } from './course.entity';
import { Instructor } from './instructor.entity';
import { Lesson } from './lesson.entity';
import { Section } from './section.entity';
import { User } from './user.entity';

export const entities = [BaseEntity, Course, Instructor, Lesson, Section, User];

export { BaseEntity, Course, Instructor, Lesson, Section, User };
