import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEventTimestamps1739986823817 implements MigrationInterface {
    name = 'ChangeEventTimestamps1739986823817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "change_event" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "change_event" DROP COLUMN "created"`);
    }

}
