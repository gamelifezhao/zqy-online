import React from 'react';
import { 
  EdgeProps, 
  getSmoothStepPath, 
  getBezierPath,
  EdgeLabelRenderer,
  useReactFlow
} from 'reactflow';
import { FiX } from 'react-icons/fi';

interface CustomEdgeProps extends EdgeProps {
  onEdgeClick?: (event: React.MouseEvent, id: string) => void;
}

// 导出CustomEdge组件
export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  data,
  selected,
  sourceHandleId
}: CustomEdgeProps) => {
  const { deleteElements } = useReactFlow();
  const edgeType = data?.edgeType || 'smoothstep';
  
  // 根据边类型选择路径
  let edgePath = '';
  if (edgeType === 'bezier') {
    const [path] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    edgePath = path;
  } else {
    const [path] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    edgePath = path;
  }

  // 计算边的中点，用于放置标签和删除按钮
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  // 根据条件节点的不同输出处理标签
  let edgeLabel = label;
  if (sourceHandleId === 'true') {
    edgeLabel = '是';
  } else if (sourceHandleId === 'false') {
    edgeLabel = '否';
  }

  // 根据选中状态确定线条样式
  const edgeStyle = {
    stroke: selected ? '#6366f1' : '#9ca3af',
    strokeWidth: selected ? 2 : 1,
    ...style,
  };

  const onEdgeDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({ edges: [{ id }] });
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={edgeStyle}
        markerEnd={markerEnd}
      />
      
      {/* 边标签 */}
      {edgeLabel && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${midX}px,${midY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
              backgroundColor: 'white',
              padding: '2px 6px',
              borderRadius: 4,
              border: '1px solid #e5e7eb',
              color: '#4b5563',
            }}
          >
            {edgeLabel}
          </div>
        </EdgeLabelRenderer>
      )}
      
      {/* 删除按钮，仅在边被选中时显示 */}
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${midX}px,${midY - 20}px)`,
              fontSize: 12,
              pointerEvents: 'all',
              cursor: 'pointer',
              backgroundColor: '#f3f4f6',
              padding: '4px',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e5e7eb',
            }}
            onClick={onEdgeDelete}
            className="edgebutton"
          >
            <FiX size={12} />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
