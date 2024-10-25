import { MigrationInterface, QueryRunner } from "typeorm";

export class FixOrderAvailableTimeRelation1728941494965 implements MigrationInterface {
    name = 'FixOrderAvailableTimeRelation1728941494965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "available-times" ADD "orderId" integer`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD CONSTRAINT "UQ_26fbe54e737e571f4a13b436a0f" UNIQUE ("orderId")`);
        await queryRunner.query(`ALTER TABLE "available-times" ADD CONSTRAINT "FK_26fbe54e737e571f4a13b436a0f" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "available-times" DROP CONSTRAINT "FK_26fbe54e737e571f4a13b436a0f"`);
        await queryRunner.query(`ALTER TABLE "available-times" DROP CONSTRAINT "UQ_26fbe54e737e571f4a13b436a0f"`);
        await queryRunner.query(`ALTER TABLE "available-times" DROP COLUMN "orderId"`);
    }

}
