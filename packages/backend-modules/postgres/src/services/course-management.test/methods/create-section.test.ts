import {
  CustomError,
  SECTION_TITLE_REQUIRED,
  SECTION_TITLE_EMPTY,
  SECTION_COURSE_REQUIRED,
  SECTION_ORDER_INDEX_REQUIRED,
  SECTION_ORDER_INDEX_DUPLICATE,
  COURSE_NOT_FOUND,
} from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';

describe('CourseManagementService - createSection', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('should create a new section with valid input', async () => {
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

    const inputData = {
      courseId: course.id,
      title: faker.lorem.sentence(),
      orderIndex: 1,
    };

    const actualResult = await courseManagementService.createSection(inputData);

    expect(actualResult.id).toBeDefined();
    expect(actualResult.title).toBe(inputData.title);
    expect(actualResult.courseId).toBe(inputData.courseId);
    expect(actualResult.orderIndex).toBe(inputData.orderIndex);
  });

  it('should trim section title before saving', async () => {
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

    const inputData = {
      courseId: course.id,
      title: '  Test Section Title  ',
      orderIndex: 1,
    };

    const actualResult = await courseManagementService.createSection(inputData);

    expect(actualResult.title).toBe('Test Section Title');
  });

  it('should throw SECTION_COURSE_REQUIRED when courseId is missing', async () => {
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

  it('should throw SECTION_TITLE_REQUIRED when title is missing', async () => {
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

    await expect(
      courseManagementService.createSection({
        courseId: course.id,
        title: '',
        orderIndex: 1,
      }),
    ).rejects.toThrow(new CustomError(SECTION_TITLE_REQUIRED));
  });

  it('should throw SECTION_TITLE_EMPTY when title contains only whitespace', async () => {
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

    await expect(
      courseManagementService.createSection({
        courseId: course.id,
        title: '   ',
        orderIndex: 1,
      }),
    ).rejects.toThrow(new CustomError(SECTION_TITLE_EMPTY));
  });

  it('should throw SECTION_ORDER_INDEX_REQUIRED when orderIndex is missing', async () => {
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

    await expect(
      courseManagementService.createSection({
        courseId: course.id,
        title: faker.lorem.sentence(),
        orderIndex: undefined as unknown as number,
      }),
    ).rejects.toThrow(new CustomError(SECTION_ORDER_INDEX_REQUIRED));
  });

  it('should throw COURSE_NOT_FOUND when course does not exist', async () => {
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

  it('should throw SECTION_ORDER_INDEX_DUPLICATE when orderIndex already exists for the course', async () => {
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

    await courseManagementService.createSection({
      courseId: course.id,
      title: faker.lorem.sentence(),
      orderIndex: 1,
    });

    await expect(
      courseManagementService.createSection({
        courseId: course.id,
        title: faker.lorem.sentence(),
        orderIndex: 1,
      }),
    ).rejects.toThrow(new CustomError(SECTION_ORDER_INDEX_DUPLICATE));
  });
});
