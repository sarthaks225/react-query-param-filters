// This file contains mock API functions and hardcoded data
// to simulate backend responses for demonstration purposes.

// Hardcoded school data for demonstration.
const allSchoolData = [
  { id: 1, name: "Alice Smith", class: 8, gender: "Female", house: "Red" },
  { id: 2, name: "Bob Johnson", class: 9, gender: "Male", house: "Green" },
  { id: 3, name: "Charlie Brown", class: 7, gender: "Male", house: "Blue" },
  { id: 4, name: "Diana Prince", class: 10, gender: "Female", house: "Yellow" },
  { id: 5, name: "Eve Adams", class: 6, gender: "Female", house: "Red" },
  { id: 6, name: "Frank White", class: 5, gender: "Male", house: "Green" },
  { id: 7, name: "Grace Lee", class: 8, gender: "Female", house: "Blue" },
  { id: 8, name: "Henry King", class: 9, gender: "Male", house: "Yellow" },
  { id: 9, name: "Ivy Queen", class: 7, gender: "Female", house: "Red" },
  { id: 10, name: "Jack Sparrow", class: 10, gender: "Male", house: "Green" },
  { id: 11, name: "Karen Davis", class: 6, gender: "Female", house: "Blue" },
  { id: 12, name: "Liam Neeson", class: 5, gender: "Male", house: "Yellow" },
  { id: 13, name: "Mia Khalifa", class: 8, gender: "Female", house: "Red" },
  { id: 14, name: "Noah Centineo", class: 9, gender: "Male", house: "Green" },
  { id: 15, name: "Olivia Rodrigo", class: 7, gender: "Female", house: "Blue" },
  { id: 16, name: "Peter Parker", class: 10, gender: "Male", house: "Yellow" },
  { id: 17, name: "Quinn Fabray", class: 6, gender: "Female", house: "Red" },
  { id: 18, name: "Ryan Gosling", class: 5, gender: "Male", house: "Green" },
  { id: 19, name: "Sarah Connor", class: 8, gender: "Female", house: "Blue" },
  { id: 20, name: "Tom Holland", class: 9, gender: "Male", house: "Yellow" },
  { id: 21, name: "Uma Thurman", class: 7, gender: "Female", house: "Red" },
  { id: 22, name: "Victor Stone", class: 10, gender: "Male", house: "Green" },
  { id: 23, name: "Wendy Darling", class: 6, gender: "Female", house: "Blue" },
  { id: 24, name: "Xavier Woods", class: 5, gender: "Male", house: "Yellow" },
  { id: 25, name: "Yara Greyjoy", class: 8, gender: "Female", house: "Red" },
  { id: 26, name: "Zack Morris", class: 9, gender: "Male", house: "Green" },
];

/**
 * Simulates an asynchronous API call to fetch report data with filtering and pagination.
 * @param {Object} params - The API parameters.
 * @param {number} params.page - The current page number (1-indexed).
 * @param {number} params.limit - The number of items per page.
 * @param {string[]} [params.studentClass] - Array of selected classes for filtering.
 * @param {string[]} [params.gender] - Array of selected genders for filtering.
 * @param {string[]} [params.house] - Array of selected houses for filtering.
 * @returns {Promise<Object>} A promise that resolves to an object containing
 * `dataMapping`, `schoolInfo` (paginated and filtered data),
 * and `total` (total items matching filters).
 */
export const mockGetReport = async (params) => {
  console.log("Mock API Call with params:", params);
  console.log("Mock API: Before simulating delay...");
  try {
    // Simulate network delay to mimic a real API call
    await new Promise((resolve) =>
      setTimeout(() => {
        console.log(
          "Mock API: setTimeout callback executed (resolving promise)."
        );
        resolve();
      }, 500)
    );
  } catch (error) {
    console.error("Mock API: Error during delay simulation:", error);
  }

  const { page, limit, studentClass, gender, house } = params;

  // Apply filters to the full dataset
  let filteredData = allSchoolData.filter((item) => {
    let match = true;

    // Filter by class if studentClass array is provided and has selections
    if (
      studentClass &&
      Array.isArray(studentClass) &&
      studentClass.length > 0
    ) {
      // Ensure comparison is consistent (e.g., convert item.class to string)
      match = match && studentClass.includes(item.class.toString());
    }
    // Filter by gender if gender array is provided and has selections
    if (gender && Array.isArray(gender) && gender.length > 0) {
      match = match && gender.includes(item.gender);
    }
    // Filter by house if house array is provided and has selections
    if (house && Array.isArray(house) && house.length > 0) {
      match = match && house.includes(item.house);
    }
    return match;
  });

  const totalItems = filteredData.length;
  // Apply pagination to the filtered data
  const startIndex = (page - 1) * limit;
  const paginatedData = filteredData.slice(startIndex, startIndex + limit);

  // Define how table columns should be mapped and displayed
  const dataMapping = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "class", title: "Class" },
    { key: "gender", title: "Gender" },
    { key: "house", title: "House" },
  ];

  console.log("Mock API: Data prepared and returning.");
  return {
    dataMapping: dataMapping,
    schoolInfo: paginatedData, // Key must match the `dataKey` prop in Report component
    total: totalItems,
  };
};

/**
 * Provides mock options for filter dropdowns based on filter name.
 * @param {string} filterName - The user-friendly name of the filter (e.g., "class").
 * @returns {string[]} An array of available options for the given filter.
 */
export const getMockFilterOptions = (filterName) => {
  switch (filterName) {
    case "class":
      return ["5", "6", "7", "8", "9", "10"];
    case "gender":
      return ["Male", "Female"];
    case "house":
      return ["Red", "Green", "Blue", "Yellow"];
    default:
      return [];
  }
};
