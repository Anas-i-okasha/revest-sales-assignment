import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSalesOrderPerUser1769292886486 implements MigrationInterface {
	name = 'UpdateSalesOrderPerUser1769292886486';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "sales_order" ADD "address" text`);
		await queryRunner.query(`ALTER TABLE "sales_order" ADD "user_id" integer`);
		await queryRunner.query(
			`ALTER TABLE "sales_order" ADD CONSTRAINT "FK_8af746dbcaa2d72798e70cd4cda" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "sales_order" DROP CONSTRAINT "FK_8af746dbcaa2d72798e70cd4cda"`,
		);
		await queryRunner.query(`ALTER TABLE "sales_order" DROP COLUMN "user_id"`);
		await queryRunner.query(`ALTER TABLE "sales_order" DROP COLUMN "address"`);
	}
}
