import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTable1726223778382 implements MigrationInterface {
    name = 'CreateOrderTable1726223778382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createdBy" integer, "lastChangedBy" integer, "deletedBy" integer, "internalComment" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "paymentDate" TIMESTAMP NOT NULL, "amount" integer NOT NULL, "refID" character varying, "authority" character varying, "status" character varying NOT NULL, "gatewayData" json, "orderId" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('WAITING_PAYMENT', 'PAYMENT_DONE', 'DONE', ' WAITING_PAYMENT_RETURN', 'CANCELED')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createdBy" integer, "lastChangedBy" integer, "deletedBy" integer, "internalComment" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "date" TIMESTAMP NOT NULL, "start" integer NOT NULL, "finish" integer NOT NULL, "basePrice" integer NOT NULL, "additionalPrice" integer NOT NULL, "totalPrice" integer NOT NULL, "status" "public"."orders_status_enum" NOT NULL, "availableTimeId" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a399201209e1090c4564afd0c69" FOREIGN KEY ("availableTimeId") REFERENCES "available-times"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a399201209e1090c4564afd0c69"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "payments"`);
    }

}
