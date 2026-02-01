import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Image Skeleton */}
                <div className="animate-fade-in-left">
                    <Skeleton className="aspect-square w-full rounded-2xl" />
                </div>

                {/* Info Skeleton */}
                <div className="animate-fade-in-right flex flex-col gap-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-8 w-1/3" />
                    <div className="mt-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="mt-8 border-t border-border pt-6 space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                        <div className="flex justify-between">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                    </div>
                    <Skeleton className="mt-6 h-12 w-full rounded-full" />
                </div>
            </div>
        </div>
    )
}
