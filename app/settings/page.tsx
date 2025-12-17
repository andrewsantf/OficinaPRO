import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { ArrowLeft, Crown } from 'lucide-react'
import { updatePassword } from './actions'
import { ProfileForm } from '@/components/feature/ProfileForm'
import { getMechanics } from '@/app/settings/mechanic-actions'
import { formatDocument } from '@/lib/utils'
import { OrganizationSettings } from '@/components/feature/OrganizationSettings'

export default async function SettingsPage() {
    const supabase = await createClient()

    // ... existing auth checks
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const mechanics = await getMechanics()

    // Fetch profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, organizations(name, document, subscription_status, trial_ends_at)')
        .eq('id', user.id)
        .single()

    const profileName = profile?.name || user.user_metadata?.full_name || ''
    const profilePhone = profile?.phone || ''
    const subStatus = profile?.organizations?.subscription_status || 'inactive'
    const trialEnd = profile?.organizations?.trial_ends_at

    const rawDoc = profile?.organizations?.document || ''
    const cleanDoc = rawDoc.replace(/\D/g, '')
    const isIndividual = cleanDoc.length <= 11 && cleanDoc.length > 0
    const formattedDoc = formatDocument(rawDoc)

    return (
        <>
            <div className="container mx-auto p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard" className="md:hidden">
                                <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8 text-muted-foreground">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold">Configurações</h1>
                        </div>
                        <p className="text-muted-foreground">Gerencie sua conta e assinatura.</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Subscription Section */}
                    <Card className={`border-l-4 ${subStatus === 'lifetime' ? 'border-l-amber-500' : subStatus === 'active' ? 'border-l-green-500' : 'border-l-slate-300'}`}>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CardTitle>Assinatura e Plano</CardTitle>
                                {subStatus === 'lifetime' && <Crown className="h-5 w-5 text-amber-500 fill-amber-500" />}
                            </div>
                            <CardDescription>Gerencie o status do seu acesso ao OficinaPRO.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {subStatus === 'lifetime' ? 'Membro Vitalício' :
                                            subStatus === 'active' ? 'Plano Pro' :
                                                subStatus === 'trialing' ? 'Período de Teste' : 'Plano Gratuito'}
                                    </h3>
                                    <Badge variant={subStatus === 'lifetime' ? 'default' : subStatus === 'active' ? 'outline' : 'secondary'}
                                        className={
                                            subStatus === 'lifetime' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200' :
                                                subStatus === 'active' ? 'text-green-700 border-green-200 bg-green-50' :
                                                    subStatus === 'trialing' ? 'bg-amber-100 text-amber-700' : ''
                                        }
                                    >
                                        {subStatus === 'lifetime' ? 'Permanente' :
                                            subStatus === 'active' ? 'Ativo' :
                                                subStatus === 'trialing' ? 'Trial' : 'Inativo'}
                                    </Badge>
                                </div>

                                {subStatus === 'active' && (
                                    <p className="text-sm text-slate-500">Sua assinatura está ativa e com renovação automática.</p>
                                )}
                                {subStatus === 'lifetime' && (
                                    <p className="text-sm text-amber-600/80">Você possui acesso ilimitado a todos os recursos.</p>
                                )}
                                {subStatus === 'trialing' && trialEnd && (
                                    <p className="text-sm text-amber-600">Seu teste termina em {new Date(trialEnd).toLocaleDateString()}.</p>
                                )}
                            </div>

                            {subStatus !== 'lifetime' && (
                                <Link href="/subscription">
                                    <Button variant={subStatus === 'active' ? 'outline' : 'default'}>
                                        {subStatus === 'active' ? 'Gerenciar Assinatura' : 'Fazer Upgrade'}
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>

                    {/* Profile Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Perfil</CardTitle>
                            <CardDescription>Atualize suas informações pessoais.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm
                                initialName={profileName}
                                initialPhone={profilePhone}
                                displayCpf={isIndividual ? formattedDoc : undefined}
                            />
                        </CardContent>
                    </Card>

                    {/* Organization Data - Only show if NOT individual (CNPJ) */}
                    {!isIndividual && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Dados da Empresa</CardTitle>
                                <CardDescription>Informações da sua oficina.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <OrganizationSettings
                                    initialName={profile?.organizations?.name || ''}
                                    initialDocument={formattedDoc}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Password Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Segurança</CardTitle>
                            <CardDescription>Alterar sua senha de acesso.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* @ts-expect-error Server Action binding */}
                            <form action={updatePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Nova Senha</Label>
                                    <Input name="password" type="password" required minLength={6} placeholder="******" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                    <Input name="confirmPassword" type="password" required minLength={6} placeholder="******" />
                                </div>
                                <Button variant="secondary">Atualizar Senha</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
