import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUser1725459943767 implements MigrationInterface {
    name = 'AddPasswordToUser1725459943767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
