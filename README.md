# Excel 数据分析工具

一个现代化、美观的Excel数据分析工具，支持文件上传、数据处理、可视化分析和结果导出。

## 功能特性

- **文件上传**：支持上传多个Excel文件，自动提取字段
- **数据处理**：拖拽字段到预览区域，支持字段排序和函数运算
- **数据可视化**：多种图表类型（柱状图、折线图、饼图等），实时数据预览
- **统计分析**：自动计算最高值、最低值、平均值、求和、计数等统计信息
- **结果导出**：将处理后的数据导出为Excel文件
- **配置保存**：保存和加载处理配置，提高工作效率

## 技术栈

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Chart.js
- ExcelJS
- React Dropzone
- Lucide React (图标库)

## 快速开始

### 方法一：直接使用（推荐）
1. 下载 [excel-data-analyzer.zip](excel-data-analyzer.zip)
2. 解压文件
3. 双击 `index.html` 文件即可在浏览器中打开应用

### 方法二：从源码构建
1. 克隆仓库
   ```bash
   git clone <repository-url>
   cd excel-data-analyzer
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 开发模式运行
   ```bash
   npm run dev
   ```

4. 构建生产版本
   ```bash
   npm run build
   ```

## 界面预览

### 数据处理页面
![数据处理页面](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20Excel%20data%20analysis%20tool%20interface%20with%20file%20upload%20area%2C%20field%20list%2C%20and%20preview%20table%2C%20blue%20gradient%20theme%2C%20clean%20modern%20design&image_size=landscape_16_9)

### 数据可视化页面
![数据可视化页面](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20data%20visualization%20interface%20with%20chart%20preview%2C%20statistics%20cards%2C%20and%20data%20table%2C%20blue%20gradient%20theme%2C%20clean%20modern%20design&image_size=landscape_16_9)

### 导出页面
![导出页面](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20export%20interface%20with%20export%20button%20and%20configuration%20management%2C%20blue%20gradient%20theme%2C%20clean%20modern%20design&image_size=landscape_16_9)

## 使用指南

1. **上传Excel文件**：点击或拖放Excel文件到上传区域
2. **选择字段**：从左侧字段列表中拖拽字段到中间预览区域
3. **查看数据**：在预览表格中查看数据
4. **数据可视化**：切换到数据可视化页面，选择图表类型查看数据图表
5. **导出结果**：切换到导出页面，设置文件名并导出Excel文件
6. **保存配置**：在导出页面保存当前配置，方便下次使用

## 技术特点

- **响应式设计**：适配不同屏幕尺寸
- **现代化UI**：使用Tailwind CSS实现美观的界面
- **流畅动画**：添加了页面加载、过渡和悬停动画
- **本地运行**：无需服务器，双击HTML文件即可使用
- **高性能**：使用React 18和Vite构建，性能优异

## 项目结构

```
excel-data-analyzer/
├── src/
│   ├── components/          # 组件
│   ├── pages/               # 页面
│   ├── utils/               # 工具函数
│   ├── store/               # 状态管理
│   ├── App.tsx              # 应用入口
│   └── main.tsx             # 主文件
├── dist/                    # 构建输出
├── excel-data-analyzer.zip  # 打包好的应用
├── package.json             # 项目配置
└── README.md               # 项目说明
```

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过GitHub Issues联系我们。