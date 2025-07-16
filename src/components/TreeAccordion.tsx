import type { TreeProps, TreeDataNode } from 'antd';
import { Tree } from 'antd';

interface treeSelectProps {
  treeData: TreeDataNode[];
  checkable: boolean;
  onCheck: (info: any, checkedKeys: any) => void;
  checkedKeys?: string[];
}

const TreeAccordion = ({ treeData, checkable = false, onCheck, checkedKeys }: treeSelectProps) => {
  const handleOnChange: TreeProps['onCheck'] = (checkedKeys, info) => {
    onCheck(info, checkedKeys);
  };
  return (
    <Tree
      treeData={treeData}
      onCheck={handleOnChange}
      checkable={checkable}
      checkedKeys={checkedKeys}
    />
  );
};

export default TreeAccordion;
