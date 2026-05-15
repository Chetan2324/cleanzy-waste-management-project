import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import '../../assets/css/AdminDashboard.css';

const DashboardCharts = ({ pickupData, pieData }) => {
  return (
    <div className="analytics-grid">
      
      {/* AREA CHART */}
      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>Weekly Waste Collection</h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer>
            <AreaChart data={pickupData}>
              <defs>
                <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="#71717a" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis stroke="#71717a" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff' }}
                itemStyle={{ color: '#22c55e' }}
              />
              <Area type="monotone" dataKey="waste" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorWaste)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHART */}
      <div className="glass-card flex-center" style={{ flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Issue Status</h3>
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          {pieData.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#a1a1aa' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }}></div>
              {item.name}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardCharts;