import { CustomError, SECTION_ORDER_INDEX_DUPLICATE } from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';

/**
 * DOMAIN RULE 5: order_index fields for sections and lessons must be maintained and unique within their parent entity
 *
 * This test suite verifies that orderIndex values are unique within the scope of their parent entity.
 */
describe('Domain Rule 05 - Order Index Unique', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('05.1 - should prevent duplicate orderIndex for sections within the same course', async () => {
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

  it('05.2 - should allow same orderIndex for sections in different courses', async () => {
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

    const course1 = await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
    });

    const course2 = await courseManagementService.createCourse({
      instructorId: instructor.id,
      title: faker.lorem.sentence(),
    });

    const section1 = await courseManagementService.createSection({
      courseId: course1.id,
      title: faker.lorem.sentence(),
      orderIndex: 1,
    });

    const section2 = await courseManagementService.createSection({
      courseId: course2.id,
      title: faker.lorem.sentence(),
      orderIndex: 1,
    });

    expect(section1.orderIndex).toBe(1);
    expect(section2.orderIndex).toBe(1);
    expect(section1.courseId).not.toBe(section2.courseId);
  });

  it('05.3 - should prevent updating section to duplicate orderIndex', async () => {
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

    const section2 = await courseManagementService.createSection({
      courseId: course.id,
      title: faker.lorem.sentence(),
      orderIndex: 2,
    });

    await expect(
      courseManagementService.updateSection({
        sectionId: section2.id,
        orderIndex: 1,
      }),
    ).rejects.toThrow(new CustomError(SECTION_ORDER_INDEX_DUPLICATE));
  });

  it('05.4 - should allow creating sections with different orderIndex in same course', async () => {
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

    const section1 = await courseManagementService.createSection({
      courseId: course.id,
      title: faker.lorem.sentence(),
      orderIndex: 1,
    });

    const section2 = await courseManagementService.createSection({
      courseId: course.id,
      title: faker.lorem.sentence(),
      orderIndex: 2,
    });

    const section3 = await courseManagementService.createSection({
      courseId: course.id,
      title: faker.lorem.sentence(),
      orderIndex: 3,
    });

    expect(section1.orderIndex).toBe(1);
    expect(section2.orderIndex).toBe(2);
    expect(section3.orderIndex).toBe(3);
  });
});
