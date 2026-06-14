import { db } from "~/lib/db/index.server";
import { buildLikeFragment } from "./like";

/** A user row with their most recent session update as `lastLogin`. */
export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  banReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  lastLogin: Date | null;
}

function baseUserQuery() {
  return db
    .selectFrom("user")
    .leftJoin(
      (eb) =>
        eb
          .selectFrom("session")
          .select(["userId", (qb) => qb.fn.max("updatedAt").as("lastLogin")])
          .groupBy("userId")
          .as("lastSession"),
      (join) => join.onRef("lastSession.userId", "=", "user.id"),
    )
    .select([
      "user.id",
      "user.name",
      "user.email",
      "user.role",
      "user.banned",
      "user.banReason",
      "user.createdAt",
      "user.updatedAt",
      "user.image",
      "lastSession.lastLogin",
    ]);
}

/** Page of users with their last login, optionally filtered by name/email. */
export async function getUsersWithLastLogin(
  page: number,
  pageSize: number,
  searchQuery?: string,
): Promise<AdminUserRow[]> {
  let query = baseUserQuery();
  const trimmed = searchQuery?.trim();
  if (trimmed) {
    const fragment = buildLikeFragment(trimmed);
    query = query.where((eb) =>
      eb.or([
        eb("user.name", "ilike", fragment),
        eb("user.email", "ilike", fragment),
      ]),
    );
  }

  return query
    .orderBy("user.name")
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .execute();
}

/** Count of users matching the search. */
export async function getUserCount(searchQuery?: string): Promise<number> {
  let query = db.selectFrom("user");
  const trimmed = searchQuery?.trim();
  if (trimmed) {
    const fragment = buildLikeFragment(trimmed);
    query = query.where((eb) =>
      eb.or([eb("name", "ilike", fragment), eb("email", "ilike", fragment)]),
    );
  }

  const result = await query
    .select((qb) => qb.fn.countAll().as("count"))
    .executeTakeFirst();
  return Number(result?.count ?? 0);
}

export async function getUserById(userId: string) {
  return db
    .selectFrom("user")
    .select(["id", "name", "email"])
    .where("id", "=", userId)
    .executeTakeFirst();
}

/**
 * Ban a user: set the banned flag and revoke all their sessions. Direct Kysely
 * write — admin authorization is enforced by `requireAdmin` at the route layer.
 *
 * Note: if Better Auth session cookie caching is active (i.e. Microsoft SSO is
 * NOT configured), a banned user's cached session cookie may remain valid for
 * up to `cookieCache.maxAge` (5 min). Sessions are revoked here immediately;
 * the window only affects the cached-cookie fast path.
 */
export async function banUser(
  userId: string,
  banReason?: string,
): Promise<void> {
  const now = new Date();
  await db.transaction().execute(async (trx) => {
    await trx
      .updateTable("user")
      .set({
        banned: true,
        banReason: banReason?.trim() || null,
        updatedAt: now,
      })
      .where("id", "=", userId)
      .execute();
    await trx.deleteFrom("session").where("userId", "=", userId).execute();
  });
}

/** Unban a user: clear the banned flag and reason. */
export async function unbanUser(userId: string): Promise<void> {
  await db
    .updateTable("user")
    .set({ banned: false, banReason: null, updatedAt: new Date() })
    .where("id", "=", userId)
    .execute();
}
