'use client';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/lib/hooks/use-debounce';

import {
  type DataTableFilterableColumn,
  type DataTableSearchableColumn,
  DataTableToolbar,
} from './data-table-toolbar';

interface DataTableProps<TData, TValue> {
  tableName?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  filterableColumns?: DataTableFilterableColumn<TData>[];
  searchableColumns?: DataTableSearchableColumn<TData>[];
  newRowLink?: string;
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
}

export function DataTable<TData, TValue>({
  tableName,
  columns,
  data,
  filterableColumns = [],
  searchableColumns = [],
  newRowLink,
  deleteRowsAction,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search params
  const page = searchParams?.get('page') ?? '1';
  const per_page = searchParams?.get('per_page') ?? '10';
  const sort = searchParams?.get('sort');
  const [column, order] = sort?.split('.') ?? [];

  // Create query string
  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  // Table states
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: Number(page) - 1,
    pageSize: Number(per_page),
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  useEffect(() => {
    setPagination({
      pageIndex: Number(page) - 1,
      pageSize: Number(per_page),
    });
  }, [page, per_page]);

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        per_page: pageSize,
      })}`,
      {
        scroll: false,
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, createQueryString, pathname, router.push]);

  // Handle server-side sorting
  const initialSorting: SortingState = useMemo(() => {
    if (column) {
      return [
        {
          id: column,
          desc: order === 'desc',
        },
      ];
    }
    return [];
  }, [column, order]);

  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  useEffect(() => {
    if (sorting.length === 0) {
      router.push(
        `${pathname}?${createQueryString({
          page,
          sort: null,
        })}`,
        {
          scroll: false,
        },
      );
    } else {
      router.push(
        `${pathname}?${createQueryString({
          page,
          sort: sorting[0]?.id
            ? `${sorting[0]?.id}.${sorting[0]?.desc ? 'desc' : 'asc'}`
            : null,
        })}`,
        {
          scroll: false,
        },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, createQueryString, pathname, router.push, page]);

  // Handle server-side filtering
  const debouncedSearchableColumnFilters = JSON.parse(
    useDebounce(
      JSON.stringify(
        columnFilters.filter((filter) => {
          return searchableColumns.find((column) => column.id === filter.id);
        }),
      ),
      500,
    ),
  ) as ColumnFiltersState;

  const filterableColumnFilters = columnFilters.filter((filter) => {
    return filterableColumns.find((column) => column.id === filter.id);
  });

  useEffect(() => {
    for (const columnFilter of debouncedSearchableColumnFilters) {
      if (typeof columnFilter.value === 'string') {
        router.push(
          `${pathname}?${createQueryString({
            page: 1,
            [columnFilter.id]: columnFilter.value,
          })}`,
          {
            scroll: false,
          },
        );
      }
    }

    for (const key of Array.from(searchParams.keys())) {
      if (
        searchableColumns.find((column) => column.id === key) &&
        !debouncedSearchableColumnFilters.find((filter) => filter.id === key)
      ) {
        router.push(
          `${pathname}?${createQueryString({
            page: 1,
            [key]: null,
          })}`,
          {
            scroll: false,
          },
        );
      }
    }
  }, [
    debouncedSearchableColumnFilters,
    router.push,
    createQueryString,
    pathname,
    searchParams.keys,
    searchableColumns.find,
  ]);

  useEffect(() => {
    for (const columnFilter of filterableColumnFilters) {
      if (
        typeof columnFilter.value === 'object' &&
        Array.isArray(columnFilter.value)
      ) {
        router.push(
          `${pathname}?${createQueryString({
            page: 1,
            [columnFilter.id]: columnFilter.value.join('.'),
          })}`,
          {
            scroll: false,
          },
        );
      }
    }

    for (const key of Array.from(searchParams.keys())) {
      if (
        filterableColumns.find((column) => column.id === key) &&
        !filterableColumnFilters.find((filter) => filter.id === key)
      ) {
        router.push(
          `${pathname}?${createQueryString({
            page: 1,
            [key]: null,
          })}`,
          {
            scroll: false,
          },
        );
      }
    }
  }, [
    filterableColumnFilters,
    router.push,
    createQueryString,
    pathname,
    searchParams.keys,
    filterableColumns.find,
  ]);

  const table = useReactTable({
    data,
    columns,

    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    rowCount: data.length,
    enableRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="w-full space-y-3">
      <DataTableToolbar
        tableName={tableName}
        table={table}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        newRowLink={newRowLink}
        deleteRowsAction={deleteRowsAction}
      />
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
