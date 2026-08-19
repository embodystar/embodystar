"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Zap, Cpu } from "lucide-react";

export function AnalyticsDashboard() {
  const [data, setData] = useState(
    Array.from({ length: 20 }).map((_, i) => ({
      time: i,
      latency: 40 + Math.random() * 20,
      cpu: 30 + Math.random() * 40,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        const lastTime = newData[newData.length - 1].time;
        newData.push({
          time: lastTime + 1,
          latency: 40 + Math.random() * 20,
          cpu: 30 + Math.random() * 40,
        });
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-fuchsia-400" />
          <span className="text-xs font-semibold text-neutral-200 uppercase tracking-widest">Real-time Telemetry</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800">
          <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1 flex items-center gap-1.5"><Cpu className="h-3 w-3 text-cyan-400"/> Core CPU Load</div>
          <div className="text-xl font-bold text-white">{data[data.length - 1].cpu.toFixed(1)}%</div>
        </div>
        <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800">
          <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1 flex items-center gap-1.5"><Zap className="h-3 w-3 text-purple-400"/> API Latency</div>
          <div className="text-xl font-bold text-white">{data[data.length - 1].latency.toFixed(1)}ms</div>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="time" hide />
            <YAxis stroke="#525252" fontSize={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="latency" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}