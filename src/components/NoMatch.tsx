import { Image } from 'antd';
import { Link } from 'react-router-dom';
import NotFound from '../assets/images/icons/not-found.svg';

interface NoMatchProps {
  title: string;
  description: string;
  className: string;
}

const NoMatch = ({ title, description, className }: NoMatchProps) => (
  <div className={className}>
    <h1 className='text-center font-semibold text-primary'>{title}</h1>
    <Image className='w-full h-full' src={NotFound} preview={false} />
    <h3>
      <Link to='/'>{description}</Link>
    </h3>
  </div>
);
export default NoMatch;
