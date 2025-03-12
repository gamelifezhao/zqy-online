'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Progress, Tooltip } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  DownloadOutlined, 
  SoundOutlined 
} from '@ant-design/icons';

interface VoiceMessageProps {
  src: string;
  duration?: number; // 音频时长，单位秒
}

export default function VoiceMessage({ src, duration = 0 }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // 初始化音频
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.preload = 'metadata';
      
      audioRef.current.onloadedmetadata = () => {
        if (audioRef.current) {
          setAudioDuration(audioRef.current.duration);
        }
      };
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [src]);

  // 更新音频进度
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  // 播放/暂停音频
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(updateProgress);
    }
    
    setIsPlaying(!isPlaying);
  };

  // 跳转到指定位置
  const seekAudio = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !waveformRef.current) return;
    
    const rect = waveformRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const newTime = ratio * audioDuration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 下载音频
  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `voice-message-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 生成一个简单的音频波形图
  const generateWaveformBars = () => {
    // 这里可以根据实际音频特征生成更真实的波形
    // 这个例子只是创建一个随机的视觉波形
    const bars = [];
    const barCount = 30;
    
    for (let i = 0; i < barCount; i++) {
      // 随机高度，但在中间位置会更高，模拟真实波形
      let height;
      const middle = barCount / 2;
      const distanceFromMiddle = Math.abs(i - middle);
      const variance = 1 - distanceFromMiddle / middle; // 越接近中间，值越接近1
      
      height = 10 + Math.random() * 25 * variance;
      
      bars.push(
        <div 
          key={i}
          className="bg-blue-500"
          style={{ 
            height: `${height}px`, 
            width: '2px',
            margin: '0 1px',
            opacity: currentTime / audioDuration > i / barCount ? 1 : 0.5
          }}
        />
      );
    }
    
    return bars;
  };

  return (
    <div className="voice-message p-3 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-sm">
      <div className="flex items-center space-x-3">
        <Button
          type="text"
          shape="circle"
          size="large"
          icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={togglePlay}
          className="text-xl"
        />
        
        <div className="flex-1">
          <div 
            ref={waveformRef}
            className="flex items-center h-10 cursor-pointer"
            onClick={seekAudio}
          >
            {generateWaveformBars()}
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(audioDuration)}</span>
          </div>
        </div>
        
        <Tooltip title="下载音频">
          <Button
            type="text"
            shape="circle"
            icon={<DownloadOutlined />}
            onClick={downloadAudio}
          />
        </Tooltip>
      </div>
    </div>
  );
}
