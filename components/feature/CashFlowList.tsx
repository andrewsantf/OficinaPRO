'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Undo2, Trash2, X } from 'lucide-react'
import { toggleExpenseStatus, deleteExpense } from '@/app/financial/actions'
import { toast } from 'sonner'

interface Transaction {
    id: string
    type: string
    date: string
    description: string
    amount: number
    category: string
}

interface CashFlowListProps {
    transactions: Transaction[]
}

export function CashFlowList({ transactions }: CashFlowListProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const formatMoney = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const handleUndo = (id: string) => {
        startTransition(async () => {
            const result = await toggleExpenseStatus(id, 'paid') // current status is paid
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Pagamento desfeito!')
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

    if (transactions.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground text-sm">
                Nenhuma movimentação no período.
            </div>
        )
    }

    return (
        <div className="divide-y">
            {transactions.map((t) => (
                <div key={`${t.type}-${t.id}`} className="relative">
                    {/* Transaction Row */}
                    <div
                        className={`p-4 space-y-2 cursor-pointer hover:bg-slate-50 transition-colors ${selectedId === t.id ? 'bg-slate-100' : ''
                            }`}
                        onClick={() => t.type === 'expense' && setSelectedId(selectedId === t.id ? null : t.id)}
                    >
                        <div className="flex justify-between items-start gap-2">
                            <span className="font-medium line-clamp-2 text-sm">{t.description}</span>
                            <span className={`font-bold whitespace-nowrap text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === 'expense' ? '-' : '+'} {formatMoney(t.amount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${t.type === 'income' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                {t.category}
                            </span>
                        </div>
                    </div>

                    {/* Action Panel - aparece quando clica numa despesa */}
                    {selectedId === t.id && t.type === 'expense' && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 bg-white shadow-lg rounded-lg p-1 border z-10">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleUndo(t.id)
                                }}
                                disabled={isPending}
                                className="h-8 text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                            >
                                <Undo2 className="h-3 w-3 mr-1" />
                                {isPending ? '...' : 'Desfazer'}
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(t.id)
                                }}
                                disabled={isPending}
                                className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Excluir
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedId(null)
                                }}
                                className="h-8 w-8 p-0 text-slate-400"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
