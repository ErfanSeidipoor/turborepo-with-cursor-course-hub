import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsRelations } from 'typeorm';
import { Course } from '@repo/postgres/entities/course.entity';
import { Section } from '@repo/postgres/entities/section.entity';
import { Lesson } from '@repo/postgres/entities/lesson.entity';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { CoursesStatusEnum } from '@repo/enums';
import { IPaginate } from '@repo/dtos/pagination';
import { SortEnum } from '@repo/enums';
import { paginate } from './utils/paginate';
import {
  CustomError,
  COURSE_NOT_FOUND,
  COURSE_TITLE_REQUIRED,
  COURSE_TITLE_EMPTY,
  COURSE_INSTRUCTOR_REQUIRED,
  INSTRUCTOR_NOT_FOUND,
  COURSE_INVALID_STATUS_TRANSITION,
  SECTION_NOT_FOUND,
  SECTION_TITLE_REQUIRED,
  SECTION_TITLE_EMPTY,
  SECTION_COURSE_REQUIRED,
  SECTION_ORDER_INDEX_REQUIRED,
  SECTION_ORDER_INDEX_DUPLICATE,
  LESSON_NOT_FOUND,
  LESSON_TITLE_REQUIRED,
  LESSON_TITLE_EMPTY,
  LESSON_SECTION_REQUIRED,
  LESSON_CONTENT_URL_INVALID,
} from '@repo/http-errors';

