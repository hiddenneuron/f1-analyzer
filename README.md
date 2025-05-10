# F1 Performance Analyzer

A React application to compare Formula 1 drivers based on their career statistics and provides a basic AI-like analysis.

## Features

* Select two F1 drivers from a dropdown list.
* View key statistics (Wins, Podiums, Poles) side-by-side in cards.
* Visualize statistics comparison using a bar chart.
* Toggle between card view and graph view for stats.
* Get a simple comparative analysis between the selected drivers.
* Responsive design with a dark theme suitable for F1 enthusiasts.

## Project Structure

f1-performance-analyzer/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── data/
│   │       └── drivers.json  # Driver stats data
│   ├── components/           # React components
│   │   ├── AIAnalysis.css
│   │   ├── AIAnalysis.js
│   │   ├── DriverSelection.css
│   │   ├── DriverSelection.js
│   │   ├── Header.css
│   │   ├── Header.js
│   │   ├── StatsComparison.css
│   │   └── StatsComparison.js
│   ├── styles/               # Global styles
│   │   └── global.css
│   ├── App.js                # Main application component
│   └── index.js              # Entry point
├── .gitignore
├── package-lock.json
├── package.json
└── README.md


## Setup and Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd f1-performance-analyzer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *Note: This project uses `react-chartjs-2` and `chart.js`. Ensure they are installed.*
    ```bash
    npm install react-chartjs-2 chart.js
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```
    This will open the application in your default browser, usually at `http://localhost:3000`.

## Key Technologies

* React
* Chart.js (via `react-chartjs-2`)
* CSS Modules / Standard CSS
* JavaScript (ES6+)

## Enhancements & Future Work

* Fetch driver data from a dedicated API instead of a static JSON file.
* Implement more sophisticated AI analysis (e.g., using NLP or a simple ML model).
* Add more detailed driver statistics (fastest laps, championships, race entries, etc.).
* Include team information and history.
* Add filtering or searching capabilities for drivers.
* Improve chart interactions and add more chart types (e.g., line charts for performance over seasons).
* Enhance accessibility.
* Add unit and integration tests.