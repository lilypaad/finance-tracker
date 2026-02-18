ALTER TABLE "users" RENAME COLUMN "passwordHash" TO "password_hash";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "passwordSalt" TO "password_salt";