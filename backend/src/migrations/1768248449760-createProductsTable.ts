import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsTable1768248449760 implements MigrationInterface {
	name = 'CreateProductsTable1768248449760';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE TABLE "products" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                "price" numeric(10,2) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP, 
                CONSTRAINT "products_pk" PRIMARY KEY ("id"))`);
		await queryRunner.query(`CREATE INDEX "products_price_idx" ON "products" ("price") `);
		await queryRunner.query(
			`CREATE INDEX "products_is_active_idx" ON "products" ("is_active") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "public"."products_is_active_idx"`);
		await queryRunner.query(`DROP INDEX "public"."products_price_idx"`);
		await queryRunner.query(`DROP TABLE "products"`);
	}
}
