import { Button } from '@/components/ui/button';

type PaginationControlsProps = {
  pageNo: number;
  totalRecords: number;
  totalPages: number;
  limit: number;
  filteredCount: number;
  onPageChange: (page: number) => void;
};

// export const PaginationControls = ({
//   pageNo,
//   totalRecords,
//   limit,
//   filteredCount,
//   onPageChange
// }: PaginationControlsProps) => {
//   return (
//     <div className="flex items-center justify-between px-3 py-2">
//       <div className="text-sm text-muted-foreground">
//         {/* {filteredCount} of {totalRecords} row(s) selected. */}
//       </div>
//       <div className="space-x-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => onPageChange(pageNo - 1)}
//           disabled={pageNo === 1}
//         >
//           Previous
//         </Button>
//         <span className="text-sm text-gray-600">
//           Page {pageNo} of {Math.ceil(totalRecords / limit)}
//         </span>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => onPageChange(pageNo + 1)}
//           disabled={pageNo >= Math.ceil(totalRecords / limit)}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// };
export const PaginationControls = ({
  pageNo,
  totalPages,
  totalRecords,
  limit,
  filteredCount,
  onPageChange
}: PaginationControlsProps) => {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="text-sm text-muted-foreground">
        {/* {filteredCount} of {totalRecords} row(s) selected. */}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageNo - 1)}
          disabled={pageNo <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {pageNo} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageNo + 1)}
          disabled={pageNo >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
