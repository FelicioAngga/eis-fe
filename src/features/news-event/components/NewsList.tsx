import { PaginationModelProps } from '../../../components/Table';
import { useNewsQuery } from '../../../api-hooks/news/api';
import NewsItem from './NewsItem';
import { Pagination } from 'antd';

interface NewsListProps {
  paginationModel: PaginationModelProps;
  search: string;
}

function NewsList({ paginationModel, search }: NewsListProps) {
  const { data: newsData } = useNewsQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  })
  
  return (
    <div>
      <div className="flex gap-2">
        {newsData?.data.map((item, idx) => <NewsItem key={idx} {...item} />)}
      </div>
      <div className="flex justify-end mt-5">
        <Pagination
          current={paginationModel.pageNumber}
          pageSize={paginationModel.pageSize}
          total={newsData?.total || 0}
          onChange={paginationModel.onChangePageValue}
        />
      </div>
    </div>
  )
}

export default NewsList;