"use client";

import { useState } from "react";

const data = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 2000 },
    { name: "Apr", sales: 2780 },
    { name: "May", sales: 1890 },
    { name: "Jun", sales: 2390 },
    { name: "Jul", sales: 3490 },
];

export default function DashboardCharts() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const maxSales = Math.max(...data.map(d => d.sales));

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales Overview</h3>

            <div className="flex items-end justify-between h-64 gap-4">
                {data.map((item, index) => {
                    const heightPercent = (item.sales / maxSales) * 100;
                    const isHovered = hoveredIndex === index;

                    return (
                        <div
                            key={item.name}
                            className="flex-1 flex flex-col items-center"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="relative w-full flex justify-center mb-2">
                                {isHovered && (
                                    <div className="absolute -top-10 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">
                                        ${item.sales.toLocaleString()}
                                    </div>
                                )}
                            </div>

                            <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                                <div
                                    className={`w-full max-w-[40px] bg-indigo-600 rounded-t transition-all duration-300 ${isHovered ? 'opacity-100 shadow-lg' : 'opacity-90'
                                        }`}
                                    style={{
                                        height: `${heightPercent}%`,
                                        transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)',
                                        transformOrigin: 'bottom'
                                    }}
                                />
                            </div>

                            <div className="mt-2 text-sm text-gray-600 font-medium">
                                {item.name}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <span>Monthly Sales</span>
                <span>Total: ${data.reduce((acc, d) => acc + d.sales, 0).toLocaleString()}</span>
            </div>
        </div>
    );
}
