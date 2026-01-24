import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToMany,
	JoinTable,
	DeleteDateColumn,
	Index,
	JoinColumn,
	ManyToOne,
} from 'typeorm';
import { Product } from './products.entity';
import { User } from './user.entity';

export enum OrderStatus {
	PENDING = 0,
	COMPLETED = 1,
	CANCELLED = 2,
}

@Entity({ name: 'sales_order' })
export class SalesOrder {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	customer_name: string;

	@Index('sales_order_email_idx')
	@Column()
	email: string;

	@Column()
	phone_num: string;

	@Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
	status: OrderStatus;

	@Column({ type: 'timestamp without time zone' })
	order_date: Date;

	@ManyToMany(() => Product) // Should we create third table explicitly?
	@JoinTable()
	products: Product[];

	@CreateDateColumn({ type: 'timestamp without time zone' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp without time zone' })
	updated_at: Date;

	@DeleteDateColumn({ type: 'timestamp without time zone' })
	deleted_at: Date;

	@ManyToOne(() => User, (user) => user.orders, { nullable: true })
	@JoinColumn({ name: 'user_id' })
	user?: User;

	@Column({ type: 'text', nullable: true })
	address: string;
}
