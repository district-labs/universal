ALTER TABLE "caveats" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "delegations" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "delegations" ADD COLUMN "verifyingContract" varchar(42) NOT NULL;