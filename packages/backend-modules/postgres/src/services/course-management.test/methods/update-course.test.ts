import {
  CustomError,
  COURSE_NOT_FOUND,
  COURSE_TITLE_EMPTY,
  COURSE_INVALID_STATUS_TRANSITION,
} from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';
import { CoursesStatusEnum } from '@repo/enums';

describe('CourseManagementService - updateCourse', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('should update course title', async () => {
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

    const newTitle = faker.lorem.sentence();
    const actualResult = await courseManagementService.updateCourse({
      courseId: createdCourse.id,
      title: newTitle,
    });

    expect(actualResult.title).toBe(newTitle);
    expect(actualResult.id).toBe(createdCourse.id);
  });

  it('should update course description', async () => {
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
      description: faker.lorem.paragraph(),
    });

    const newDescription = faker.lorem.paragraph();
    const actualResult = await courseManagementService.updateCourse({
      courseId: createdCourse.id,
      description: newDescription,
    });

    expect(actualResult.description).toBe(newDescription);
  });

  it('should update course status with valid transition', async () => {
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
      status: CoursesStatusEnum.DRAFT,
    });

    const actualResult = await courseManagementService.updateCourse({
      courseId: createdCourse.id,
      status: CoursesStatusEnum.REVIEW,
    });

    expect(actualResult.status).toBe(CoursesStatusEnum.REVIEW);
  });

  it('should trim title before updating', async () => {
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

    const actualResult = await courseManagementService.updateCourse({
      courseId: createdCourse.id,
      title: '  Updated Title  ',
    });

    expect(actualResult.title).toBe('Updated Title');
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

    const createdCourse = await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
    });

    await expect(
      courseManagementService.updateCourse({
        courseId: createdCourse.id,
        title: '   ',
      }),
    ).rejects.toThrow(new CustomError(COURSE_TITLE_EMPTY));
  });

  it('should throw COURSE_NOT_FOUND when course does not exist', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    await expect(
      courseManagementService.updateCourse({
        courseId: faker.string.uuid(),
        title: faker.lorem.sentence(),
      }),
    ).rejects.toThrow(new CustomError(COURSE_NOT_FOUND));
  });

  it('should throw COURSE_INVALID_STATUS_TRANSITION for invalid status transition', async () => {
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
      status: CoursesStatusEnum.DELETED,
    });

    await expect(
      courseManagementService.updateCourse({
        courseId: createdCourse.id,
        status: CoursesStatusEnum.DRAFT,
      }),
    ).rejects.toThrow(new CustomError(COURSE_INVALID_STATUS_TRANSITION));
  });

  it('should not update when no changes are provided', async () => {
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

    const actualResult = await courseManagementService.updateCourse({
      courseId: createdCourse.id,
    });

    expect(actualResult.title).toBe(createdCourse.title);
    expect(actualResult.updatedAt).toBeDefined();
  });
});
