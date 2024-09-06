import { MigrationInterface, QueryRunner } from "typeorm";

export class SeperateDateAndTimeInAvailableTimes1725565521655 implements MigrationInterface {
    name = 'SeperateDateAndTimeInAvailableTimes1725565521655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "available-times" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "start" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "finish"`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "finish" TIME NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "finish"`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "finish" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "start" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "date"`);
    }

}
