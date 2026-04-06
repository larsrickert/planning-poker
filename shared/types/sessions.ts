export type StorySource = (typeof schema.planningSourceEnum.enumValues)[number];

export type PlanningSession = typeof schema.planningSession.$inferSelect;
export type InsertPlanningSession = typeof schema.planningSession.$inferInsert;

export type PlanningStory = {
  id: number;
  title: string;
  content?: string;
};

export type EnrichedPlanningSession = PlanningSession & {
  /**
   * Users currently joined to the session.
   */
  users: User[];
};
