import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeChangeEventGeneric1739981809100 implements MigrationInterface {
    name = 'MakeChangeEventGeneric1739981809100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "change_event" DROP COLUMN "email_enabled"`);
        await queryRunner.query(`ALTER TABLE "change_event" DROP COLUMN "sms_enabled"`);
        await queryRunner.query(`ALTER TABLE "change_event" ADD "payload" json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "change_event" DROP COLUMN "payload"`);
        await queryRunner.query(`ALTER TABLE "change_event" ADD "sms_enabled" boolean`);
        await queryRunner.query(`ALTER TABLE "change_event" ADD "email_enabled" boolean`);
    }

}
