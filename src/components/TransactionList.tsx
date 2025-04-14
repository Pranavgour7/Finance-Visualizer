"use client";

import { useState } from 'react';
import { Transaction } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionForm from './TransactionForm';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: any) => {
    if (editingTransaction?._id) {
      await onEdit({
        ...data,
        _id: editingTransaction._id,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No transactions found</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <span>{transaction.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={transaction.category === 'Income' ? 'text-green-600' : ''}>
                      {formatCurrency(transaction.amount)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => transaction._id && onDelete(transaction._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editingTransaction && (
        <TransactionForm
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTransaction(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={editingTransaction}
          title="Edit Transaction"
        />
      )}
    </div>
  );
} 