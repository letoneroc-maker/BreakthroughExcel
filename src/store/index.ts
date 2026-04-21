import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义数据类型
export interface ExcelFile {
  id: string;
  name: string;
  data: any[];
  headers: string[];
}

export interface Field {
  id: string;
  name: string;
  fileId: string;
}

export interface PreviewField {
  id: string;
  fieldId: string;
  fieldName: string;
  fileId: string;
  fileName: string;
}

export interface CalculatedField {
  id: string;
  name: string;
  formula: string;
  dependencies: string[];
}

export interface Configuration {
  id: string;
  name: string;
  files: ExcelFile[];
  previewFields: PreviewField[];
  calculatedFields: CalculatedField[];
  createdAt: string;
}

// 定义状态接口
interface AppState {
  // 文件相关
  files: ExcelFile[];
  addFile: (file: ExcelFile) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  
  // 字段相关
  fields: Field[];
  setFields: (fields: Field[]) => void;
  
  // 预览相关
  previewFields: PreviewField[];
  addPreviewField: (field: PreviewField) => void;
  removePreviewField: (fieldId: string) => void;
  reorderPreviewFields: (fields: PreviewField[]) => void;
  
  // 计算字段相关
  calculatedFields: CalculatedField[];
  addCalculatedField: (field: CalculatedField) => void;
  removeCalculatedField: (fieldId: string) => void;
  
  // 配置相关
  configurations: Configuration[];
  saveConfiguration: (name: string) => void;
  loadConfiguration: (configId: string) => void;
  deleteConfiguration: (configId: string) => void;
  
  // 可视化相关
  chartType: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  setChartType: (type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea') => void;
  chartData: any;
  setChartData: (data: any) => void;
}

// 创建store
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 文件相关
      files: [],
      addFile: (file) => set((state) => ({ files: [...state.files, file] })),
      removeFile: (fileId) => set((state) => ({
        files: state.files.filter((file) => file.id !== fileId),
        fields: state.fields.filter((field) => field.fileId !== fileId),
        previewFields: state.previewFields.filter((field) => field.fileId !== fileId)
      })),
      clearFiles: () => set({ files: [], fields: [], previewFields: [], calculatedFields: [] }),
      
      // 字段相关
      fields: [],
      setFields: (fields) => set({ fields }),
      
      // 预览相关
      previewFields: [],
      addPreviewField: (field) => set((state) => ({
        previewFields: [...state.previewFields, field]
      })),
      removePreviewField: (fieldId) => set((state) => ({
        previewFields: state.previewFields.filter((field) => field.id !== fieldId)
      })),
      reorderPreviewFields: (fields) => set({ previewFields: fields }),
      
      // 计算字段相关
      calculatedFields: [],
      addCalculatedField: (field) => set((state) => ({
        calculatedFields: [...state.calculatedFields, field]
      })),
      removeCalculatedField: (fieldId) => set((state) => ({
        calculatedFields: state.calculatedFields.filter((field) => field.id !== fieldId)
      })),
      
      // 配置相关
      configurations: [],
      saveConfiguration: (name) => set((state) => {
        const newConfig: Configuration = {
          id: Date.now().toString(),
          name,
          files: state.files,
          previewFields: state.previewFields,
          calculatedFields: state.calculatedFields,
          createdAt: new Date().toISOString()
        };
        return {
          configurations: [...state.configurations, newConfig]
        };
      }),
      loadConfiguration: (configId) => set((state) => {
        const config = state.configurations.find((c) => c.id === configId);
        if (config) {
          return {
            files: config.files,
            fields: config.files.flatMap((file) => 
              file.headers.map((header) => ({
                id: `${file.id}-${header}`,
                name: header,
                fileId: file.id
              }))
            ),
            previewFields: config.previewFields,
            calculatedFields: config.calculatedFields
          };
        }
        return {};
      }),
      deleteConfiguration: (configId) => set((state) => ({
        configurations: state.configurations.filter((c) => c.id !== configId)
      })),
      
      // 可视化相关
      chartType: 'bar' as 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea',
      setChartType: (type) => set({ chartType: type }),
      chartData: null,
      setChartData: (data) => set({ chartData: data })
    }),
    {
      name: 'excel-analyzer-storage'
    }
  )
);