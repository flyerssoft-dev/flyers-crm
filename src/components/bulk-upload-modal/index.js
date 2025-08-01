import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Drawer, Button } from "antd";
import styles from "./ExcelUploader.module.scss";
import { UploadOutlined } from "@ant-design/icons";
import { BsFileSpreadsheet } from "react-icons/bs";

const ExcelUploader = ({
  requiredFields,
  formFields,
  onDataSubmit,
  open,
  onClose,
}) => {
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [columnMapping, setColumnMapping] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

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

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (jsonData.length > 0) {
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        setExcelData({ headers, rows });

        const autoMapping = {};
        formFields.forEach((field) => {
          const match = headers.find(
            (header) =>
              header.toLowerCase().includes(field.toLowerCase()) ||
              field.toLowerCase().includes(header.toLowerCase())
          );
          if (match) autoMapping[field] = match;
        });
        setColumnMapping(autoMapping);
      }
    } catch (error) {
      console.error("Error reading Excel file:", error);
      alert("Error reading Excel file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingChange = (field, selectedHeader) => {
    setColumnMapping((prev) => ({
      ...prev,
      [field]: selectedHeader,
    }));
  };

  const getMappedData = () => {
    if (!excelData) return [];
    return excelData.rows.map((row) => {
      const mappedRow = {};
      Object.entries(columnMapping).forEach(([field, selectedHeader]) => {
        const headerIndex = excelData.headers.indexOf(selectedHeader);
        if (headerIndex !== -1) {
          mappedRow[field] = row[headerIndex];
        }
      });
      return mappedRow;
    });
  };

  const handleSubmit = () => {
    const mappedData = getMappedData();
    onDataSubmit(mappedData);
    onClose?.();
    resetUpload();
  };

  const isAllFieldsMapped = () =>
    requiredFields.every((field) => columnMapping[field]);

  const resetUpload = () => {
    setFile(null);
    setExcelData(null);
    setColumnMapping({});
    setShowPreview(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
                        <select
                          value={columnMapping[field] || ""}
                          onChange={(e) =>
                            handleMappingChange(field, e.target.value)
                          }
                        >
                          <option value="">Select column...</option>
                          {excelData.headers.map((header) => (
                            <option key={header} value={header}>
                              {header}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className={styles.mappingStatus}>
                    <div className={styles.statusIndicator}>
                      <div
                        className={`${styles.statusDot} ${
                          isAllFieldsMapped() ? styles.complete : styles.partial
                        }`}
                      />
                      <span>
                        {Object.keys(columnMapping).length} of{" "}
                        {formFields.length} fields mapped
                      </span>
                    </div>
                    {isAllFieldsMapped() && (
                      <div className={styles.readyIndicator}>
                        <span>Ready to import</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.previewSection}>
                  <div className={styles.previewHeader}>
                    <h3>Data Preview</h3>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
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
                            {getMappedData()
                              .slice(0, 5)
                              .map((row, index) => (
                                <tr key={index}>
                                  {formFields.map((field) => (
                                    <td key={field}>{row[field] || "-"}</td>
                                  ))}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      {excelData.rows.length > 5 && (
                        <div className={styles.tableFooter}>
                          Showing first 5 rows of {excelData.rows.length} total
                          rows
                        </div>
                      )}
                    </div>
                  )}
                </div>

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