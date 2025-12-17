'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { saveChecklist } from '@/app/service-orders/checklist-actions'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp, ClipboardCheck, Fuel, Camera, X, Loader2 } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import imageCompression from 'browser-image-compression'
import { createClient } from '@/lib/supabase/client'

interface ChecklistData {
    id: string
    fuel_level: string | null
    items: Record<string, boolean>
    notes: string | null
    photos_url?: string[] | null
}

export function ChecklistForm({ serviceOrderId, initialData }: { serviceOrderId: string, initialData?: ChecklistData | null }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [photos, setPhotos] = useState<string[]>(initialData?.photos_url || [])

    // Helper to check if item is checked safely
    const isChecked = (key: string) => {
        return initialData?.items?.[key] === true
    }

    async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            setUploading(true)

            // 1. Compression
            const options = {
                maxSizeMB: 0.3, // 300KB
                maxWidthOrHeight: 1280,
                useWebWorker: true
            }

            const compressedFile = await imageCompression(file, options)

            // 2. Upload to Supabase
            const supabase = createClient()
            const filename = `${serviceOrderId}-${Date.now()}.jpg`

            const { data, error } = await supabase.storage
                .from('checklist-photos')
                .upload(filename, compressedFile)

            if (error) {
                console.error("Erro upload:", error)
                throw error
            }

            // 3. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('checklist-photos')
                .getPublicUrl(filename)

            setPhotos(prev => [...prev, publicUrl])
            toast.success("Foto adicionada!")

        } catch (error) {
            console.error(error)
            toast.error("Erro ao enviar foto. Tente novamente.")
        } finally {
            setUploading(false)
        }
    }

    function removePhoto(indexToRemove: number) {
        setPhotos(prev => prev.filter((_, index) => index !== indexToRemove))
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        // Append all photo URLs to formData
        // We will need to handle this in the server action
        photos.forEach(url => formData.append('photos_url', url))

        const result = await saveChecklist(serviceOrderId, formData)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Checklist salvo com sucesso!")
            setIsOpen(false)
        }
    }

    return (
        <Card className="border-l-4 border-l-blue-500">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="py-4 cursor-pointer hover:bg-slate-50 transition-colors flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <ClipboardCheck className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-base text-blue-700">Checklist de Entrada (Vistoria)</CardTitle>
                        </div>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="pt-0">
                        <form action={handleSubmit} className="space-y-6">

                            {/* Nível de Combustível */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2"><Fuel className="h-4 w-4" /> Nível de Combustível</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['empty', 'low', 'half', 'full'].map((level) => {
                                        const labels: Record<string, string> = { empty: 'Reserva', low: '1/4', half: '1/2', full: 'Cheio' }
                                        return (
                                            <div key={level} className="flex items-center space-x-2 border rounded p-2 hover:bg-slate-50">
                                                <input
                                                    type="radio"
                                                    name="fuel_level"
                                                    value={level}
                                                    id={`fuel-${level}`}
                                                    defaultChecked={initialData?.fuel_level === level}
                                                    className="accent-blue-600"
                                                />
                                                <Label htmlFor={`fuel-${level}`} className="cnt-0 cursor-pointer">{labels[level]}</Label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <hr />

                            {/* Itens Obrigatórios */}
                            <div className="space-y-3">
                                <Label>Itens Obrigatórios</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { id: 'step_tire', label: 'Estepe' },
                                        { id: 'jack', label: 'Macaco' },
                                        { id: 'wheel_wrench', label: 'Chave de Roda' },
                                        { id: 'triangle', label: 'Triângulo' },
                                        { id: 'manual', label: 'Manual' },
                                        { id: 'radio_face', label: 'Frente do Rádio' },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                name={item.id}
                                                id={item.id}
                                                defaultChecked={isChecked(item.id)}
                                            />
                                            <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr />

                            {/* Fotos */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2"><Camera className="h-4 w-4" /> Fotos da Vistoria</Label>

                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    {photos.map((url, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-slate-100">
                                            <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg aspect-square cursor-pointer hover:bg-slate-50 transition-colors relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                            disabled={uploading}
                                        />
                                        {uploading ? (
                                            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                                        ) : (
                                            <>
                                                <Camera className="h-6 w-6 text-slate-400 mb-2" />
                                                <span className="text-xs text-slate-500 font-medium">Adicionar</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                                <p className="text-xs text-slate-400">Clique para abrir a câmera. As fotos são comprimidas automaticamente.</p>
                            </div>

                            <hr />

                            {/* Observações */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Avarias e Observações</Label>
                                <Textarea
                                    name="notes"
                                    id="notes"
                                    placeholder="Ex: Risco na porta direita, amassado no parachoque traseiro..."
                                    defaultValue={initialData?.notes || ''}
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                                {loading ? 'Salvando...' : 'Salvar Vistoria'}
                            </Button>
                        </form>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}
