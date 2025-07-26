# React Query Param Filters

This repository showcases a robust and reusable pattern for managing application state, specifically filters and pagination, directly through URL query parameters in a React application. This approach significantly enhances the user experience by making report views shareable, bookmarkable, and persistent across browser sessions.

The demo application displays a mock school data report, allowing users to filter by `Class`, `Gender`, and `House`, and navigate through paginated results. All applied filters and pagination states are reflected in the URL.

**Live Demo:** [https://react-query-param-filters.vercel.app/](https://react-query-param-filters.vercel.app/)

**GitHub Repository:** [https://github.com/sarthaks225/react-query-param-filters.git](https://github.com/sarthaks225/react-query-param-filters.git)

## 🌟 Features

- **URL Synchronization:** All filter selections (multi-select dropdowns) and pagination states (page number, items per page) are automatically synchronized with the URL's query parameters.

- **Shareable & Bookmarkable URLs:** Users can easily share the exact view of a report or bookmark it for future access.

- **Generic `Report` Component:** A highly reusable component that abstracts away the complexities of URL parsing, state management, and API integration for various reports.

- **Modular Filter UI:** The `FilterComponent` is designed as a Material-UI Drawer, providing a clean and intuitive user experience for applying filters.

- **Versatile Data Display:** The URL query mapping is not limited to just table data; it can be extended to control the state of **graphical data** (charts, dashboards) as well, ensuring a consistent and shareable view across different data visualizations.

- **Mock API Integration:** Includes a mock API to simulate backend data fetching, making the demo self-contained and easy to run.

- **Material-UI (MUI):** Utilizes MUI components for a modern and consistent UI.

- **Responsive Design:** Built with MUI's responsive capabilities to ensure optimal viewing on different screen sizes.

## 🚀 How it Works

The core of this solution lies in the generic `Report` component, which acts as an orchestrator:

1.  **Initialization from URL:** On component mount, the `Report` component parses the current URL's query parameters (e.g., `?page=1&limit=20&studentClass[]=8&gender[]=Female`) to initialize its internal state for pagination and filters. This ensures that if a user lands on a bookmarked URL or refreshes the page, the report automatically loads with the correct filters and pagination applied.

2.  **State to URL Synchronization:** Any changes to the `pageNumber`, `itemsPerPage`, or `appliedFilter` state within the `Report` component trigger a `useEffect` hook. This hook constructs a new URL query string and updates the browser's history using `react-router-dom`'s `navigate` function. This keeps the URL always in sync with the displayed report state.

3.  **Data Fetching:** Another `useEffect` hook in the `Report` component is responsible for triggering the `getReport` API call whenever the pagination or filter state changes. It consolidates the current state into an `apiParams` object and passes it to the `getReport` function.

4.  **Generic & Reusable:** The `Report` component is designed to be generic. It accepts props like:

    - `getReport`: An asynchronous function that mimics your backend API call.

    - `dataKey`: The key within the API response object that holds the actual list of data items (e.g., `"schoolInfo"`).

    - `allowedFilterKeys`: An array of strings representing the actual URL query parameter keys (e.g., `"studentClass"`, `"gender"`). This acts as a whitelist for parsing URL parameters.

5.  **Filter Component (`FilterComponent.jsx`):** This component is a presentational UI for applying filters. It maintains a `tempFilters` state, allowing users to make multiple selections before committing them via an "Apply Filters" button. It also handles reverting changes if the drawer is closed without applying. Importantly, it validates incoming URL filter values against available options to prevent displaying invalid selections.

## 📁 Project Structure

The project is organized into a clear and modular directory structure:

```bash
src/
├── App.jsx                 # Main application component, sets up routing and theme.
├── components/
│   ├── Report/             # Contains generic report-related components
│   │   ├── Report.jsx      # The core generic report logic component
│   │   ├── FilterComponent.jsx # UI for filter drawer
│   │   ├── DynamicTable.jsx    # UI for displaying data in a table
│   │   ├── Loader.jsx          # Simple loading indicator
│   │   └── Snackbar.jsx        # Simple notification component
├── data/
│   └── mockApi.js          # Mock API functions and hardcoded data
├── pages/
│   └── SchoolDataPage.jsx  # Specific page demonstrating Report component usage
├── theme/
│   └── muiTheme.js         # Material-UI custom theme definition
└── index.js                # Application entry point (renders App.jsx)
```

## 🛠️ Setup and Running

To get this project up and running on your local machine:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/sarthaks225/react-query-param-filters.git
    cd react-query-param-filters
    ```

    (Replace `<repository-url>` with the actual URL of your Git repository.)

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

    First, ensure you have react and react-dom installed, which are typically part of your initial React project setup. Then, install the necessary libraries:

    ```bash
    npm install react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material
    # or
    yarn add react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material
    ```

3.  **Start the development server:**

    ```bash
    npm start
    # or
    yarn start
    ```

    The application should open in your browser, typically at `http://localhost:3000`.

## ⚙️ Customization and Modification

This project is designed to be easily adaptable for different reports and data sets.

### 1. Defining Your Report Page (`src/pages/SchoolDataPage.jsx`)

To create a new report page, you would create a new file (e.g., `SalesDataPage.jsx`) and import the `Report` component:

```javascript
// src/pages/SalesDataPage.jsx
import Report from "../components/Report/Report";
// import your actual API function here
// import { getSalesData } from "../data/api"; // Example

const SalesDataPage = () => {
  return (
    <Report
      getReport={/* your actual API function, e.g., getSalesData */}
      dataKey="salesRecords" // The key in your API response that holds the data array
      allowedFilterKeys={["regionId", "productId", "startDate", "endDate"]} // Actual URL/API keys
    />
  );
};

export default SalesDataPage;
```

Remember to add a route for your new page in `src/App.jsx`.

2. Implementing Your API Call (`src/data/mockApi.js`)

The `mockGetReport` function in `src/data/mockApi.js` simulates an API call. To integrate your actual backend:

- Replace `mockGetReport`: Modify or replace the `mockGetReport` function with your actual `fetch` or `axios` call to your backend.
- Parameter Mapping: Ensure your API call correctly consumes the `params` object (which will contain `page`, `limit`, and your `allowedFilterKeys`).
- Response Structure: Make sure your actual API response matches the expected structure:

  ```json
  {
    "dataMapping": [ // Array of objects: [{ key: 'yourDataKey', title: 'Display Title' }]
      { "key": "id", "title": "ID" },
      { "key": "name", "title": "Name" }
      // ... other columns
    ],
    "yourDataKey": [ // The array of actual data rows, matching `dataKey` prop
      { "id": 1, "name": "Item 1", ... },
      { "id": 2, "name": "Item 2", ... }
    ],
    "total": 100 // Total count of items matching filters (for pagination)
  }
  ```

- Filter Options: Update the `getMockFilterOptions` function to provide the actual options available for your filters. This is crucial for the dropdowns in `FilterComponent`.

3. Customizing Filter UI (src/components/Report/FilterComponent.jsx)

The FilterComponent.jsx is designed as the visual control panel for your report's filters, presented as a Material-UI Drawer. Its primary role is to provide an interactive way for users to select filter options, manage temporary changes, and then apply or reset those filters, all while ensuring data consistency with the URL.

- The flexibility of this component stems from its reliance on the allowedFilterKeys prop, which dictates which filters are available and how their UI elements are rendered.

- Dynamic Rendering based on allowedFilterKeys:
  The component iterates directly over the allowedFilterKeys array (e.g., ["studentClass", "gender", "house"]) passed from the Report component. For each filterKey in this array, it dynamically renders a FormControl containing a Select component. This means if you add a new filter key to allowedFilterKeys in your SchoolDataPage.jsx, a new dropdown will automatically appear in the filter drawer.

- Mapping filterKey to Display Name (getFilterName helper):
  Since URL parameters often use camelCase or specific backend keys (like "studentClass"), but UI labels should be user-friendly (like "Class"), the getFilterName helper function is crucial. This internal function contains a switch statement that explicitly maps each filterKey to its corresponding lowercase, user-friendly display name (which is then used to fetch options from getMockFilterOptions).

4. Styling and Theme (`src/theme/muiTheme.js`)

You can modify `src/theme/muiTheme.js` to change the primary/secondary colors, typography, and component-specific styles to match your application's branding.
