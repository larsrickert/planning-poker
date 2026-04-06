CREATE TYPE "public"."planning_source" AS ENUM('github');--> statement-breakpoint
CREATE TYPE "public"."planning_status" AS ENUM('vote', 'reveal');--> statement-breakpoint
CREATE TABLE "planning_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar(64) NOT NULL,
	"source" "planning_source" NOT NULL,
	"estimationUnits" json NOT NULL,
	"repository" varchar(1028),
	"story" json,
	"join_code" varchar(4) NOT NULL,
	"status" "planning_status" DEFAULT 'vote' NOT NULL,
	CONSTRAINT "planning_sessions_join_code_unique" UNIQUE("join_code")
);
--> statement-breakpoint
CREATE TABLE "planning_session_users" (
	"sessionId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"estimation" numeric,
	CONSTRAINT "planning_session_users_sessionId_userId_pk" PRIMARY KEY("sessionId","userId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"picture" varchar,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "planning_sessions" ADD CONSTRAINT "planning_sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planning_session_users" ADD CONSTRAINT "planning_session_users_sessionId_planning_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."planning_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planning_session_users" ADD CONSTRAINT "planning_session_users_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;