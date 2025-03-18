'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  type ChartOptions
} from 'chart.js';
import { useState } from 'react';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

export default function Dashboard() {
  const [selectedBranches] = useState(['REL_13_STABLE', 'REL_14_STABLE']);

  // Chart configuration
  const chartData = {
    labels: ['Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15', 'Jan 16'],
    datasets: selectedBranches.map((branch, index) => ({
      label: branch,
      data: [540000, 550000, 557000, 564000, 570000, 567000, 573000].map(value => value + (index * 20000)),
      borderColor: index === 0 ? 'rgb(59, 130, 246)' : 'rgb(99, 102, 241)',
      backgroundColor: index === 0 ? 'rgba(59, 130, 246, 0.5)' : 'rgba(99, 102, 241, 0.5)',
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'white',
        titleColor: 'black',
        bodyColor: 'black',
        borderColor: 'rgb(229, 231, 235)',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 12,
        },
        titleFont: {
          size: 12,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        type: 'linear',
        beginAtZero: false,
        grid: {
          color: 'rgb(243, 244, 246)',
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: (value) => {
            if (typeof value === 'number') {
              return new Intl.NumberFormat('en-US', {
                notation: 'compact',
                compactDisplay: 'short',
              }).format(value);
            }
            return '';
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Builds</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">3,234</h3>
            </div>
            <span className="text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full">+10%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Build Time</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">220s</h3>
            </div>
            <span className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full">-2%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">98.5%</h3>
            </div>
            <span className="text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full">+15%</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Build Performance Trend</h3>
          <div className="flex items-center space-x-2">
            {selectedBranches.map((branch, index) => (
              <div key={branch} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-indigo-500'}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{branch}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Build List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Builds</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Build</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Commit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">#1234</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">REL_13_STABLE</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Success</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">3m 45s</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">3850fcca</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 