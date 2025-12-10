'use client'

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton() {
    return (
        <Button
            onClick={() => window.print()}
            className="mb-8 print:hidden bg-blue-600 text-white hover:bg-blue-700 gap-2"
        >
            <Printer size={16} />
            Imprimir / Salvar PDF
        </Button>
    )
}
