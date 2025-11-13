import React, { useState } from "react";
import "./FilterPanel.scss";
import { FiFilter } from "react-icons/fi";
import { Select } from "antd";
import { useSelector } from "react-redux";

const fieldOptions = [
  "Untouched Records",
  "Touched Records",
  "Notes",
  "Tag",
  "Mobile",
  "Time Zone",
  "Title",
  "Created Time",
  "Created By",
  "Contact Owner",
  "Company Size",
  "Industry",
];

const { Option } = Select;

const FilterPanel = ({ onApply, refreshList }) => {
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [filters, setFilters] = useState([]);

  const userRedux = useSelector((state) => state.userRedux);

  const handleAddFilter = () => {
    if (!selectedField) return;

    // For date range (Created Time), require both from/to
    if (
      selectedField === "Created Time" &&
      (!fieldValue?.from || !fieldValue?.to)
    ) {
      return;
    }

    if (
      (typeof fieldValue === "string" && fieldValue.trim() !== "") ||
      (typeof fieldValue === "object" &&
        fieldValue.from &&
        fieldValue.to)
    ) {
      let fieldKey;

      switch (selectedField) {
        case "Notes":
          fieldKey = "notes";
          break;
        case "Tag":
          fieldKey = "tag";
          break;
        case "Mobile":
          fieldKey = "mobile";
          break;
        case "Time Zone":
          fieldKey = "time_zone";
          break;
        case "Title":
          fieldKey = "title";
          break;
        case "Company Size":
          fieldKey = "company_size";
          break;
        case "Industry":
          fieldKey = "industry";
          break;
        case "Untouched Records":
          fieldKey = "recordType";
          break;
        case "Touched Records":
          fieldKey = "recordType";
          break;
        case "Contact Owner":
          fieldKey = "contact_owner_name";
          break;
        case "Created By":
          fieldKey = "created_by_name";
          break;
        case "Created Time":
          fieldKey = "created_time";
          break;
        default:
          fieldKey = "";
      }

      setFilters((prev) => [
        ...prev,
        { field: fieldKey, value: fieldValue },
      ]);
      setSelectedField("");
      setFieldValue("");
    }
  };

  const handleApply = () => {
    onApply(filters);
    setOpen(false);
  };

  const handleCancel = () => {
    setFilters([]);
    setSelectedField("");
    setFieldValue("");
    setOpen(false);
    refreshList();
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedField(value);
    setFieldValue("");

    // Direct apply for touched/untouched
    if (value === "Touched Records" || value === "Untouched Records") {
      const newFilters = [
        ...filters,
        {
          field: "recordType",
          value: value === "Untouched Records" ? "untouched" : "touched",
        },
      ];
      setFilters(newFilters);
      onApply(newFilters);
      setOpen(false);
    }
  };

  const renderInputForField = () => {
    if (!selectedField) return null;

    switch (selectedField) {
      case "Time Zone":
        return (
          <select
            className="input"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
          >
            <option value="">Select Time Zone</option>
            <option value="EST">Eastern Standard Time (EST)</option>
            <option value="CST">Central Standard Time (CST)</option>
            <option value="MST">Mountain Standard Time (MST)</option>
            <option value="PST">Pacific Standard Time (PST)</option>
            <option value="GST">Gulf Standard Time (GST)</option>
            <option value="SGT">Singapore Standard Time (SGT)</option>
          </select>
        );

      case "Contact Owner":
      case "Created By":
        return (
          <Select
            placeholder={`Select ${selectedField}`}
            onChange={(e) => setFieldValue(e)}
          >
            {userRedux?.userDetails?.message?.map((user) => (
              <Option key={user.id} value={user.display_name}>
                {user.display_name}
              </Option>
            ))}
          </Select>
        );

      case "Company Size":
        return (
          <select
            className="input"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
          >
            <option value="">Select Company Size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1001-5000">1001-5000 employees</option>
            <option value="5001-10000">5001-10000 employees</option>
            <option value="10000+">10000+ employees</option>
          </select>
        );

      case "Created Time":
        const from = fieldValue?.from || "";
        const to = fieldValue?.to || "";
        return (
          <div className="date-range">
            <input
              type="date"
              className="input"
              value={from}
              onChange={(e) =>
                setFieldValue({ ...fieldValue, from: e.target.value })
              }
            />
            <span className="separator">to</span>
            <input
              type="date"
              className="input"
              value={to}
              onChange={(e) =>
                setFieldValue({ ...fieldValue, to: e.target.value })
              }
            />
          </div>
        );

      default:
        return (
          <input
            className="input"
            type="text"
            placeholder={`Enter ${selectedField}`}
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
          />
        );
    }
  };

  const isAddButtonDisabled =
    selectedField === "Created Time"
      ? !fieldValue?.from || !fieldValue?.to
      : !fieldValue;

  return (
    <div className="dynamic-filter-container">
      <button className="filter-icon-btn" onClick={() => setOpen(!open)}>
        <FiFilter size={20} />
      </button>

      {open && (
        <div className="filter-panel">
          <div className="filter-header">
            <h3>Filter Sales Pipeline</h3>
            <button className="close-btn" onClick={handleCancel}>
              ✕
            </button>
          </div>

          <div className="filter-body">
            <div className="filter-group">
              <label>Choose a Property</label>
              <select
                className="input"
                value={selectedField}
                onChange={handleSelectChange}
              >
                <option value="">Choose a Property</option>
                {fieldOptions.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            {/* Skip value input for touched/untouched */}
            {selectedField &&
              selectedField !== "Touched Records" &&
              selectedField !== "Untouched Records" && (
                <>
                  <div className="filter-group">
                    <label>Enter Value</label>
                    {renderInputForField()}
                  </div>

                  <button
                    className="add-filter-btn"
                    disabled={isAddButtonDisabled}
                    onClick={handleAddFilter}
                  >
                    + Add Filter
                  </button>
                </>
              )}

            {filters.length > 0 && (
              <div className="applied-filters">
                <h4>Applied Filters</h4>
                {filters.map((f, idx) => (
                  <div className="filter-chip" key={idx}>
                    <span>
                      {f.field}:{" "}
                      {typeof f.value === "object"
                        ? `${f.value.from} → ${f.value.to}`
                        : f.value}
                    </span>
                    <button
                      onClick={() =>
                        setFilters(filters.filter((_, i) => i !== idx))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="filter-footer">
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className="apply-btn"
              disabled={filters.length === 0}
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
