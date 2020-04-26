import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const { income, outcome, total } = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        const { type, value } = transaction;
        const parsedValue = Number(value);
        switch (type) {
          case 'income':
            accumulator.income += parsedValue;
            accumulator.total += parsedValue;
            break;

          case 'outcome':
            accumulator.outcome += parsedValue;
            accumulator.total -= parsedValue;
            break;

          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const balance = {
      total: Number(total.toFixed(2)),
      income: Number(income.toFixed(2)),
      outcome: Number(outcome.toFixed(2)),
    };

    return balance;
  }
}

export default TransactionsRepository;
