import {
  CustomError,
  SECTION_NOT_FOUND,
  LESSON_SECTION_REQUIRED,
} from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';

/**
 * DOMAIN RULE 4: Every Lesson must be linked to a valid, existing Section
 *
 * This test suite verifies that lessons cannot exist without a valid section reference.
 */
describe('Domain Rule 04 - Lesson Section Link', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('04.1 - should prevent creating a lesson without a section', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    await expect(
      courseManagementService.createLesson({
        sectionId: '',
        title: faker.lorem.sentence(),
      }),
    ).rejects.toThrow(new CustomError(LESSON_SECTION_REQUIRED));
  });

  it('04.2 - should prevent creating a lesson with non-existent section', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    await expect(
      courseManagementService.createLesson({
        sectionId: faker.string.uuid(),
        title: faker.lorem.sentence(),
      }),
    ).rejects.toThrow(new CustomError(SECTION_NOT_FOUND));
  });

  it('04.3 - should allow creating a lesson with valid section', async () => {
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

    const section = await courseManagementService.createSection({
      courseId: course.id,
      title: faker.lorem.sentence(),
      orderIndex: 1,
    });

    const actualResult = await courseManagementService.createLesson({
      sectionId: section.id,
      title: faker.lorem.sentence(),
    });

    expect(actualResult.id).toBeDefined();
    expect(actualResult.sectionId).toBe(section.id);
  });
});
