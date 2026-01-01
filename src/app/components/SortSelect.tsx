// app/components/SortSelect.tsx
'use client';

import { useRouter } from 'next/navigation';

interface SortSelectProps {
  currentSort: string;
  selectedCategory: string;
  searchQuery: string;
}

export default function SortSelect({ currentSort, selectedCategory, searchQuery }: SortSelectProps) {
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    const params = new URLSearchParams();
    
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    if (sortValue !== 'featured') {
      params.set('sort', sortValue);
    }
    
    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-gray-600">Sort by:</label>
      <div className="relative">
        <select 
          name="sort"
          id="sort"
          className="appearance-none px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 bg-white cursor-pointer pr-8"
          value={currentSort}
          onChange={handleSortChange}
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name-az">Name: A-Z</option>
          <option value="name-za">Name: Z-A</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}