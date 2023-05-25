import { CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
import dailyVibeApi from '../../../apis/dailyVibe.api';
import uploadApi from '../../../apis/upload.api';
import UploadDailyVibeIcon from '../../../assets/images/icons/upload-daily-vibe.svg';
import UploadImageIcon from '../../../assets/images/icons/upload-image.svg';
import DailyVibe from '../../../models/DailyVibe.model';
import Document from '../../../models/Document.model';
import { reasons } from '../../../utils/reasons.util';
import {
  Button,
  Form,
  Modal,
  Progress,
  Select,
  SelectProps,
  Tag,
  Upload,
  message,
} from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { useEffect, useState } from 'react';
import '../../affirmation/Affirmation.style.scss';

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
      <span className='flex items-center text-black font-normal'>{label}</span>
    </Tag>
  );
};

interface CreateDailyVibeModalProps {
  model: string;
  onOpen: boolean;
  onClose?: () => void;
  dailyVibeId?: string;
  onModalOk?: () => void;
  onEditOk?: () => void;
}

enum DocumentType {
  DailyVibeImage = 'dailyVibeImage',
  DailyVibeAudio = 'dailyVibeAudio',
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

function b64toBlob(dataURI: string) {
  const parts = dataURI.split(';base64,');

  const mediaType = parts[0].split(':')[1];

  const byteString = window.atob(parts[1]);

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mediaType });
}

