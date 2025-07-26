// This component is a specific page that uses the generic Report component.
import Report from "../components/Report/Report";
import { mockGetReport } from "../data/mockApi";

const SchoolDataPage = () => {
  return (
    <Report
      getReport={mockGetReport}
      dataKey="schoolInfo"
      allowedFilterKeys={["studentClass", "gender", "house"]}
    />
  );
};

export default SchoolDataPage;

// PROPS EXPLANATION FOR THE GENERIC REPORT COMPONENT:
//
// getReport (Function, Required):
//   - Purpose: This function is responsible for fetching the report data.
//   - Expects: An async function that takes an object of API parameters
//              ({ page, limit, ...filters }) and returns a Promise
//              resolving to an object like:
//              { dataMapping: Array, [dataKey]: Array, total: Number }.
//   - Customization: Replace `mockGetReport` with your actual API call.
//
// dataKey (String, Required):
//   - Purpose: Specifies the key in the API response object that holds the
//              main array of report data (e.g., 'schoolInfo', 'impInfo').
//   - Example: If your API returns `{ schoolInfo: [...], total: 100 }`,
//              `dataKey` should be "schoolInfo".
//
// allowedFilterKeys (Array<String>, Required):
//   - Purpose: Defines the actual query parameter keys expected in the URL
//              and by the `getReport` API function for filtering.
//   - Importance: This array is crucial for parsing URL query strings and
//                 constructing API requests. It also acts as a whitelist
//                 for valid filter keys.
//   - Example: `["studentClass", "gender", "house"]` maps to URL params
//              like `?studentClass[]=5&gender[]=Male`.
