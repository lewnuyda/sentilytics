import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import TitleText from "./TitleText";

const Datatable = ({
  title = "Table",
  columns = [],
  data = [],
  renderRow,
  customTableBody,
  searchable = false,
  searchPlaceholder = "Search...",
  searchKeys = [],
  pageSize = 10,
  showPagination = false,
  paginationComponent,
  ...rest
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!searchable || !normalizedSearch) return data;

    return data.filter((row) => {
      const keys = searchKeys.length > 0 ? searchKeys : Object.keys(row || {});

      return keys.some((key) => {
        const value = row?.[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(normalizedSearch);
      });
    });
  }, [data, normalizedSearch, searchable, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const totalEntries = filteredData.length;
  const startEntry =
    totalEntries === 0 || !showPagination
      ? totalEntries === 0
        ? 0
        : 1
      : (safeCurrentPage - 1) * pageSize + 1;
  const endEntry =
    totalEntries === 0
      ? 0
      : showPagination
        ? Math.min(safeCurrentPage * pageSize, totalEntries)
        : totalEntries;

  const tableData = useMemo(() => {
    if (!showPagination) return filteredData;
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pageSize, safeCurrentPage, showPagination]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <Card {...rest}>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <TitleText variant="h6">{title}</TitleText>
        {searchable && (
          <div className="relative mt-3">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            )}
          </div>
        )}
      </CardHeader>
      <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="border-b p-4 text-left">
                  <TitleText variant="small" className="font-semibold">
                    {col}
                  </TitleText>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customTableBody ? (
              customTableBody
            ) : tableData.length > 0 ? (
              tableData.map((row, index) =>
                renderRow ? (
                  renderRow(row, index, startEntry + index)
                ) : (
                  <tr key={index}>
                    <td colSpan={columns.length} className="p-4">
                      {JSON.stringify(row)}
                    </td>
                  </tr>
                ),
              )
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                  <TitleText variant="small" className="text-gray-500">
                    No data available.
                  </TitleText>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showPagination && (
          <div className="mt-4 flex items-center justify-between px-4">
            {paginationComponent ? (
              paginationComponent
            ) : (
              <>
                <TitleText variant="small" className="text-gray-600">
                  Showing {startEntry} to {endEntry} of {totalEntries} entries
                </TitleText>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={safeCurrentPage <= 1}
                    className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={safeCurrentPage >= totalPages}
                    className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default Datatable;
