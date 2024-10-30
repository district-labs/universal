CREATE TABLE IF NOT EXISTS "initial_owners" (
	"publicKey" varchar(130) PRIMARY KEY NOT NULL,
	"credentialId" varchar(255),
	"smartContractAddress" varchar(42)
);
