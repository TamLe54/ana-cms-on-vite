import { ExclamationCircleOutlined } from '@ant-design/icons';
import affirmationApi from '../../../apis/affirmation.api';
import Delete from '../../../assets/images/icons/delete.svg';
import Edit from '../../../assets/images/icons/edit.svg';
import Affirmation from '../../../models/Affirmation.model';
import { Card, Image, Modal, Space, Tag, Tooltip, message } from 'antd';
import { useState } from 'react';
import './AffirmationCard.style.scss';
import CreateAffirmationModal from './CreateAffirmationModal.page';

const { confirm } = Modal;
interface AffirmationCardProps {
  onDeleteOk?: () => void;
  onEditOk?: () => void;
  affirmation: Affirmation;
}
const AffirmationCard = ({
  onDeleteOk = () => {
    return;
  },
  onEditOk = () => {
    return;
  },
  affirmation,
}: AffirmationCardProps) => {
  const [openAffirmationDetail, setOpenAffirmationDetail] = useState(false);

  const handleDeleteAffirmation = () => {
    confirm({
      icon: <ExclamationCircleOutlined style={{ color: '#D01616' }} />,
      centered: true,
      maskClosable: true,
      title: (
        <h3 className='font-bold text-primary'>Remove the affirmation?</h3>
      ),
      content: (
        <h4 className='text-black text-base font-normal'>
          Are you sure you want to remove this affirmation?
        </h4>
      ),
      async onOk() {
        await affirmationApi.deleteAffirmation(affirmation.id);
        message.success('This affirmation has been deleted successfully');
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
  const sortedTags = affirmation?.tags.sort((a, b) => a.localeCompare(b));

  const editAffirmation = () => {
    setOpenAffirmationDetail(true);
  };

  const onCloseModal = () => {
    setOpenAffirmationDetail(false);
  };

  return (
    <>
      <Card className='w-full h-full bg-[#E4E4E4] border-none shadow-lg'>
        <section className='pl-1 pb-1'>
          <section className='flex justify-end space-x-2'>
            <Tooltip title='Edit' placement='bottom'>
              <Image
                className='cursor-pointer'
                onClick={editAffirmation}
                src={Edit}
                preview={false}
              />
            </Tooltip>
            <Tooltip title='Delete' placement='bottom'>
              <Image
                className='cursor-pointer'
                onClick={handleDeleteAffirmation}
                src={Delete}
                preview={false}
              />
            </Tooltip>
          </section>
          <p className='text-black font-bold text-[16px]'>Affirmation</p>
          <p className='font-medium text-[14px] text-black pl-4'>
            {affirmation?.statement}
          </p>
          <p className='font-bold text-[16px] text-black'>Reasons</p>
          <div className='max-h-[88px] keep-scrolling'>
            {sortedTags?.map((tag, index) => (
              <Space size={[10, 10]} wrap key={index}>
                <Tag className=' mt-2 text-white rounded-[10px]  font-normal text-sm bg-primary w-fit h-fit p-[7px]'>
                  {tag}
                </Tag>
              </Space>
            ))}
          </div>
        </section>
      </Card>
      <CreateAffirmationModal
        onEditOk={onEditOk}
        model={'edit'}
        onOpen={openAffirmationDetail}
        onClose={onCloseModal}
        affirmationId={affirmation.id}
      />
    </>
  );
};

export default AffirmationCard;
