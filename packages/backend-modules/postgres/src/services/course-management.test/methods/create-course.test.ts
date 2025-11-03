import {
  CustomError,
  COURSE_TITLE_REQUIRED,
  COURSE_TITLE_EMPTY,
  COURSE_INSTRUCTOR_REQUIRED,
  INSTRUCTOR_NOT_FOUND,
} from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';
import { CoursesStatusEnum } from '@repo/enums';

describe('CourseManagementService - createCourse', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('should create a new course with valid input', async () => {
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
      bio: faker.lorem.paragraph(),
    });
    await instructorRepository.save(instructor);

    const inputData = {
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
    };

    const actualResult = await courseManagementService.createCourse(inputData);

    expect(actualResult.id).toBeDefined();
    expect(actualResult.title).toBe(inputData.title);
    expect(actualResult.description).toBe(inputData.description);
    expect(actualResult.instructorId).toBe(inputData.instructorId);
    expect(actualResult.status).toBe(CoursesStatusEnum.DRAFT);
  });

  it('should create a course with custom status', async () => {
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

    const inputData = {
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
      status: CoursesStatusEnum.REVIEW,
    };

    const actualResult = await courseManagementService.createCourse(inputData);

    expect(actualResult.status).toBe(CoursesStatusEnum.REVIEW);
  });

  it('should trim course title before saving', async () => {
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

    const inputData = {
      instructorId: instructor.id,
      title: '  Test Course Title  ',
    };

    const actualResult = await courseManagementService.createCourse(inputData);

    expect(actualResult.title).toBe('Test Course Title');
  });

  it('should throw COURSE_INSTRUCTOR_REQUIRED when instructorId is missing', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    await expect(
      courseManagementService.createCourse({
        instructorId: '',
        title: faker.lorem.sentence(),
      }),
    ).rejects.toThrow(new CustomError(COURSE_INSTRUCTOR_REQUIRED));
  });

  it('should throw COURSE_TITLE_REQUIRED when title is missing', async () => {
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

    await expect(
      courseManagementService.createCourse({
        instructorId: instructor.id,
        title: '',
      }),
    ).rejects.toThrow(new CustomError(COURSE_TITLE_REQUIRED));
  });

  it('should throw COURSE_TITLE_EMPTY when title contains only whitespace', async () => {
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

    await expect(
      courseManagementService.createCourse({
        instructorId: instructor.id,
        title: '   ',
      }),
    ).rejects.toThrow(new CustomError(COURSE_TITLE_EMPTY));
  });

  it('should throw INSTRUCTOR_NOT_FOUND when instructor does not exist', async () => {
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
});
