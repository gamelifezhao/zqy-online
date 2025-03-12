'use client';

import { useState } from 'react';
import { 
  FaTimes, FaDownload, FaExpand, FaCompress, 
  FaChevronLeft, FaChevronRight, FaFilePdf, 
  FaFileWord, FaFileExcel, FaFilePowerpoint, 
  FaFileImage, FaFileAlt, FaFile 
} from 'react-icons/fa';
import { Document, PreviewType } from '../types';

interface DocPreviewProps {
  document: Document;
  onClose: () => void;
}

const DocPreview = ({ document, onClose }: DocPreviewProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);

  // 确定预览类型
  const getPreviewType = (): PreviewType => {
    switch (document.type) {
      case 'pdf':
        return 'pdf';
      case 'docx':
      case 'xlsx':
      case 'pptx':
        return 'office';
      case 'image':
        return 'image';
      case 'txt':
        return 'text';
      default:
        return 'unsupported';
    }
  };

  // 获取文档图标
  const getDocumentIcon = () => {
    switch (document.type) {
      case 'pdf':
        return <FaFilePdf className="text-red-500 text-2xl" />;
      case 'docx':
        return <FaFileWord className="text-blue-500 text-2xl" />;
      case 'xlsx':
        return <FaFileExcel className="text-green-500 text-2xl" />;
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500 text-2xl" />;
      case 'image':
        return <FaFileImage className="text-purple-500 text-2xl" />;
      case 'txt':
        return <FaFileAlt className="text-gray-500 text-2xl" />;
      default:
        return <FaFile className="text-gray-400 text-2xl" />;
    }
  };

  // 切换全屏状态
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 上一页
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 下一页
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 放大
  const zoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 10);
    }
  };

  // 缩小
  const zoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 10);
    }
  };

  // 重置缩放
  const resetZoom = () => {
    setZoom(100);
  };

  // 渲染文档内容预览
  const renderPreview = () => {
    const previewType = getPreviewType();
    
    switch (previewType) {
      case 'pdf':
        return renderPdfPreview();
      case 'office':
        return renderOfficePreview();
      case 'image':
        return renderImagePreview();
      case 'text':
        return renderTextPreview();
      case 'unsupported':
      default:
        return renderUnsupportedPreview();
    }
  };

  // PDF预览
  const renderPdfPreview = () => {
    // 在实际应用中，这里将使用PDF.js或类似库来渲染PDF
    return (
      <div className="bg-gray-100 flex items-center justify-center h-full">
        <div className="bg-white shadow-lg p-10 rounded text-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="text-xl font-bold mb-4">PDF预览示例</div>
          <div className="text-gray-500 mb-4">文件: {document.name}</div>
          <div className="border border-gray-300 p-4 mb-4">
            <p>这里是PDF文档的第 {currentPage} 页内容预览</p>
            <p className="my-2">在实际应用中，将使用PDF.js渲染真实内容</p>
            <p>适用于<span className="font-semibold">智能客服系统</span>和<span className="font-semibold">自动化文档生成</span>场景</p>
          </div>
        </div>
      </div>
    );
  };

  // Office文档预览
  const renderOfficePreview = () => {
    // 在实际应用中，这里将使用Office Viewer或类似库来渲染Office文档
    let title = '';
    let scenarioInfo = '';
    
    switch (document.type) {
      case 'docx':
        title = 'Word文档预览示例';
        scenarioInfo = '适用于<span class="font-semibold">自动化文档生成</span>场景';
        break;
      case 'xlsx':
        title = 'Excel表格预览示例';
        scenarioInfo = '适用于<span class="font-semibold">动态数据仪表板</span>和<span class="font-semibold">实时数据分析管道</span>场景';
        break;
      case 'pptx':
        title = 'PowerPoint演示文稿预览示例';
        scenarioInfo = '适用于<span class="font-semibold">动态数据仪表板</span>场景';
        break;
    }
    
    return (
      <div className="bg-gray-100 flex items-center justify-center h-full">
        <div className="bg-white shadow-lg p-10 rounded text-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="text-xl font-bold mb-4">{title}</div>
          <div className="text-gray-500 mb-4">文件: {document.name}</div>
          <div className="border border-gray-300 p-4 mb-4">
            <p>这里是{document.type.toUpperCase()}文档的第 {currentPage} 页内容预览</p>
            <p className="my-2">在实际应用中，将使用Office Viewer渲染真实内容</p>
            <p dangerouslySetInnerHTML={{ __html: scenarioInfo }}></p>
          </div>
        </div>
      </div>
    );
  };

  // 图片预览
  const renderImagePreview = () => {
    return (
      <div className="bg-gray-100 flex items-center justify-center h-full">
        <div style={{ transform: `scale(${zoom / 100})` }}>
          {/* 这里只是示例，实际应用中会加载真实图片 */}
          <div className="bg-white p-4 shadow-lg rounded">
            <div className="text-center text-gray-500 mb-4">图片预览: {document.name}</div>
            <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
              <FaFileImage className="text-gray-400 text-5xl" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 文本预览
  const renderTextPreview = () => {
    return (
      <div className="bg-gray-100 flex items-center justify-center h-full">
        <div className="bg-white shadow-lg p-10 rounded w-full max-w-4xl" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="text-xl font-bold mb-4">文本预览</div>
          <div className="text-gray-500 mb-4">文件: {document.name}</div>
          <div className="border border-gray-300 p-4 mb-4 text-left font-mono text-sm">
            <p>// 这里是文本文件的内容预览示例</p>
            <p>// 在实际应用中，将显示真实文本内容</p>
            <p>console.log("这是一个示例文本文件");</p>
            <p>console.log("适用于智能客服系统和实时数据分析管道场景");</p>
            <p>// 更多内容...</p>
          </div>
        </div>
      </div>
    );
  };

  // 不支持的文件类型预览
  const renderUnsupportedPreview = () => {
    return (
      <div className="bg-gray-100 flex items-center justify-center h-full">
        <div className="bg-white shadow-lg p-10 rounded text-center">
          <div className="text-xl font-bold mb-4">无法预览</div>
          <div className="text-gray-500 mb-4">
            <p>文件: {document.name}</p>
            <p>文件类型: {document.type} 暂不支持预览</p>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            下载文件
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative w-11/12 max-w-6xl h-[80vh]'} bg-white rounded-lg shadow-xl overflow-hidden`}>
      {/* 顶部工具栏 */}
      <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-b">
        <div className="flex items-center">
          {getDocumentIcon()}
          <h3 className="ml-2 text-lg font-medium text-gray-700 truncate">{document.name}</h3>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleFullscreen}
            className="text-gray-600 hover:text-gray-800"
            aria-label={isFullscreen ? "退出全屏" : "全屏预览"}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="关闭预览"
          >
            <FaTimes />
          </button>
        </div>
      </div>
      
      {/* 文档内容 */}
      <div className="flex-1 overflow-auto h-[calc(100%-6rem)]">
        {renderPreview()}
      </div>
      
      {/* 底部工具栏 */}
      <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-t">
        <div className="flex items-center space-x-4">
          {/* 页面导航（仅适用于多页文档） */}
          {['pdf', 'docx', 'pptx'].includes(document.type) && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={prevPage}
                disabled={currentPage <= 1}
                className={`p-1 rounded ${currentPage <= 1 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}`}
                aria-label="上一页"
              >
                <FaChevronLeft />
              </button>
              <span className="text-sm text-gray-600">
                第 {currentPage} 页 / 共 {totalPages} 页
              </span>
              <button 
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                className={`p-1 rounded ${currentPage >= totalPages ? 'text-gray-400' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}`}
                aria-label="下一页"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 缩放控制 */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={zoomOut}
              disabled={zoom <= 50}
              className={`p-1 rounded ${zoom <= 50 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}`}
              aria-label="缩小"
            >
              -
            </button>
            <button 
              onClick={resetZoom}
              className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
            >
              {zoom}%
            </button>
            <button 
              onClick={zoomIn}
              disabled={zoom >= 200}
              className={`p-1 rounded ${zoom >= 200 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}`}
              aria-label="放大"
            >
              +
            </button>
          </div>
          
          {/* 下载按钮 */}
          <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800">
            <FaDownload />
            <span>下载</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocPreview;
