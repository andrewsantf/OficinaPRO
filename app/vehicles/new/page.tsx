import { VehicleForm } from '@/components/feature/VehicleForm'
import { QueryClientProvider } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'

// We need a wrapper to provide the QueryClient if it's not provided at layout level yet.
// For now, I will create a simple client wrapper or expect the root layout to have it.
// Assuming root layout doesn't have it yet, I will make this a Client Component that provides it, 
// or better, create a providers component.

// Ideally, we should have a `providers.tsx`
export default function NewVehiclePage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <VehicleForm />
        </div>
    )
}
