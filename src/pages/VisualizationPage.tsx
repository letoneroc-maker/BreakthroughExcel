import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useStore } from '../store';
import { calculateStatistics } from '../utils/excel';
import { BarChart3, LineChart, PieChart, CircleDollarSign, Activity, Target, FileSpreadsheet } from 'lucide-react';

const VisualizationPage: React.FC = () => {
  const { files, previewFields, chartType, setChartType, chartData, setChartData } = useStore();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  // 图表类型选项
  const chartTypes = [
    { value: 'bar', label: '柱状图', icon: BarChart3 },
    { value: 'line', label: '折线图', icon: LineChart },
    { value: 'pie', label: '饼图', icon: PieChart },
    { value: 'doughnut', label: '环形图', icon: CircleDollarSign },
    { value: 'radar', label: '雷达图', icon: Activity },
    { value: 'polarArea', label: '极坐标图', icon: Target }
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
      const colors = [
        'rgba(59, 130, 246, 0.6)',
        'rgba(139, 92, 246, 0.6)',
        'rgba(236, 72, 153, 0.6)',
        'rgba(16, 185, 129, 0.6)',
        'rgba(245, 158, 11, 0.6)',
        'rgba(239, 68, 68, 0.6)'
      ];
      
      const datasets = previewFields.map((field, index) => {
        const fieldData = data.map((row) => row[field.fieldName] || 0);
        const color = colors[index % colors.length];
        
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
              position: 'top' as const,
              labels: {
                usePointStyle: true,
                padding: 20
              }
            },
            title: {
              display: true,
              text: '数据可视化',
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          },
          scales: chartType !== 'pie' && chartType !== 'doughnut' && chartType !== 'polarArea' ? {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            }
          } : undefined
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
    <div className="container mx-auto p-6">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
          <BarChart3 className="h-8 w-8 text-primary mr-3" />
          数据可视化
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 图表配置 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-700">图表配置</h3>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">图表类型</label>
              <div className="grid grid-cols-2 gap-3">
                {chartTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setChartType(type.value as any)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 ${chartType === type.value
                        ? 'bg-primary bg-opacity-10 border-2 border-primary text-primary'
                        : 'bg-gray-50 border border-gray-200 hover:border-primary hover:bg-blue-50'
                        }`}
                    >
                      <Icon className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* 统计分析 */}
            <h3 className="text-xl font-semibold mb-4 text-gray-700">统计分析</h3>
            {stats.length > 0 ? (
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={stat.field} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <h4 className="font-medium text-gray-800 mb-3">{stat.field}</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">最高值:</span>
                        <span className="font-medium text-primary">{stat.max}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">最低值:</span>
                        <span className="font-medium text-pink">{stat.min}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">平均值:</span>
                        <span className="font-medium text-accent">{stat.avg.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">求和:</span>
                        <span className="font-medium text-green">{stat.sum}</span>
                      </div>
                      <div className="flex justify-between items-center col-span-2">
                        <span className="text-gray-600">计数:</span>
                        <span className="font-medium text-secondary">{stat.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无数据进行统计分析</p>
                <p className="text-sm text-gray-400 mt-2">请在数据处理页面添加字段</p>
              </div>
            )}
          </div>
          
          {/* 图表预览 */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-700">图表预览</h3>
            <div className="h-[450px] relative rounded-xl border border-gray-200 overflow-hidden">
              {chartData ? (
                <canvas ref={chartRef}></canvas>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
                  <h4 className="text-lg font-medium mb-2">暂无图表数据</h4>
                  <p>请在数据处理页面添加字段以生成图表</p>
                </div>
              )}
            </div>
            
            {/* 数据预览 */}
            <h3 className="text-xl font-semibold mt-8 mb-6 text-gray-700">数据预览</h3>
            {previewFields.length > 0 && files.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                    <tr>
                      {previewFields.map((field) => (
                        <th
                          key={field.id}
                          className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider"
                        >
                          {field.fieldName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {files[0].data.slice(0, 10).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-300">
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
              <div className="text-center py-8">
                <FileSpreadsheet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无数据预览</p>
                <p className="text-sm text-gray-400 mt-2">请在数据处理页面添加字段</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage;