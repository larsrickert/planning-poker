export type User = typeof schema.users.$inferSelect;

export type EnrichedUser = User & {
  estimation?: number | boolean | null;
};
