import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // Validates value greater than 0
    if (value < 0) {
      throw new AppError('Only values greater than zero are permitted.', 400);
    }

    // Checks transactio types
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Transaction type not permitted.', 400);
    }

    // Checks if category already exists
    const categoriesRepository = getRepository(Category);
    const categoryExists = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    let categoryModel = null;
    if (!categoryExists) {
      categoryModel = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(categoryModel);
    } else {
      categoryModel = categoryExists;
    }

    const transactionsRepository = getRepository(Transaction);
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryModel.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
