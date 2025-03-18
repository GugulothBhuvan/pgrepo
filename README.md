# Postgres Performance Analytics Dashboard

A modern web application built with Next.js for visualizing and analyzing PostgreSQL performance test results across different branches and environments.

## Features

- 📊 Interactive Performance Visualization
  - Line graphs showing performance metrics over time
  - Table view for detailed data analysis
  - Zoom and pan capabilities for detailed data exploration

- 🔍 Advanced Filtering
  - Filter by test types (OLTP, DSS)
  - Branch-based filtering with multi-select capability
  - Plant/environment-specific data views

- 📱 Modern UI/UX
  - Clean, responsive design
  - Split-view layout for efficient workspace utilization
  - Interactive tables with sorting and hover states
  - Dark/Light mode support

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with React-Chartjs-2
- **Layout**: React-Split for resizable panels
- **Data Visualization**: 
  - Chartjs-plugin-zoom for interactive charts
  - Date-fns adapter for time-series data

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── components/     # React components
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main dashboard page
├── public/
│   └── image.png      # Postgres logo
└── package.json       # Project dependencies
```

## Features in Detail

### Performance Tests
- Database Test 2 (OLTP)
- Database Test 3 (DSS)
- Database Test 5 (OLTP)
- Database Test 7 (DSS)

### Branch Management
Supports multiple branch types:
- Stable releases (REL_XX_STABLE)
- Main branch
- Development branch
- Testing branch
- Feature branches

### Data Visualization
- Interactive line charts
- Detailed tooltips with commit information
- Performance metric comparisons
- Time-series analysis

### Plant Management
- Multiple plant environments
- Admin and host information
- Result count tracking
- Environment-specific metrics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
