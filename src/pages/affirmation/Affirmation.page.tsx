import affirmationApi from '../../apis/affirmation.api';
import Affirmation from '../../models/Affirmation.model';
import { Pagination, SelectProps, Skeleton } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import AffirmationCard from './component/AffirmationCard.page';
import CreateAffirmationModal from './component/CreateAffirmationModal.page';
import './Affirmation.style.scss';
import NoMatch from '../../components/NoMatch';
import { reasons } from '../../utils/reasons.util';

import PageHeader from '../../components/PageHeader';

const initPagination = {
  page: 1,
  limit: 6,
};
const AffirmationPage = () => {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [pagination, setPagination] = useState(initPagination);
  const [totalAffirmation, setTotalAffirmation] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(1);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filteredAffirmations, setFilteredAffirmations] = useState<
    Affirmation[]
  >([]);

  const handleChange = (value: string | null) => {
    setSelectedTag(value);
    setPagination({ ...pagination, page: 1 });
    setCurrent(1);
  };

  // const options = Array.from(new Set(affirmations.flatMap((a) => a.tags)));
  const sortedReasons = reasons.sort((a, b) => a.label.localeCompare(b.label));
  const options: SelectProps['options'] = sortedReasons;

  const getAffirmations = useCallback(async () => {
    try {
      setLoadingData(true);
      const response = await affirmationApi.getAffirmations(
        pagination.page,
        pagination.limit
      );
      if (response.data.success) {
        console;
        setAffirmations(response.data.data.affirmations);
        setTotalAffirmation(response.data.data.totalCount);
      }
    } catch (error) {
      console.error(error);
      setLoadingData(false);
    } finally {
      setLoadingData(false);
    }
  }, [pagination]);

  useEffect(() => {
    const newFilteredAffirmations = selectedTag
      ? affirmations.filter((a) => a.tags.includes(selectedTag))
      : affirmations;
    setFilteredAffirmations(newFilteredAffirmations);
  }, [selectedTag, affirmations]);

  useEffect(() => {
    getAffirmations();
  }, [pagination, selectedTag, getAffirmations]);

  const onChange = (page: number, pageSize: number) => {
    setPagination({ page: page, limit: pageSize });
    setCurrent(page);
  };

  const addNewAffirmation = () => {
    setIsModalOpen(true);
  };

  const onCancelCreate = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className='flex flex-col h-full'>
        <PageHeader
          addFunction={addNewAffirmation}
          handleChange={handleChange}
          options={options}
        />
        <div className='page-container grid grid-cols-3 gap-x-6 gap-y-8 pt-8 pb-8'>
          {affirmations.length === 0 ? (
            loadingData ? (
              <Skeleton
                active
                avatar
                title
                paragraph={{ rows: 3, width: '100%' }}
              />
            ) : (
              !affirmations && (
                <NoMatch
                  className='absolute w-fit flex flex-col items-center  h-fit justify-center space-y-5 m-auto p-[120px]'
                  title='No affirmation was uploaded'
                  description=''
                />
              )
            )
          ) : filteredAffirmations.length === 0 ? (
            <>
              <h2 className='absolute left-1/2 font-semibold text-xl translate-x-[-10%]'>
                No affirmation match your filter
              </h2>
            </>
          ) : (
            filteredAffirmations.map((affirmation) => {
              return (
                <div key={affirmation.id}>
                  {loadingData ? (
                    <Skeleton
                      active
                      title
                      paragraph={{ rows: 3, width: '100%' }}
                    />
                  ) : (
                    <AffirmationCard
                      onEditOk={() => getAffirmations()}
                      onDeleteOk={() => getAffirmations()}
                      key={affirmation.id}
                      affirmation={affirmation}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
        <div className='page-pagination flex justify-center pb-6 '>
          {filteredAffirmations.length > 0 && (
            <Pagination
              current={current}
              total={totalAffirmation}
              defaultPageSize={initPagination.limit}
              onChange={onChange}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <CreateAffirmationModal
          onModalOk={() => getAffirmations()}
          onClose={onCancelCreate}
          onOpen={isModalOpen}
          model={'add'}
        />
      )}
    </>
  );
};

export default AffirmationPage;
