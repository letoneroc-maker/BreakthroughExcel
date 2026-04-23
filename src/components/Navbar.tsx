import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileSpreadsheet, BarChart3, Download } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '数据处理', icon: FileSpreadsheet },
    { path: '/visualization', label: '数据可视化', icon: BarChart3 },
    { path: '/export', label: '导出', icon: Download }
  ];
  
  return (
    <nav className="bg-gradient-to-r from-primary to-secondary text-white p-4 shadow-xl">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FileSpreadsheet className="h-8 w-8 text-accent" />
          <h1 className="text-2xl font-bold tracking-tight">Excel 数据分析工具</h1>
        </div>
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${location.pathname === item.path
                  ? 'bg-white bg-opacity-20 font-medium shadow-md'
                  : 'hover:bg-white hover:bg-opacity-10 hover:shadow-md'
                  }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-300 ${location.pathname === item.path ? 'text-accent' : 'group-hover:text-accent'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;