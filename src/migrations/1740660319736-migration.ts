import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740660319736 implements MigrationInterface {
    name = 'Migration1740660319736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Job" ("job_id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_d8f9b418d6ce284965176b3f22b" PRIMARY KEY ("job_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Job"`);
    }

}
