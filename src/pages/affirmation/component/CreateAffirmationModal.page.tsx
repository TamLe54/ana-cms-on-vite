import { CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
import affirmationApi from '../../../apis/affirmation.api';
import { reasons } from '../../../utils/reasons.util';
import { SelectProps, Tag, message } from 'antd';
import { Button, Form, Input, Modal, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

import Affirmation from '../../../models/Affirmation.model';
import '../Affirmation.style.scss';

const tagRender = (props: CustomTagProps) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      className='flex m-[6px] rounded-[5px] h-[30px] border-[#F0F0F0] border-solid border-[1px] items-center justify-center'
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
    >
      <span className='flex items-center justify-center text-black font-normal'>
        {label}
      </span>
    </Tag>
  );
};

interface CreateAffirmationModalProps {
  model: string;
  onOpen: boolean;
  onClose?: () => void;
  affirmationId?: string;
  onModalOk?: () => void;
  onEditOk?: () => void;
}

const CreateAffirmationModal = ({
  onOpen,
  onClose = () => {
    return;
  },
  model,
  affirmationId,
  onModalOk = () => {
    return;
  },
  onEditOk = () => {
    return;
  },
}: CreateAffirmationModalProps) => {
  const [form] = Form.useForm();
  const [affirmation, setAffirmation] = useState<Affirmation>();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const sortedReasons = reasons.sort((a, b) => a.label.localeCompare(b.label));
  const options: SelectProps['options'] = sortedReasons;

  const handleSubmit = async () => {
    try {
      setIsAdding(true);
      const result = {
        statement: form.getFieldValue('statement').trim(),
        tags: form.getFieldValue('tags'),
      };
      await affirmationApi.createAffirmation(result);
      message.success('Your new affirmation has been saved');
      onModalOk();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditAffirmation = async () => {
    if (affirmationId) {
      setIsEditing(true);
      const result = {
        statement: form.getFieldValue('statement').trim(),
        tags: form.getFieldValue('tags'),
      };
      try {
        await affirmationApi.editAffirmation(affirmationId, result);
        message.success('This affirmation has been updated successfully');
        onEditOk();
        onClose();
      } catch (error) {
        console.log(error);
      } finally {
        setIsEditing(false);
      }
    }
  };

  const getAffirmationDetail = useCallback(async () => {
    if (affirmationId) {
      const response = await affirmationApi.getAffirmation(affirmationId);
      if (response.data.success) {
        setAffirmation(response.data.data);
      }
    }
  }, [affirmationId]);
  useEffect(() => {
    if (onOpen) {
      getAffirmationDetail();
    }
  }, [onOpen, getAffirmationDetail]);

  useEffect(() => {
    form.setFieldsValue(affirmation);
  }, [form, affirmation]);

  return (
    <>
      <Modal
        centered
        destroyOnClose
        open={onOpen}
        onOk={onClose}
        onCancel={onClose}
        style={{ backgroundColor: '#4D4479' }}
        title={
          <h2
            style={{
              fontWeight: 700,
              fontSize: 32,
              color: 'white',
              textAlign: 'center',
              marginTop: 40,
            }}
          >
            {model === 'edit' ? 'Edit Affirmation' : 'Add Affirmation'}
          </h2>
        }
        width={728}
        closeIcon={
          <CloseCircleOutlined className='text-white text-[20px] pb-2' />
        }
        footer={null}
      >
        <div className='flex flex-col p-10'>
          <Form
            layout='vertical'
            form={form}
            initialValues={{
              ...affirmation,
              tags: affirmation === undefined ? [] : [affirmation?.tags],
            }}
            onReset={onClose}
          >
            <Form.Item
              className='text-black text-[16px]'
              label={<p className='text-white'>Affirmation*</p>}
              name='statement'
            >
              <Input
                className='font-normal text-base items-center'
                placeholder='Your affirmation'
                maxLength={50}
                showCount
              />
            </Form.Item>

            <Form.Item
              className='text-white text-[16px]'
              label={<p className='text-white'>Reasons*</p>}
              name='tags'
            >
              <Select
                allowClear
                className='max-h-[120px] overflow-auto'
                mode='multiple'
                placeholder='Please select reasons'
                options={options}
                tagRender={tagRender}
                dropdownStyle={{
                  borderRadius: 10,
                }}
                suffixIcon={<DownOutlined />}
              />
            </Form.Item>
          </Form>
          {model === 'edit' && !isEditing ? (
            <Button
              onClick={handleEditAffirmation}
              htmlType='submit'
              className='w-full h-[60px] rounded-[10px] bg-[#8B90C6] border-none'
              type='primary'
            >
              Save
            </Button>
          ) : (
            model === 'edit' && (
              <Button
                loading={isEditing}
                disabled={isEditing}
                htmlType='submit'
                className='w-full h-[60px] rounded-[10px] bg-[#8B90C6] border-none'
                type='primary'
              >
                Saving
              </Button>
            )
          )}
          {model !== 'edit' && !isAdding ? (
            <div className='flex justify-center'>
              <button
                onClick={handleSubmit}
                type='submit'
                className='w-full h-[60px] rounded-[10px] bg-[#8B90C6] border-none text-xl hover:bg-[#6f72ac] text-white hover:cursor-pointer'
              >
                Save
              </button>
            </div>
          ) : (
            model !== 'edit' && (
              <div className='flex justify-center'>
                <Button
                  loading={isAdding}
                  disabled={isAdding}
                  htmlType='submit'
                  className='w-full h-[60px] rounded-[10px] bg-[#8B90C6] border-none text-xl'
                  type='primary'
                >
                  Saving
                </Button>
              </div>
            )
          )}
        </div>
      </Modal>
    </>
  );
};

export default CreateAffirmationModal;