const CreateDailyVibeModal = ({
  onOpen,
  onClose = () => {
    return;
  },
  model,
  dailyVibeId,
  onModalOk = () => {
    return;
  },
  onEditOk = () => {
    return;
  },
}: CreateDailyVibeModalProps) => {
  const [form] = Form.useForm();
  const [dailyVibe, setDailyVibe] = useState<DailyVibe>();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [action, setAction] = useState<Document>();
  const [abortUpload, setAbortUpload] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [progressAudio, setProgressAudio] = useState(0);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [progressImage, setProgressImage] = useState(0);
  const [audio, setAudio] = useState('');
  const [audioInfo, setAudioInfo] = useState('');
  const [image, setImage] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (values: string[]) => {
    setSelectedOptions(values);
  };

  const sortedReasons = reasons.sort((a, b) => a.label.localeCompare(b.label));
  const options: SelectProps['options'] = sortedReasons;

  const handleRequestAudioUrl = async () => {
    console.log('request upload');
    try {
      const response = await uploadApi.requestUpload(
        DocumentType.DailyVibeAudio,
      );
      if (response.data.success) {
        setAction(response.data.data);
      }
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequestImageUrl = async () => {
    console.log('request upload');
    try {
      const response = await uploadApi.requestUpload(
        DocumentType.DailyVibeImage,
      );
      if (response.data.success) {
        setAction(response.data.data);
      }
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const beforeUploadAudio = async (file: RcFile) => {
    const url = await handleRequestAudioUrl();
    form.setFieldValue('audioUrl', url);
    console.log('before upload audio');

    const isAudioCheck = file.type === 'audio/mpeg';
    const audioSize = file.size / 1024 / 1024 < 10;

    if (!isAudioCheck) {
      message.error('You can only upload MP3 file');
    }

    if (!audioSize) {
      message.error('You can only upload less than 10MB');
    }

    if (abortUpload) {
      setAbortUpload(false);
    }
    return isAudioCheck && audioSize;
  };

  const beforeUploadImage = async (file: RcFile) => {
    const url = await handleRequestImageUrl();
    form.setFieldValue('imageUrl', url);
    console.log('before upload image');

    const isImageCheck =
      file.type === 'image/jpg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/svg+xml';
    const imageSize = file.size / 1024 / 1024 < 1;

    if (!isImageCheck) {
      message.error('You can only upload JPG/JPEG/PNG/SVG file');
    }

    if (!imageSize) {
      message.error('You can only upload less than 1MB');
    }

    if (abortUpload) {
      setAbortUpload(false);
    }
    return isImageCheck && imageSize;
  };

  const handleUploadAudio: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (abortUpload === true) {
      info.file.status = 'error';
      setIsLoadingAudio(false);
      setProgressAudio(0);
      setAbortUpload(true);
      return;
    }
    console.log('handle upload audio');
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, url => {
        setAudio(url);
        setAudioInfo(info.file.name);
      });
      setIsLoadingAudio(false);
      setProgressAudio(0);
    } else if (info.file.status === 'error') {
      setIsLoadingAudio(false);
      setProgressAudio(0);
    } else if (abortUpload) {
      setIsLoadingAudio(false);
      setProgressAudio(0);
      setAbortUpload(false);
    } else {
      const percent = info.file.percent;
      if (percent) {
        setProgressAudio(Math.round(percent));
      }
      setIsLoadingAudio(true);
      setAbortUpload(false);
    }
  };

  const handleUploadImage: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (abortUpload === true) {
      info.file.status = 'error';
      setIsLoadingImage(false);
      setProgressImage(0);
      setAbortUpload(true);
      return;
    }
    console.log('handle upload image');
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, url => {
        setImage(url);
      });
      setIsLoadingImage(false);
      setProgressImage(0);
    } else if (info.file.status === 'error') {
      setIsLoadingImage(false);
      setProgressImage(0);
    } else if (abortUpload) {
      setIsLoadingImage(false);
      setProgressImage(0);
      setAbortUpload(false);
    } else {
      const percent = info.file.percent;
      if (percent) {
        setProgressImage(Math.round(percent));
      }
      setIsLoadingImage(true);
      setAbortUpload(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsAdding(true);
      const formDataAudio = new FormData();
      formDataAudio.append('url', form.getFieldValue('audioUrl').uploadUrl);
      formDataAudio.append('file', b64toBlob(audio));

      const formDataImage = new FormData();
      formDataImage.append('url', form.getFieldValue('imageUrl').uploadUrl);
      formDataImage.append('file', b64toBlob(image));

      await uploadApi.upload(formDataAudio);
      await uploadApi.upload(formDataImage);

      const result = {
        audio: form.getFieldValue('audioUrl').destination,
        image: form.getFieldValue('imageUrl').destination,
        audioFileName: audioInfo,
        tags: form.getFieldValue('tags'),
      };
      await dailyVibeApi.createDailyVibe(result);
      message.success('Your new daily vibe has been saved');
      onModalOk();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditDailyVibe = async () => {
    setIsEditing(true);
    const audioUrlField = form.getFieldValue('audioUrl') || dailyVibe?.audio;
    const imageUrlField = form.getFieldValue('imageUrl') || dailyVibe?.image;

    if (typeof imageUrlField !== 'string') {
      const formDataImage = new FormData();
      formDataImage.append('url', imageUrlField.uploadUrl);
      formDataImage.append('file', b64toBlob(image));

      await uploadApi.upload(formDataImage);
    }

    if (typeof audioUrlField !== 'string') {
      const formDataAudio = new FormData();
      formDataAudio.append('url', audioUrlField.uploadUrl);
      formDataAudio.append('file', b64toBlob(audio));

      await uploadApi.upload(formDataAudio);
    }

    const result = {
      audio:
        typeof audioUrlField === 'string'
          ? audioUrlField
          : audioUrlField.destination,
      image:
        typeof imageUrlField === 'string'
          ? imageUrlField
          : imageUrlField.destination,
      audioFileName: audioInfo || dailyVibe?.audioFileName,
      tags: form.getFieldValue('tags'),
    };
    try {
      if (dailyVibeId) {
        setIsEditing(true);
        await dailyVibeApi.editDailyVibe(dailyVibeId, result);
        message.success('This daily vibe has been updated successfully');
      }
      onEditOk();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
    }
  };

  const getDailyVibeDetail = async () => {
    if (dailyVibeId) {
      const response = await dailyVibeApi.getDailyVibe(dailyVibeId);
      if (response.data.success) {
        setDailyVibe(response.data.data);
      }
    }
  };
  useEffect(() => {
    if (onOpen) {
      getDailyVibeDetail();
    }
  }, [onOpen]);

  useEffect(() => {
    form.setFieldsValue(dailyVibe);
  }, [form, dailyVibe]);

  const uploadAudioButton = (
    <>
      <div className='upload-daily-vibe-audio space-x-5'>
        <img
          alt='img'
          src={UploadDailyVibeIcon}
          className='flex justify-center items-center'
        />
        <p className='text-[14px] text-white space-x-3'>
          Drop or browse to{' '}
          <span className='font-bold text-white'>upload audio files</span>
        </p>
      </div>
    </>
  );

  const uploadImageButton = (
    <>
      <div className='upload-file-image space-x-5 space-y-4'>
        <img
          alt='img'
          src={UploadImageIcon}
          className='flex justify-center items-center'
        />
        <p className='text-[14px] text-primary space-x-3 font-normal'>
          Drop or browse to{' '}
          <span className='font-bold text-primary'>upload image files</span>
        </p>
      </div>
    </>
  );

  return (
    <>
      <Modal
        centered
        destroyOnClose
        open={onOpen}
        onOk={onClose}
        onCancel={onClose}
        bodyStyle={{ backgroundColor: '#4D4479' }}
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
            {model === 'edit'
              ? 'Edit Daily Vibe Content'
              : 'Add New Daily Vibe Content'}
          </h2>
        }
        width={1035}
        closeIcon={
          <CloseCircleOutlined className='text-white text-[20px] pb-2' />
        }
        footer={null}
      >
        <Form
          layout='vertical'
          form={form}
          initialValues={{
            ...dailyVibe,
            tags: dailyVibe === undefined ? [] : [dailyVibe?.tags],
          }}
          onReset={onClose}
        >
          <div className='md:flex p-5'>
            <div className='md:shrink-0'>
              <Form.Item>
                <Upload
                  name='imageUrl'
                  onChange={handleUploadImage}
                  maxCount={1}
                  accept='.png, .jpeg, .jpg, .svg'
                  beforeUpload={beforeUploadImage}
                  method='PUT'
                  action={action?.uploadUrl}
                  showUploadList={false}
                  className='cursor-pointer'
                >
                  {isLoadingImage && progressImage ? (
                    <div className='upload-file-image'>
                      <Progress
                        className='w-[200px]'
                        percent={progressImage}
                        size='small'
                        status='active'
                      />
                    </div>
                  ) : (
                    <>
                      {image || dailyVibe ? (
                        <img
                          className='upload-file-image'
                          src={image || dailyVibe?.image}
                          alt='img'
                        />
                      ) : (
                        uploadImageButton
                      )}
                    </>
                  )}
                </Upload>
              </Form.Item>
            </div>
            <div className='pl-10 space-y-5'>
              <Form.Item
                className='text-black text-[16px]'
                label={
                  <p className='text-white'>
                    Audio<span className='text-[#DB555A]'>*</span>
                  </p>
                }
              >
                <Upload
                  name='audioUrl'
                  onChange={handleUploadAudio}
                  maxCount={1}
                  accept='.mp3'
                  beforeUpload={beforeUploadAudio}
                  method='PUT'
                  action={action?.uploadUrl}
                  showUploadList={false}
                  className='cursor-pointer'
                >
                  {isLoadingAudio && progressAudio ? (
                    <div className='upload-daily-vibe-audio'>
                      <Progress
                        className='w-full 2xl:w-[545px] text-white'
                        percent={progressAudio}
                        size='small'
                        status='active'
                      />
                    </div>
                  ) : (
                    <>
                      {audioInfo || dailyVibe ? (
                        <div className='audio-exist space-x-5'>
                          <img
                            alt='img'
                            src={UploadDailyVibeIcon}
                            className='flex justify-center items-center'
                          />
                          <p className='text-[14px] w-[480px] truncate text-white space-x-3'>
                            {audioInfo || dailyVibe?.audioFileName}
                          </p>
                        </div>
                      ) : (
                        uploadAudioButton
                      )}
                    </>
                  )}
                </Upload>
              </Form.Item>
              <div className='flex flex-wrap'>
                <Form.Item
                  className='text-white text-[16px] w-full 2xl:w-[550px]'
                  label={
                    <p className='text-white'>
                      Reasons<span className='text-[#DB555A]'>*</span>
                    </p>
                  }
                  name='tags'
                >
                  <Select
                    allowClear
                    onChange={handleOptionChange}
                    value={selectedOptions}
                    className='max-h-[120px] overflow-auto p-1'
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
              </div>

              {model === 'edit' && !isEditing ? (
                <Button
                  onClick={handleEditDailyVibe}
                  htmlType='submit'
                  className='w-full h-[60px] rounded-[10px] bg-[#8B90C6] border-none'
                  type='primary'
                  disabled={!dailyVibe?.image || !dailyVibe?.audio}
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
                  <Button
                    onClick={handleSubmit}
                    htmlType='submit'
                    className='w-full h-[60px] rounded-[10px] bg-[#8B90C6] border-none'
                    type='primary'
                    disabled={!image || !audio || selectedOptions.length === 0}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                model !== 'edit' && (
                  <div className='flex justify-center'>
                    <Button
                      loading={isAdding}
                      disabled={isAdding}
                      htmlType='submit'
                      className='w-full h-[60px] rounded-[10px] bg-[#8B90C6] border-none'
                      type='primary'
                    >
                      Saving
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default CreateDailyVibeModal;
