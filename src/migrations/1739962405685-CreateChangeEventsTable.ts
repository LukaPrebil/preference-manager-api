import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChangeEventsTable1739962405685 implements MigrationInterface {
    name = 'CreateChangeEventsTable1739962405685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "change_event" ("id" SERIAL NOT NULL, "event_type" character varying NOT NULL, "email_enabled" boolean, "sms_enabled" boolean, "userId" uuid, CONSTRAINT "PK_0ec064be863f2541f0d6f8fb94c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "change_event" ADD CONSTRAINT "FK_dd09ec8c532fa78fe9cdd92de7e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "change_event" DROP CONSTRAINT "FK_dd09ec8c532fa78fe9cdd92de7e"`);
        await queryRunner.query(`DROP TABLE "change_event"`);
    }

}
