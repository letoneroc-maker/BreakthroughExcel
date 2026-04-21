import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '数据处理' },
    { path: '/visualization', label: '数据可视化' },
    { path: '/export', label: '导出' }
  ];
  
  return (
    <nav className="bg-gradient-to-r from-[#3a0ca3] to-[#4361ee] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Excel 数据分析工具</h1>
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md transition-all duration-300 ${location.pathname === item.path
                ? 'bg-white bg-opacity-20 font-medium'
                : 'hover:bg-white hover:bg-opacity-10'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;