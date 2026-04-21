import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useStore } from '../store';
import { calculateStatistics } from '../utils/excel';

const VisualizationPage: React.FC = () => {
  const { files, previewFields, chartType, setChartType, chartData, setChartData } = useStore();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  // 图表类型选项
  const chartTypes = [
    { value: 'bar', label: '柱状图' },
    { value: 'line', label: '折线图' },
    { value: 'pie', label: '饼图' },
    { value: 'doughnut', label: '环形图' },
    { value: 'radar', label: '雷达图' },
    { value: 'polarArea', label: '极坐标图' }
  ];
  
  // 准备图表数据
  useEffect(() => {
    if (previewFields.length === 0 || files.length === 0) {
      setChartData(null);
      return;
    }
    
    const firstFile = files[0];
    const data = firstFile.data.slice(0, 50); // 限制数据量以提高性能
    
    if (previewFields.length > 0) {
      const labels = data.map((_, index) => `Item ${index + 1}`);
      const datasets = previewFields.map((field, index) => {
        const fieldData = data.map((row) => row[field.fieldName] || 0);
        
        // 生成随机颜色
        const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
        
        return {
          label: field.fieldName,
          data: fieldData,
          backgroundColor: color,
          borderColor: color.replace('0.6', '1'),
          borderWidth: 1
        };
      });
      
      setChartData({ labels, datasets });
    }
  }, [previewFields, files, setChartData]);
  
  // 渲染图表
  useEffect(() => {
    if (!chartRef.current || !chartData) {
      return;
    }
    
    // 销毁旧图表
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // 创建新图表
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const
            },
            title: {
              display: true,
              text: '数据可视化'
            }
          }
        }
      });
    }
    
    // 清理函数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, chartType]);
  
  // 计算统计数据
  const calculateStats = () => {
    if (previewFields.length === 0 || files.length === 0) {
      return [];
    }
    
    const firstFile = files[0];
    return previewFields.map((field) => {
      const stats = calculateStatistics(firstFile.data, field.fieldName);
      return { field: field.fieldName, ...stats };
    });
  };
  
  const stats = calculateStats();
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">数据可视化</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 图表配置 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">图表配置</h3>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">图表类型</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4361ee]"
            >
              {chartTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* 统计分析 */}
          <h3 className="text-xl font-semibold mb-4 text-gray-700">统计分析</h3>
          {stats.length > 0 ? (
            <div className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.field} className="border border-gray-200 rounded-md p-3">
                  <h4 className="font-medium text-gray-800 mb-2">{stat.field}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">最高值: <span className="font-medium">{stat.max}</span></div>
                    <div className="text-gray-600">最低值: <span className="font-medium">{stat.min}</span></div>
                    <div className="text-gray-600">平均值: <span className="font-medium">{stat.avg.toFixed(2)}</span></div>
                    <div className="text-gray-600">求和: <span className="font-medium">{stat.sum}</span></div>
                    <div className="text-gray-600">计数: <span className="font-medium">{stat.count}</span></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无数据进行统计分析</p>
          )}
        </div>
        
        {/* 图表预览 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">图表预览</h3>
          <div className="h-[400px] relative">
            {chartData ? (
              <canvas ref={chartRef}></canvas>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                请在数据处理页面添加字段以生成图表
              </div>
            )}
          </div>
          
          {/* 数据预览 */}
          <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700">数据预览</h3>
          {previewFields.length > 0 && files.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {previewFields.map((field) => (
                      <th
                        key={field.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {field.fieldName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files[0].data.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      {previewFields.map((field) => (
                        <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row[field.fieldName] || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无数据预览</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage;