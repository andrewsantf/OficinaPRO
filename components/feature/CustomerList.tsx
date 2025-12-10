import { createClient } from '@/lib/supabase/server'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Trash2 } from 'lucide-react'
import { deleteCustomer } from '@/app/customers/actions'
import { DeleteButton } from '@/components/feature/DeleteButton'
import { formatDocument, formatPhone } from '@/lib/utils'

export default async function CustomerList({ search }: { search?: string }) {
    const supabase = await createClient()

    let query = supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true })

    if (search) {
        query = query.or(`name.ilike.%${search}%,cpf_cnpj.ilike.%${search}%`)
    }

    const { data: customers } = await query

    return (
        <Card>
            <CardHeader>
                <CardTitle>Clientes Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Desktop View (Table) */}
                <div className="hidden md:block rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Contato</TableHead>
                                <TableHead>CPF/CNPJ</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers?.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">{customer.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{formatPhone(customer.phone)}</span>
                                            <span className="text-xs text-muted-foreground">{customer.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{customer.cpf_cnpj ? formatDocument(customer.cpf_cnpj) : ''}</TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <Link href={`/customers/${customer.id}`}>
                                            <Button variant="ghost" size="sm">Editar</Button>
                                        </Link>
                                        <DeleteButton
                                            onDelete={deleteCustomer.bind(null, customer.id)}
                                            title="Excluir Cliente"
                                            description={`Tem certeza que deseja excluir ${customer.name}?`}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {customers?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        Nenhum cliente encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile View (Cards) */}
                <div className="md:hidden space-y-6">
                    {customers?.map((customer) => (
                        <div key={customer.id} className="border rounded-lg p-4 flex flex-col gap-3 bg-white shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg">{customer.name}</p>
                                    <p className="text-sm text-muted-foreground">{customer.cpf_cnpj || 'Sem documento'}</p>
                                </div>
                                <div className="flex gap-1">
                                    <Link href={`/customers/${customer.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <span className="sr-only">Editar</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                        </Button>
                                    </Link>
                                    <DeleteButton
                                        onDelete={deleteCustomer.bind(null, customer.id)}
                                        title="Excluir Cliente"
                                        description={`Tem certeza que deseja excluir ${customer.name}?`}
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded text-sm">
                                <p className="flex items-center gap-2">
                                    <span className="font-semibold">Tel:</span> {customer.phone}
                                </p>
                                {customer.email && (
                                    <p className="flex items-center gap-2 mt-1">
                                        <span className="font-semibold">Email:</span> {customer.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                    {customers?.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            Nenhum cliente encontrado.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
