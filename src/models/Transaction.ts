import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Category from './Category';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ['income', 'outcome'],
  })
  type: 'income' | 'outcome';

  @Column('decimal', { precision: 9, scale: 2 })
  value: number;

  @Column()
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('timestamp with time zone')
  created_at: Date;

  @Column('timestamp with time zone')
  updated_at: Date;
}

export default Transaction;
