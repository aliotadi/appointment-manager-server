import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAvailableTimeEntity1729873964737 implements MigrationInterface {
    name = 'FixAvailableTimeEntity1729873964737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "finish"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "orderId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "orderId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "finish" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "start" integer NOT NULL`);
    }

}
