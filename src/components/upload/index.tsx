import { List, Upload } from 'antd';
import { UploadFile } from 'antd';
import { CloseIcon, FileTypeIcon, UploadIcon } from '@assets/icons';
import './index.css';
import moment from 'moment';
import useAuthStore from '@feature/auth/store/useAuthStore';
import { UploadChangeParam } from 'antd/es/upload';

const { Dragger } = Upload;

type UploadPropsType = {
  accept?: '.xlsx' | '.pdf' | 'jpeg' | 'png' | string;
  disabled?: boolean;
  onChange?: (file: UploadFile) => void;
  onMultipleChange?: (file: UploadFile[]) => void;
  multiple?: boolean;
  className?: string;
  uploadedFile?: any;
  setUploadedFile: (value: any) => void;
};

const FSUpload = ({
  accept,
  disabled = false,
  onChange = () => {},
  multiple = false,
  className = '',
  uploadedFile,
  setUploadedFile,
  onMultipleChange = () => {},
}: UploadPropsType) => {
  const currentDate = moment().format('DD MMM YYYY');

  // To simulate the success file scenario we making dummy success file using below request
  // refer for more https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
  const successRequest = (data: any) => {
    setTimeout(() => {
      data.onSuccess('ok');
    }, 0);
  };

  const handleChange = (event: UploadChangeParam<UploadFile>) => {
    if (multiple) {
      const newFileList = [...event.fileList];
      setUploadedFile(newFileList);
      onMultipleChange(newFileList);
    } else {
      setUploadedFile(event?.file?.name || '');
      onChange(event?.file);
    }
  };

  const { getUserRole } = useAuthStore();

  const handleRemove = (file: UploadFile) => {
    const newFileList = uploadedFile.filter((f: UploadFile) => f.uid !== file.uid);
    setUploadedFile(newFileList);
    onMultipleChange(newFileList);
  };

  return (
    <>
      <Dragger
        className={`upload-wrapper ${className}`}
        disabled={disabled}
        customRequest={successRequest}
        action="/upload.do"
        onChange={handleChange}
        beforeUpload={() => false}
        multiple={multiple}
        fileList={multiple ? uploadedFile : []}
        accept={accept}
      >
        <div className="col justify-center items-center h-150px">
          <UploadIcon />
        </div>
        <p className="text-sm leading-5 font-semibold mt-2.5">
          Drag and drop files <span className="text-grayText">or </span>
          <span className="!text-primary">Browse</span>
        </p>
        {getUserRole() === 'design_team_lead' && (
          <p className="text-sm leading-5 font-normal mt-[10px] text-grayText">
            The leave document file must be a file of: {accept}
          </p>
        )}
        {getUserRole() === 'hr_admin' && (
          <p className="text-sm leading-5 font-normal mt-[10px] text-grayText">
            The photo document file must be a file of: {accept}
          </p>
        )}
      </Dragger>
      {multiple && Array.isArray(uploadedFile) && uploadedFile.length > 0 && (
        <div>
          <p className="mt-6 text-sm leading-5 font-medium text-black">Last uploaded file:</p>
          <List
            dataSource={uploadedFile}
            renderItem={(file: UploadFile) => (
              <List.Item key={file.uid}>
                <div className="w-full p-2.5 bg-graySurface flex items-center justify-between mt-2.5">
                  <div className="flex gap-2 justify-center items-center">
                    <FileTypeIcon />
                    <div>
                      <List.Item.Meta title={<p className="w-max  ">{file.name}</p>} />
                      <p>{currentDate}</p>
                    </div>
                  </div>
                  <div onClick={() => handleRemove(file)} className="cursor-pointer">
                    <CloseIcon width={16} height={16} fill="#F80f0F" />
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
      {!multiple && uploadedFile && (
        <div>
          <p className="mt-6 text-sm leading-5 font-medium text-black">Last uploaded file:</p>

          <div className="w-[400px] p-2.5 bg-graySurface flex items-center justify-between mt-2.5">
            <div className="flex gap-2 justify-center items-center">
              <FileTypeIcon />
              <div>
                <p>{uploadedFile}</p>
                <p>{currentDate}</p>
              </div>
            </div>
            <div
              onClick={() => {
                setUploadedFile(null);
              }}
            >
              <CloseIcon width={16} height={16} fill="#F80f0F" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FSUpload;
