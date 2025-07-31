import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, MapPin, Send, Check, X, Eye, EyeOff } from 'lucide-react';
import * as XLSX from 'xlsx';
import styles from './ExcelUploader.module.scss';



const ExcelUploader= ({ requiredFields, onDataSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
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
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setIsLoading(true);
    setFile(uploadedFile);

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length > 0) {
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        
        setExcelData({ headers, rows });
        
        // Auto-map columns based on similar names
        const autoMapping = {};
        requiredFields.forEach(field => {
          const matchingHeader = headers.find(header => 
            header.toLowerCase().includes(field.toLowerCase()) ||
            field.toLowerCase().includes(header.toLowerCase())
          );
          if (matchingHeader) {
            autoMapping[field] = matchingHeader;
          }
        });
        setColumnMapping(autoMapping);
      }
    } catch (error) {
      console.error('Error reading Excel file:', error);
      alert('Error reading Excel file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingChange = (requiredField, selectedHeader) => {
    setColumnMapping(prev => ({
      ...prev,
      [requiredField]: selectedHeader
    }));
  };

  const getMappedData = () => {
    if (!excelData) return [];

    return excelData.rows.map(row => {
      const mappedRow = {};
      Object.entries(columnMapping).forEach(([requiredField, selectedHeader]) => {
        const headerIndex = excelData.headers.indexOf(selectedHeader);
        if (headerIndex !== -1) {
          mappedRow[requiredField] = row[headerIndex];
        }
      });
      return mappedRow;
    });
  };

  const handleSubmit = () => {
    const mappedData = getMappedData();
    onDataSubmit(mappedData);
  };

  const isAllFieldsMapped = () => {
    return requiredFields.every(field => columnMapping[field]);
  };

  const resetUpload = () => {
    setFile(null);
    setExcelData(null);
    setColumnMapping({});
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Excel Data Importer</h2>
        <p>Upload your Excel file and map columns to our required fields</p>
      </div>

      {!file ? (
        <div
          className={`${styles.uploadArea} ${
            dragActive
              ? styles.dragActive
              : ''
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
              <Upload />
            </div>
            <div className={styles.uploadText}>
              <h3>Drop your Excel file here</h3>
              <p>or click to browse</p>
            </div>
            <p className={styles.supportText}>Supports .xlsx and .xls files</p>
          </div>
        </div>
      ) : (
        <div>
          {/* File Info */}
          <div className={styles.fileInfo}>
            <div className={styles.fileDetails}>
              <FileSpreadsheet />
              <div>
                <p className={styles.fileName}>{file.name}</p>
                <p className={styles.fileSize}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={resetUpload}
              className={styles.removeButton}
            >
              <X />
            </button>
          </div>

          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <span>Processing Excel file...</span>
            </div>
          ) : excelData ? (
            <>
              {/* Column Mapping */}
              <div className={styles.mappingSection}>
                <div className={styles.sectionHeader}>
                  <MapPin />
                  <h3>Map Your Columns</h3>
                </div>
                
                <div className={styles.mappingGrid}>
                  {requiredFields.map(field => (
                    <div key={field} className={styles.fieldGroup}>
                      <label>
                        {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        <span className={styles.required}>*</span>
                      </label>
                      <select
                        value={columnMapping[field] || ''}
                        onChange={(e) => handleMappingChange(field, e.target.value)}
                      >
                        <option value="">Select column...</option>
                        {excelData.headers.map(header => (
                          <option key={header} value={header}>
                            {header}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Mapping Status */}
                <div className={styles.mappingStatus}>
                  <div className={styles.statusIndicator}>
                    <div className={`${styles.statusDot} ${isAllFieldsMapped() ? styles.complete : styles.partial}`}></div>
                    <span>
                      {Object.keys(columnMapping).length} of {requiredFields.length} fields mapped
                    </span>
                  </div>
                  {isAllFieldsMapped() && (
                    <div className={styles.readyIndicator}>
                      <Check />
                      <span>Ready to import</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Preview */}
              <div className={styles.previewSection}>
                <div className={styles.previewHeader}>
                  <h3>Data Preview</h3>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={styles.toggleButton}
                  >
                    {showPreview ? <EyeOff /> : <Eye />}
                    <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                  </button>
                </div>

                {showPreview && (
                  <div className={styles.tableContainer}>
                    <div className={styles.tableWrapper}>
                      <table>
                        <thead>
                          <tr>
                            {requiredFields.map(field => (
                              <th key={field}>
                                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {getMappedData().slice(0, 5).map((row, index) => (
                            <tr key={index}>
                              {requiredFields.map(field => (
                                <td key={field}>
                                  {row[field] || '-'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {excelData.rows.length > 5 && (
                      <div className={styles.tableFooter}>
                        Showing first 5 rows of {excelData.rows.length} total rows
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className={styles.submitSection}>
                <button
                  onClick={handleSubmit}
                  disabled={!isAllFieldsMapped()}
                  className={`${styles.submitButton} ${
                    isAllFieldsMapped()
                      ? styles.enabled
                      : styles.disabled
                  }`}
                >
                  <Send />
                  <span>Import Data ({excelData.rows.length} rows)</span>
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;