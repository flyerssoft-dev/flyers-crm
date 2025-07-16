import { SearchIcon } from '@assets/icons/index';
import { Input } from 'antd';

type InputPropTypes = {
  label?: string;
  isLabel?: boolean;
  containerclassName?: string;
  labelClassName?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isIcon?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  isRequired?: boolean;
  value?: string;
  name?: string;
  type?: string;
  style?: React.CSSProperties | undefined;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
};

const FsInput = ({
  label,
  isLabel,
  labelClassName,
  className,
  containerclassName,
  disabled = false,
  isIcon,
  placeholder,
  value,
  isRequired = false,
  onChange,
  name,
  type,
  style,
  onKeyDown,
}: InputPropTypes) => {
  return (
    <div className={`flex flex-col justify-center ${containerclassName}`}>
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
      <Input
        size="middle"
        type={type}
        defaultValue={value}
        value={value}
        placeholder={placeholder}
        prefix={isIcon && <SearchIcon width={16} height={16} />}
        className={`${className} `}
        disabled={disabled}
        onChange={onChange}
        name={name}
        style={style}
        prefixCls=""
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

FsInput.Password = Input.Password;

export default FsInput;
