import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminUserColumn1769285876301 implements MigrationInterface {
	name = 'AddAdminUserColumn1769285876301';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ADD "is_admin" boolean NOT NULL DEFAULT false`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_admin"`);
	}
}
