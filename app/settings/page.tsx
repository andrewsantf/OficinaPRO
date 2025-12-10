import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Assinatura</CardTitle>
                            <CardDescription>Status atual do seu plano.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                            <div>
                                <p className="font-medium text-slate-900 uppercase">{subStatus}</p>
                                {trialEnd && subStatus === 'trialing' && (
                                    <p className="text-xs text-amber-600">Em período de teste</p>
                                )}
                            </div>
                            <Link href="/subscription">
                                <Button variant="outline">Gerenciar Assinatura</Button>
                            </Link>
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
