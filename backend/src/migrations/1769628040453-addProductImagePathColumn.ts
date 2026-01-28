import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductImagePathColumn1769628040453 implements MigrationInterface {
	name = 'AddProductImagePathColumn1769628040453';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "products" ADD "image_url" character varying`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "image_url"`);
	}
}
