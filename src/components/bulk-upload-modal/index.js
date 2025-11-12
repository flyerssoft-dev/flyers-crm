import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Drawer, Button, Tooltip } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { BsFileSpreadsheet } from "react-icons/bs";
import styles from "./ExcelUploader.module.scss";

const ExcelUploader = ({
  requiredFields,
  formFields,
  onDataSubmit,
  open,
  onClose,
  validationRules = {},
}) => {
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [columnMapping, setColumnMapping] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [mappedData, setMappedData] = useState([]);
  const fileInputRef = useRef(null);

  // --- Drag & Drop ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e?.dataTransfer?.files && e?.dataTransfer?.files[0]) {
      handleFileUpload(e?.dataTransfer?.files[0]);
    }
  };

  // --- File Input ---
  const handleFileChange = (e) => {
    if (e?.target?.files && e?.target?.files[0]) {
      handleFileUpload(e?.target?.files[0]);
    }
  };

  // --- Core Upload Logic ---
  const handleFileUpload = async (uploadedFile) => {
    if (!uploadedFile.name.match(/\.(xlsx|xls)$/)) {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    setIsLoading(true);
    setFile(uploadedFile);

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert everything to text values
      const rawData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
      });

      if (rawData.length > 0) {
        const headers = rawData[0].map((h) =>
          h != null ? String(h).trim() : ""
        );
        const rows = rawData.slice(1).map((row) =>
          row.map((cell) => (cell != null ? String(cell).trim() : ""))
        );

        setExcelData({ headers, rows });

        // Auto-map headers to form fields
        const autoMapping = {};
        formFields.forEach((field) => {
          const match = headers.find(
            (header) =>
              typeof header === "string" &&
              (header.toLowerCase().includes(field.toLowerCase()) ||
                field.toLowerCase().includes(header.toLowerCase()))
          );
          if (match) autoMapping[field] = match;
        });
        setColumnMapping(autoMapping);

        const { mappedRows, errors } =
          generateMappedDataWithMapping(autoMapping);
        setMappedData(mappedRows);
        setValidationErrors(errors);
      }
    } catch (error) {
      console.error("Error reading Excel file:", error);
      alert("Error reading Excel file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Mapping + Validation ---
  const handleMappingChange = (field, selectedHeader) => {
    const updatedMapping = {
      ...columnMapping,
      [field]: selectedHeader,
    };
    setColumnMapping(updatedMapping);

    const { mappedRows, errors } = generateMappedDataWithMapping(updatedMapping);
    setMappedData(mappedRows);
    setValidationErrors(errors);
  };

  const generateMappedDataWithMapping = (mapping) => {
    if (!excelData) return { mappedRows: [], errors: [] };

    const errors = [];
    const mappedRows = excelData.rows.map((row, rowIndex) => {
      const mappedRow = {};
      Object.entries(mapping).forEach(([field, selectedHeader]) => {
        const headerIndex = excelData.headers.indexOf(selectedHeader);
        if (headerIndex !== -1) {
          const value = row[headerIndex];
          mappedRow[field] = value;

          if (value && validationRules[field] && !validationRules[field](value)) {
            errors.push({ row: rowIndex, field, value });
          }
        }
      });
      return mappedRow;
    });

    return { mappedRows, errors };
  };

  // --- Submit ---
  const handleSubmit = () => {
    const { mappedRows, errors } = generateMappedDataWithMapping(columnMapping);

    const invalidRowIndexes = new Set(errors.map((err) => err.row));

    const validRows = mappedRows.filter((row, index) => {
      if (invalidRowIndexes.has(index)) return false;
      const isEmpty = Object.values(row).every(
        (val) => val === null || val === undefined || val === ""
      );
      return !isEmpty;
    });

    setValidationErrors(errors);
    setMappedData(validRows);

    const skippedCount = mappedRows.length - validRows.length;

    if (skippedCount > 0) {
      alert(
        `${skippedCount} row(s) were skipped due to validation errors or being empty.\n${validRows.length} valid row(s) imported successfully.`
      );
    } else {
      alert(`All ${validRows.length} rows imported successfully.`);
    }

    onDataSubmit(validRows);
    onClose?.();
    resetUpload();
  };

  // --- UI Helpers ---
  const togglePreview = () => {
    const { mappedRows, errors } = generateMappedDataWithMapping(columnMapping);
    setMappedData(mappedRows);
    setValidationErrors(errors);
    setShowPreview((prev) => !prev);
  };

  const isAllFieldsMapped = () =>
    requiredFields.every((field) => columnMapping[field]);

  const resetUpload = () => {
    setFile(null);
    setExcelData(null);
    setColumnMapping({});
    setMappedData([]);
    setValidationErrors([]);
    setShowPreview(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getErrorMap = () => {
    const map = {};
    validationErrors.forEach((err) => {
      map[`${err.row}-${err.field}`] = true;
    });
    return map;
  };

  const hasFieldError = (field) =>
    validationErrors.some((err) => err.field === field);

  const errorMap = getErrorMap();

  // --- Render ---
  return (
    <Drawer
      title="Excel Data Importer"
      open={open}
      onClose={onClose}
      width={720}
      destroyOnClose
    >
      <div className={styles.drawerContent}>
        <p className={styles.subHeader}>
          Upload your Excel file and map columns to our required fields
        </p>

        {!file ? (
          <div
            className={`${styles.uploadArea} ${
              dragActive ? styles.dragActive : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <div className={styles.uploadContent}>
              <div className={styles.iconWrapper}>
                <UploadOutlined />
              </div>
              <div className={styles.uploadText}>
                <h3>Drop your Excel file here</h3>
                <p>or click to browse</p>
              </div>
              <p className={styles.supportText}>
                Supports .xlsx and .xls files
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.fileInfo}>
              <div className={styles.fileDetails}>
                <BsFileSpreadsheet />
                <div>
                  <p className={styles.fileName}>{file.name}</p>
                  <p className={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button onClick={resetUpload} className={styles.removeButton}>
                Remove
              </button>
            </div>

            {isLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <span>Processing Excel file...</span>
              </div>
            ) : excelData ? (
              <>
                <div className={styles.mappingSection}>
                  <div className={styles.sectionHeader}>
                    <h3>Map Your Columns</h3>
                  </div>
                  <div className={styles.mappingGrid}>
                    {formFields.map((field) => (
                      <div key={field} className={styles.fieldGroup}>
                        <label>
                          {field}
                          {requiredFields.includes(field) && (
                            <span className={styles.required}>*</span>
                          )}
                        </label>
                        <Tooltip
                          title={
                            hasFieldError(field)
                              ? `Some data in the ${field} column is invalid`
                              : ""
                          }
                        >
                          <select
                            value={columnMapping[field] || ""}
                            onChange={(e) =>
                              handleMappingChange(field, e.target.value)
                            }
                            className={
                              hasFieldError(field) ? styles.selectError : ""
                            }
                          >
                            <option value="">Select column...</option>
                            {excelData.headers.map((header, idx) => (
                              <option key={idx} value={header}>
                                {header || "(Empty Header)"}
                              </option>
                            ))}
                          </select>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.mappingStatus}>
                  <div className={styles.statusIndicator}>
                    <div
                      className={`${styles.statusDot} ${
                        isAllFieldsMapped() ? styles.complete : styles.partial
                      }`}
                    />
                    <span>
                      {Object.keys(columnMapping).length} of {formFields.length}{" "}
                      fields mapped
                    </span>
                  </div>
                  {isAllFieldsMapped() && (
                    <div className={styles.readyIndicator}>
                      <span>Ready to import</span>
                    </div>
                  )}
                </div>

                <div className={styles.previewSection}>
                  <div className={styles.previewHeader}>
                    <h3>Data Preview</h3>
                    <button
                      onClick={togglePreview}
                      className={styles.toggleButton}
                    >
                      <span>{showPreview ? "Hide" : "Show"} Preview</span>
                    </button>
                  </div>

                  {showPreview && (
                    <div className={styles.tableContainer}>
                      <div className={styles.tableWrapper}>
                        <table>
                          <thead>
                            <tr>
                              {formFields.map((field) => (
                                <th key={field}>{field}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {mappedData.map((row, index) => (
                              <tr key={index}>
                                {formFields.map((field) => (
                                  <td
                                    key={field}
                                    className={
                                      errorMap[`${index}-${field}`]
                                        ? styles.errorCell
                                        : ""
                                    }
                                  >
                                    {row[field] || "-"}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {excelData.rows.length > 5 && (
                        <div className={styles.tableFooter}>
                          Showing first {excelData.rows.length}  rows of {excelData.rows.length} total
                          rows
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {validationErrors.length > 0 && (
                  <div className={styles.validationErrors}>
                    <h4>Validation Errors</h4>
                    <ul>
                      {validationErrors.map((err, idx) => (
                        <li key={idx}>
                          Row {err.row + 1}: Invalid{" "}
                          <strong>{err.field}</strong> – <em>{err.value}</em>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.submitSection}>
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    disabled={!isAllFieldsMapped()}
                  >
                    Import Data ({excelData.rows.length} rows)
                  </Button>
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </Drawer>
  );
};

export default ExcelUploader;
