CREATE TABLE "accounts" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;