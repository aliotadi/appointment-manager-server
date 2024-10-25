import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPaymentEntity1729874112960 implements MigrationInterface {
    name = 'FixPaymentEntity1729874112960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "paymentDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "authority" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "authority" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "paymentDate" SET NOT NULL`);
    }

}
