import React, { useState } from 'react';
import { useStore } from '../store';
import { exportToExcel } from '../utils/excel';
import { Download, Save, FolderOpen, Trash2, CheckCircle } from 'lucide-react';

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
    <div className="container mx-auto p-6">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
          <Download className="h-8 w-8 text-primary mr-3" />
          导出
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 结果导出 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
              <Download className="h-5 w-5 text-primary mr-2" />
              结果导出
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">导出文件名</label>
              <input
                type="text"
                value={exportFileName}
                onChange={(e) => setExportFileName(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="输入导出文件名"
              />
            </div>
            <button
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-lg font-medium hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <Download className="h-5 w-5 mr-2" />
              导出Excel文件
            </button>
            {showSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center animate-fade-in">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700">导出成功！</span>
              </div>
            )}
          </div>
          
          {/* 配置保存 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
              <Save className="h-5 w-5 text-primary mr-2" />
              配置保存
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">配置名称</label>
              <input
                type="text"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="输入配置名称"
              />
            </div>
            <button
              onClick={handleSaveConfig}
              className="w-full bg-gradient-to-r from-accent to-pink text-white py-3 px-6 rounded-lg font-medium hover:shadow-xl transition-all duration-300 flex items-center justify-center mb-8"
            >
              <Save className="h-5 w-5 mr-2" />
              保存配置
            </button>
            
            {/* 配置列表 */}
            <h4 className="font-medium text-gray-700 mb-4">已保存的配置</h4>
            {configurations.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {configurations.map((config, index) => (
                  <div key={config.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-800">{config.name}</h5>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleLoadConfig(config.id)}
                          className="p-2 text-gray-400 hover:text-primary transition-colors duration-300"
                          title="加载配置"
                        >
                          <FolderOpen className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfig(config.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                          title="删除配置"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{new Date(config.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无保存的配置</p>
                <p className="text-sm text-gray-400 mt-2">保存配置以便下次快速使用</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;