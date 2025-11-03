import { CustomError, COURSE_NOT_FOUND } from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';

describe('CourseManagementService - findCourseById', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('should find a course by id', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );
    const userRepository = TestManager.getRepository(User);
    const instructorRepository = TestManager.getRepository(Instructor);

    const user = userRepository.create({
      username: faker.internet.username(),
      password: faker.internet.password(),
    });
    await userRepository.save(user);

    const instructor = instructorRepository.create({
      userId: user.id,
    });
    await instructorRepository.save(instructor);

    const createdCourse = await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
    });

    const actualResult = await courseManagementService.findCourseById({
      courseId: createdCourse.id,
    });

    expect(actualResult).toBeDefined();
    expect(actualResult?.id).toBe(createdCourse.id);
    expect(actualResult?.title).toBe(createdCourse.title);
  });

  it('should return undefined when course does not exist and returnError is false', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    const actualResult = await courseManagementService.findCourseById({
      courseId: faker.string.uuid(),
      returnError: false,
    });

    expect(actualResult).toBeNull();
  });

  it('should throw COURSE_NOT_FOUND when course does not exist and returnError is true', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    await expect(
      courseManagementService.findCourseById({
        courseId: faker.string.uuid(),
        returnError: true,
      }),
    ).rejects.toThrow(new CustomError(COURSE_NOT_FOUND));
  });

  it('should return undefined when courseId is empty and returnError is false', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    const actualResult = await courseManagementService.findCourseById({
      courseId: '',
      returnError: false,
    });

    expect(actualResult).toBeUndefined();
  });

  it('should throw COURSE_NOT_FOUND when courseId is empty and returnError is true', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    await expect(
      courseManagementService.findCourseById({
        courseId: '',
        returnError: true,
      }),
    ).rejects.toThrow(new CustomError(COURSE_NOT_FOUND));
  });

  it('should load relations when specified', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );
    const userRepository = TestManager.getRepository(User);
    const instructorRepository = TestManager.getRepository(Instructor);

    const user = userRepository.create({
      username: faker.internet.username(),
      password: faker.internet.password(),
    });
    await userRepository.save(user);

    const instructor = instructorRepository.create({
      userId: user.id,
    });
    await instructorRepository.save(instructor);

    const createdCourse = await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
    });

    const actualResult = await courseManagementService.findCourseById({
      courseId: createdCourse.id,
      relations: { instructor: true },
    });

    expect(actualResult).toBeDefined();
    expect(actualResult?.instructor).toBeDefined();
    expect(actualResult?.instructor.id).toBe(instructor.id);
  });
});
