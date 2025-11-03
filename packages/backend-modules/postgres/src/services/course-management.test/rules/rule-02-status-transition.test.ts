import {
  CustomError,
  COURSE_INVALID_STATUS_TRANSITION,
} from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';
import { CoursesStatusEnum } from '@repo/enums';

/**
 * DOMAIN RULE 2: A Course must transition through workflow statuses (Draft -> Review -> Published)
 *
 * This test suite verifies that courses follow valid status transition paths.
 */
describe('Domain Rule 02 - Course Status Transition', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('02.1 - should allow DRAFT to REVIEW transition', async () => {
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

    const course = await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
      status: CoursesStatusEnum.DRAFT,
    });

    const actualResult = await courseManagementService.updateCourse({
      courseId: course.id,
      status: CoursesStatusEnum.REVIEW,
    });

    expect(actualResult.status).toBe(CoursesStatusEnum.REVIEW);
  });

  it('02.2 - should allow REVIEW to PUBLISHED transition', async () => {
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

    const course = await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
      status: CoursesStatusEnum.REVIEW,
    });

    const actualResult = await courseManagementService.updateCourse({
      courseId: course.id,
      status: CoursesStatusEnum.PUBLISHED,
    });

    expect(actualResult.status).toBe(CoursesStatusEnum.PUBLISHED);
  });

  it('02.3 - should prevent invalid transition from DRAFT to PUBLISHED', async () => {
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

    const course = await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
      status: CoursesStatusEnum.DRAFT,
    });

    await expect(
      courseManagementService.updateCourse({
        courseId: course.id,
        status: CoursesStatusEnum.PUBLISHED,
      }),
    ).rejects.toThrow(new CustomError(COURSE_INVALID_STATUS_TRANSITION));
  });

  it('02.4 - should prevent transition from DELETED to any status', async () => {
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

    const course = await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
      status: CoursesStatusEnum.DELETED,
    });

    await expect(
      courseManagementService.updateCourse({
        courseId: course.id,
        status: CoursesStatusEnum.DRAFT,
      }),
    ).rejects.toThrow(new CustomError(COURSE_INVALID_STATUS_TRANSITION));
  });

  it('02.5 - should allow PUBLISHED to ARCHIVED transition', async () => {
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

    const course = await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
      status: CoursesStatusEnum.PUBLISHED,
    });

    const actualResult = await courseManagementService.updateCourse({
      courseId: course.id,
      status: CoursesStatusEnum.ARCHIVED,
    });

    expect(actualResult.status).toBe(CoursesStatusEnum.ARCHIVED);
  });
});
