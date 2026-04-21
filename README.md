# Excel数据分析工具

A powerful Excel data analysis tool for processing Excel files, extracting fields, performing data operations, and visualizing analysis.

## Features

- **Data Processing**: Support for uploading multiple Excel files, extracting fields, drag-and-drop preview, field sorting, and function operations
- **Data Visualization**: Support for multiple chart types (bar charts, line charts, pie charts, etc.), data preview, and statistical analysis
- **Export Functionality**: Export processed data to new Excel files, save configurations for future use

## Tech Stack

- Frontend: React@18 + TypeScript + Tailwind CSS + Vite
- Data Processing: ExcelJS
- Data Visualization: Chart.js
- State Management: Zustand
- Build Tool: Electron (supports desktop applications)

## Installation and Running

### Development Mode

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build Desktop Application

```bash
# Build and package as desktop application
npm run electron:build
```

After building, executable files will be generated in the `dist-electron` directory.

## Usage

1. **Data Processing Page**: Upload Excel files, extract fields from files, drag fields to the preview area to view data
2. **Data Visualization Page**: Select chart types, view data visualization effects and statistical analysis
3. **Export Page**: Export processed data to Excel files, save configurations for future use

## System Requirements

- Windows 7+ or macOS 10.13+
- At least 4GB of memory
- Modern browser support (Chrome, Firefox, Safari, Edge)

## Offline Use

This application supports offline use, no internet connection required to run all features.

## License

MIT

---

[中文README](README_zh.md)
