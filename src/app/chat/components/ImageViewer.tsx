'use client';

import { useState } from 'react';
import { Image, Modal, Button, Tooltip } from 'antd';
import { 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  FullscreenOutlined,
  EditOutlined
} from '@ant-design/icons';
import { Attachment } from '../types';
import ImageEditor from './ImageEditor';

interface ImageViewerProps {
  src: string;
  attachments?: Attachment[];
}

export default function ImageViewer({ src, attachments = [] }: ImageViewerProps) {
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentImage, setCurrentImage] = useState(src);
  const [rotation, setRotation] = useState(0);

  // 处理图片编辑
  const handleEdit = () => {
    setEditMode(true);
  };

  // 保存编辑后的图片
  const handleSaveEdit = (editedImageUrl: string) => {
    setCurrentImage(editedImageUrl);
    setEditMode(false);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditMode(false);
  };

  // 下载图片
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 旋转图片
  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="image-viewer">
      <div 
        className="relative cursor-pointer rounded overflow-hidden inline-block"
        onClick={() => setVisible(true)}
      >
        <img 
          src={currentImage}
          alt="附件图片"
          className="max-w-full max-h-56 object-contain"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
          点击查看大图
        </div>
      </div>

      {/* 全屏图片查看器 */}
      <div style={{ display: 'none' }}>
        <Image
          src={currentImage}
          preview={{
            visible,
            onVisibleChange: (vis) => setVisible(vis),
            toolbarRender: (_, { transform: { scale }, actions: { onZoomIn, onZoomOut } }) => (
              <div className="flex space-x-2">
                <Tooltip title="缩小">
                  <Button 
                    type="text" 
                    icon={<ZoomOutOutlined />} 
                    onClick={onZoomOut}
                  />
                </Tooltip>
                <Tooltip title="放大">
                  <Button 
                    type="text" 
                    icon={<ZoomInOutlined />} 
                    onClick={onZoomIn}
                  />
                </Tooltip>
                <Tooltip title="向左旋转">
                  <Button 
                    type="text" 
                    icon={<RotateLeftOutlined />} 
                    onClick={handleRotateLeft}
                  />
                </Tooltip>
                <Tooltip title="向右旋转">
                  <Button 
                    type="text" 
                    icon={<RotateRightOutlined />} 
                    onClick={handleRotateRight}
                  />
                </Tooltip>
                <Tooltip title="编辑图片">
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    onClick={handleEdit}
                  />
                </Tooltip>
                <Tooltip title="下载">
                  <Button 
                    type="text" 
                    icon={<DownloadOutlined />} 
                    onClick={handleDownload}
                  />
                </Tooltip>
              </div>
            ),
          }}
        />
      </div>

      {/* 图片编辑器模态框 */}
      <Modal
        title="图片编辑"
        open={editMode}
        onCancel={handleCancelEdit}
        footer={null}
        width={800}
      >
        <ImageEditor
          imageUrl={currentImage}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      </Modal>
    </div>
  );
}
