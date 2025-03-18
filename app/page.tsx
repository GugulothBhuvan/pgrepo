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
import Image from 'next/image';

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

// Add these type definitions at the top after imports
type DetailedTestResult = {
  build_number: number;
  builder_id: number;
  ctime: number;
  metric: string;
  revision: string;
  scale: number;
  timestamp: string;
  branch: string;
  log_summary_id: number;
  log_test_id: number;
};

type PlantSummary = {
  plant: string;
  admin: string;
  host: string;
  results: number;
};

type PerformanceTest = {
  id: string;
  name: string;
  description: string;
  plants: PlantSummary[];
  testResults: DetailedTestResult[];
};

// Define all plants that are available for all tests
const allPlants: PlantSummary[] = [
  { plant: 'Plant A', admin: 'Admin1', host: 'host1.example.com', results: 156 },
  { plant: 'Plant B', admin: 'Admin2', host: 'host2.example.com', results: 234 },
  { plant: 'Plant C', admin: 'Admin3', host: 'host3.example.com', results: 189 },
  { plant: 'Plant D', admin: 'Admin4', host: 'host4.example.com', results: 145 },
  { plant: 'Plant E', admin: 'Admin5', host: 'host5.example.com', results: 167 },
  { plant: 'Plant F', admin: 'Admin6', host: 'host6.example.com', results: 178 },
  { plant: 'Plant G', admin: 'Admin7', host: 'host7.example.com', results: 198 },
  { plant: 'Plant H', admin: 'Admin8', host: 'host8.example.com', results: 167 },
  { plant: 'Plant I', admin: 'Admin9', host: 'host9.example.com', results: 189 },
];

// Define all branches
const allBranches = [
  'REL_13_STABLE',
  'REL_14_STABLE',
  'REL_15_STABLE',
  'REL_16_STABLE',
  'REL_17_STABLE',
  'main',
  'DEVEL',
  'TESTING',
  'FEATURE_A',
  'FEATURE_B',
  'FEATURE_C',
  'FEATURE_D',
  'FEATURE_E',
  'FEATURE_F',
  'FEATURE_G',
  'FEATURE_H'
];

// Helper function to generate test results for a plant and branch
const generateTestResults = (plantId: number, branch: string, baseMetric: number): DetailedTestResult[] => {
  const results: DetailedTestResult[] = [];
  const dates = [
    '2024-01-01', '2024-01-15', '2024-02-01', '2024-02-15', '2024-03-01', '2024-03-15'
  ];

  // Create unique patterns for different branch types
  const branchType = branch.includes('STABLE') ? 'stable' :
                    branch === 'main' ? 'main' :
                    branch === 'DEVEL' ? 'devel' :
                    branch === 'TESTING' ? 'testing' : 'feature';
  
  // Base variations for different branch types
  const branchVariations = {
    stable: 0.95,    // Stable branches perform slightly worse but more consistently
    main: 1.0,       // Main branch is the baseline
    devel: 1.05,     // Development branch has some optimizations
    testing: 0.98,   // Testing branch is close to main
    feature: 0.92    // Feature branches might have experimental changes
  };

  // Add branch-specific random factor
  const branchRandomFactor = Math.random() * 0.1 - 0.05; // Random value between -0.05 and 0.05
  
  dates.forEach((date, index) => {
    // Create more complex variations
    const timeVariation = Math.sin(index * 0.5) * 2000; // Base time variation
    const branchSpecificVariation = Math.sin(index * 0.3 + branch.length) * 1500; // Branch-specific pattern
    const randomNoise = (Math.random() - 0.5) * 1000; // Random noise
    
    // Calculate final metric with all variations
    const branchMultiplier = branchVariations[branchType] + branchRandomFactor;
    const metric = (baseMetric * branchMultiplier + timeVariation + branchSpecificVariation + randomNoise).toFixed(2);
    
    results.push({
      build_number: 100 + index,
      builder_id: plantId,
      ctime: new Date(date).getTime() / 1000,
      metric,
      revision: `${Math.random().toString(16).substring(2, 8)}`,
      scale: 1,
      timestamp: date,
      branch,
      log_summary_id: plantId * 100 + index,
      log_test_id: plantId * 100 + index,
    });
  });
  
  return results;
};

