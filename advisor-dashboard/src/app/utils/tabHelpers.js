/**
 * Filters an array of items based on a search string
 * @param {Array} items - The array to filter
 * @param {string} filterValue - The search string
 * @param {Array} searchFields - Fields to search in (e.g., ['name', 'email'])
 * @returns {Array} Filtered array
 */
export const filterItems = (items, filterValue, searchFields) => {
    if (!filterValue) return items;
    
    const lowerCaseFilter = filterValue.toLowerCase();
    return items.filter(item => 
      searchFields.some(field => 
        item[field] && item[field].toString().toLowerCase().includes(lowerCaseFilter)
      )
    );
  };
  
  /**
   * Sorts an array of items by a specific field
   * @param {Array} items - The array to sort
   * @param {string} sortField - The field to sort by
   * @param {string} sortOrder - The sort direction ('asc' or 'desc')
   * @returns {Array} Sorted array
   */
  export const sortItems = (items, sortField, sortOrder) => {
    if (!sortField) return items;
    
    return [...items].sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        // Sort Alphabetically if a string
        return sortOrder === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        // Sort Numerically if a number
        return sortOrder === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }
    });
  };
  
  /**
   * Combines filtering and sorting in one operation
   * @param {Array} items - The array to process
   * @param {Object} options - Filter and sort options
   * @returns {Array} Filtered and sorted array
   */
  export const filterAndSortItems = (items, { filterValue, sortField, sortOrder, searchFields }) => {
    const filtered = filterItems(items, filterValue, searchFields);
    return sortItems(filtered, sortField, sortOrder);
  };

  /**
 * Returns search fields for different table types
 * @param {string} type - The table type ('advisors', 'accounts', 'holdings')
 * @returns {Array} Array of field names to search in
 */
export const getSearchFields = (type) => {
    switch(type) {
      case 'advisors':
        return ['name', 'email'];
      case 'accounts':
        return ['name', 'number', 'custodian', 'repId'];
      case 'holdings':
        return ['ticker'];
      default:
        return [];
    }
  };