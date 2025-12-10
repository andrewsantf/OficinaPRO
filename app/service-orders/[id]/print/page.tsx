import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PrintButton } from '@/components/feature/PrintButton'

export default async function PrintServiceOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    console.log('--- PRINT PAGE DEBUG ---')
    console.log('ID:', id)

    const { data: os, error } = await supabase
        .from('service_orders')
        .select(`
            *,
            vehicles (
                plate, brand, model, color, year,
                customers (name, phone, cpf_cnpj, email)
            )
        `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Print Page Query Error:', JSON.stringify(error, null, 2))
    }

    if (!os) {
        console.error('Print Page: OS not found')
        return notFound()
    }

    // Fetch Organization separately to avoid join/RLS issues
    const { data: org } = await supabase
        .from('organizations')
        .select('name, document')
        .eq('id', os.organization_id)
        .single()

    const { data: items } = await supabase
        .from('service_items')
        .select('*')
        .eq('service_order_id', os.id)
        .order('created_at', { ascending: true })

    const total = (os.total_amount_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const orgName = org?.name || 'Minha Oficina'
    const orgDoc = org?.document || ''

    return (
        <div className="p-8 max-w-[210mm] mx-auto bg-white min-h-screen text-black print:p-0">
            <div className="mb-8 print:hidden flex justify-between items-center">
                <PrintButton />
                <a href={`/service-orders/${os.id}`} className="text-gray-600 hover:underline">Voltar para O.S</a>
            </div>

            {/* Header */}
            <div className="border-b pb-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold uppercase">{orgName}</h1>
                        <p className="text-sm text-gray-600">Ordem de Serviço Profissional</p>
                        <p className="text-sm mt-2 font-medium">CNPJ: {orgDoc}</p>
                        {/* Address/Phone would go here if we had them in DB */}
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold">Ordem de Serviço</h2>
                        <p className="text-lg">#{os.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">Data: {new Date(os.created_at).toLocaleDateString()}</p>
                        <p className="text-sm font-medium mt-1 uppercase">{os.status?.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>

            {/* Client & Vehicle */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="font-bold border-b mb-2 pb-1">Cliente</h3>
                    <p><span className="font-medium">Nome:</span> {os.vehicles.customers.name}</p>
                    <p><span className="font-medium">CPF/CNPJ:</span> {os.vehicles.customers.cpf_cnpj || '-'}</p>
                    <p><span className="font-medium">Tel:</span> {os.vehicles.customers.phone || '-'}</p>
                </div>
                <div>
                    <h3 className="font-bold border-b mb-2 pb-1">Veículo</h3>
                    <p><span className="font-medium">Veículo:</span> {os.vehicles.brand} {os.vehicles.model}</p>
                    <p><span className="font-medium">Placa:</span> {os.vehicles.plate}</p>
                    <p><span className="font-medium">Ano:</span> {os.vehicles.year}</p>
                    <p><span className="font-medium">Cor:</span> {os.vehicles.color}</p>
                </div>
            </div>

            {/* Items */}
            <div className="mb-8 overflow-x-auto">
                <h3 className="font-bold border-b mb-4 pb-1">Serviços e Peças</h3>
                <table className="w-full text-sm min-w-[600px]">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="text-left py-2">Descrição</th>
                            <th className="text-right py-2 w-40">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items?.map((item: any) => {
                            const itemTotal = (item.quantity * item.unit_price_cents / 100)
                            return (
                                <tr key={item.id} className="border-b border-gray-200">
                                    <td className="py-2">{item.description}</td>
                                    <td className="py-2 text-right font-medium">
                                        {itemTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="pt-4 text-right font-bold text-lg">Total Geral</td>
                            <td className="pt-4 text-right font-bold text-lg">{total}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Footer / Signatures */}
            <div className="mt-20 grid grid-cols-2 gap-12 text-center text-sm">
                <div>
                    <div className="border-t border-black pt-2">
                        Assinatura da Oficina
                    </div>
                </div>
                <div>
                    <div className="border-t border-black pt-2">
                        Assinatura do Cliente
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center text-xs text-gray-400">
                <p>Documento gerado em {new Date().toLocaleString()} via OficinaPro</p>
            </div>
        </div>
    )
}