// Mock data for performance tests
const performanceTests: PerformanceTest[] = [
  {
    id: 'dbt2',
    name: 'Database Test 2',
    description: 'OLTP',
    plants: allPlants,
    testResults: allPlants.flatMap((plant, plantIndex) =>
      allBranches.flatMap(branch =>
        generateTestResults(plantIndex + 1, branch, 550000 + plantIndex * 5000)
      )
    ),
  },
  {
    id: 'dbt3',
    name: 'Database Test 3',
    description: 'DSS',
    plants: allPlants,
    testResults: allPlants.flatMap((plant, plantIndex) =>
      allBranches.flatMap(branch =>
        generateTestResults(plantIndex + 1, branch, 580000 + plantIndex * 5000)
      )
    ),
  },
  {
    id: 'dbt5',
    name: 'Database Test 5',
    description: 'OLTP',
    plants: allPlants,
    testResults: allPlants.flatMap((plant, plantIndex) =>
      allBranches.flatMap(branch =>
        generateTestResults(plantIndex + 1, branch, 600000 + plantIndex * 5000)
      )
    ),
  },
  {
    id: 'dbt7',
    name: 'Database Test 7',
    description: 'DSS',
    plants: allPlants,
    testResults: allPlants.flatMap((plant, plantIndex) =>
      allBranches.flatMap(branch =>
        generateTestResults(plantIndex + 1, branch, 620000 + plantIndex * 5000)
      )
    ),
  },
];

export default function Home() {
  // State for selected test
  const [selectedTest, setSelectedTest] = useState<PerformanceTest | null>(null);
  // State for selected plant
  const [selectedPlant, setSelectedPlant] = useState<PlantSummary | null>(null);
  // State for selected branches
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  // Add view mode state
  const [viewMode, setViewMode] = useState<'graph' | 'table' | 'comparison'>('graph');
  
  // Get unique branches from selected test's results for selected plant
  const availableBranches = selectedTest && selectedPlant
    ? [...new Set(selectedTest.testResults
        .filter(result => result.builder_id === allPlants.findIndex(p => p.plant === selectedPlant.plant) + 1)
        .map(result => result.branch))]
    : [];

  // Filter test results based on selected plant and branches
  const filteredTestResults = selectedTest && selectedPlant
    ? selectedTest.testResults.filter(result => 
        result.builder_id === allPlants.findIndex(p => p.plant === selectedPlant.plant) + 1 &&
        selectedBranches.includes(result.branch)
      )
    : [];

  // Chart configuration
  const chartData = {
    labels: [...new Set(filteredTestResults.map(result => result.timestamp))],
    datasets: selectedBranches.map(branch => ({
      label: branch,
      data: filteredTestResults
        .filter(result => result.branch === branch)
        .map(result => ({
          x: result.timestamp,
          y: parseFloat(result.metric),
        })),
      borderColor: branch === 'REL_13_STABLE' ? 'rgb(75, 192, 192)' :
                  branch === 'REL_14_STABLE' ? 'rgb(255, 99, 132)' :
                  'rgb(153, 102, 255)',
      tension: 0.4,
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
            const build = selectedTest?.testResults.find(b => 
              b.branch === branch && 
              b.timestamp === chartData.labels[dataIndex]
            );
            return build ? [
              `Branch: ${build.branch}`,
              `Commit: ${build.revision}`,
              `Description: ${selectedTest?.description || 'N/A'}`,
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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-0 sm:px-2 lg:px-4">
          <div className="flex h-16">
            <div className="flex items-center pl-2">
              <div className="flex items-center space-x-3">
                <Image
                  src="/image.png"
                  alt="Postgres Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="text-2xl font-extrabold text-gray-900">Postgres</span>
              </div>
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
                    {availableBranches.map(branch => (
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
                  {performanceTests.map((test) => (
                    <tr 
                      key={test.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedTest?.id === test.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        setSelectedTest(test);
                        setSelectedPlant(null);
                        setSelectedBranches([]);
                      }}
                    >
                      <td className="px-4 py-2 border border-gray-200 text-sm text-blue-600">
                        {test.name}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                        {test.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Lower Right - Plants Table */}
          {selectedTest && (
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
                    {selectedTest.plants.map((plant) => (
                      <tr 
                        key={plant.plant} 
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedPlant?.plant === plant.plant ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          setSelectedPlant(plant);
                          // You could add additional logic here to filter test results by plant
                        }}
                      >
                        <td className="px-4 py-2 border border-gray-200 text-sm text-blue-600">
                          {plant.plant}
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
          )}
        </div>

        {/* Charts Section */}
        <div className="flex flex-col gap-6 p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
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
                {selectedTest && selectedBranches.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Select a test and at least one branch to view the graph
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                {selectedTest && selectedBranches.length > 0 ? (
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700">Branch</th>
                        <th className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700">Build #</th>
                        <th className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700">Metric</th>
                        <th className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700">Revision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTestResults.map((result, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                            {result.timestamp}
                          </td>
                          <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                            {result.branch}
                          </td>
                          <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                            {result.build_number}
                          </td>
                          <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900">
                            {result.metric}
                          </td>
                          <td className="px-4 py-2 border border-gray-200 text-sm text-gray-900 font-mono">
                            {result.revision}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-[600px] flex items-center justify-center text-gray-500">
                    Select a test and at least one branch to view the data
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Split>
    </main>
  );
}