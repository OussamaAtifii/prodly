import { db } from '@db/index';
import { InsertProject, membersTable, projectsTable } from '@db/schema';
import { and, eq } from 'drizzle-orm';

class ProjectService {
  static async getAllUserProjects(userId: number) {
    const userProjects = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.userId, userId));

    const projectsMember = await db
      .select({ project: projectsTable })
      .from(membersTable)
      .innerJoin(projectsTable, eq(membersTable.projectId, projectsTable.id))
      .where(eq(membersTable.userId, userId));

    const memberProjects = projectsMember.map((projects) => projects.project);
    const allProjects = userProjects.concat(memberProjects);

    return allProjects;
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
