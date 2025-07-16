import { Select } from 'antd';

interface OptionTypes {
  value: string;
  label: string;
}

type dropdownTypeProps = {
  options: OptionTypes[];
  disabled?: boolean;
  label: string;
  isLabel: boolean;
  labelClassName?: string;
  isRequired: boolean;
  className?: string;
  isIcon?: boolean;
  defaultValue?: string;
  onChange?: () => void;
};

const FsDropdownSearch = ({
  label,
  isLabel,
  labelClassName,
  className,
  onChange,
  disabled,
  isRequired = false,
  options,
  defaultValue,
}: dropdownTypeProps) => (
  <div className="flex flex-col gap-1">
    <div className="flex gap-1">
      <span
        className={
          isLabel ? `text-sm font-medium leading-5 text-black ${labelClassName}` : 'hidden'
        }
      >
        {label}
      </span>
      {isLabel && isRequired && <span className="text-red">*</span>}
    </div>
    <Select
      mode="multiple"
      defaultValue={defaultValue}
      onChange={onChange}
      disabled={disabled}
      className={`h-full w-full ${className} searchDropdown `}
      showSearch
      style={{ width: '100%' }}
      placeholder="Search to Select"
      optionFilterProp="label"
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
      }
      options={options}
    />
  </div>
);

export default FsDropdownSearch;
