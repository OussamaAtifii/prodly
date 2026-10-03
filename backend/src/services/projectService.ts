import { db } from '@db/index';
import { InsertProject, membersTable, projectsTable } from '@db/schema';
import { and, eq, exists, or } from 'drizzle-orm';

class ProjectService {
  static async getAllUserProjects(userId: number) {
  return db
    .select()
    .from(projectsTable)
    .where(
      or(
        eq(projectsTable.userId, userId),
        exists(
          db
            .select()
            .from(membersTable)
            .where(
              and(
                eq(membersTable.projectId, projectsTable.id),
                eq(membersTable.userId, userId),
              ),
            ),
        ),
      ),
    );
}

  static async create(data: InsertProject) {
    const [project] = await db.insert(projectsTable).values(data).returning();
    return project;
  }

  static async getByName(userId: number, projectName: string) {
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.userId, userId),
          eq(projectsTable.name, projectName)
        )
      );

    return project;
  }

  static async getById(id: number) {
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, id));

    return project;
  }

  static async updateProject(
    projectId: number,
    projectData: Partial<Omit<InsertProject, 'id'>>
  ) {
    const [project] = await db
      .update(projectsTable)
      .set(projectData)
      .where(eq(projectsTable.id, projectId))
      .returning();

    return project;
  }

  static async deleteProject(projectId: number) {
    await db.delete(projectsTable).where(eq(projectsTable.id, projectId));
  }
}

export default ProjectService;
