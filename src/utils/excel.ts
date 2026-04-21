import * as ExcelJS from 'exceljs';

export const readExcelFile = async (file: File): Promise<{ headers: string[]; data: any[] }> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  
  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('No worksheet found in the Excel file');
  }
  
  // 提取表头
  const headers: string[] = [];
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    headers.push(cell.value as string || `Column ${cell.col}`);
  });
  
  // 提取数据
  const data: any[] = [];
  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    const rowData: any = {};
    headers.forEach((header, index) => {
      rowData[header] = row.getCell(index + 1).value;
    });
    data.push(rowData);
  }
  
  return { headers, data };
};

export const exportToExcel = async (data: any[], fileName: string): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  
  if (data.length === 0) {
    return;
  }
  
  // 添加表头
  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);
  
  // 添加数据
  data.forEach((row) => {
    worksheet.addRow(Object.values(row));
  });
  
  // 导出文件
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  
  URL.revokeObjectURL(url);
};

export const calculateStatistics = (data: any[], field: string): {
  min: number;
  max: number;
  avg: number;
  sum: number;
  count: number;
} => {
  const values = data
    .map((row) => parseFloat(row[field]))
    .filter((value) => !isNaN(value));
  
  if (values.length === 0) {
    return { min: 0, max: 0, avg: 0, sum: 0, count: 0 };
  }
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = sum / values.length;
  
  return { min, max, avg, sum, count: values.length };
};