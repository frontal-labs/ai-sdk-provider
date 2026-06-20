'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { useState } from 'react';
import {
  type Expense,
  expenseSchema,
  type PartialExpense,
} from '../api/use-object-expense-tracker/schema';

export default function Page() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const { submit, isLoading, object } = useObject({
    api: '/api/use-object-expense-tracker',
    schema: expenseSchema,
    onFinish({ object }) {
      if (object != null) {
        setExpenses(prev => [object.expense, ...prev]);
      }
    },
  });

  return (
    <div className="m-4 flex min-h-screen flex-col items-center p-4">
      <form
        className="flex w-full max-w-md items-center"
        onSubmit={e => {
          e.preventDefault();
          const input = e.currentTarget.expense as HTMLInputElement;
          if (input.value.trim()) {
            submit({ expense: input.value });
            e.currentTarget.reset();
          }
        }}
      >
        <input
          className="mr-2 flex-grow rounded-md border px-4 py-2"
          name="expense"
          placeholder="Enter expense details"
          type="text"
        />
        <button
          className="whitespace-nowrap rounded-md bg-blue-500 px-4 py-2 text-white disabled:bg-blue-200"
          disabled={isLoading}
          type="submit"
        >
          Log expense
        </button>
      </form>

      {isLoading && object?.expense && <ExpenseView expense={object.expense} />}

      {expenses.map((expense, index) => (
        <ExpenseView expense={expense} key={index} />
      ))}
    </div>
  );
}

const ExpenseView = ({ expense }: { expense: PartialExpense | Expense }) => (
  <div className="mt-4 grid grid-cols-12 gap-4 rounded-md bg-gray-100 p-4 dark:bg-gray-800">
    <div className="col-span-2">
      <p className="text-gray-500 text-sm dark:text-gray-400">
        {expense?.date ?? ''}
      </p>
    </div>
    <div className="col-span-2">
      <p className="text-gray-500 text-sm dark:text-gray-400">
        ${expense?.amount?.toFixed(2) ?? ''}
      </p>
    </div>
    <div className="col-span-3">
      <p className="font-medium dark:text-white">{expense?.category ?? ''}</p>
    </div>
    <div className="col-span-5">
      <p className="text-gray-700 dark:text-gray-300">
        {expense?.details ?? ''}
      </p>
    </div>
  </div>
);
