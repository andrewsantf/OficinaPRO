'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Pencil, Trash2, Check, X, Undo2 } from 'lucide-react'
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

interface ExpenseSearchListProps {
    expenses: Expense[]
    type: 'pending' | 'paid'
}

export function ExpenseSearchList({ expenses, type }: ExpenseSearchListProps) {
    const [search, setSearch] = useState('')
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Edit form state
    const [editDescription, setEditDescription] = useState('')
    const [editAmount, setEditAmount] = useState('')
    const [editDueDate, setEditDueDate] = useState('')

    const formatMoney = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    // Filtrar por busca
    const filteredExpenses = expenses.filter(e =>
        e.description.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = (expense: Expense) => {
        if (selectedId === expense.id) {
            setSelectedId(null)
            setIsEditing(false)
        } else {
            setSelectedId(expense.id)
            setEditDescription(expense.description)
            setEditAmount(formatMoney(expense.amount_cents))
            setEditDueDate(expense.due_date)
            setIsEditing(false)
        }
    }

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "")
        if (value === '') {
            setEditAmount('')
            return
        }
        const cents = parseInt(value)
        const result = (cents / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        setEditAmount(result)
    }

    const handleSave = () => {
        if (!selectedId) return
        startTransition(async () => {
            const cleanAmount = editAmount.replace(/\D/g, '')
            const result = await updateExpense(selectedId, {
                description: editDescription,
                amount_cents: parseInt(cleanAmount),
                due_date: editDueDate
            })
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Despesa atualizada!')
                setIsEditing(false)
                setSelectedId(null)
            }
        })
    }

    const handleDelete = (id: string) => {
        startTransition(async () => {
            const result = await deleteExpense(id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Despesa excluída!')
                setSelectedId(null)
            }
        })
    }

    const handleToggleStatus = (id: string, currentStatus: string) => {
        startTransition(async () => {
            const result = await toggleExpenseStatus(id, currentStatus)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(currentStatus === 'pending' ? 'Marcado como pago!' : 'Pagamento desfeito!')
                setSelectedId(null)
            }
        })
    }

    if (expenses.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-4">
                {type === 'pending' ? 'Nenhuma conta pendente' : 'Nenhuma movimentação'}
            </p>
        )
    }

    return (
        <div className="space-y-3">
            {/* Campo de Busca */}
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar despesa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 text-sm"
                />
            </div>

            {/* Lista de Resultados */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredExpenses.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum resultado para "{search}"
                    </p>
                ) : (
                    filteredExpenses.map(expense => (
                        <div key={expense.id}>
                            {/* Card da Despesa */}
                            <div
                                onClick={() => handleSelect(expense)}
                                className={`p-3 rounded-lg cursor-pointer transition-all ${selectedId === expense.id
                                        ? 'bg-blue-50 border-2 border-blue-300'
                                        : type === 'paid'
                                            ? 'bg-green-50/50 border border-green-100 hover:bg-green-50'
                                            : 'bg-white border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-sm text-slate-800 line-clamp-1">
                                        {type === 'paid' && '✓ '}{expense.description}
                                    </span>
                                    <span className={`font-bold text-sm whitespace-nowrap ml-2 ${type === 'paid' ? 'text-green-700' : 'text-slate-900'
                                        }`}>
                                        {formatMoney(expense.amount_cents)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                                    <span>{type === 'paid' ? 'Pago' : 'Vence'}: {new Date(expense.due_date).toLocaleDateString('pt-BR')}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${expense.category === 'fixed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {expense.category === 'fixed' ? 'Fixa' : 'Variável'}
                                    </span>
                                </div>
                            </div>

                            {/* Painel de Ações - aparece quando selecionado */}
                            {selectedId === expense.id && !isEditing && (
                                <div className="mt-2 p-2 bg-slate-50 rounded-lg border flex flex-wrap gap-2 justify-center">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setIsEditing(true)
                                        }}
                                        className="h-8 text-xs"
                                    >
                                        <Pencil className="h-3 w-3 mr-1" /> Editar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(expense.id)
                                        }}
                                        disabled={isPending}
                                        className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-3 w-3 mr-1" /> {isPending ? '...' : 'Excluir'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleToggleStatus(expense.id, expense.status)
                                        }}
                                        disabled={isPending}
                                        className={`h-8 text-xs ${type === 'paid'
                                                ? 'text-amber-700 border-amber-200 hover:bg-amber-50'
                                                : 'text-green-700 border-green-200 hover:bg-green-50'
                                            }`}
                                    >
                                        {type === 'paid' ? (
                                            <><Undo2 className="h-3 w-3 mr-1" /> Desfazer</>
                                        ) : (
                                            <><Check className="h-3 w-3 mr-1" /> Pagar</>
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* Formulário de Edição */}
                            {selectedId === expense.id && isEditing && (
                                <div className="mt-2 p-3 bg-blue-50 rounded-lg border-2 border-blue-200 space-y-2">
                                    <Input
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        placeholder="Descrição"
                                        className="h-8 text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <Input
                                            value={editAmount}
                                            onChange={handleAmountChange}
                                            placeholder="Valor"
                                            className="h-8 text-sm flex-1"
                                        />
                                        <Input
                                            type="date"
                                            value={editDueDate}
                                            onChange={(e) => setEditDueDate(e.target.value)}
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
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
