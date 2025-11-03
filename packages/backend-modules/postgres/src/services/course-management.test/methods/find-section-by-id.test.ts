import { CustomError, SECTION_NOT_FOUND } from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';

describe('CourseManagementService - findSectionById', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('should find a section by id', async () => {
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

    const createdSection = await courseManagementService.createSection({
      courseId: course.id,
      title: faker.lorem.sentence(),
      orderIndex: 1,
    });

    const actualResult = await courseManagementService.findSectionById({
      sectionId: createdSection.id,
    });

    expect(actualResult).toBeDefined();
    expect(actualResult?.id).toBe(createdSection.id);
    expect(actualResult?.title).toBe(createdSection.title);
  });

  it('should return undefined when section does not exist and returnError is false', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    const actualResult = await courseManagementService.findSectionById({
      sectionId: faker.string.uuid(),
      returnError: false,
    });

    expect(actualResult).toBeNull();
  });

  it('should throw SECTION_NOT_FOUND when section does not exist and returnError is true', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    await expect(
      courseManagementService.findSectionById({
        sectionId: faker.string.uuid(),
        returnError: true,
      }),
    ).rejects.toThrow(new CustomError(SECTION_NOT_FOUND));
  });
});
