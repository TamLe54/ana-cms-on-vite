import { ExclamationCircleOutlined } from '@ant-design/icons';
import dailyVibeApi from '../../../apis/dailyVibe.api';
import Delete from '../../../assets/images/icons/delete.svg';
import Edit from '../../../assets/images/icons/edit.svg';
import DailyVibe from '../../../models/DailyVibe.model';
import '../../../pages/affirmation/component/AffirmationCard.style.scss';
import { Card, Image, Modal, Tag, Tooltip, message } from 'antd';
import { useState } from 'react';
import CreateDailyVibeModal from './CreateDailyVibeModal.page';

const { confirm } = Modal;
interface DailyVibeCardProps {
  onDeleteOk?: () => void;
  onEditOk?: () => void;
  dailyVibe: DailyVibe;
}
const DailyVibeCard = ({
  onDeleteOk = () => {
    return;
  },
  onEditOk = () => {
    return;
  },
  dailyVibe,
}: DailyVibeCardProps) => {
  const [openDailyVibeDetail, setOpenDailyVibeDetail] = useState(false);

  const handleDeleteDailyVibe = () => {
    confirm({
      icon: <ExclamationCircleOutlined style={{ color: '#D01616' }} />,
      centered: true,
      maskClosable: true,
      title: <h3 className='font-bold text-primary'>Remove the daily vibe?</h3>,
      content: (
        <h4 className='text-black text-base font-normal'>
          Are you sure you want to remove this daily vibe?
        </h4>
      ),
      async onOk() {
        await dailyVibeApi.deleteDailyVibe(dailyVibe.id);
        message.success('This daily vibe has been deleted successfully');
        onDeleteOk();
      },
      onCancel() {
        return;
      },
      bodyStyle: {
        background: 'white',
        borderRadius: 10,
      },
      width: 502,
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: {
        style: {
          borderRadius: 4,
          width: 90,
          height: 40,
        },
      },
      cancelButtonProps: {
        style: {
          borderRadius: 4,
          width: 90,
          height: 40,
          borderColor: '#4D4479',
          color: '#4D4479',
        },
      },
      autoFocusButton: null,
    });
  };
  const sortedTags = dailyVibe?.tags.sort((a, b) => a.localeCompare(b));
  //const splitAudioName = dailyVibe?.audio.split("/");

  const editDailyVibe = () => {
    setOpenDailyVibeDetail(true);
  };

  const onCloseModal = () => {
    setOpenDailyVibeDetail(false);
  };

  return (
    <>
      <Card className='w-full h-full bg-[#E4E4E4] border-none shadow-lg'>
        <section className='flex justify-end space-x-2'>
          <Tooltip title='Edit' placement='bottom'>
            <Image
              className='cursor-pointer'
              onClick={editDailyVibe}
              src={Edit}
              preview={false}
            />
          </Tooltip>
          <Tooltip title='Delete' placement='bottom'>
            <Image
              className='cursor-pointer'
              onClick={handleDeleteDailyVibe}
              src={Delete}
              preview={false}
            />
          </Tooltip>
        </section>
        <div className='flex  justify-center'>
          <div className='w-[auto] max-w-[40%] h-[auto]'>
            <Image
              height={"100%"}
              width={"auto"}
              src={dailyVibe?.image}
              alt='dailyVibe'
            />
          </div>
          <div className='pl-10 space-y-5'>
            <div className='tracking-wide text-base text-primary font-bold'>
              {dailyVibe?.audioFileName}
            </div>
            <div className='flex flex-wrap max-h-[88px] keep-scrolling leading-tight'>
              {sortedTags?.map((tag, index) => (
                <div className='mt-2' key={index}>
                  <Tag className='text-white rounded-[10px] cursor-default font-normal text-sm bg-primary p-[7px]'>
                    {tag}
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <CreateDailyVibeModal
        onEditOk={onEditOk}
        model={'edit'}
        onOpen={openDailyVibeDetail}
        onClose={onCloseModal}
        dailyVibeId={dailyVibe?.id}
      />
    </>
  );
};

export default DailyVibeCard;
