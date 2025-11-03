import { CustomError, INSTRUCTOR_NOT_FOUND } from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';

/**
 * DOMAIN RULE 1: A Course can only be created by a user who has an associated record in the instructors table
 *
 * This test suite verifies that only users with instructor privileges can create courses.
 */
describe('Domain Rule 01 - Instructor Required for Course Creation', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('01.1 - should prevent creating a course when instructor does not exist', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    await expect(
      courseManagementService.createCourse({
        instructorId: faker.string.uuid(),
        title: faker.lorem.sentence(),
      }),
    ).rejects.toThrow(new CustomError(INSTRUCTOR_NOT_FOUND));
  });

  it('01.2 - should allow creating a course when instructor exists', async () => {
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

    const actualResult = await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
    });

    expect(actualResult.id).toBeDefined();
    expect(actualResult.instructorId).toBe(instructor.id);
  });

  it('01.3 - should verify that only valid instructor IDs can create courses', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );
    const userRepository = TestManager.getRepository(User);

    const user = userRepository.create({
      username: faker.internet.username(),
      password: faker.internet.password(),
    });
    await userRepository.save(user);

    await expect(
      courseManagementService.createCourse({
        instructorId: user.id,
        title: faker.lorem.sentence(),
      }),
    ).rejects.toThrow(new CustomError(INSTRUCTOR_NOT_FOUND));
  });
});
