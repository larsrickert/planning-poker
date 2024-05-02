export type GitHubIssue = {
  number: number;
  html_url: string;
  title: string;
  assignees: GitHubAssignee[];
  body_html?: string;
  labels: GitHubLabel[];
};

export type GitHubAssignee = {
  /**
   * User name.
   */
  login: string;
  avatar_url: string;
};

export type GitHubLabel = {
  color: string;
  name: string;
  description: string;
};
