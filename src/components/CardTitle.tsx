type Props = {
  title: string;
  subTitle?: string;
};

const CardTitle = ({ title, subTitle }: Props) => {
  return (
    <div className="py-2 flex justify-between flex-wrap">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-base">{subTitle}</div>
    </div>
  );
};

export default CardTitle;
