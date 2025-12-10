'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Undo2, Trash2, X, TrendingDown } from 'lucide-react'
import { deleteExpense, toggleExpenseStatus } from '@/app/financial/actions'
import { toast } from 'sonner'

interface Transaction {
    id: string
    type: string
    date: string
    description: string
    amount: number
    category: string
}

interface CashFlowSearchProps {
    transactions: Transaction[]
    totalExpenses: number
}

export function CashFlowSearch({ transactions, totalExpenses }: CashFlowSearchProps) {
    const [selectedId, setSelectedId] = useState<string>('')
    const [isPending, startTransition] = useTransition()

    const formatMoney = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    // Apenas despesas podem ser desfeitas
    const expenses = transactions.filter(t => t.type === 'expense')
    const selectedExpense = expenses.find(e => e.id === selectedId)

    const handleUndo = (id: string) => {
        startTransition(async () => {
            const result = await toggleExpenseStatus(id, 'paid')
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Pagamento desfeito!')
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

    return (
        <Card className="bg-red-50/50 border-red-200">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-red-900">
                        <TrendingDown className="h-5 w-5" />
                        Despesas Pagas
                    </CardTitle>
                    <div className="font-bold text-red-700">
                        {formatMoney(totalExpenses)}
                    </div>
                </div>

                {/* Campo de Busca */}
                {expenses.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                        <div className="space-y-2">
                            <Label>Buscar Despesa</Label>
                            <SearchableSelect
                                placeholder="Digite para buscar..."
                                options={expenses.map(e => ({
                                    label: `${e.description} - ${formatMoney(e.amount)}`,
                                    value: e.id
                                }))}
                                value={selectedId}
                                onValueChange={setSelectedId}
                            />
                            <p className="text-xs text-muted-foreground">
                                Selecione uma despesa para desfazer ou excluir.
                            </p>
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardContent className="pt-0">
                {/* Card da Despesa Selecionada */}
                {selectedExpense && (
                    <div className="p-4 rounded-lg border-2 border-amber-200 bg-amber-50 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-amber-900">
                                    {selectedExpense.description}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Pago em: {new Date(selectedExpense.date).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedId('')}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-red-600">-{formatMoney(selectedExpense.amount)}</span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                {selectedExpense.category}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUndo(selectedExpense.id)}
                                disabled={isPending}
                                className="flex-1 text-amber-700 border-amber-300 hover:bg-amber-100"
                            >
                                <Undo2 className="h-4 w-4 mr-2" /> {isPending ? 'Desfazendo...' : 'Desfazer'}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(selectedExpense.id)}
                                disabled={isPending}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Excluir
                            </Button>
                        </div>
                    </div>
                )}

                {/* Estado vazio */}
                {!selectedId && (
                    <div className="text-center py-8 text-muted-foreground">
                        <TrendingDown className="h-12 w-12 mx-auto text-red-200 mb-4" />
                        <p>
                            {expenses.length === 0
                                ? 'Nenhuma despesa paga neste período'
                                : 'Selecione uma despesa acima para ver os detalhes.'
                            }
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
