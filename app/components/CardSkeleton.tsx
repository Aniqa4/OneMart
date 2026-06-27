function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square w-full bg-gray-100" />
      <div className="px-4 pt-3 pb-4 space-y-2">
        <div className="h-3.5 w-3/4 rounded-full bg-gray-100" />
        <div className="h-3.5 w-1/3 rounded-full bg-gray-100" />
      </div>
    </div>
  );
}

interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 4 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export default CardSkeleton;
