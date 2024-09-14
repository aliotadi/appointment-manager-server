import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentTableRefactorOrderTable1726343907409 implements MigrationInterface {
    name = 'CreatePaymentTableRefactorOrderTable1726343907409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a399201209e1090c4564afd0c69"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "availableTimeId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a399201209e1090c4564afd0c69" FOREIGN KEY ("availableTimeId") REFERENCES "available-times"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a399201209e1090c4564afd0c69"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "availableTimeId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a399201209e1090c4564afd0c69" FOREIGN KEY ("availableTimeId") REFERENCES "available-times"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "date" TIMESTAMP NOT NULL`);
    }

}
