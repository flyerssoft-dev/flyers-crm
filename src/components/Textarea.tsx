import TextArea from 'antd/es/input/TextArea';

type TextareaTypeProps = {
  label: string;
  isLabel: boolean;
  labelClassName?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
  isRequired: boolean;
  value?: string;
  name?: string;
  style?: any;
  maxLength?: number;
  rows?: number;
};

const FsTextarea = ({
  label,
  isLabel,
  labelClassName,
  className,
  disabled = false,
  placeholder,
  isRequired = false,
  onChange,
  value,
  name,
  style,
  maxLength,
  rows,
}: TextareaTypeProps) => {
  return (
    <div className="flex flex-col justify-center gap-2.5">
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
      <TextArea
        size="large"
        placeholder={placeholder}
        className={`rounded-xl w-full ${className} `}
        disabled={disabled}
        onChange={onChange}
        value={value}
        name={name}
        style={style}
        maxLength={maxLength}
        rows={rows}
      />
    </div>
  );
};

export default FsTextarea;
