import { PlusCircleOutlined } from '@ant-design/icons';

interface AddButtonProps {
  onClick?: () => void;
}

const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <>
      <button
        className='hover:cursor-pointer rounded-[10px] pr-4 bg-primary text-white hover:bg-[#5f52a0] focus:bg-primary focus:text-white hover:text-white border-none w-[120px] h-[40px]'
        onClick={onClick}
      >
        <div className='flex items-center w-full'>
          <p className='m-auto'>Add new</p>
          <PlusCircleOutlined className='border-none text-[20px] text-white' />
        </div>
      </button>
    </>
  );
};

export default AddButton;
