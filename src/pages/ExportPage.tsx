import React, { useState } from 'react';
import { useStore } from '../store';
import { exportToExcel } from '../utils/excel';

const ExportPage: React.FC = () => {
  const { files, previewFields, configurations, saveConfiguration, loadConfiguration, deleteConfiguration } = useStore();
  const [configName, setConfigName] = useState('');
  const [exportFileName, setExportFileName] = useState('exported-data.xlsx');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // 处理导出
  const handleExport = async () => {
    if (files.length === 0 || previewFields.length === 0) {
      alert('请先上传文件并选择字段');
      return;
    }
    
    const firstFile = files[0];
    const exportedData = firstFile.data.map((row) => {
      const exportedRow: any = {};
      previewFields.forEach((field) => {
        exportedRow[field.fieldName] = row[field.fieldName];
      });
      return exportedRow;
    });
    
    await exportToExcel(exportedData, exportFileName);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  // 处理保存配置
  const handleSaveConfig = () => {
    if (!configName.trim()) {
      alert('请输入配置名称');
      return;
    }
    saveConfiguration(configName);
    setConfigName('');
    alert('配置保存成功');
  };
  
  // 处理加载配置
  const handleLoadConfig = (configId: string) => {
    loadConfiguration(configId);
    alert('配置加载成功');
  };
  
  // 处理删除配置
  const handleDeleteConfig = (configId: string) => {
    if (window.confirm('确定要删除这个配置吗？')) {
      deleteConfiguration(configId);
      alert('配置删除成功');
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">导出</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 结果导出 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">结果导出</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">导出文件名</label>
            <input
              type="text"
              value={exportFileName}
              onChange={(e) => setExportFileName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4361ee]"
            />
          </div>
          <button
            onClick={handleExport}
            className="w-full bg-[#4361ee] text-white py-2 px-4 rounded-md hover:bg-[#3a0ca3] transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            导出Excel文件
          </button>
          {showSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
              导出成功！
            </div>
          )}
        </div>
        
        {/* 配置保存 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">配置保存</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">配置名称</label>
            <input
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4361ee]"
              placeholder="输入配置名称"
            />
          </div>
          <button
            onClick={handleSaveConfig}
            className="w-full bg-[#4cc9f0] text-white py-2 px-4 rounded-md hover:bg-[#4361ee] transition-colors duration-300 shadow-md hover:shadow-lg mb-6"
          >
            保存配置
          </button>
          
          {/* 配置列表 */}
          <h4 className="font-medium text-gray-700 mb-2">已保存的配置</h4>
          {configurations.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {configurations.map((config) => (
                <div key={config.id} className="border border-gray-200 rounded-md p-3 flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-gray-800">{config.name}</h5>
                    <p className="text-xs text-gray-500">{new Date(config.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLoadConfig(config.id)}
                      className="text-[#4361ee] hover:text-[#3a0ca3]"
                    >
                      加载
                    </button>
                    <button
                      onClick={() => handleDeleteConfig(config.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无保存的配置</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportPage;