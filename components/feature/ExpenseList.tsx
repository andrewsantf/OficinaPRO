'use client'

import { ExpenseCard } from './ExpenseCard'

interface Expense {
    id: string
    description: string
    amount_cents: number
    due_date: string
    status: string
    category: string
}

interface ExpenseListProps {
    expenses: Expense[]
}

export function ExpenseList({ expenses }: ExpenseListProps) {
    const formatMoney = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    // Mostrar apenas pendentes aqui - pagas aparecem só no fluxo de caixa
    const pendingExpenses = expenses.filter(e => e.status === 'pending')

    if (pendingExpenses.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-4">Tudo pago! 🎉</p>
        )
    }

    return (
        <div className="space-y-2">
            {pendingExpenses.map(expense => (
                <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    formatMoney={formatMoney}
                />
            ))}
        </div>
    )
}
