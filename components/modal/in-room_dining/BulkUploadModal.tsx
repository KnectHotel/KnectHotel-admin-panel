'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, FileUp } from 'lucide-react';
import apiCall from '@/lib/axios';
import { ToastAtTopRight } from '@/lib/sweetalert'; 

export type BulkUploadedProduct = {
  _id: string;
  HotelId: string;
  productType: string;
  productName: string;
  description: string;
  cost: number;
  foodType: 'vegetarian' | 'non-vegetarian';
  visibility: boolean;
  imageUrl: string;
  __v?: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: BulkUploadedProduct[]) => void;
};

const REQUIRED_COLUMNS = [
  'productType',
  'productName',
  'description',
  'cost',
  'foodType',   
  'visibility', 
  'imageUrl',
] as const;

export default function BulkUploadModal({ isOpen, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<BulkUploadedProduct[] | null>(null);

  
  const [headerOk, setHeaderOk] = useState<boolean | null>(null);
  const [missingCols, setMissingCols] = useState<string[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [previewRows, setPreviewRows] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const canUpload = useMemo(
    () => !!file && !uploading && (headerOk === true || headerOk === null),
    [file, uploading, headerOk]
  );

  if (!isOpen) return null;

  const resetState = () => {
    setFile(null);
    setUploading(false);
    setServerMsg(null);
    setError(null);
    setCreated(null);
    setHeaderOk(null);
    setMissingCols([]);
    setRowCount(0);
    setPreviewRows([]);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handlePickFile = () => {
    inputRef.current?.click();
  };

  const parseHeader = (firstLine: string): string[] => {
    return firstLine.split(',').map((h) => h.trim());
  };

  const validateHeader = (headers: string[]) => {
    const missing = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
    setMissingCols(missing as string[]);
    const ok = missing.length === 0;
    setHeaderOk(ok);

    if (!ok) {
      ToastAtTopRight.fire({
        icon: 'warning',
        title: `Missing columns: ${missing.join(', ') || '—'}`,
      });
    }
  };

  const isCsvFile = (f: File) =>
    f.type === 'text/csv' ||
    f.name.toLowerCase().endsWith('.csv') ||
    f.type === 'application/vnd.ms-excel';

  const isXlsxFile = (f: File) =>
    f.type ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    f.name.toLowerCase().endsWith('.xlsx');

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;

    if (!isCsvFile(f) && !isXlsxFile(f)) {
      setError('Please select a .csv or .xlsx file');
      ToastAtTopRight.fire({ icon: 'error', title: 'Please select a .csv or .xlsx file' }); 
      setFile(null);
      setHeaderOk(null);
      setMissingCols([]);
      setRowCount(0);
      setPreviewRows([]);
      return;
    }

    setError(null);
    setFile(f);

    
    if (isCsvFile(f)) {
      try {
        const text = await f.text();
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

        if (lines.length === 0) {
          setHeaderOk(false);
          setMissingCols(Array.from(REQUIRED_COLUMNS));
          setRowCount(0);
          setPreviewRows([]);
          ToastAtTopRight.fire({ icon: 'warning', title: 'CSV is empty' }); 
          return;
        }

        const headerLine = lines[0];
        const headers = parseHeader(headerLine);
        validateHeader(headers);

        const dataLines = lines.slice(1);
        setRowCount(dataLines.length);
        setPreviewRows(dataLines.slice(0, 5));
      } catch {
        const msg = 'Failed to read the CSV file. Please try again.';
        setError(msg);
        setHeaderOk(null);
        setMissingCols([]);
        setRowCount(0);
        setPreviewRows([]);
        ToastAtTopRight.fire({ icon: 'error', title: msg }); 
      }
    } else {
      
      setHeaderOk(null);
      setMissingCols([]);
      setRowCount(0);
      setPreviewRows([]);
    }
  };


  const downloadHeaderOnlySample = async () => {
    try {
      
      const XLSX = (await import('xlsx')) as typeof import('xlsx');


      
      const header = Array.from(REQUIRED_COLUMNS);
      const wsTemplate = XLSX.utils.aoa_to_sheet([header]);

      
      wsTemplate['!cols'] = header.map((h) => ({ wch: Math.max(12, String(h).length + 2) }));

      
      const readmeData = [
        ['Instructions'],
        ['• Keep the header row exactly as-is (case-sensitive).'],
        ['• foodType: "vegetarian" or "non-vegetarian".'],
        ['• visibility: true or false (boolean).'],
        ['• cost: number only (no currency symbol).'],
        ['• imageUrl: full URL to image (optional if your backend supports it).'],
        ['• Save this file as .xlsx and upload via Bulk Upload.'],
      ];
      const wsReadme = XLSX.utils.aoa_to_sheet(readmeData);
      wsReadme['!cols'] = [{ wch: 90 }];

      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsTemplate, 'Template');
      XLSX.utils.book_append_sheet(wb, wsReadme, 'README');

      
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'inroomdining-bulk-upload-template.xlsx';
      a.click();
      URL.revokeObjectURL(url);

      ToastAtTopRight.fire({ icon: 'success', title: 'Excel template downloaded' });
    } catch (err) {
      ToastAtTopRight.fire({
        icon: 'error',
        title: 'Failed to generate Excel. Please install "xlsx".',
      });
    }
  };



  
  
  
  
  
  
  
  
  
  
  
  
  
  


  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setServerMsg(null);
    setError(null);
    setCreated(null);

    try {
      const form = new FormData();
      
      form.append('excelFile', file, file.name);

      const res = await apiCall(
        'POST',
        'api/services/inroomdining/products/bulk-upload',
        form
      );

      if (res?.success) {
        const title = res.message || 'Upload successful';
        setServerMsg(title);
        const createdList: BulkUploadedProduct[] = Array.isArray(res.data) ? res.data : [];
        setCreated(createdList);
        ToastAtTopRight.fire({ icon: 'success', title }); 
        onSuccess?.(createdList);
      } else {
        const msg = res?.message || 'Upload failed';
        setError(msg);
        ToastAtTopRight.fire({ icon: 'error', title: msg }); 
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        'Something went wrong during upload';
      setError(msg);
      ToastAtTopRight.fire({ icon: 'error', title: msg }); 
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999]">
      {}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      {}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
          {}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h3 className="text-lg font-semibold">Bulk Upload In-Room Dining Items</h3>
            <button
              onClick={handleClose}
              className="rounded p-1 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {}
          <div className="px-5 py-4 space-y-4">
            <div>
              <p className="text-sm text-gray-600">
                Upload a <strong>.csv</strong> or <strong>.xlsx</strong> with the following columns (case-sensitive for CSV):
              </p>
              {}


              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadHeaderOnlySample}>
                  Download Header Guide
                </Button>
              </div>

              {}

            </div>

            <div className="rounded-lg border p-4">
              <input
                ref={inputRef}
                type="file"
                accept=".csv, text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsx"
                onChange={handleFileSelected}
                className="hidden"
              />
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium">
                    {file ? file.name : 'No file selected'}
                  </p>
                  {file && (
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
                <Button variant="outline" onClick={handlePickFile} disabled={uploading}>
                  <FileUp className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Supported: .csv, .xlsx
              </p>

              {}
              {headerOk !== null && (
                <div className="mt-3 text-sm">
                  {headerOk ? (
                    <div className="rounded-md bg-green-50 p-2 border border-green-200 text-green-700">
                      Header looks good. Rows detected: {rowCount}.
                    </div>
                  ) : (
                    <div className="rounded-md bg-yellow-50 p-2 border border-yellow-200 text-yellow-800">
                      Missing columns: {missingCols.join(', ') || '—'}
                    </div>
                  )}
                </div>
              )}

              {previewRows.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Preview (first 5 data rows):</p>
                  <div className="max-h-28 overflow-auto rounded border text-xs">
                    <ul className="divide-y">
                      {previewRows.map((line, idx) => (
                        <li key={idx} className="px-2 py-1 font-mono">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}
            {serverMsg && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                {serverMsg}
              </div>
            )}

            {created && created.length > 0 && (
              <div className="rounded-md border p-3">
                <p className="text-sm font-medium">
                  Created Items ({created.length})
                </p>
                <div className="mt-2 max-h-40 overflow-auto text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    {created.map((p) => (
                      <li key={p._id}>
                        <span className="font-medium">{p.productName}</span>{' '}
                        <span className="text-gray-500">({p.productType})</span> — ₹{p.cost}{' '}
                        <span className="text-xs text-gray-500">
                          [{p.foodType}, visible: {String(p.visibility)}]
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!canUpload}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload & Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
