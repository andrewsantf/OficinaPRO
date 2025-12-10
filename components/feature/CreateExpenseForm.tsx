'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, CalendarDays, Zap } from 'lucide-react'
import { createExpense } from '@/app/financial/actions'
import { toast } from 'sonner' // Assuming sonner is available based on previous context

export function CreateExpenseForm() {
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('fixed')
    const [isLoading, setIsLoading] = useState(false)

    // Handle currency formatting
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value

        // Remove everything that is not a digit
        value = value.replace(/\D/g, "")

        if (value === '') {
            setAmount('')
            return
        }

        // Convert to cents (integer)
        const cents = parseInt(value)

        // Format to BRL currency string
        const result = (cents / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })

        setAmount(result)
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        // Clean the amount string before sending or let server handle?
        // Let's send the raw value and let server action parse it, or pass cleaned.
        // The FormData will get the value from the input which is "R$ 1.234,56".

        const result = await createExpense(formData)
        setIsLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Despesa criada com sucesso!")
            // Reset form
            const form = document.querySelector('form') as HTMLFormElement
            form.reset()
            setAmount('')
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input id="description" name="description" placeholder="Ex: Aluguel" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <Input
                    id="amount"
                    name="amount"
                    placeholder="R$ 0,00"
                    required
                    value={amount}
                    onChange={handleAmountChange}
                />
                <p className="text-xs text-muted-foreground">Digite o valor (ex: 2000 gera R$ 20,00)</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="due_date">Vencimento</Label>
                <Input id="due_date" name="due_date" type="date" required />
            </div>

            <div className="space-y-3">
                <Label>Tipo de Despesa</Label>
                <div className="grid grid-cols-2 gap-4">
                    <label className={`
                        flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-slate-50
                        ${category === 'fixed' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'}
                    `}>
                        <input
                            type="radio"
                            name="category"
                            value="fixed"
                            className="sr-only"
                            checked={category === 'fixed'}
                            onChange={() => setCategory('fixed')}
                        />
                        <CalendarDays className={`h-6 w-6 mb-2 ${category === 'fixed' ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className={`font-medium text-sm ${category === 'fixed' ? 'text-blue-700' : 'text-slate-600'}`}>Despesa Fixa</span>
                        <span className="text-xs text-muted-foreground mt-1 text-center">Mensal (Aluguel, Luz)</span>
                    </label>

                    <label className={`
                        flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-slate-50
                        ${category === 'variable' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-200'}
                    `}>
                        <input
                            type="radio"
                            name="category"
                            value="variable"
                            className="sr-only"
                            checked={category === 'variable'}
                            onChange={() => setCategory('variable')}
                        />
                        <Zap className={`h-6 w-6 mb-2 ${category === 'variable' ? 'text-amber-600' : 'text-slate-400'}`} />
                        <span className={`font-medium text-sm ${category === 'variable' ? 'text-amber-700' : 'text-slate-600'}`}>Despesa Variável</span>
                        <span className="text-xs text-muted-foreground mt-1 text-center">Eventual (Manutenção, Extra)</span>
                    </label>
                </div>
            </div>

            <Button className="w-full" disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" />
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
        </form>
    )
}
