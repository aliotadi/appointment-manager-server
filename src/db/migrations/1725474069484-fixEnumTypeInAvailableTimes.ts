import { MigrationInterface, QueryRunner } from "typeorm";

export class FixEnumTypeInAvailableTimes1725474069484 implements MigrationInterface {
    name = 'FixEnumTypeInAvailableTimes1725474069484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "allowedFragment"`);
        await queryRunner.query(`CREATE TYPE "public"."available-times_allowedfragment_enum" AS ENUM('TWENTY_M', 'ONE_AND_HALF_H')`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "allowedFragment" "public"."available-times_allowedfragment_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "allowedFragment"`);
        await queryRunner.query(`DROP TYPE "public"."available-times_allowedfragment_enum"`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "allowedFragment" character varying NOT NULL`);
    }

}
