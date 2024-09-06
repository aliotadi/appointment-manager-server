import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingTimeFragmentFields1725632657427 implements MigrationInterface {
    name = 'AddMissingTimeFragmentFields1725632657427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time-fragments" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "time-fragments" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "time-fragments" ADD "additionalPricePerPersonPercentage" numeric(5,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time-fragments" DROP COLUMN "additionalPricePerPersonPercentage"`);
        await queryRunner.query(`ALTER TABLE "time-fragments" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "time-fragments" DROP COLUMN "name"`);
    }

}
