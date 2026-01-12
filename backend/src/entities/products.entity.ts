import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	Index,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	description: string;

	@Index('products_price_idx')
	@Column('decimal', { precision: 10, scale: 2 })
	price: number;

	@Index('products_is_active_idx')
	@Column({ default: true })
	is_active: boolean;

	@CreateDateColumn({ type: 'timestamp without time zone' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp without time zone' })
	updated_at: Date;

	@DeleteDateColumn({ type: 'timestamp without time zone' })
	deleted_at: Date;
}
