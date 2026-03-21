"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

type PaginationProps = {
  pageIndex: number;
  pageCount: number;
  onPageChange: (index: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
};

export const Pagination = ({
  pageIndex,
  pageCount,
  onPageChange,
  pageSize,
  onPageSizeChange
}: PaginationProps) => {
  const pageSizeOptions = [5, 10, 20, 50];

  const renderPageNumbers = () => {
    let startPage = 0;
    let endPage = 0;

    if (pageCount <= 3) {
      startPage = 0;
      endPage = pageCount - 1;
    } else {
      if (pageIndex <= 1) {
        startPage = 0;
        endPage = 2;
      } else if (pageIndex >= pageCount - 2) {
        startPage = pageCount - 3;
        endPage = pageCount - 1;
      } else {
        startPage = pageIndex - 1;
        endPage = pageIndex + 1;
      }
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === pageIndex ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
        >
          {i + 1}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(val) => onPageSizeChange(Number(val))}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pagination buttons */}
      <div className="flex justify-center items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pageIndex === 0}
          onClick={() => onPageChange(pageIndex - 1)}
        >
          Previous
        </Button>

        {renderPageNumbers()}

        <Button
          variant="outline"
          size="sm"
          disabled={pageIndex >= pageCount - 1}
          onClick={() => onPageChange(pageIndex + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
