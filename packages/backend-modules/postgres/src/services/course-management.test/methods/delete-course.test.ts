import { CustomError, COURSE_NOT_FOUND } from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';
import { Course } from '@repo/postgres/entities/course.entity';

describe('CourseManagementService - deleteCourse', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('should soft delete a course', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );
    const courseRepository = TestManager.getRepository(Course);
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

    await courseManagementService.deleteCourse({
      courseId: createdCourse.id,
    });

    const courseAfterDelete = await courseRepository.findOne({
      where: { id: createdCourse.id },
      withDeleted: true,
    });

    expect(courseAfterDelete).toBeDefined();
    expect(courseAfterDelete?.deletedAt).toBeDefined();
  });

  it('should throw COURSE_NOT_FOUND when course does not exist', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    await expect(
      courseManagementService.deleteCourse({
        courseId: faker.string.uuid(),
      }),
    ).rejects.toThrow(new CustomError(COURSE_NOT_FOUND));
  });

  it('should not find deleted course in normal queries', async () => {
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

    await courseManagementService.deleteCourse({
      courseId: createdCourse.id,
    });

    const courseAfterDelete = await courseManagementService.findCourseById({
      courseId: createdCourse.id,
      returnError: false,
    });

    expect(courseAfterDelete).toBeNull();
  });
});
