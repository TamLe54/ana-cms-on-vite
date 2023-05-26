import dailyVibeApi from '../../apis/dailyVibe.api';
import NoMatch from '../../components/NoMatch';
import DailyVibe from '../../models/DailyVibe.model';
import { Pagination, SelectProps, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import CreateDailyVibeModal from './component/CreateDailyVibeModal.page';
import DailyVibeCard from './component/DailyVibeCard.page';
import { reasons } from '../../utils/reasons.util';
import PageHeader from '../../components/PageHeader';

const initPagination = {
  page: 1,
  limit: 6,
};
const DailyVibePage = () => {
  const [dailyVibes, setDailyVibes] = useState<DailyVibe[]>([]);
  const [pagination, setPagination] = useState(initPagination);
  const [totalDailyVibe, setTotalDailyVibe] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(1);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleChange = (value: string | null) => {
    setSelectedTag(value);
  };

  // const options = Array.from(new Set(dailyVibes.flatMap((a) => a.tags)));
  const sortedReasons = reasons.sort((a, b) => a.label.localeCompare(b.label));
  const options: SelectProps['options'] = sortedReasons;

  const filteredDailyVibes = selectedTag
    ? dailyVibes.filter((a) => a.tags.includes(selectedTag))
    : dailyVibes;

  const getDailyVibes = async () => {
    try {
      setLoadingData(true);
      const response = await dailyVibeApi.getDailyVibes(
        pagination.page,
        pagination.limit
      );
      if (response.data.success) {
        setDailyVibes(response.data.data.dailyVibes);
        setTotalDailyVibe(response.data.data.totalCount);
      }
    } catch (error) {
      console.error(error);
      setLoadingData(false);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    getDailyVibes();
  }, [pagination]);

  const onChange = (page: number, pageSize: number) => {
    setPagination({ page: page, limit: pageSize });
    setCurrent(page);
  };

  const addNewDailyVibe = () => {
    setIsModalOpen(true);
  };
  const onCancelCreate = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className='flex flex-col h-full'>
        <PageHeader
          addFunction={addNewDailyVibe}
          options={options}
          handleChange={handleChange}
        />
        <div className='grid grid-cols-2 md:grid-cols-1 2xl:grid-cols-2 gap-x-6 gap-y-8 pt-8 pb-8'>
          {dailyVibes.length === 0 ? (
            loadingData ? (
              <Skeleton
                active
                avatar
                title
                paragraph={{ rows: 3, width: '100%' }}
              />
            ) : (
              !dailyVibes && (
                <NoMatch
                  className='absolute w-fit flex flex-col items-center  h-fit justify-center space-y-5 m-auto p-[120px]'
                  title='No daily vibe was uploaded'
                  description=''
                />
              )
            )
          ) : filteredDailyVibes.length === 0 ? (
            <>
              <h2 className='absolute left-1/2 font-semibold text-xl translate-x-[-10%]'>
                No daily vibe match your filter
              </h2>
            </>
          ) : (
            filteredDailyVibes.map((dailyVibe) => {
              return (
                <div key={dailyVibe.id}>
                  {loadingData ? (
                    <Skeleton
                      active
                      avatar
                      title
                      paragraph={{ rows: 3, width: '100%' }}
                    />
                  ) : (
                    <DailyVibeCard
                      onEditOk={() => getDailyVibes()}
                      onDeleteOk={() => getDailyVibes()}
                      key={dailyVibe.id}
                      dailyVibe={dailyVibe}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
        <div className='flex justify-center pb-6'>
          {filteredDailyVibes.length > 0 && (
            <Pagination
              current={current}
              pageSizeOptions={[initPagination.limit, 10, 20, 40]}
              total={totalDailyVibe}
              defaultPageSize={initPagination.limit}
              onChange={onChange}
            />
          )}
        </div>
      </div>
      {isModalOpen && (
        <CreateDailyVibeModal
          onModalOk={() => getDailyVibes()}
          onClose={onCancelCreate}
          onOpen={isModalOpen}
          model={'add'}
        />
      )}
    </>
  );
};

export default DailyVibePage;
