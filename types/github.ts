export type GitHubIssue = {
  number: number;
  html_url: string;
  title: string;
  assignees: GitHubAssignee[];
  body_html?: string;
};

export type GitHubAssignee = {
  /**
   * User name.
   */
  login: string;
  avatar_url: string;
};
