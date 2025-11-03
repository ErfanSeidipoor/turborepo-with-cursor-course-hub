import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';
import { CoursesStatusEnum, SortEnum } from '@repo/enums';

describe('CourseManagementService - findCourses', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('should find all courses with pagination', async () => {
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

    for (let i = 0; i < 5; i++) {
      await courseManagementService.createCourse({
        instructorId: instructor.id,
        title: faker.lorem.sentence(),
      });
    }

    const actualResult = await courseManagementService.findCourses({
      page: 1,
      limit: 10,
    });

    expect(actualResult.items.length).toBe(5);
    expect(actualResult.meta?.currentPage).toBe(1);
    expect(actualResult.meta?.totalItems).toBe(5);
  });

  it('should filter courses by status', async () => {
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

    await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
      status: CoursesStatusEnum.DRAFT,
    });

    await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
      status: CoursesStatusEnum.PUBLISHED,
    });

    const actualResult = await courseManagementService.findCourses({
      status: CoursesStatusEnum.DRAFT,
    });

    expect(actualResult.items.length).toBe(1);
    expect(actualResult.items[0]?.status).toBe(CoursesStatusEnum.DRAFT);
  });

  it('should filter courses by instructorId', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );
    const userRepository = TestManager.getRepository(User);
    const instructorRepository = TestManager.getRepository(Instructor);

    const user1 = userRepository.create({
      username: faker.internet.username(),
      password: faker.internet.password(),
    });
    await userRepository.save(user1);

    const instructor1 = instructorRepository.create({
      userId: user1.id,
    });
    await instructorRepository.save(instructor1);

    const user2 = userRepository.create({
      username: faker.internet.username(),
      password: faker.internet.password(),
    });
    await userRepository.save(user2);

    const instructor2 = instructorRepository.create({
      userId: user2.id,
    });
    await instructorRepository.save(instructor2);

    await courseManagementService.createCourse({
      instructorId: instructor1.id,
      title: faker.lorem.sentence(),
    });

    await courseManagementService.createCourse({
      instructorId: instructor2.id,
      title: faker.lorem.sentence(),
    });

    const actualResult = await courseManagementService.findCourses({
      instructorId: instructor1.id,
    });

    expect(actualResult.items.length).toBe(1);
    expect(actualResult.items[0]?.instructorId).toBe(instructor1.id);
  });

  it('should filter courses by search term', async () => {
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

    await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: 'TypeScript Fundamentals',
    });

    await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: 'Python for Beginners',
    });

    const actualResult = await courseManagementService.findCourses({
      searchTerm: 'TypeScript',
    });

    expect(actualResult.items.length).toBe(1);
    expect(actualResult.items[0]?.title).toContain('TypeScript');
  });

  it('should sort courses by specified field and type', async () => {
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

    await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: 'Zebra Course',
    });

    await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: 'Alpha Course',
    });

    const actualResult = await courseManagementService.findCourses({
      sort: 'title',
      sortType: SortEnum.ASC,
    });

    expect(actualResult.items[0]?.title).toBe('Alpha Course');
    expect(actualResult.items[1]?.title).toBe('Zebra Course');
  });

  it('should paginate courses correctly', async () => {
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

    for (let i = 0; i < 10; i++) {
      await courseManagementService.createCourse({
        instructorId: instructor.id,
        title: faker.lorem.sentence(),
      });
    }

    const actualResult = await courseManagementService.findCourses({
      page: 2,
      limit: 5,
    });

    expect(actualResult.items.length).toBe(5);
    expect(actualResult.meta?.currentPage).toBe(2);
    expect(actualResult.meta?.totalItems).toBe(10);
  });
});
