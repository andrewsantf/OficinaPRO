'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createMechanic, deleteMechanic, updateMechanic } from '@/app/settings/mechanic-actions'
import { toast } from 'sonner'
import { Trash2, Plus, Users, Save, X } from 'lucide-react'
import { SearchableSelect } from '@/components/ui/searchable-select'

interface Mechanic {
    id: string
    name: string
    commission_rate: number
}

export function MechanicList({ initialMechanics }: { initialMechanics: Mechanic[] }) {
    // We rely on reload to refresh this, so prop is fresh
    const mechanics = initialMechanics
    const [loading, setLoading] = useState(false)
    const [selectedId, setSelectedId] = useState<string>('')

    const selectedMechanic = mechanics.find(m => m.id === selectedId)

    async function handleAdd(formData: FormData) {
        setLoading(true)
        const result = await createMechanic(formData)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Prestador adicionado!")
            window.location.reload()
        }
    }

    async function handleUpdate(formData: FormData) {
        setLoading(true)
        const result = await updateMechanic(formData)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Prestador atualizado!")
            window.location.reload()
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja remover este prestador?")) return
        setLoading(true)
        const result = await deleteMechanic(id)
        setLoading(false)
        if (result.success) {
            toast.success("Prestador removido")
            window.location.reload()
        } else {
            toast.error("Erro ao remover")
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Equipe e Prestadores
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* 1. Adicionar Novo */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                    <h3 className="font-semibold text-sm uppercase text-muted-foreground">Cadastrar Novo</h3>
                    <form action={handleAdd} className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
                        <div className="flex-1 space-y-2">
                            <Label>Nome do Prestador</Label>
                            <Input name="name" required placeholder="Ex: João da Silva" />
                        </div>
                        <div className="w-full md:w-32 space-y-2">
                            <Label>Comissão (%)</Label>
                            <Input name="rate" type="number" min="0" max="100" defaultValue="30" required />
                        </div>
                        <Button disabled={loading} className="w-full md:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar
                        </Button>
                    </form>
                </div>

                {/* 2. Buscar e Editar */}
                <div className="space-y-4">
                    <div className="border-t pt-6">
                        <h3 className="font-semibold text-lg mb-4">Gerenciar Equipe</h3>
                        <div className="space-y-2">
                            <Label>Buscar Prestador</Label>
                            <div className="max-w-md">
                                <SearchableSelect
                                    placeholder="Digite o nome para buscar..."
                                    options={mechanics.map(m => ({ label: m.name, value: m.id }))}
                                    value={selectedId}
                                    onValueChange={setSelectedId}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Selecione um prestador para editar ou remover.</p>
                        </div>
                    </div>

                    {selectedMechanic && (
                        <div className="mt-6 p-4 border rounded-lg bg-orange-50/50 animate-in fade-in slide-in-from-top-2">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="font-bold text-lg text-orange-900">Editar: {selectedMechanic.name}</h4>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedId('')}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <form action={handleUpdate} className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
                                <input type="hidden" name="id" value={selectedMechanic.id} />

                                <div className="flex-1 space-y-2">
                                    <Label>Nome</Label>
                                    <Input name="name" defaultValue={selectedMechanic.name} required />
                                </div>
                                <div className="w-32 space-y-2">
                                    <Label>Comissão (%)</Label>
                                    <Input name="rate" type="number" min="0" max="100" defaultValue={selectedMechanic.commission_rate} required />
                                </div>

                                <div className="flex gap-2">
                                    <Button disabled={loading} className="flex-1 md:flex-none">
                                        <Save className="h-4 w-4 mr-2" />
                                        Salvar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        disabled={loading}
                                        onClick={() => handleDelete(selectedMechanic.id)}
                                        className="flex-1 md:flex-none"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
