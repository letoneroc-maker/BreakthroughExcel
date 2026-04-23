import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useStore, ExcelFile, Field, PreviewField } from '../store';
import { readExcelFile } from '../utils/excel';
import { FileSpreadsheet, Upload, Search, X, ChevronDown, ChevronUp } from 'lucide-react';

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
    <div className="container mx-auto p-6">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
          <FileSpreadsheet className="h-8 w-8 text-primary mr-3" />
          数据处理
        </h2>
        
        {/* 文件上传区域 */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">文件上传</h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${isDragActive
              ? 'border-primary bg-blue-50 shadow-lg'
              : 'border-gray-300 hover:border-primary hover:shadow-md'
              }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center">
              <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary bg-opacity-20' : 'bg-gray-100'} mb-4`}>
                <Upload className={`h-10 w-10 ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
              </div>
              <h4 className={`text-lg font-medium mb-2 ${isDragActive ? 'text-primary' : 'text-gray-700'}`}>
                {isDragActive ? '释放文件以上传' : '拖放Excel文件到此处'}
              </h4>
              <p className="text-gray-500 mb-4">或点击选择文件</p>
              <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                选择文件
              </button>
              <p className="text-sm text-gray-400 mt-4">支持 .xlsx 和 .xls 格式</p>
            </div>
          </div>
          
          {/* 文件列表 */}
          {files.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <div key={file.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 animate-slide-up">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-6 w-6 text-primary mr-3" />
                      <h4 className="font-medium text-gray-800 truncate">{file.name}</h4>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="w-24">数据行数:</span>
                      <span className="font-medium">{file.data.length}</span>
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="w-24">字段数量:</span>
                      <span className="font-medium">{file.headers.length}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 字段列表 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <Search className="h-5 w-5 text-primary mr-2" />
              字段列表
            </h3>
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索字段..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto pr-2">
              {filteredFields.length > 0 ? (
                <ul className="space-y-3">
                  {filteredFields.map((field) => {
                    const file = files.find((f) => f.id === field.fileId);
                    return (
                      <li
                        key={field.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, field)}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary cursor-move transition-all duration-300"
                      >
                        <div className="text-sm font-medium text-gray-800">{field.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{file?.name}</div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">暂无字段</p>
                  <p className="text-sm text-gray-400 mt-2">上传Excel文件后将显示字段列表</p>
                </div>
              )}
            </div>
          </div>
          
          {/* 预览区域 */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-700">拖拽预览</h3>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed rounded-xl p-12 text-center mb-8 min-h-[250px] transition-all duration-300 hover:border-primary hover:bg-blue-50"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="p-4 rounded-full bg-gray-100 mb-4">
                  <FileSpreadsheet className="h-12 w-12 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">将字段拖拽到此处</h4>
                <p className="text-gray-500">从左侧字段列表中拖拽字段到这里预览数据</p>
              </div>
            </div>
            
            {/* 预览表格 */}
            {previewFields.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                    <tr>
                      {previewFields.map((field) => (
                        <th
                          key={field.id}
                          className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider"
                        >
                          <div className="flex items-center justify-between">
                            <span>{field.fieldName}</span>
                            <button
                              onClick={() => removePreviewField(field.id)}
                              className="text-white hover:text-red-200 transition-colors duration-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-xs text-white text-opacity-80 mt-1">{field.fileName}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {files.length > 0 && files[0].data.slice(0, 10).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-300">
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
    </div>
  );
};

export default DataProcessingPage;