'use client';

import { useState, useRef, useEffect } from 'react';
import { Slider, Button, Radio, Tabs, Space, Tooltip } from 'antd';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  ScissorOutlined,
  UndoOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const { TabPane } = Tabs;

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
}

export default function ImageEditor({ imageUrl, onSave, onCancel }: ImageEditorProps) {
  // 状态
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [filter, setFilter] = useState('none');
  const [originalImage, setOriginalImage] = useState<string>(imageUrl);
  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl);

  // 引用
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 过滤器选项
  const filters = [
    { name: '原图', value: 'none', style: {} },
    { name: '灰度', value: 'grayscale', style: { filter: 'grayscale(100%)' } },
    { name: '怀旧', value: 'sepia', style: { filter: 'sepia(100%)' } },
    { name: '高对比度', value: 'contrast', style: { filter: 'contrast(150%)' } },
    { name: '亮度增强', value: 'brightness', style: { filter: 'brightness(130%)' } },
    { name: '暗化', value: 'dark', style: { filter: 'brightness(70%)' } },
    { name: '模糊', value: 'blur', style: { filter: 'blur(2px)' } },
    { name: '锐化', value: 'sharpen', style: { filter: 'contrast(150%) brightness(110%)' } },
    { name: '冷色调', value: 'cool', style: { filter: 'saturate(80%) hue-rotate(20deg)' } },
    { name: '暖色调', value: 'warm', style: { filter: 'saturate(120%) hue-rotate(-10deg)' } },
  ];

  // 当裁剪完成时生成预览
  useEffect(() => {
    if (!completedCrop || !canvasRef.current || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    // 绘制裁剪区域
    ctx.drawImage(
      image,
      completedCrop.x,
      completedCrop.y,
      completedCrop.width,
      completedCrop.height,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    // 生成预览URL
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPreviewUrl(dataUrl);
  }, [completedCrop]);

  // 应用所有编辑效果
  const applyAllEffects = () => {
    if (!imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 原始图像
    const image = imgRef.current;
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    // 设置canvas尺寸
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;

    // 清除canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 移动到中心，应用旋转和缩放
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-naturalWidth / 2, -naturalHeight / 2);
    
    // 绘制图像
    ctx.drawImage(image, 0, 0, naturalWidth, naturalHeight);
    ctx.restore();
    
    // 应用过滤器
    if (filter !== 'none') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      switch (filter) {
        case 'grayscale':
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
          }
          break;
        case 'sepia':
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
          }
          break;
        case 'contrast':
          const factor = 259 * (150 + 255) / (255 * (259 - 150));
          for (let i = 0; i < data.length; i += 4) {
            data[i] = factor * (data[i] - 128) + 128;
            data[i + 1] = factor * (data[i + 1] - 128) + 128;
            data[i + 2] = factor * (data[i + 2] - 128) + 128;
          }
          break;
        case 'brightness':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.3);
            data[i + 1] = Math.min(255, data[i + 1] * 1.3);
            data[i + 2] = Math.min(255, data[i + 2] * 1.3);
          }
          break;
        case 'dark':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * 0.7;
            data[i + 1] = data[i + 1] * 0.7;
            data[i + 2] = data[i + 2] * 0.7;
          }
          break;
        // 其他滤镜效果可以在此扩展
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    // 应用裁剪
    if (completedCrop && isCropping) {
      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');
      if (!croppedCtx) return;
      
      croppedCanvas.width = completedCrop.width;
      croppedCanvas.height = completedCrop.height;
      
      croppedCtx.drawImage(
        canvas,
        completedCrop.x,
        completedCrop.y,
        completedCrop.width,
        completedCrop.height,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );
      
      // 获取裁剪后的图像
      const croppedImageUrl = croppedCanvas.toDataURL('image/jpeg');
      setPreviewUrl(croppedImageUrl);
      return croppedImageUrl;
    }
    
    // 获取处理后的图像
    const processedImageUrl = canvas.toDataURL('image/jpeg');
    setPreviewUrl(processedImageUrl);
    return processedImageUrl;
  };

  // 保存编辑后的图像
  const handleSave = () => {
    const editedImageUrl = applyAllEffects();
    if (editedImageUrl) {
      onSave(editedImageUrl);
    }
  };

  // 重置编辑
  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setCrop({
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25
    });
    setCompletedCrop(null);
    setIsCropping(false);
    setFilter('none');
    setPreviewUrl(originalImage);
  };

  // 切换裁剪模式
  const toggleCropMode = () => {
    setIsCropping(!isCropping);
    if (!isCropping) {
      setCrop({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
      });
    } else {
      setCrop({} as Crop);
      setCompletedCrop(null);
    }
  };

  return (
    <div className="image-editor">
      {/* 编辑工具栏 */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="调整" key="1">
          <div className="flex flex-col space-y-4 mb-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>缩放</span>
                <div className="flex items-center">
                  <Button 
                    icon={<ZoomOutOutlined />} 
                    size="small"
                    onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                  />
                  <span className="mx-2">{Math.round(scale * 100)}%</span>
                  <Button 
                    icon={<ZoomInOutlined />} 
                    size="small"
                    onClick={() => setScale(Math.min(3, scale + 0.1))}
                  />
                </div>
              </div>
              <Slider
                min={0.5}
                max={3}
                step={0.1}
                value={scale}
                onChange={setScale}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>旋转</span>
                <div className="flex items-center">
                  <Button 
                    icon={<RotateLeftOutlined />} 
                    size="small"
                    onClick={() => setRotation((rotation - 90) % 360)}
                  />
                  <span className="mx-2">{rotation}°</span>
                  <Button 
                    icon={<RotateRightOutlined />} 
                    size="small"
                    onClick={() => setRotation((rotation + 90) % 360)}
                  />
                </div>
              </div>
              <Slider
                min={0}
                max={359}
                value={rotation}
                onChange={setRotation}
              />
            </div>
            
            <div>
              <Button 
                icon={<ScissorOutlined />}
                onClick={toggleCropMode}
                type={isCropping ? "primary" : "default"}
              >
                {isCropping ? "完成裁剪" : "裁剪图像"}
              </Button>
            </div>
          </div>
        </TabPane>
        
        <TabPane tab="滤镜" key="2">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
            {filters.map((f) => (
              <div
                key={f.value}
                className={`
                  cursor-pointer border rounded p-2 text-center
                  ${filter === f.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                `}
                onClick={() => setFilter(f.value)}
              >
                <div 
                  className="w-full h-16 mb-1 bg-cover bg-center rounded"
                  style={{ 
                    backgroundImage: `url(${imageUrl})`,
                    ...f.style
                  }}
                />
                <div className="text-xs">{f.name}</div>
              </div>
            ))}
          </div>
        </TabPane>
      </Tabs>

      {/* 图像编辑区域 */}
      <div className="image-preview-container my-4 flex justify-center">
        {isCropping ? (
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            aspect={undefined}
          >
            <img
              ref={imgRef}
              src={originalImage}
              alt="编辑图像"
              style={{
                maxHeight: '50vh',
                maxWidth: '100%',
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                filter: filter !== 'none' ? filters.find(f => f.value === filter)?.style.filter : 'none',
                transition: 'transform 0.3s ease'
              }}
            />
          </ReactCrop>
        ) : (
          <img
            ref={imgRef}
            src={originalImage}
            alt="编辑图像"
            style={{
              maxHeight: '50vh',
              maxWidth: '100%',
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              filter: filter !== 'none' ? filters.find(f => f.value === filter)?.style.filter : 'none',
              transition: 'transform 0.3s ease'
            }}
          />
        )}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>

      {/* 预览区域 */}
      <div className="flex justify-between items-center border-t pt-4 mt-4">
        <Button icon={<UndoOutlined />} onClick={handleReset}>
          重置
        </Button>
        
        <div className="flex space-x-2">
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}
