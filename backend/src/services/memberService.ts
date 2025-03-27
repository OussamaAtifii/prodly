import { db } from '@db/index';
import { membersTable, usersTable } from '@db/schema';
import { and, eq } from 'drizzle-orm';

class MemberService {
  /**
   * Adds a new member to a project.
   *
   * @param {number} userId - The ID of the user to add to the project.
   * @param {number} projectId - The ID of the project to add the user to.
   */
  static async addMember(userId: number, projectId: number) {
    const member = await db
      .insert(membersTable)
      .values({ userId, projectId })
      .returning();

    return member;
  }

  /**
   * Retrieves a specific member of a project based on user ID and project ID.
   *
   * @param {number} userId - The ID of the user to retrieve.
   * @param {number} projectId - The ID of the project to retrieve the member from.
   */
  static async getMember(userId: number, projectId: number) {
    const [member] = await db
      .select()
      .from(membersTable)
      .where(
        and(
          eq(membersTable.userId, userId),
          eq(membersTable.projectId, projectId)
        )
      );

    return member;
  }

  /**
   * Retrieves the members of a specific project.
   *
   * @param {number} projectId - The ID of the project to retrieve members for.
   */
  static async getProjectMembers(projectId: number) {
    const members = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        role: membersTable.role,
      })
      .from(membersTable)
      .innerJoin(usersTable, eq(membersTable.userId, usersTable.id))
      .where(eq(membersTable.projectId, projectId));

    return members;
  }
}

export default MemberService;
