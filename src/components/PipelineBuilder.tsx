"use client";

import React, { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 50, y: 50 }, data: { label: 'Lidar Sensor (Input)' }, type: 'input', style: { background: '#0a0a0a', color: '#06b6d4', border: '1px solid #06b6d4', borderRadius: '8px' } },
  { id: '2', position: { x: 50, y: 150 }, data: { label: 'Stereo Camera (Input)' }, type: 'input', style: { background: '#0a0a0a', color: '#06b6d4', border: '1px solid #06b6d4', borderRadius: '8px' } },
  { id: '3', position: { x: 300, y: 100 }, data: { label: 'Embodystar Neural Planner' }, style: { background: '#0a0a0a', color: '#a855f7', border: '1px solid #a855f7', borderRadius: '8px', padding: '10px' } },
  { id: '4', position: { x: 550, y: 50 }, data: { label: 'Actuator Torque (Output)' }, type: 'output', style: { background: '#0a0a0a', color: '#22c55e', border: '1px solid #22c55e', borderRadius: '8px' } },
  { id: '5', position: { x: 550, y: 150 }, data: { label: 'Nav Steering (Output)' }, type: 'output', style: { background: '#0a0a0a', color: '#22c55e', border: '1px solid #22c55e', borderRadius: '8px' } },
];

const initialEdges = [
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#06b6d4' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#06b6d4' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#a855f7' } },
  { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#a855f7' } },
];

export function PipelineBuilder() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="w-full h-[400px] bg-[#0c0a09] rounded-xl border border-neutral-900/70 overflow-hidden relative" style={{ color: 'black' }}>
       <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur border border-neutral-800 px-3 py-1.5 rounded-md text-[10px] font-mono text-cyan-400">
        INTERACTIVE PIPELINE BUILDER
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-[#0c0a09]"
      >
        <Controls style={{ fill: '#404040' }} />
        <Background color="#262626" gap={16} />
      </ReactFlow>
    </div>
  );
}