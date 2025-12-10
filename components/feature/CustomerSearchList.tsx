'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Users, Pencil, Trash2, X, Phone, Mail, FileText, ExternalLink } from 'lucide-react'
import { deleteCustomer } from '@/app/customers/actions'
import { toast } from 'sonner'
import Link from 'next/link'
import { formatDocument, formatPhone } from '@/lib/utils'

interface Customer {
    id: string
    name: string
    phone: string | null
    email: string | null
    doc_type: string
    cpf_cnpj: string // Corrigido para corresponder ao BD
    address?: string | null
}

interface CustomerSearchListProps {
    customers: Customer[]
}

export function CustomerSearchList({ customers }: CustomerSearchListProps) {
    const [selectedId, setSelectedId] = useState<string>('')
    const [isPending, startTransition] = useTransition()

    const selectedCustomer = customers.find(c => c.id === selectedId)

    const handleDelete = (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir ${name}?`)) return
        startTransition(async () => {
            try {
                await deleteCustomer(id)
                toast.success('Cliente excluído!')
                setSelectedId('')
            } catch (error) {
                toast.error('Erro ao excluir cliente. Verifique se existem veículos vinculados.')
            }
        })
    }

    // Prepare options safely
    const options = customers.map(c => ({
        label: `${c.name} - ${c.cpf_cnpj ? formatDocument(c.cpf_cnpj) : 'S/ Doc'}`,
        value: c.id
    }))

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Clientes Cadastrados
                    </CardTitle>
                    <div className="text-muted-foreground text-sm font-normal">
                        {customers.length} cliente{customers.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Campo de Busca */}
                <div className="mt-4 pt-4 border-t">
                    <div className="space-y-2">
                        <Label>Buscar Cliente</Label>
                        <SearchableSelect
                            placeholder="Digite o nome ou documento..."
                            options={options}
                            value={selectedId}
                            onValueChange={setSelectedId}
                        />
                        <p className="text-xs text-muted-foreground">
                            Selecione um cliente para ver os detalhes, editar ou excluir.
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Card do Cliente Selecionado */}
                {selectedCustomer && (
                    <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50/50 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-xl text-blue-900">
                                    {selectedCustomer.name}
                                </h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {selectedCustomer.doc_type}: {selectedCustomer.cpf_cnpj ? formatDocument(selectedCustomer.cpf_cnpj) : 'N/A'}
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedId('')}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-2 mb-4 bg-white p-3 rounded-lg border">
                            {selectedCustomer.address && (
                                <div className="text-sm text-muted-foreground mb-2 pb-2 border-b">
                                    <span className="font-medium text-foreground">Endereço:</span> {selectedCustomer.address}
                                </div>
                            )}

                            {selectedCustomer.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Telefone:</span>
                                    <span>{formatPhone(selectedCustomer.phone)}</span>
                                </div>
                            )}
                            {selectedCustomer.email && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Email:</span>
                                    <span>{selectedCustomer.email}</span>
                                </div>
                            )}
                            {!selectedCustomer.phone && !selectedCustomer.email && (
                                <p className="text-sm text-muted-foreground">Nenhum contato cadastrado</p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Link href={`/customers/${selectedCustomer.id}`} className="flex-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Pencil className="h-4 w-4 mr-2" /> Editar
                                </Button>
                            </Link>
                            <Link href={`/customers/${selectedCustomer.id}`} className="flex-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" /> Ver Detalhes
                                </Button>
                            </Link>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(selectedCustomer.id, selectedCustomer.name)}
                                disabled={isPending}
                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> {isPending ? '...' : 'Excluir'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Estado vazio */}
                {!selectedId && (
                    <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto text-slate-200 mb-4" />
                        <p>
                            {customers.length === 0
                                ? 'Nenhum cliente cadastrado'
                                : 'Selecione um cliente acima para ver os detalhes.'
                            }
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
