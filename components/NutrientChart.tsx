import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { NutrientProfile } from '../types';

interface Props {
  target: NutrientProfile;
  actual: NutrientProfile;
}

const NutrientChart: React.FC<Props> = ({ target, actual }) => {
  const data = [
    { subject: 'Protein', A: target.protein, B: actual.protein, fullMark: 100 },
    { subject: 'Lipids', A: target.lipids, B: actual.lipids, fullMark: 100 },
    { subject: 'Carbs', A: target.carbohydrates, B: actual.carbohydrates, fullMark: 100 },
    { subject: 'Fiber', A: target.fiber, B: actual.fiber, fullMark: 20 },
    { subject: 'Ash', A: target.ash, B: actual.ash, fullMark: 20 },
    { subject: 'Moisture', A: target.moisture, B: actual.moisture, fullMark: 20 },
  ];

  return (
    <div className="h-64 w-full bg-white rounded-lg p-2 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 text-center mb-2">Nutritional Profile Analysis</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Target"
            dataKey="A"
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="#0ea5e9"
            fillOpacity={0.1}
          />
          <Radar
            name="Actual"
            dataKey="B"
            stroke="#10b981"
            strokeWidth={2}
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ fontSize: '12px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutrientChart;
