'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Pencil, Trash2, Check, X, Undo2, DollarSign, FileText } from 'lucide-react'
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
    title: string
}

export function ExpenseSearchList({ expenses, type, title }: ExpenseSearchListProps) {
    const [selectedId, setSelectedId] = useState<string>('')
    const [isEditing, setIsEditing] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Edit form state
    const [editDescription, setEditDescription] = useState('')
    const [editAmount, setEditAmount] = useState('')
    const [editDueDate, setEditDueDate] = useState('')

    const formatMoney = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const selectedExpense = expenses.find(e => e.id === selectedId)

    const handleSelect = (id: string) => {
        setSelectedId(id)
        const expense = expenses.find(e => e.id === id)
        if (expense) {
            setEditDescription(expense.description)
            setEditAmount(formatMoney(expense.amount_cents))
            setEditDueDate(expense.due_date)
        }
        setIsEditing(false)
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
                setSelectedId('')
            }
        })
    }

    const handleDelete = (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta despesa?")) return
        startTransition(async () => {
            const result = await deleteExpense(id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Despesa excluída!')
                setSelectedId('')
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
                setSelectedId('')
            }
        })
    }

    // Total do tipo
    const total = expenses.reduce((acc, e) => acc + e.amount_cents, 0)

    return (
        <Card className={type === 'pending' ? 'bg-amber-50/50 border-amber-200' : 'bg-green-50/50 border-green-200'}>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className={`flex items-center gap-2 ${type === 'pending' ? 'text-amber-900' : 'text-green-900'}`}>
                        {type === 'pending' ? <FileText className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />}
                        {title}
                    </CardTitle>
                    <div className={`font-bold ${type === 'pending' ? 'text-amber-700' : 'text-green-700'}`}>
                        {formatMoney(total)}
                    </div>
                </div>

                {/* Campo de Busca - igual ao MechanicList */}
                <div className="mt-4 pt-4 border-t">
                    <div className="space-y-2">
                        <Label>Buscar Despesa</Label>
                        <div className="max-w-md">
                            <SearchableSelect
                                placeholder="Digite para buscar..."
                                options={expenses.map(e => ({
                                    label: `${e.description} - ${formatMoney(e.amount_cents)}`,
                                    value: e.id
                                }))}
                                value={selectedId}
                                onValueChange={handleSelect}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Selecione uma despesa para {type === 'pending' ? 'editar, excluir ou marcar como paga' : 'desfazer ou excluir'}.
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Card da Despesa Selecionada - igual ao MechanicList */}
                {selectedExpense && !isEditing && (
                    <div className={`p-4 rounded-lg border animate-in fade-in slide-in-from-top-2 ${type === 'pending' ? 'bg-orange-50/50 border-orange-200' : 'bg-green-100/50 border-green-300'
                        }`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className={`font-bold text-lg ${type === 'pending' ? 'text-orange-900' : 'text-green-900'}`}>
                                    {selectedExpense.description}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {type === 'pending' ? 'Vence' : 'Pago'}: {new Date(selectedExpense.due_date).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedId('')}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold">{formatMoney(selectedExpense.amount_cents)}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${selectedExpense.category === 'fixed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {selectedExpense.category === 'fixed' ? 'Despesa Fixa' : 'Despesa Variável'}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="flex-1"
                            >
                                <Pencil className="h-4 w-4 mr-2" /> Editar
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(selectedExpense.id)}
                                disabled={isPending}
                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> {isPending ? '...' : 'Excluir'}
                            </Button>
                            <Button
                                size="sm"
                                variant={type === 'pending' ? 'default' : 'outline'}
                                onClick={() => handleToggleStatus(selectedExpense.id, selectedExpense.status)}
                                disabled={isPending}
                                className={`flex-1 ${type === 'paid' ? 'text-amber-700 border-amber-200 hover:bg-amber-50' : ''}`}
                            >
                                {type === 'pending' ? (
                                    <><Check className="h-4 w-4 mr-2" /> {isPending ? '...' : 'Marcar Pago'}</>
                                ) : (
                                    <><Undo2 className="h-4 w-4 mr-2" /> {isPending ? '...' : 'Desfazer'}</>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Formulário de Edição */}
                {selectedExpense && isEditing && (
                    <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-lg text-blue-900">Editar: {selectedExpense.description}</h4>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Descrição</Label>
                                <Input
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Descrição"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Valor</Label>
                                    <Input
                                        value={editAmount}
                                        onChange={handleAmountChange}
                                        placeholder="Valor"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Vencimento</Label>
                                    <Input
                                        type="date"
                                        value={editDueDate}
                                        onChange={(e) => setEditDueDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isPending}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isPending}
                                >
                                    {isPending ? 'Salvando...' : 'Salvar Alterações'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Estado vazio - quando nada selecionado */}
                {!selectedId && (
                    <div className="text-center py-8 text-muted-foreground">
                        {type === 'pending' ? (
                            <FileText className="h-12 w-12 mx-auto text-amber-200 mb-4" />
                        ) : (
                            <DollarSign className="h-12 w-12 mx-auto text-green-200 mb-4" />
                        )}
                        <p>
                            {expenses.length === 0
                                ? (type === 'pending' ? 'Nenhuma conta pendente' : 'Nenhuma movimentação')
                                : 'Selecione uma despesa acima para ver os detalhes.'
                            }
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
