import React, { useState, useMemo } from "react";
import { Drawer, Input, Button, Row, Col } from "antd";
import { CheckCircleFilled, SearchOutlined } from "@ant-design/icons";
import { BsGripVertical } from "react-icons/bs";

export const DisplayedColumns = ({ columns, onSave, onCancel, isOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localColumns, setLocalColumns] = useState(columns);

  const filteredColumns = useMemo(() => {
    return localColumns
      .sort((a, b) => a.order - b.order)
      .filter((column) =>
        column.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [localColumns, searchTerm]);

  const handleToggleColumn = (columnId) => {
    setLocalColumns((prev) =>
      prev.map((col) =>
        col.key === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleSave = () => {
    onSave(localColumns);
  };

  const handleCancel = () => {
    setLocalColumns(columns);
    setSearchTerm("");
    onCancel();
  };

  const handleDragStart = (e, columnId) => {
    e.dataTransfer.setData("text/plain", columnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    const draggedColumnId = e.dataTransfer.getData("text/plain");
    if (draggedColumnId === targetColumnId) return;

    const visibleColumns = localColumns.filter((col) => col.visible && !col.default);
    const draggedIndex = visibleColumns.findIndex(
      (col) => col.id === draggedColumnId
    );
    const targetIndex = visibleColumns.findIndex(
      (col) => col.id === targetColumnId
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    const reorderedVisible = [...visibleColumns];
    const [dragged] = reorderedVisible.splice(draggedIndex, 1);
    reorderedVisible.splice(targetIndex, 0, dragged);

    const newColumns = localColumns.map((col) => {
      if (!col.visible || col.default) return col;
      const updated = reorderedVisible.find((v) => v.id === col.id);
      return updated || col;
    });

    const updatedWithOrder = newColumns.map((col, index) => ({
      ...col,
      order: index,
    }));

    setLocalColumns(updatedWithOrder);
  };

  return (
    <Drawer
      title="Displayed Columns"
      placement="right"
      onClose={handleCancel}
      open={isOpen}
      width={400}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      }
    >
      <div>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <div style={{ overflowY: "auto", paddingRight: 4 }}>
          {filteredColumns.map((column) => (
            <Row
              key={column.id}
              align="middle"
              gutter={8}
              // draggable={column.visible && !column.default}
              // onDragStart={(e) =>
              //   column.visible && !column.default && handleDragStart(e, column.id)
              // }
              // onDragOver={(e) =>
              //   column.visible && !column.default && handleDragOver(e)
              // }
              // onDrop={(e) =>
              //   column.visible && !column.default && handleDrop(e, column.id)
              // }
              style={{
                padding: 10,
                borderRadius: 6,
                cursor: column.default ? "not-allowed" : "pointer",
                marginBottom: 4,
                transition: "background 0.2s",
                backgroundColor: column.default ? "#E8E8E8" : "transparent",
                userSelect: "none",
              }}
            >
              {/* {column.visible && !column.default && (
                <Col>
                  <BsGripVertical style={{ color: "#aaa", fontSize: 16 }} />
                </Col>
              )} */}
              <Col>
                <button
                  onClick={() =>
                    !column.default && handleToggleColumn(column.key)
                  }
                  style={{
                    width: 20,
                    height: 20,
                    border: `2px solid ${column.visible ? "#52c41a" : "#ccc"}`,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: column.visible ? "#52c41a" : "transparent",
                    transition: "0.2s",
                    cursor: column.default ? "not-allowed" : "pointer",
                  }}
                  disabled={column.default}
                >
                  {column.visible && (
                    <CheckCircleFilled
                      style={{ color: "white", fontSize: 12 }}
                    />
                  )}
                </button>
              </Col>
              <Col flex="auto">
                <span style={{ color: "#333" }}>{column.title}</span>
              </Col>
            </Row>
          ))}
        </div>
      </div>
    </Drawer>
  );
};
