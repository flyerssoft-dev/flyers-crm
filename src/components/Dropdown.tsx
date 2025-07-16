import { Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

type dropdownTypeProps = {
  options?: DefaultOptionType[];
  disabled?: boolean;
  label?: string;
  isLabel?: boolean;
  labelClassName?: string;
  isRequired?: boolean;
  className?: string;
  isIcon?: boolean;
  onChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  allowClear?: true;
  containerClassname?: string;
  loading?: boolean;
};

const FsDropdown = ({
  label,
  isLabel,
  labelClassName,
  className,
  options,
  onChange,
  disabled,
  placeholder,
  isRequired = false,
  defaultValue,
  value,
  allowClear,
  containerClassname = '',
  loading = false,
}: dropdownTypeProps) => (
  <div className={`flex flex-col justify-center gap-2.5 ${containerClassname}`}>
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
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`h-full w-full ${className}`}
      allowClear={allowClear}
      loading={loading}
    >
      {options && options.length ? (
        options.map((value: DefaultOptionType, index: number) => (
          <Select.Option key={index} value={value.value}>
            {value.label}
          </Select.Option>
        ))
      ) : (
        <Select.Option value="no-data" disabled>
          no data
        </Select.Option>
      )}
    </Select>
  </div>
);

export default FsDropdown;
