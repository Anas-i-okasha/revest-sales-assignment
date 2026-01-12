import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSalesOrderTable1768249155502 implements MigrationInterface {
	name = 'CreateSalesOrderTable1768249155502';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."sales_order_status_enum" AS ENUM('0', '1', '2')`,
		);
		await queryRunner.query(`CREATE TABLE "sales_order" (
            "id" SERIAL NOT NULL,
            "customer_name" character varying NOT NULL,
            "email" character varying NOT NULL,
            "phone_num" character varying NOT NULL,
            "status" "public"."sales_order_status_enum" NOT NULL DEFAULT '0',
            "order_date" TIMESTAMP NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP,
            CONSTRAINT "PK_1631a193003bfc4297c61ba38ba" PRIMARY KEY ("id"))`);
		await queryRunner.query(`CREATE INDEX "sales_order_email_idx" ON "sales_order" ("email") `);

		await queryRunner.query(`CREATE TABLE "sales_order_products_products" (
            "salesOrderId" integer NOT NULL,
            "productsId" integer NOT NULL,
            CONSTRAINT "PK_ef7e654703c0b694eb7499d31d4" PRIMARY KEY ("salesOrderId", "productsId"))`);

		await queryRunner.query(
			`CREATE INDEX "idx_sales_order_id" ON "sales_order_products_products" ("salesOrderId") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx_product_id" ON "sales_order_products_products" ("productsId") `,
		);
		await queryRunner.query(
			`ALTER TABLE "sales_order_products_products" ADD CONSTRAINT "FK_sales_prod" FOREIGN KEY ("salesOrderId") REFERENCES "sales_order"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "sales_order_products_products" ADD CONSTRAINT "FK_products" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "sales_order_products_products" DROP CONSTRAINT "FK_products"`,
		);
		await queryRunner.query(
			`ALTER TABLE "sales_order_products_products" DROP CONSTRAINT "FK_sales_prod"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx_product_id"`);
		await queryRunner.query(`DROP INDEX "public"."idx_sales_order_id"`);
		await queryRunner.query(`DROP TABLE "sales_order_products_products"`);
		await queryRunner.query(`DROP INDEX "public"."sales_order_email_idx"`);
		await queryRunner.query(`DROP TABLE "sales_order"`);
		await queryRunner.query(`DROP TYPE "public"."sales_order_status_enum"`);
	}
}
