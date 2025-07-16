import { Empty, Table } from 'antd';
import './index.css';

type TablePropsType = {
  dataSource: object[];
  columns: object[];
  scroll?: object;
  className?: string;
  showPagination?: boolean;
  total?: number;
  loading?: boolean;
  pageSize?: number;
  current?: number;
  onRow?: any;
  onPaginationChange?: (page: number, pageSize: number) => void;
};

const FSTable = ({
  dataSource,
  onRow,
  columns,
  className = '',
  showPagination = false,
  current,
  scroll,
  pageSize,
  total,
  loading,
  onPaginationChange,
}: TablePropsType) => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      className={`table-wrapper ${className} `}
      scroll={scroll}
      onRow={onRow}
      loading={loading}
      locale={{
        emptyText: <Empty description="No Data" image={Empty.PRESENTED_IMAGE_DEFAULT} />,
      }}
      pagination={
        showPagination
          ? {
              pageSize: pageSize,
              total: total,
              current: current,
              onChange: onPaginationChange,
            }
          : false
      }
    />
  );
};

export default FSTable;
