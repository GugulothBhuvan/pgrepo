'use client';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { useState } from 'react';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import Split from 'react-split';

// Register ChartJS components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin // Register the zoom plugin
);

export default function Home() {
  // Sample branches data
  const branches = [
    'REL_13_STABLE',
    'REL_14_STABLE',
    'REL_15_STABLE',
    'REL_16_STABLE',
    'REL_17_STABLE',
    'main',
    'DEVEL',
    'TESTING',
    'FEATURE_A',
    'FEATURE_B'
  ];

  // Sample build data with multiple branches and more data points
  const buildData = [
    // REL_13_STABLE data
    {
      buildNumber: 101,
      branch: 'REL_13_STABLE',
      revision: '3850fcca69b5',
      metric: 564578.0,
      timestamp: '2024-02-01',
      description: 'Improve query performance',
    },
    {
      buildNumber: 102,
      branch: 'REL_13_STABLE',
      metric: 557362.69,
      timestamp: '2024-02-15',
      revision: '9061fd23c28f',
      description: 'Optimize hash joins',
    },
    {
      buildNumber: 103,
      branch: 'REL_13_STABLE',
      metric: 570000.0,
      timestamp: '2024-03-01',
      revision: 'a1234567890b',
      description: 'Indexing improvements',
    },
    // REL_14_STABLE data
    {
      buildNumber: 201,
      branch: 'REL_14_STABLE',
      metric: 580000.0,
      timestamp: '2024-02-01',
      revision: 'a850fcca69b5',
      description: 'Enhanced indexing',
    },
    {
      buildNumber: 202,
      branch: 'REL_14_STABLE',
      metric: 585000.0,
      timestamp: '2024-02-15',
      revision: 'b061fd23c28f',
      description: 'Memory optimization',
    },
    {
      buildNumber: 203,
      branch: 'REL_14_STABLE',
      metric: 590000.0,
      timestamp: '2024-03-01',
      revision: 'b1234567890c',
      description: 'Query planner updates',
    },
    // REL_15_STABLE data
    {
      buildNumber: 301,
      branch: 'REL_15_STABLE',
      metric: 590000.0,
      timestamp: '2024-02-01',
      revision: 'c850fcca69b5',
      description: 'Parallel query improvements',
    },
    {
      buildNumber: 302,
      branch: 'REL_15_STABLE',
      metric: 595000.0,
      timestamp: '2024-02-15',
      revision: 'd061fd23c28f',
      description: 'Query planner updates',
    },
    {
      buildNumber: 303,
      branch: 'REL_15_STABLE',
      metric: 600000.0,
      timestamp: '2024-03-01',
      revision: 'c1234567890d',
      description: 'Optimizer enhancements',
    },
  ];

  // State for selected branches
  const [selectedBranches, setSelectedBranches] = useState(['REL_13_STABLE', 'REL_14_STABLE']);
  // Add view mode state to include bar chart
  const [viewMode, setViewMode] = useState<'graph' | 'table' | 'comparison'>('graph');
  
  // Add type for build data
  type BuildData = {
    buildNumber: number;
    branch: string;
    revision: string;
    metric: number;
    timestamp: string;
    description: string;
  };

  // Add type for sort config
  type SortKey = keyof BuildData;

  // Add sorting state with proper typing
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc';
  }>({
    key: 'timestamp',
    direction: 'asc'
  });

  // Sorting function for table data with proper typing
  const sortedData = () => {
    const filteredData = buildData.filter(build => selectedBranches.includes(build.branch));
    return [...filteredData].sort((a: BuildData, b: BuildData) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Sort request handler with proper typing
  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Add this plants data
  const plants = [
    { name: 'Plant A', results: 156, admin: 'Admin1', host: 'host1.example.com' },
    { name: 'Plant B', results: 234, admin: 'Admin2', host: 'host2.example.com' },
    { name: 'Plant C', results: 189, admin: 'Admin3', host: 'host3.example.com' },
  ];

  // Chart configuration
  const chartData = {
    labels: [...new Set(buildData.map(build => build.timestamp))], // Unique timestamps
    datasets: selectedBranches.map(branch => ({
      label: branch,
      data: buildData
        .filter(build => build.branch === branch)
        .map(build => ({
          x: build.timestamp,
          y: build.metric,
        })),
      borderColor: branch === 'REL_13_STABLE' ? 'rgb(75, 192, 192)' :
                  branch === 'REL_14_STABLE' ? 'rgb(255, 99, 132)' :
                  'rgb(153, 102, 255)',
      tension: 0.4,  // Increase the tension value for more curvature
      pointRadius: 6,
      pointHoverRadius: 8,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          afterBody: (context: any) => {
            const dataIndex = context[0].dataIndex;
            const datasetIndex = context[0].datasetIndex;
            const branch = selectedBranches[datasetIndex];
            const build = buildData.find(b => 
              b.branch === branch && 
              b.timestamp === chartData.labels[dataIndex]
            );
            return build ? [
              `Branch: ${build.branch}`,
              `Commit: ${build.revision}`,
              `Description: ${build.description}`,
            ] : [];
          },
        },
      },
      legend: {
        position: 'top' as const,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy' as const,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy' as const,
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Performance Score',
        },
      },
    },
  };

  // Add state for branch comparison
  const [comparisonBranches, setComparisonBranches] = useState<{
    [key: string]: string
  }>({
    'Plant A': 'REL_13_STABLE',
    'Plant B': 'REL_14_STABLE',
    'Plant C': 'REL_15_STABLE',
  });

  // Function to get latest metric for a branch
  const getLatestMetric = (branch: string) => {
    const branchData = buildData
      .filter(build => build.branch === branch)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return branchData[0]?.metric || 0;
  };

  // Bar chart configuration
  const barChartData = {
    labels: plants.map(plant => plant.name),
    datasets: [{
      label: 'Latest Performance Score',
      data: plants.map(plant => getLatestMetric(comparisonBranches[plant.name])),
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderColor: [
        'rgb(75, 192, 192)',
        'rgb(255, 99, 132)',
        'rgb(153, 102, 255)',
      ],
      borderWidth: 1,
      minBarLength: 10, // Add minimum bar length to ensure visibility
    }],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const plantName = context.label;
            const branch = comparisonBranches[plantName];
            const latestBuild = buildData
              .filter(build => build.branch === branch)
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            
            return [
              `Branch: ${branch}`,
              `Score: ${context.raw.toFixed(2)}`,
              `Build: #${latestBuild?.buildNumber || 'N/A'}`,
              `Commit: ${latestBuild?.revision || 'N/A'}`,
              `Date: ${latestBuild?.timestamp || 'N/A'}`,
              `Description: ${latestBuild?.description || 'N/A'}`
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Start from zero to show full bar length
        title: {
          display: true,
          text: 'Performance Score',
        },
        ticks: {
          // Add callback to format large numbers
          callback: function(value: any) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K';
            }
            return value;
          }
        },
        // Add a suggested minimum to prevent scale from being too compressed
        suggestedMin: Math.min(...plants.map(plant => getLatestMetric(comparisonBranches[plant.name]))) * 0.9,
      },
      x: {
        title: {
          display: true,
          text: 'Plants',
        },
      },
    },
    // Add animation configuration
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
    // Improve bar chart layout
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      }
    },
    // Add hover effects
    hover: {
      mode: 'point' as const,
      intersect: true,
    },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-extrabold text-gray-900">Postgres</span>
              </div>
            </div>
            <div className="flex items-center">
              <button className="text-gray-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-100 transition">
                Log In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Split className="flex" sizes={[35, 65]} minSize={200} expandToMin>
        <div className="flex flex-col gap-6 p-6">
          {/* Upper Right - Selection and Performance Tests */}
          <section className="bg-white rounded-lg shadow-md p-6">
            {/* Filters */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Filters</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branches
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {branches.map(branch => (
                      <div key={branch} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`branch-${branch}`}
                          value={branch}
                          checked={selectedBranches.includes(branch)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBranches([...selectedBranches, branch]);
                            } else {
                              setSelectedBranches(selectedBranches.filter(b => b !== branch));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`branch-${branch}`}
                          className="ml-2 text-sm text-gray-700 whitespace-nowrap"
                        >
                          {branch}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Tests Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700">
                      Performance Test
                    </th>
                    <th className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200 text-sm text-blue-600">
                      <a href="pf/dbt2">Database Test 2</a>
                    </td>
                    <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                      OLTP
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200 text-sm text-blue-600">
                      <a href="pf/dbt3">Database Test 3</a>
                    </td>
                    <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                      DSS
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200 text-sm text-blue-600">
                      <a href="pf/dbt5">Database Test 5</a>
                    </td>
                    <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                      OLTP
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200 text-sm text-blue-600">
                      <a href="pf/dbt7">Database Test 7</a>
                    </td>
                    <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                      DSS
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Lower Right - Plants Table */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Plants</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700">Plant</th>
                    <th className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700">Results</th>
                    <th className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700">Admin</th>
                    <th className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700">Host</th>
                  </tr>
                </thead>
                <tbody>
                  {plants.map((plant, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-200 text-sm text-blue-600">
                        <a href={`/plant/${plant.name.toLowerCase()}`}>{plant.name}</a>
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-sm text-right text-gray-900">
                        {plant.results}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                        {plant.admin}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                        {plant.host}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Left Section - Charts (65% width on desktop) */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Performance Metrics</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('graph')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                  viewMode === 'graph'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Line Graph
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                  viewMode === 'comparison'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Plant Comparison
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Table View
              </button>
            </div>
          </div>
          
          {viewMode === 'graph' ? (
            <div className="h-[600px] bg-white rounded-lg">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : viewMode === 'comparison' ? (
            <div className="space-y-4">
              <div className="h-[400px] bg-white rounded-lg p-4">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                {plants.map((plant) => (
                  <div key={plant.name} className="flex flex-col space-y-2 bg-white p-4 rounded-lg shadow-sm">
                    <label className="text-sm font-medium text-gray-700">
                      {plant.name} Branch
                    </label>
                    <div className="flex flex-col space-y-1">
                      <select
                        value={comparisonBranches[plant.name]}
                        onChange={(e) => setComparisonBranches({
                          ...comparisonBranches,
                          [plant.name]: e.target.value
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        {branches.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>
                      <div className="text-xs text-gray-500">
                        Latest Score: {getLatestMetric(comparisonBranches[plant.name]).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => requestSort('timestamp')}
                      className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      Date {sortConfig.key === 'timestamp' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      onClick={() => requestSort('branch')}
                      className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      Branch {sortConfig.key === 'branch' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      onClick={() => requestSort('buildNumber')}
                      className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      Build # {sortConfig.key === 'buildNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      onClick={() => requestSort('metric')}
                      className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      Performance Score {sortConfig.key === 'metric' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      onClick={() => requestSort('revision')}
                      className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      Commit {sortConfig.key === 'revision' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      onClick={() => requestSort('description')}
                      className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      Description {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData().map((build, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                        {build.timestamp}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                        {build.branch}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                        {build.buildNumber}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                        {build.metric.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900 font-mono">
                        {build.revision}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                        {build.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Split>
    </main>
  );
}
