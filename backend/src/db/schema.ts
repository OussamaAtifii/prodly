import { relations, sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Users table
export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username').unique().notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  avatar: text('avatar').notNull().default('default.jpg'),
  role: text('role').notNull().default('user'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

// Users relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  projects: many(projectsTable),
}));

// -----------------------------------------------------------------------------
// Projects table
export const projectsTable = sqliteTable('projects', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull().default('#ffffff'),
  description: text('description'),
  userId: integer('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type InsertProject = typeof projectsTable.$inferInsert;
export type SelectProject = typeof projectsTable.$inferSelect;

// Projects relations
export const projectsRelations = relations(projectsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [projectsTable.userId],
    references: [usersTable.id],
  }),
  tasks: many(tasksTable),
}));

// -----------------------------------------------------------------------------
// Tasks table
export const tasksTable = sqliteTable('tasks', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  priority: text('priority', { enum: ['low', 'medium', 'high'] })
    .notNull()
    .default('low'),
  status: text('status', { enum: ['todo', 'process', 'done'] })
    .notNull()
    .default('todo'),
  completed: integer('priority', { mode: 'boolean' }).default(false),
  projectId: integer('project_id')
    .references(() => projectsTable.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type InsertTask = typeof tasksTable.$inferInsert;
export type SelectTask = typeof tasksTable.$inferSelect;

// Tags relations
export const tasksRelations = relations(tasksTable, ({ one }) => ({
  project: one(projectsTable, {
    fields: [tasksTable.projectId],
    references: [projectsTable.id],
  }),
}));
