
import { Group, Loader } from "@mantine/core";
import { Pagination, Table, TablePaginationConfig } from "antd";
import { ColumnsType, ColumnType, FilterValue, SorterResult, TableCurrentDataSource } from "antd/lib/table/interface";
import { CSSProperties, useEffect, useState } from "react";

export type TableParams = {
    pagination?: TablePaginationConfig | undefined; //pagination config
    sorter?: SorterResult<any> | SorterResult<any>[] | undefined; //sorter
};

type TableProps = {
    columns: ColumnType<any>[] | undefined; // the columns of the table
    loading: boolean; // whether the table is loading (default: false)
    data: any[]; // the data of the table
    totalCount: number; // the total count of the table data

    onTableChange?: (tableParams: TableParams) => void; // the function to call when we use table filters, pagination, etc
    onRowClick?: (record: Record<string, any>) => void; // the function to call when we click on a row
    styles?: CSSProperties | undefined; // the styles to apply to the table
    pageSize?: number; // the page size of the table (defaults to 10) if not provided
};
//if there is nothing to delete, pur deleteUrl = ''

export default function NTable({
    styles,

    onTableChange = () => { },
    data = [],
    onRowClick,
    loading = false,
    totalCount: total_count,
    columns = [],
    pageSize = 10,
}: TableProps) {
    const [pagination, setPagination] = useState<TablePaginationConfig | undefined>({
        current: 1,
        pageSize: pageSize,
        total: 0,
    });

    useEffect(() => {
        onTableChange?.({ pagination });
    }, []);

    //this function throws limit, offset,
    //and sort and filters from ant icons if there
    const handleTableChange = (
        pagination?: TablePaginationConfig,
        filters?: Record<string, FilterValue | null>,
        sorter?: SorterResult<any> | SorterResult<any>[],
        extra?: TableCurrentDataSource<any>
    ) => {
        onTableChange?.({
            pagination,
            sorter,
        });
        setPagination(pagination);
    };


    return (
        <>
            <Table
                size="large"
                rowKey="rootfi_id"
                style={{
                    color: "#9A9A9A",
                    width: "100%",
                    maxHeight: "100px",

                    ...styles,

                }}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: () => {
                            onRowClick?.(record);
                        }
                    };
                }}
                loading={loading}
                scroll={{ x: "max-content" }}
                columns={columns} //filtering columns which includes only changed values array
                dataSource={data}
                pagination={{
                    pageSize: pagination?.pageSize ?? 10,
                    current: pagination?.current ?? 1,
                    total: pagination?.total ?? 0,
                    style: { padding: "24px" },
                    className: "pagination",
                    hideOnSinglePage: true,
                }}
                // loading={loading ? { indicator: <Loader size="lg" /> } : false}
                onChange={handleTableChange}
            />
        </>
    );
}
