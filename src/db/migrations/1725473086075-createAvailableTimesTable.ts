import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAvailableTimesTable1725473086075 implements MigrationInterface {
    name = 'CreateAvailableTimesTable1725473086075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "available-times" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createdBy" integer, "lastChangedBy" integer, "deletedBy" integer, "internalComment" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "start" TIMESTAMP NOT NULL, "finish" TIMESTAMP NOT NULL, "allowedFragment" character varying NOT NULL, "restTime" integer NOT NULL, CONSTRAINT "PK_f36423ef4a832fc186805ba60cd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "available-times"`);
    }

}
