import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

function SkeletonDocument() {
  const skeletonItem = Array.from({ length: 5 }, (_, index) => (
    <Skeleton key={index} className="document-list-item">
      <div className="flex flex-1 items-center gap-4">
        <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
          <Image
            src="/assets/icons/doc.svg"
            alt="file"
            width={40}
            height={40}
          />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-[100px] h-[18px]" />

          <Skeleton className="w-[150px] h-[16px]" />
        </div>
      </div>
    </Skeleton>
  ));

  return (
    <div className="document-list-container">
      <ul className="document-ul">{skeletonItem}</ul>
    </div>
  );
}

export default SkeletonDocument;
