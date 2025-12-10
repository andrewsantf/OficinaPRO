'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBrands, getModels, getYears, getFipeData, FipeData } from '@/services/fipe'
import { formatDocument, formatPhone } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createVehicle } from '@/app/vehicles/actions'
import { toast } from "sonner"
import { useTransition } from 'react'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Badge } from '@/components/ui/badge'

export function VehicleForm() {
    const [selectedBrand, setSelectedBrand] = useState<string>('')
    const [selectedModel, setSelectedModel] = useState<string>('')
    const [selectedYear, setSelectedYear] = useState<string>('')
    const [plate, setPlate] = useState('')
    const [vehicleType, setVehicleType] = useState<'carros' | 'motos' | 'caminhoes'>('carros')
    const [isPending, startTransition] = useTransition()

    // FIPE State
    const [fipeInfo, setFipeInfo] = useState<FipeData | null>(null)
    const [loadingFipe, setLoadingFipe] = useState(false)

    // Fetch FIPE Data when Year is selected
    useEffect(() => {
        if (selectedBrand && selectedModel && selectedYear) {
            setLoadingFipe(true)
            getFipeData(selectedBrand, selectedModel, selectedYear, vehicleType)
                .then(data => setFipeInfo(data))
                .catch(() => setFipeInfo(null))
                .finally(() => setLoadingFipe(false))
        } else {
            setFipeInfo(null)
        }
    }, [selectedBrand, selectedModel, selectedYear, vehicleType])
    // hidden fields for names
    const [brandName, setBrandName] = useState('')
    const [modelName, setModelName] = useState('')
    const [color, setColor] = useState('')

    // Controlled inputs for masking
    const [customerPhone, setCustomerPhone] = useState('')
    const [customerDoc, setCustomerDoc] = useState('')

    // hidden fields for names
    // hidden fields for names
    // const [brandName, setBrandName] = useState('') // Removed duplicate
    // const [modelName, setModelName] = useState('') // Removed duplicate

    // Reset selections when type changes
    function handleTypeChange(val: 'carros' | 'motos' | 'caminhoes') {
        setVehicleType(val)
        setSelectedBrand('')
        setBrandName('')
        setSelectedModel('')
        setModelName('')
        setSelectedYear('')
        setFipeInfo(null)
    }

    const { data: brands } = useQuery({
        queryKey: ['brands', vehicleType],
        queryFn: () => getBrands(vehicleType),
    })

    const { data: models } = useQuery({
        queryKey: ['models', selectedBrand, vehicleType],
        queryFn: () => getModels(selectedBrand, vehicleType),
        enabled: !!selectedBrand,
    })

    const { data: years } = useQuery({
        queryKey: ['years', selectedBrand, selectedModel, vehicleType],
        queryFn: () => getYears(selectedBrand, selectedModel, vehicleType),
        enabled: !!selectedBrand && !!selectedModel,
    })

    const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
        if (value.length > 7) value = value.slice(0, 7)
        setPlate(value)
    }

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            // Append names logic from state because SearchableSelect doesn't natively submit them in formData 
            // unless we strictly used hidden inputs.
            // But we are appending them manually here anyway.
            formData.append('brandName', brandName)
            formData.append('modelName', modelName)
            formData.append('plate', plate)

            // Append Fipe IDs
            formData.append('brandId', selectedBrand)
            formData.append('modelId', selectedModel)
            formData.append('yearId', selectedYear)

            const result = await createVehicle(formData)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Veículo cadastrado!")
            }
        })
    }

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Cadastro de Veículo</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">

                    {/* Vehicle Type Selector */}
                    <div className="mb-4 space-y-2">
                        <Label>Tipo de Veículo</Label>
                        <Select
                            value={vehicleType}
                            onValueChange={(val) => handleTypeChange(val as 'carros' | 'motos' | 'caminhoes')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="carros">Carro</SelectItem>
                                <SelectItem value="motos">Moto</SelectItem>
                                <SelectItem value="caminhoes">Caminhão</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 border-b pb-4">
                        <Label className="font-bold text-lg">Cliente</Label>

                        <div className="space-y-2">
                            <Label htmlFor="customerName">Nome</Label>
                            <Input name="customerName" required placeholder="João da Silva" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="customerPhone">Celular</Label>
                            <Input
                                name="customerPhone"
                                placeholder="(11) 99999-9999"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(formatPhone(e.target.value))}
                                maxLength={15}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="docNumber">CPF ou CNPJ</Label>
                            <Input
                                name="docNumber"
                                placeholder="000.000.000-00"
                                value={customerDoc}
                                onChange={(e) => setCustomerDoc(formatDocument(e.target.value))}
                                maxLength={18}
                            />
                        </div>
                    </div>

                    {/* Placa */}
                    <div className="space-y-2">
                        <Label htmlFor="plate">Placa</Label>
                        <Input
                            id="plate"
                            value={plate}
                            onChange={handlePlateChange}
                            placeholder="ABC1D23"
                            maxLength={7}
                            required
                            className="uppercase"
                        />
                    </div>

                    {/* Marca */}
                    <div className="space-y-2">
                        <Label>Marca</Label>
                        <SearchableSelect
                            placeholder="Buscar marca..."
                            options={brands?.map(b => ({ label: b.nome, value: b.codigo })) || []}
                            value={selectedBrand}
                            onValueChange={(val) => {
                                setSelectedBrand(val)
                                const brandObj = brands?.find(b => b.codigo === val)
                                setBrandName(brandObj?.nome || '')
                                setSelectedModel('')
                                setModelName('')
                                setSelectedYear('')
                            }}
                        />
                    </div>

                    {/* Modelo */}
                    <div className="space-y-2">
                        <Label>Modelo</Label>
                        <SearchableSelect
                            placeholder="Buscar modelo..."
                            disabled={!selectedBrand}
                            options={models?.map(m => ({ label: m.nome, value: m.codigo })) || []}
                            value={selectedModel}
                            onValueChange={(val) => {
                                setSelectedModel(val)
                                const modelObj = models?.find(m => m.codigo === val)
                                setModelName(modelObj?.nome || '')
                                setSelectedYear('')
                            }}
                        />
                    </div>

                    {/* Ano */}
                    <div className="space-y-2">
                        <Label>Ano/Modelo</Label>
                        <Select name="year" disabled={!selectedModel} value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o ano" />
                            </SelectTrigger>
                            <SelectContent>
                                {years?.map((year) => (
                                    <SelectItem key={year.codigo} value={year.codigo}>
                                        {year.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* FIPE Result Card */}
                    {loadingFipe && <p className="text-sm text-muted-foreground">Buscando valor FIPE...</p>}
                    {fipeInfo && (
                        <div className="bg-slate-50 p-4 rounded-lg border flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700">Tabela FIPE</h3>
                                <p className="text-xs text-slate-500">{fipeInfo.MesReferencia}</p>
                            </div>
                            <div className="text-right">
                                <Badge variant="secondary" className="text-sm font-bold bg-green-100 text-green-800">
                                    {fipeInfo.Valor}
                                </Badge>
                            </div>
                        </div>
                    )}

                    {/* Cor */}
                    <div className="space-y-2">
                        <Label>Cor</Label>
                        <Input
                            name="color"
                            placeholder="Prata, Preto..."
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>

                    <Button className="w-full mt-4" disabled={isPending}>
                        {isPending ? 'Salvando...' : 'Salvar Veículo'}
                    </Button>
                </form>

            </CardContent>
        </Card>
    )
}
