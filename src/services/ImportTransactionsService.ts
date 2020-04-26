import path from 'path';
import fs from 'fs';
import csvParse from 'csv-parse';
import { getRepository, In } from 'typeorm';

import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface CSVtransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory, filename);
    const csvFilePathExists = await fs.promises.stat(csvFilePath);

    if (!csvFilePathExists) {
      throw new AppError('Csv file not found.', 404);
    }

    const transactionsCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
    });

    const parseCSV = transactionsCSVStream.pipe(parseStream);
    const transactions: CSVtransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async transaction => {
      const [title, type, value, category] = transaction.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const transactionsRepository = getRepository(Transaction);
    const categoriesRepository = getRepository(Category);

    const categoriesFound = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const categoriesFoundTitles = categoriesFound.map(
      (category: Category) => category.title,
    );

    const categoryTitlesToAdd = categories
      .filter(category => !categoriesFoundTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = await categoriesRepository.create(
      categoryTitlesToAdd.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const usedCategories = [...categoriesFound, ...newCategories];

    console.log('usedCategories', usedCategories);

    const newTransactions = transactionsRepository.create(
      transactions.map((transaction: CSVtransaction) => ({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category: usedCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(newTransactions);

    await fs.promises.unlink(csvFilePath);

    return newTransactions;
  }
}

export default ImportTransactionsService;