@Injectable()
export class CourseManagementService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
  ) {}

  public async createCourse(input: {
    instructorId: string;
    title: string;
    description?: string;
    status?: CoursesStatusEnum;
  }): Promise<Course> {
    const { instructorId, title, description, status } = input;

    if (!instructorId) {
      throw new CustomError(COURSE_INSTRUCTOR_REQUIRED);
    }

    if (!title) {
      throw new CustomError(COURSE_TITLE_REQUIRED);
    }

    if (title.trim().length === 0) {
      throw new CustomError(COURSE_TITLE_EMPTY);
    }

    const instructor = await this.instructorRepository.findOne({
      where: { id: instructorId },
    });

    if (!instructor) {
      throw new CustomError(INSTRUCTOR_NOT_FOUND);
    }

    const course = this.courseRepository.create({
      instructorId,
      title: title.trim(),
      description: description?.trim() || null,
      status: status || CoursesStatusEnum.DRAFT,
    });

    const savedCourse = await this.courseRepository.save(course);
    return savedCourse;
  }

  public async findCourseById(input: {
    courseId: string;
    returnError?: boolean;
    relations?: FindOptionsRelations<Course>;
  }): Promise<Course | undefined> {
    const { courseId, returnError, relations } = input;

    if (!courseId) {
      if (returnError) {
        throw new CustomError(COURSE_NOT_FOUND);
      } else {
        return undefined;
      }
    }

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations,
    });

    if (!course && returnError) {
      throw new CustomError(COURSE_NOT_FOUND);
    }

    return course;
  }

  public async updateCourse(input: {
    courseId: string;
    title?: string;
    description?: string;
    status?: CoursesStatusEnum;
  }): Promise<Course> {
    const { courseId, title, description, status } = input;

    const course = await this.findCourseById({
      courseId,
      returnError: true,
    });

    const updateValue: Partial<Course> = {};

    if (title !== undefined && title !== course?.title) {
      if (title.trim().length === 0) {
        throw new CustomError(COURSE_TITLE_EMPTY);
      }
      updateValue.title = title.trim();
    }

    if (description !== undefined && description !== course?.description) {
      updateValue.description = description.trim() || null;
    }

    if (status !== undefined && status !== course?.status) {
      this.validateStatusTransition(course?.status, status);
      updateValue.status = status;
    }

    if (Object.keys(updateValue).length > 0) {
      await this.courseRepository.update({ id: courseId }, updateValue);
    }

    return (await this.findCourseById({
      courseId,
      returnError: true,
    })) as Course;
  }

  public async deleteCourse(input: { courseId: string }): Promise<void> {
    const { courseId } = input;

    const course = await this.findCourseById({
      courseId,
      returnError: true,
    });

    if (!course) {
      throw new CustomError(COURSE_NOT_FOUND);
    }

    await course.softRemove();
  }

  public async findCourses(
    options: {
      page?: number;
      limit?: number;
      status?: CoursesStatusEnum;
      instructorId?: string;
      searchTerm?: string;
      sort?: string;
      sortType?: SortEnum;
    } = {},
  ): Promise<IPaginate<Course>> {
    const { page, limit, status, instructorId, searchTerm, sort, sortType } =
      options;

    const queryBuilder = this.courseRepository.createQueryBuilder('course');

    if (status !== undefined) {
      queryBuilder.andWhere('course.status = :status', { status });
    }

    if (instructorId) {
      queryBuilder.andWhere('course.instructorId = :instructorId', {
        instructorId,
      });
    }

    if (searchTerm) {
      queryBuilder.andWhere(
        '(course.title ILIKE :searchTerm OR course.description ILIKE :searchTerm)',
        {
          searchTerm: `%${searchTerm}%`,
        },
      );
    }

    if (sort && sortType) {
      queryBuilder.orderBy(`course.${sort}`, sortType);
    } else {
      queryBuilder.orderBy('course.createdAt', SortEnum.DESC);
    }

    return await paginate(queryBuilder, limit, page);
  }

  public async createSection(input: {
    courseId: string;
    title: string;
    orderIndex: number;
  }): Promise<Section> {
    const { courseId, title, orderIndex } = input;

    if (!courseId) {
      throw new CustomError(SECTION_COURSE_REQUIRED);
    }

    if (!title) {
      throw new CustomError(SECTION_TITLE_REQUIRED);
    }

    if (title.trim().length === 0) {
      throw new CustomError(SECTION_TITLE_EMPTY);
    }

    if (orderIndex === undefined || orderIndex === null) {
      throw new CustomError(SECTION_ORDER_INDEX_REQUIRED);
    }

    const course = await this.findCourseById({
      courseId,
      returnError: true,
    });

    if (!course) {
      throw new CustomError(COURSE_NOT_FOUND);
    }

    const existingSection = await this.sectionRepository.findOne({
      where: { courseId, orderIndex },
    });

    if (existingSection) {
      throw new CustomError(SECTION_ORDER_INDEX_DUPLICATE);
    }

    const section = this.sectionRepository.create({
      courseId,
      title: title.trim(),
      orderIndex,
    });

    const savedSection = await this.sectionRepository.save(section);
    return savedSection;
  }

  public async findSectionById(input: {
    sectionId: string;
    returnError?: boolean;
    relations?: FindOptionsRelations<Section>;
  }): Promise<Section | undefined> {
    const { sectionId, returnError, relations } = input;

    if (!sectionId) {
      if (returnError) {
        throw new CustomError(SECTION_NOT_FOUND);
      } else {
        return undefined;
      }
    }

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
      relations,
    });

    if (!section && returnError) {
      throw new CustomError(SECTION_NOT_FOUND);
    }

    return section;
  }

  public async updateSection(input: {
    sectionId: string;
    title?: string;
    orderIndex?: number;
  }): Promise<Section> {
    const { sectionId, title, orderIndex } = input;

    const section = await this.findSectionById({
      sectionId,
      returnError: true,
    });

    const updateValue: Partial<Section> = {};

    if (title !== undefined && title !== section?.title) {
      if (title.trim().length === 0) {
        throw new CustomError(SECTION_TITLE_EMPTY);
      }
      updateValue.title = title.trim();
    }

    if (orderIndex !== undefined && orderIndex !== section?.orderIndex) {
      const existingSection = await this.sectionRepository.findOne({
        where: { courseId: section?.courseId, orderIndex },
      });

      if (existingSection && existingSection.id !== sectionId) {
        throw new CustomError(SECTION_ORDER_INDEX_DUPLICATE);
      }

      updateValue.orderIndex = orderIndex;
    }

    if (Object.keys(updateValue).length > 0) {
      await this.sectionRepository.update({ id: sectionId }, updateValue);
    }

    return (await this.findSectionById({
      sectionId,
      returnError: true,
    })) as Section;
  }

  public async deleteSection(input: { sectionId: string }): Promise<void> {
    const { sectionId } = input;

    const section = await this.findSectionById({
      sectionId,
      returnError: true,
    });

    if (!section) {
      throw new CustomError(SECTION_NOT_FOUND);
    }

    await section.softRemove();
  }

  public async findSections(
    options: {
      page?: number;
      limit?: number;
      courseId?: string;
      searchTerm?: string;
      sort?: string;
      sortType?: SortEnum;
    } = {},
  ): Promise<IPaginate<Section>> {
    const { page, limit, courseId, searchTerm, sort, sortType } = options;

    const queryBuilder = this.sectionRepository.createQueryBuilder('section');

    if (courseId) {
      queryBuilder.andWhere('section.courseId = :courseId', { courseId });
    }

    if (searchTerm) {
      queryBuilder.andWhere('section.title ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });
    }

    if (sort && sortType) {
      queryBuilder.orderBy(`section.${sort}`, sortType);
    } else {
      queryBuilder.orderBy('section.orderIndex', SortEnum.ASC);
    }

    return await paginate(queryBuilder, limit, page);
  }

  public async createLesson(input: {
    sectionId: string;
    title: string;
    contentUrl?: string;
  }): Promise<Lesson> {
    const { sectionId, title, contentUrl } = input;

    if (!sectionId) {
      throw new CustomError(LESSON_SECTION_REQUIRED);
    }

    if (!title) {
      throw new CustomError(LESSON_TITLE_REQUIRED);
    }

    if (title.trim().length === 0) {
      throw new CustomError(LESSON_TITLE_EMPTY);
    }

    const section = await this.findSectionById({
      sectionId,
      returnError: true,
    });

    if (!section) {
      throw new CustomError(SECTION_NOT_FOUND);
    }

    if (contentUrl && !this.isValidUrl(contentUrl)) {
      throw new CustomError(LESSON_CONTENT_URL_INVALID);
    }

    const lesson = this.lessonRepository.create({
      sectionId,
      title: title.trim(),
      contentUrl: contentUrl?.trim() || null,
    });

    const savedLesson = await this.lessonRepository.save(lesson);
    return savedLesson;
  }

  public async findLessonById(input: {
    lessonId: string;
    returnError?: boolean;
    relations?: FindOptionsRelations<Lesson>;
  }): Promise<Lesson | undefined> {
    const { lessonId, returnError, relations } = input;

    if (!lessonId) {
      if (returnError) {
        throw new CustomError(LESSON_NOT_FOUND);
      } else {
        return undefined;
      }
    }

    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations,
    });

    if (!lesson && returnError) {
      throw new CustomError(LESSON_NOT_FOUND);
    }

    return lesson;
  }

  public async updateLesson(input: {
    lessonId: string;
    title?: string;
    contentUrl?: string;
  }): Promise<Lesson> {
    const { lessonId, title, contentUrl } = input;

    const lesson = await this.findLessonById({
      lessonId,
      returnError: true,
    });

    const updateValue: Partial<Lesson> = {};

    if (title !== undefined && title !== lesson?.title) {
      if (title.trim().length === 0) {
        throw new CustomError(LESSON_TITLE_EMPTY);
      }
      updateValue.title = title.trim();
    }

    if (contentUrl !== undefined && contentUrl !== lesson?.contentUrl) {
      if (contentUrl && !this.isValidUrl(contentUrl)) {
        throw new CustomError(LESSON_CONTENT_URL_INVALID);
      }
      updateValue.contentUrl = contentUrl?.trim() || null;
    }

    if (Object.keys(updateValue).length > 0) {
      await this.lessonRepository.update({ id: lessonId }, updateValue);
    }

    return (await this.findLessonById({
      lessonId,
      returnError: true,
    })) as Lesson;
  }

  public async deleteLesson(input: { lessonId: string }): Promise<void> {
    const { lessonId } = input;

    const lesson = await this.findLessonById({
      lessonId,
      returnError: true,
    });

    if (!lesson) {
      throw new CustomError(LESSON_NOT_FOUND);
    }

    await lesson.softRemove();
  }

  public async findLessons(
    options: {
      page?: number;
      limit?: number;
      sectionId?: string;
      searchTerm?: string;
      sort?: string;
      sortType?: SortEnum;
    } = {},
  ): Promise<IPaginate<Lesson>> {
    const { page, limit, sectionId, searchTerm, sort, sortType } = options;

    const queryBuilder = this.lessonRepository.createQueryBuilder('lesson');

    if (sectionId) {
      queryBuilder.andWhere('lesson.sectionId = :sectionId', { sectionId });
    }

    if (searchTerm) {
      queryBuilder.andWhere('lesson.title ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });
    }

    if (sort && sortType) {
      queryBuilder.orderBy(`lesson.${sort}`, sortType);
    } else {
      queryBuilder.orderBy('lesson.createdAt', SortEnum.DESC);
    }

    return await paginate(queryBuilder, limit, page);
  }

  private validateStatusTransition(
    currentStatus: CoursesStatusEnum | undefined,
    newStatus: CoursesStatusEnum,
  ): void {
    const validTransitions: Record<CoursesStatusEnum, CoursesStatusEnum[]> = {
      [CoursesStatusEnum.DRAFT]: [
        CoursesStatusEnum.REVIEW,
        CoursesStatusEnum.ARCHIVED,
      ],
      [CoursesStatusEnum.REVIEW]: [
        CoursesStatusEnum.DRAFT,
        CoursesStatusEnum.PUBLISHED,
        CoursesStatusEnum.ARCHIVED,
      ],
      [CoursesStatusEnum.PUBLISHED]: [
        CoursesStatusEnum.ARCHIVED,
        CoursesStatusEnum.DELETED,
      ],
      [CoursesStatusEnum.ARCHIVED]: [CoursesStatusEnum.DRAFT],
      [CoursesStatusEnum.DELETED]: [],
    };

    if (
      currentStatus &&
      !validTransitions[currentStatus]?.includes(newStatus)
    ) {
      throw new CustomError(COURSE_INVALID_STATUS_TRANSITION);
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
