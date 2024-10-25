import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSmsTable1728241065110 implements MigrationInterface {
    name = 'CreateSmsTable1728241065110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "SMSes" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createdBy" integer, "lastChangedBy" integer, "deletedBy" integer, "internalComment" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "content" character varying NOT NULL, "type" character varying NOT NULL, "gatewayData" jsonb NOT NULL, CONSTRAINT "PK_4c5ef9c4424a91446cc26917556" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "SMSes"`);
    }

}
