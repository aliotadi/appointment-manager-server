import { MigrationInterface, QueryRunner } from "typeorm";

export class RemodelTimesToNumber1725721661760 implements MigrationInterface {
    name = 'RemodelTimesToNumber1725721661760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "start" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "finish"`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "finish" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "finish"`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "finish" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD "start" TIME NOT NULL`);
    }

}
