'use server'

type LookupResult = {
    brand: string // "Honda"
    model: string // "Civic"
    year: string  // "2021"
    color: string // "Prata"
    success: boolean
    message?: string
}

export async function lookupPlate(plate: string): Promise<LookupResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const p = plate.replace(/[^A-Z0-9]/g, '').toUpperCase()

    // DEMO DATA
    if (p === 'ABC1234' || p === 'ABC1D34') {
        return {
            brand: 'Honda',
            model: 'Civic',
            year: '2021',
            color: 'Prata',
            success: true
        }
    }

    if (p === 'OFF1980') {
        return {
            brand: 'Volkswagen',
            model: 'Fusca',
            year: '1980',
            color: 'Azul',
            success: true
        }
    }

    if (p === 'AAA0001') {
        return {
            brand: 'Fiat',
            model: 'Uno',
            year: '2010',
            color: 'Branco',
            success: true
        }
    }

    // Default Fallback for ANY string if not matched above (Good for demoing without needing memorization)
    // If it starts with 'H', make it Hyundai HB20
    if (p.startsWith('H')) {
        return {
            brand: 'Hyundai',
            model: 'HB20',
            year: '2023',
            color: 'Branco',
            success: true
        }
    }

    // If it starts with 'T', make it Toyota Corolla
    if (p.startsWith('T')) {
        return {
            brand: 'Toyota',
            model: 'Corolla',
            year: '2022',
            color: 'Preto',
            success: true
        }
    }

    // Generic Fallback
    return {
        brand: 'Chevrolet',
        model: 'Onix',
        year: '2020',
        color: 'Vermelho',
        success: true
    }
}
