import { CustomError, SECTION_NOT_FOUND } from '@repo/http-errors';
import { TestManager } from '../../../test-manager.test';
import { CourseManagementService } from '../../course-management.service';
import { faker } from '@faker-js/faker';
import { Instructor } from '@repo/postgres/entities/instructor.entity';
import { User } from '@repo/postgres/entities/user.entity';
import { Section } from '@repo/postgres/entities/section.entity';

describe('CourseManagementService - deleteSection', () => {
  beforeAll(async () => {
    await TestManager.beforeAll();
  });

  afterAll(async () => {
    await TestManager.afterAll();
  });

  beforeEach(async () => {
    await TestManager.beforeEach();
  });

  it('should soft delete a section', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );
    const sectionRepository = TestManager.getRepository(Section);
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

    await courseManagementService.deleteSection({
      sectionId: createdSection.id,
    });

    const sectionAfterDelete = await sectionRepository.findOne({
      where: { id: createdSection.id },
      withDeleted: true,
    });

    expect(sectionAfterDelete).toBeDefined();
    expect(sectionAfterDelete?.deletedAt).toBeDefined();
  });

  it('should throw SECTION_NOT_FOUND when section does not exist', async () => {
    const courseManagementService = TestManager.getHandler(
      CourseManagementService,
    );

    await expect(
      courseManagementService.deleteSection({
        sectionId: faker.string.uuid(),
      }),
    ).rejects.toThrow(new CustomError(SECTION_NOT_FOUND));
  });
});
