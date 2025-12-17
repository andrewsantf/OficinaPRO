import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-10 w-[120px]" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-[120px] rounded-xl" />
                <Skeleton className="h-[120px] rounded-xl" />
                <Skeleton className="h-[120px] rounded-xl" />
                <Skeleton className="h-[120px] rounded-xl" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        </div>
    )
}

export function TableLoadingSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[150px]" />
                <Skeleton className="h-10 w-[100px]" />
            </div>
            <div className="border rounded-md p-4 space-y-4">
                <div className="flex gap-4 mb-6">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-[100px]" />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-12 w-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}
