import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function DataTable({
  columns,
  data,
  isLoading = false,
  pageSize = 10,
  className = "",
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Enhanced columns with sorting buttons
  const enhancedColumns = React.useMemo(() => {
    return columns.map((column) => ({
      ...column,
      header: ({ column: col }) => {
        if (typeof column.header === 'string' && column.accessorKey) {
          return (
            <Button
              variant="ghost"
              onClick={() => col.toggleSorting(col.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold"
            >
              {column.header}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        }
        return typeof column.header === 'function' ? column.header({ column: col }) : column.header;
      },
    }));
  }, [columns]);

  const tableInstance = useReactTable({
    ...table.options,
    columns: enhancedColumns,
  });

  // Skeleton rows for loading state
  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {columns.map((column, colIndex) => (
          <TableCell key={`skeleton-cell-${index}-${colIndex}`}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className={`space-y-4 w-full ${className}`}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold px-1 sm:px-4 text-xs sm:text-sm">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeletonRows()
            ) : tableInstance.getRowModel().rows?.length ? (
              tableInstance.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-1 sm:px-4 py-2 text-xs sm:text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground px-1 sm:px-4"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          {isLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            `${tableInstance.getFilteredRowModel().rows.length} total rows`
          )}
        </div>
        <div className="flex items-center space-x-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => tableInstance.previousPage()}
            disabled={!tableInstance.getCanPreviousPage() || isLoading}
            className="px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">‹</span>
          </Button>
          <div className="text-sm text-muted-foreground px-2">
            {isLoading ? (
              <Skeleton className="h-4 w-16 sm:w-20" />
            ) : (
              <span className="whitespace-nowrap">
                <span className="hidden sm:inline">
                  Page {tableInstance.getState().pagination.pageIndex + 1} of {tableInstance.getPageCount()}
                </span>
                <span className="sm:hidden">
                  {tableInstance.getState().pagination.pageIndex + 1}/{tableInstance.getPageCount()}
                </span>
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => tableInstance.nextPage()}
            disabled={!tableInstance.getCanNextPage() || isLoading}
            className="px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">›</span>
          </Button>
        </div>
      </div>
    </div>
  );
}