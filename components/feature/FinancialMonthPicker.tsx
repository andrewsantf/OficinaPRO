'use client'

import { useRouter } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CalendarIcon } from 'lucide-react'

export function FinancialMonthPicker({ currentMonth }: { currentMonth: string }) {
    const router = useRouter()
    // format YYYY-MM
    const [yearStr, monthStr] = currentMonth.split('-')
    const currentYear = parseInt(yearStr)
    const normalizedMonth = parseInt(monthStr).toString() // '05' -> '5'

    const months = [
        { value: '1', label: 'Janeiro' },
        { value: '2', label: 'Fevereiro' },
        { value: '3', label: 'Março' },
        { value: '4', label: 'Abril' },
        { value: '5', label: 'Maio' },
        { value: '6', label: 'Junho' },
        { value: '7', label: 'Julho' },
        { value: '8', label: 'Agosto' },
        { value: '9', label: 'Setembro' },
        { value: '10', label: 'Outubro' },
        { value: '11', label: 'Novembro' },
        { value: '12', label: 'Dezembro' },
    ]

    // Generate years: current year - 2 to current year + 1
    const baseYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => (baseYear - 3 + i).toString())

    function handleUpdate(type: 'month' | 'year', value: string) {
        let newMonth = type === 'month' ? value : normalizedMonth
        let newYear = type === 'year' ? value : yearStr

        // Pad month
        newMonth = newMonth.padStart(2, '0')

        router.push(`/financial?month=${newYear}-${newMonth}`)
    }

    return (
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm w-full">
            <CalendarIcon className="h-5 w-5 text-muted-foreground ml-2" />

            <div className="flex-1 flex gap-2 w-full">
                <Select value={normalizedMonth} onValueChange={(v) => handleUpdate('month', v)}>
                    <SelectTrigger className="flex-1 border-0 shadow-none focus:ring-0 h-10 font-medium bg-transparent">
                        <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((m) => (
                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <span className="flex items-center text-muted-foreground">/</span>

                <Select value={yearStr} onValueChange={(v) => handleUpdate('year', v)}>
                    <SelectTrigger className="flex-1 border-0 shadow-none focus:ring-0 h-10 font-medium bg-transparent">
                        <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((y) => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
