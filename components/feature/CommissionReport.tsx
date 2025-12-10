'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DollarSign, Search, X } from 'lucide-react'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Button } from '@/components/ui/button'

interface CommissionData {
    mechanicId: string
    mechanicName: string
    totalServices: number
    commissionRate: number
    commissionValue: number
    ordersCount: number
    totalMaterialCost: number
}

interface Mechanic {
    id: string
    name: string
    commission_rate: number
}

export function CommissionReport({ data, mechanics }: { data: CommissionData[], mechanics: Mechanic[] }) {
    const [selectedId, setSelectedId] = useState<string>('')

    const selectedReport = data.find(d => d.mechanicId === selectedId)
    const selectedMechanic = mechanics.find(m => m.id === selectedId)

    const formatMoney = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    const totalCommissions = data.reduce((acc, curr) => acc + curr.commissionValue, 0)

    return (
        <Card className="mt-8 overflow-hidden border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            Relatório de Comissões
                        </CardTitle>
                        <CardDescription>Mês Atual</CardDescription>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Geral (Visível)</p>
                        <p className="text-xl font-bold text-green-700">{formatMoney(totalCommissions)}</p>
                    </div>
                </div>

                <div className="mt-6 border-t pt-6">
                    <h3 className="font-semibold text-lg mb-4">Consultar Prestador</h3>
                    <div className="space-y-2">
                        <div className="max-w-md">
                            <SearchableSelect
                                placeholder="Digite o nome para buscar..."
                                options={mechanics.map(m => ({ label: m.name, value: m.id }))}
                                value={selectedId}
                                onValueChange={setSelectedId}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Selecione um prestador para ver o detalhamento.</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 bg-slate-50/30 min-h-[100px]">
                {selectedId ? (
                    selectedReport ? (
                        <div className="animate-in fade-in slide-in-from-top-2 border rounded-xl bg-white shadow-sm overflow-hidden">
                            <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900">{selectedReport.mechanicName}</h4>
                                    <p className="text-sm text-muted-foreground">{selectedReport.ordersCount} serviços realizados</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedId('')}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="p-6 grid gap-6 md:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Total de Serviços</p>
                                    <p className="text-2xl font-semibold text-slate-700">{formatMoney(selectedReport.totalServices)}</p>
                                    <p className="text-xs text-muted-foreground">Valor bruto dos serviços</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Total Material</p>
                                    <p className="text-2xl font-semibold text-red-600">-{formatMoney(selectedReport.totalMaterialCost)}</p>
                                    <p className="text-xs text-muted-foreground">Descontado do valor bruto</p>
                                </div>

                                <div className="space-y-1 md:col-span-2 border-t pt-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Base de Cálculo</p>
                                            <p className="text-xs text-muted-foreground">(Serviços - Material)</p>
                                        </div>
                                        <p className="text-xl font-medium text-slate-600">
                                            {formatMoney(Math.max(0, selectedReport.totalServices - selectedReport.totalMaterialCost))}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1 md:col-span-2 bg-green-50 p-4 rounded-lg border border-green-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm font-medium text-green-900">Comissão a Pagar</p>
                                        <div className="px-2 py-1 rounded-full bg-green-200 text-green-800 text-xs font-bold">
                                            {selectedReport.commissionRate}%
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-green-700 text-right">
                                        {formatMoney(selectedReport.commissionValue)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white rounded-lg border border-dashed">
                            <h4 className="font-bold text-lg text-slate-900 mb-2">
                                {selectedMechanic?.name || 'Prestador'}
                            </h4>
                            <p className="text-muted-foreground">Nenhuma comissão gerada neste mês.</p>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedId('')} className="mt-4">
                                Limpar seleção
                            </Button>
                        </div>
                    )
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <DollarSign className="h-12 w-12 mx-auto text-slate-200 mb-4" />
                        <p>Selecione um prestador acima para ver os detalhes da comissão.</p>
                    </div>
                )}
            </CardContent>

            <div className="bg-slate-50 p-4 border-t text-xs text-center text-muted-foreground">
                Calculado com base apenas em serviços com status "Finalizado" ou "Pago".
            </div>
        </Card>
    )
}
