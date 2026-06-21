function CardSkeleton() {
  return (
    <div className="p-3 bg-gray-50 rounded-md shadow-sm animate-pulse">
      {/* Image */}
      <div className="aspect-square w-full rounded bg-gray-200" />

      {/* Text */}
      <div className="py-3 grid gap-5">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>

      {/* Button */}
      <div className="h-8 w-full rounded bg-gray-200" />
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
