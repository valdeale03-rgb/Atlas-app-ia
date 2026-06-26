import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
}

export function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="bg-[#2a2218] rounded-2xl p-4 text-center border border-[#c9a84c]/10">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold text-[#e8d5a3]">{value}</div>
      <div className="text-[#8b7355] text-xs">{label}</div>
    </div>
  );
}
