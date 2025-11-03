import {
  CustomError,
  COURSE_NOT_FOUND,
  SECTION_COURSE_REQUIRED,
} from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';

/**
 * DOMAIN RULE 3: Every Section must be linked to a valid, existing Course
 *
 * This test suite verifies that sections cannot exist without a valid course reference.
 */
describe('Domain Rule 03 - Section Course Link', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('03.1 - should prevent creating a section without a course', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    await expect(
      courseManagementService.createSection({
        courseId: '',
        title: faker.lorem.sentence(),
        orderIndex: 1,
      }),
    ).rejects.toThrow(new CustomError(SECTION_COURSE_REQUIRED));
  });

  it('03.2 - should prevent creating a section with non-existent course', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    await expect(
      courseManagementService.createSection({
        courseId: faker.string.uuid(),
        title: faker.lorem.sentence(),
        orderIndex: 1,
      }),
    ).rejects.toThrow(new CustomError(COURSE_NOT_FOUND));
  });

  it('03.3 - should allow creating a section with valid course', async () => {
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
    });

    const actualResult = await courseManagementService.createSection({
      courseId: course.id,
      title: faker.lorem.sentence(),
      orderIndex: 1,
    });

    expect(actualResult.id).toBeDefined();
    expect(actualResult.courseId).toBe(course.id);
  });
});
