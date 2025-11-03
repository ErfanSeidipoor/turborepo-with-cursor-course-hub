import { CustomError, LESSON_CONTENT_URL_INVALID } from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';

/**
 * DOMAIN RULE 6: Content URLs (content_url) must be validated
 *
 * This test suite verifies that content URLs are properly validated.
 */
describe('Domain Rule 06 - Content URL Validation', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('06.1 - should accept valid HTTP URL', async () => {
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
      contentUrl: 'https://example.com/video.mp4',
    });

    expect(actualResult.contentUrl).toBe('https://example.com/video.mp4');
  });

  it('06.2 - should accept valid HTTPS URL', async () => {
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
      contentUrl: faker.internet.url(),
    });

    expect(actualResult.contentUrl).toBeDefined();
  });

  it('06.3 - should reject invalid URL format', async () => {
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

    await expect(
      courseManagementService.createLesson({
        sectionId: section.id,
        title: faker.lorem.sentence(),
        contentUrl: 'not-a-url',
      }),
    ).rejects.toThrow(new CustomError(LESSON_CONTENT_URL_INVALID));
  });

  it('06.4 - should reject invalid URL during update', async () => {
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

    const lesson = await courseManagementService.createLesson({
      sectionId: section.id,
      title: faker.lorem.sentence(),
      contentUrl: faker.internet.url(),
    });

    await expect(
      courseManagementService.updateLesson({
        lessonId: lesson.id,
        contentUrl: 'invalid-url',
      }),
    ).rejects.toThrow(new CustomError(LESSON_CONTENT_URL_INVALID));
  });

  it('06.5 - should allow null or undefined content URL', async () => {
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

    expect(actualResult.contentUrl).toBeNull();
  });
});
