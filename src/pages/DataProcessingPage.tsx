import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useStore, ExcelFile, Field, PreviewField } from '../store';
import { readExcelFile } from '../utils/excel';

const DataProcessingPage: React.FC = () => {
  const { files, addFile, removeFile, fields, setFields, previewFields, addPreviewField, removePreviewField, reorderPreviewFields } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // 文件上传处理
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        const { headers, data } = await readExcelFile(file);
        const newFile: ExcelFile = {
          id: Date.now().toString(),
          name: file.name,
          data,
          headers
        };
        addFile(newFile);
        
        // 提取字段
        const newFields: Field[] = headers.map((header) => ({
          id: `${newFile.id}-${header}`,
          name: header,
          fileId: newFile.id
        }));
        setFields([...fields, ...newFields]);
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    }
  }, [addFile, fields, setFields]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  });
  
  // 过滤字段
  const filteredFields = fields.filter((field) => 
    field.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // 处理字段拖拽到预览区域
  const handleDragStart = (e: React.DragEvent, field: Field) => {
    e.dataTransfer.setData('field', JSON.stringify(field));
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fieldData = e.dataTransfer.getData('field');
    if (fieldData) {
      const field = JSON.parse(fieldData) as Field;
      const file = files.find((f) => f.id === field.fileId);
      if (file) {
        const newPreviewField: PreviewField = {
          id: Date.now().toString(),
          fieldId: field.id,
          fieldName: field.name,
          fileId: field.fileId,
          fileName: file.name
        };
        addPreviewField(newPreviewField);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">数据处理</h2>
      
      {/* 文件上传区域 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">文件上传</h3>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${isDragActive
            ? 'border-[#4361ee] bg-blue-50'
            : 'border-gray-300 hover:border-[#4361ee]'
            }`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-500">拖放Excel文件到此处，或点击选择文件</p>
          <p className="text-sm text-gray-400 mt-2">支持 .xlsx 和 .xls 格式</p>
        </div>
        
        {/* 文件列表 */}
        {files.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div key={file.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800">{file.name}</h4>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </div>
                <p className="text-sm text-gray-500">{file.data.length} 行数据</p>
                <p className="text-sm text-gray-500">{file.headers.length} 个字段</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 字段列表 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">字段列表</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="搜索字段..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4361ee]"
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredFields.length > 0 ? (
              <ul className="space-y-2">
                {filteredFields.map((field) => {
                  const file = files.find((f) => f.id === field.fileId);
                  return (
                    <li
                      key={field.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, field)}
                      className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-move"
                    >
                      <div className="text-sm font-medium">{field.name}</div>
                      <div className="text-xs text-gray-500">{file?.name}</div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无字段</p>
            )}
          </div>
        </div>
        
        {/* 预览区域 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">拖拽预览</h3>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed rounded-lg p-8 text-center mb-6 min-h-[200px]"
          >
            <p className="text-gray-500">将字段拖拽到此处预览数据</p>
          </div>
          
          {/* 预览表格 */}
          {previewFields.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {previewFields.map((field) => (
                      <th
                        key={field.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center justify-between">
                          <span>{field.fieldName}</span>
                          <button
                            onClick={() => removePreviewField(field.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ×
                          </button>
                        </div>
                        <div className="text-xs text-gray-400">{field.fileName}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.length > 0 && files[0].data.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      {previewFields.map((field) => {
                        const file = files.find((f) => f.id === field.fileId);
                        const fileRow = file?.data[index];
                        return (
                          <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {fileRow ? fileRow[field.fieldName] : ''}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataProcessingPage;