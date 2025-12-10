'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { deleteExpense, toggleExpenseStatus, updateExpense } from '@/app/financial/actions'
import { toast } from 'sonner'

interface Expense {
    id: string
    description: string
    amount_cents: number
    due_date: string
    status: string
    category: string
}

interface ExpenseCardProps {
    expense: Expense
    formatMoney: (cents: number) => string
}

export function ExpenseCard({ expense, formatMoney }: ExpenseCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Edit form state
    const [description, setDescription] = useState(expense.description)
    const [amount, setAmount] = useState(formatMoney(expense.amount_cents))
    const [dueDate, setDueDate] = useState(expense.due_date)

    const isPaid = expense.status === 'paid'

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "")
        if (value === '') {
            setAmount('')
            return
        }
        const cents = parseInt(value)
        const result = (cents / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        setAmount(result)
    }

    const handleSave = () => {
        startTransition(async () => {
            const cleanAmount = amount.replace(/\D/g, '')
            const result = await updateExpense(expense.id, {
                description,
                amount_cents: parseInt(cleanAmount),
                due_date: dueDate
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Despesa atualizada!')
                setIsEditing(false)
            }
        })
    }

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteExpense(expense.id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Despesa excluída!')
            }
        })
    }

    const handleToggleStatus = () => {
        startTransition(async () => {
            const result = await toggleExpenseStatus(expense.id, expense.status)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(isPaid ? 'Pagamento desfeito!' : 'Marcado como pago!')
            }
        })
    }

    // Editing mode
    if (isEditing) {
        return (
            <div className="p-3 bg-white border-2 border-blue-200 rounded-lg shadow-sm space-y-3">
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição"
                    className="h-8 text-sm"
                />
                <div className="flex gap-2">
                    <Input
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Valor"
                        className="h-8 text-sm flex-1"
                    />
                    <Input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="h-8 text-sm flex-1"
                    />
                </div>
                <div className="flex gap-2 justify-end">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        disabled={isPending}
                        className="h-7 text-xs"
                    >
                        <X className="h-3 w-3 mr-1" /> Cancelar
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isPending}
                        className="h-7 text-xs"
                    >
                        <Check className="h-3 w-3 mr-1" /> {isPending ? 'Salvando...' : 'Salvar'}
                    </Button>
                </div>
            </div>
        )
    }

    // Delete confirmation
    if (isDeleting) {
        return (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg shadow-sm">
                <p className="text-sm text-red-800 mb-3">Excluir "{expense.description}"?</p>
                <div className="flex gap-2 justify-end">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsDeleting(false)}
                        disabled={isPending}
                        className="h-7 text-xs"
                    >
                        Cancelar
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="h-7 text-xs"
                    >
                        {isPending ? 'Excluindo...' : 'Confirmar'}
                    </Button>
                </div>
            </div>
        )
    }

    // Normal view
    return (
        <div className={`p-3 rounded-lg shadow-sm ${isPaid ? 'bg-green-50/50 border border-green-200' : 'bg-white border border-amber-100'}`}>
            <div className="flex justify-between items-start mb-2">
                <span className={`font-medium text-sm ${isPaid ? 'text-green-800' : 'text-slate-800'}`}>
                    {isPaid && '✓ '}{expense.description}
                </span>
                <span className={`font-bold text-sm ${isPaid ? 'text-green-700' : 'text-slate-900'}`}>
                    {formatMoney(expense.amount_cents)}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                    {isPaid ? 'Pago' : 'Vence'}: {new Date(expense.due_date).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-blue-600"
                        title="Editar"
                    >
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsDeleting(true)}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
                        title="Excluir"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleToggleStatus}
                        disabled={isPending}
                        className={`h-6 text-[10px] ml-1 ${isPaid
                                ? 'border-green-300 hover:bg-green-100 text-green-700'
                                : 'border-amber-200 hover:bg-amber-50 text-amber-700'
                            }`}
                    >
                        {isPending ? '...' : isPaid ? 'Desfazer' : 'Pagar'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
