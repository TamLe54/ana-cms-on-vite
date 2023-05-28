import { DefaultOptionType } from "antd/es/select";
import AddButton from "./AddButton";
import { Select } from "antd";

interface PageHeaderProps {
  addFunction?: () => void;
  handleChange: (value: string | null) => void;
  options?: DefaultOptionType[];
}

const PageHeader = ({
  addFunction,
  handleChange,
  options,
}: PageHeaderProps) => {
  return (
    <div className="page-header flex flex-col justify-start">
      <div className="flex justify-center">
        <p className="font-bold text-primary text-[40px] m-auto text-center">
          Ana Content Management Dashboard
        </p>
      </div>
      <div className="the_filter flex items-center justify-between pt-2">
        <AddButton onClick={addFunction} />
        <div className="flex flex-row items-center justify-center space-x-4">
          <p className="flex items-center my-auto justify-center font-semibold text-xl text-primary w-fit">
            Filter by
          </p>

          <Select
            className={`border-primary w-[200px] `}
            placeholder="Reasons"
            allowClear
            onChange={(e: string | null) => {
              handleChange(e);
            }}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
