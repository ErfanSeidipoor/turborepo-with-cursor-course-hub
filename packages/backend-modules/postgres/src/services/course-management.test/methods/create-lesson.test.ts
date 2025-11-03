import {
  CustomError,
  LESSON_TITLE_REQUIRED,
  LESSON_TITLE_EMPTY,
  LESSON_SECTION_REQUIRED,
  SECTION_NOT_FOUND,
  LESSON_CONTENT_URL_INVALID,
} from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';

describe('CourseManagementService - createLesson', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('should create a new lesson with valid input', async () => {
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

    const inputData = {
      sectionId: section.id,
      title: faker.lorem.sentence(),
      contentUrl: faker.internet.url(),
    };

    const actualResult = await courseManagementService.createLesson(inputData);

    expect(actualResult.id).toBeDefined();
    expect(actualResult.title).toBe(inputData.title);
    expect(actualResult.sectionId).toBe(inputData.sectionId);
    expect(actualResult.contentUrl).toBe(inputData.contentUrl);
  });

  it('should create lesson without contentUrl', async () => {
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

    const inputData = {
      sectionId: section.id,
      title: faker.lorem.sentence(),
    };

    const actualResult = await courseManagementService.createLesson(inputData);

    expect(actualResult.contentUrl).toBeNull();
  });

  it('should trim lesson title before saving', async () => {
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

    const inputData = {
      sectionId: section.id,
      title: '  Test Lesson Title  ',
    };

    const actualResult = await courseManagementService.createLesson(inputData);

    expect(actualResult.title).toBe('Test Lesson Title');
  });

  it('should throw LESSON_SECTION_REQUIRED when sectionId is missing', async () => {
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

  it('should throw LESSON_TITLE_REQUIRED when title is missing', async () => {
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
        title: '',
      }),
    ).rejects.toThrow(new CustomError(LESSON_TITLE_REQUIRED));
  });

  it('should throw LESSON_TITLE_EMPTY when title contains only whitespace', async () => {
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
        title: '   ',
      }),
    ).rejects.toThrow(new CustomError(LESSON_TITLE_EMPTY));
  });

  it('should throw SECTION_NOT_FOUND when section does not exist', async () => {
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

  it('should throw LESSON_CONTENT_URL_INVALID when contentUrl is invalid', async () => {
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
        contentUrl: 'not-a-valid-url',
      }),
    ).rejects.toThrow(new CustomError(LESSON_CONTENT_URL_INVALID));
  });
});
