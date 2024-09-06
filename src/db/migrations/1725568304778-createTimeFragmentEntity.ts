import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTimeFragmentEntity1725568304778 implements MigrationInterface {
    name = 'CreateTimeFragmentEntity1725568304778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "time-fragments" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createdBy" integer, "lastChangedBy" integer, "deletedBy" integer, "internalComment" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "length" integer NOT NULL, "rest" integer NOT NULL, CONSTRAINT "PK_a1a894274c96d8484b09e48cbff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "restTime"`);
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "allowedFragment"`);
        await queryRunner.query(`DROP TYPE "public"."available-times_allowedfragment_enum"`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "timeFragmentId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD CONSTRAINT "FK_bfecc09360ee772e2c6e5197d97" FOREIGN KEY ("timeFragmentId") REFERENCES "time-fragments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "available-times" DROP CONSTRAINT "FK_bfecc09360ee772e2c6e5197d97"`);
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "timeFragmentId"`);
        await queryRunner.query(`CREATE TYPE "public"."available-times_allowedfragment_enum" AS ENUM('TWENTY_M', 'ONE_AND_HALF_H')`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "allowedFragment" "public"."available-times_allowedfragment_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "restTime" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "time-fragments"`);
    }

}
