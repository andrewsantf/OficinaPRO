'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { addItem, removeItem } from '@/app/service-orders/actions'
import { Trash2, Plus, User } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

type Item = {
    id: string
    description: string
    type: 'product' | 'service'
    quantity: number
    unit_price_cents: number
    mechanic_id?: string
    // we might need to join mechanics to get name, but for now lets assume parent passed enriched items or we just show icon
    // Actually parent should pass enriched items.
    // Let's interface assuming parent passes mechanic name in a joined object or we just show ID?
    // Parent query needs update to join mechanics on items.
    mechanics?: { name: string } | null
}

type Mechanic = {
    id: string
    name: string
}

export function ServiceOrderItems({ osId, items, mechanics }: { osId: string, items: Item[], mechanics: Mechanic[] }) {
    const [isAdding, setIsAdding] = useState(false)

    async function handleAdd(formData: FormData) {
        setIsAdding(true)
        const result = await addItem(formData)
        setIsAdding(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Item adicionado!")
            const form = document.getElementById('add-item-form') as HTMLFormElement
            form?.reset()
            // Reset select manually if needed or let re-render handle it
        }
    }

    async function handleRemove(itemId: string) {
        const result = await removeItem(itemId, osId)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Item removido")
        }
    }

    const total = items.reduce((acc, item) => acc + (item.quantity * item.unit_price_cents), 0) / 100

    return (
        <div className="space-y-6">
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50%] min-w-[200px]">Descrição</TableHead>
                            <TableHead className="min-w-[150px]">Prestador</TableHead>
                            <TableHead className="text-right whitespace-nowrap">Valor</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="min-w-[200px]">{item.description}</TableCell>
                                <TableCell>
                                    {item.mechanics?.name ? (
                                        <Badge variant="secondary" className="font-normal">
                                            {item.mechanics.name}
                                        </Badge>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-medium whitespace-nowrap">
                                    {((item.quantity * item.unit_price_cents) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemove(item.id)}
                                        className="h-8 w-8 text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                    Nenhum item adicionado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-end pr-4">
                <div className="text-2xl font-bold">
                    Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border">
                <h3 className="font-semibold mb-4 text-sm uppercase text-muted-foreground tracking-wider">Adicionar Novo Item</h3>
                <form id="add-item-form" action={handleAdd} className="flex gap-4 items-end flex-wrap">
                    <input type="hidden" name="osId" value={osId} />
                    <input type="hidden" name="type" value="service" />
                    <input type="hidden" name="quantity" value="1" />

                    <div className="flex-1 min-w-[200px] space-y-2">
                        <Label>Descrição</Label>
                        <Input name="description" placeholder="Ex: Troca de óleo" required />
                    </div>

                    <div className="w-[180px] space-y-2">
                        <Label>Prestador</Label>
                        <Select name="mechanicId">
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">-- Nenhum --</SelectItem>
                                {mechanics.map(m => (
                                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-[130px] space-y-2">
                            <Label className="text-xs">Custo Material (R$)</Label>
                            <Input name="materialCost" type="number" step="0.01" placeholder="0,00" />
                            <p className="text-[10px] text-muted-foreground leading-tight">Desconta da comissão</p>
                        </div>

                        <div className="w-[120px] space-y-2">
                            <Label>Valor (R$)</Label>
                            <Input name="price" type="number" step="0.01" placeholder="0,00" required />
                        </div>
                    </div>



                    <Button disabled={isAdding} className="mb-[2px]">
                        <Plus className="mr-2 h-4 w-4" />
                        {isAdding ? 'Adicionando...' : 'Adicionar'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
