import { FilterSortOptions } from '../types';

interface Item {
  [key: string]: any;
}

/**
 * Filters an array of items based on a search string
 * @param items - The array to filter
 * @param filterValue - The search string
 * @param searchFields - Fields to search in (e.g., ['name', 'email'])
 * @returns Filtered array
 */
export const filterItems = <T extends Item>(
  items: T[], 
  filterValue: string, 
  searchFields: string[]
): T[] => {
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
 * @param items - The array to sort
 * @param sortField - The field to sort by
 * @param sortOrder - The sort direction ('asc' or 'desc')
 * @returns Sorted array
 */
export const sortItems = <T extends Item>(
  items: T[], 
  sortField: string, 
  sortOrder: 'asc' | 'desc'
): T[] => {
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
 * @param items - The array to process
 * @param options - Filter and sort options
 * @returns Filtered and sorted array
 */
export const filterAndSortItems = <T extends Item>(
  items: T[], 
  options: FilterSortOptions
): T[] => {
  const { filterValue, sortField, sortOrder, searchFields } = options;
  const filtered = filterItems(items, filterValue, searchFields || []);
  return sortItems(filtered, sortField, sortOrder);
};

/**
 * Returns search fields for different table types
 * @param type - The table type ('advisors', 'accounts', 'holdings')
 * @returns Array of field names to search in
 */
export const getSearchFields = (type: string): string[] => {
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