import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { CreateExpenseForm } from '@/components/feature/CreateExpenseForm'
import { ExpenseSearchList } from '@/components/feature/ExpenseSearchList'
import { CashFlowSearch } from '@/components/feature/CashFlowSearch'
import { getExpenses, getFinancialStatement } from './actions'
import { FinancialMonthPicker } from '@/components/feature/FinancialMonthPicker'
import Link from 'next/link'

export default async function FinancialPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const resolvedParams = await searchParams
    const monthParam = resolvedParams?.month as string | undefined

    // Default to current month YYYY-MM
    const currentMs = Date.now()
    const currentYear = new Date(currentMs).getFullYear()
    const currentMonthIdx = new Date(currentMs).getMonth() // 0-11

    // Adjust logic to get "YYYY-MM"
    const displayMonth = monthParam || `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}`

    // Fetch Statement Data
    const { summary, transactions } = await getFinancialStatement(displayMonth)

    // Fetch pending expenses for the sidebar "A Pagar" widget
    // Optimization: Fetch LIMIT 50? Or all pending? All pending is fine, usually less than historical paid.
    const pendingExpenses = await getExpenses({ status: 'pending' })

    // Calculate total from fetched result
    // const totalPending = pendingExpenses?.reduce((acc, curr) => acc + curr.amount_cents, 0) || 0
    // Note: totalPending var is not used in the render code provided, maybe redundant? 
    // Checking render... it is NOT used in the provided slice.
    // But let's keep the fetch optimized.


    const formatMoney = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const [year, month] = displayMonth.split('-').map(Number)

    return (
        <>
            <div className="container mx-auto p-4 md:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard" className="md:hidden">
                                <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8 text-muted-foreground">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financeiro</h1>
                        </div>
                        <p className="text-muted-foreground">Fluxo de caixa e contas a pagar.</p>
                    </div>

                    {/* Month Picker */}
                    <div className="w-full md:w-[400px]">
                        <FinancialMonthPicker currentMonth={displayMonth} />
                    </div>
                </div>

                {/* Statement Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                        <CardContent className="p-4 flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Receita Total</p>
                                <div className="text-xl font-bold text-blue-700">{formatMoney(summary.totalRevenue)}</div>
                            </div>
                            <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center">
                                <ArrowLeft className="h-4 w-4 text-blue-600 rotate-[135deg]" /> {/* Arrow Up Right */}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
                        <CardContent className="p-4 flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Custos Var.</p>
                                <div className="text-xl font-bold text-amber-700">{formatMoney(summary.totalVariableCosts)}</div>
                                <p className="text-[10px] text-muted-foreground">Peças e Comissões</p>
                            </div>
                            <div className="h-8 w-8 bg-amber-50 rounded-full flex items-center justify-center">
                                <ArrowLeft className="h-4 w-4 text-amber-600 rotate-[-45deg]" /> {/* Arrow Down Right */}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-red-500">
                        <CardContent className="p-4 flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Despesas Fixas</p>
                                <div className="text-xl font-bold text-red-700">{formatMoney(summary.totalFixedExpenses)}</div>
                            </div>
                            <div className="h-8 w-8 bg-red-50 rounded-full flex items-center justify-center">
                                <ArrowLeft className="h-4 w-4 text-red-600 rotate-[-45deg]" /> {/* Arrow Down Right */}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`shadow-sm hover:shadow-md transition-shadow border-l-4 ${summary.netProfit >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
                        <CardContent className="p-4 flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lucro Líquido</p>
                                <div className={`text-xl font-bold ${summary.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {formatMoney(summary.netProfit)}
                                </div>
                            </div>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${summary.netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                {summary.netProfit >= 0 ?
                                    <CheckCircle className="h-4 w-4 text-green-600" /> :
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 pb-8 space-y-8">
                <div className="space-y-8">
                    {/* 1. Nova Despesa */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Nova Despesa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CreateExpenseForm />
                        </CardContent>
                    </Card>

                    {/* 2. Fluxo de Caixa */}
                    <Card className="border shadow-sm">
                        <CardHeader>
                            <CardTitle>Fluxo de Caixa</CardTitle>
                            <CardDescription>Movimentações do período (Entradas e Saídas confirmadas).</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="w-[100px]">Data</TableHead>
                                            <TableHead>Descrição</TableHead>
                                            <TableHead>Categoria</TableHead>
                                            <TableHead className="text-right">Valor</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.map((t) => (
                                            <TableRow key={`${t.type}-${t.id}`}>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {new Date(t.date).toLocaleDateString('pt-BR')}
                                                </TableCell>
                                                <TableCell className="font-medium">{t.description}</TableCell>
                                                <TableCell className="text-xs">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold
                                                        ${t.type === 'income' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}
                                                    `}>
                                                        {t.category}
                                                    </span>
                                                </TableCell>
                                                <TableCell className={`text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {t.type === 'expense' ? '-' : '+'} {formatMoney(t.amount)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {transactions.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                    Nenhuma movimentação no período.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile List View - lista simples de entradas e saídas */}
                            <div className="md:hidden divide-y max-h-[300px] overflow-y-auto">
                                {transactions.map((t) => (
                                    <div key={`mobile-${t.type}-${t.id}`} className="p-4 space-y-2">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="font-medium line-clamp-2 text-sm">{t.description}</span>
                                            <span className={`font-bold whitespace-nowrap text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {t.type === 'expense' ? '-' : '+'} {formatMoney(t.amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                            <span>{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
                                                ${t.type === 'income' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}
                                            `}>
                                                {t.category}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {transactions.length === 0 && (
                                    <div className="p-8 text-center text-muted-foreground text-sm">
                                        Nenhuma movimentação no período.
                                    </div>
                                )}
                            </div>

                        </CardContent>
                    </Card>

                    {/* 3. Despesas Pagas - para Desfazer/Excluir */}
                    <CashFlowSearch
                        transactions={transactions}
                        totalExpenses={summary.totalFixedExpenses}
                    />

                    {/* 4. Contas a Pagar */}
                    <ExpenseSearchList
                        expenses={pendingExpenses || []}
                        type="pending"
                        title="Contas a Pagar"
                    />
                </div>
            </div>
        </>
    )
}

