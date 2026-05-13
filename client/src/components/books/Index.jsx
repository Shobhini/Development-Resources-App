import { useEffect, useState } from 'react';
import Card from '../Card';
import Filter from '../filter/Index';
import { useLocation } from "react-router-dom";

const API_URL = 'http://localhost:5000/api';

const Index = () => {
  const [filter, setFilter] = useState('html');
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/books/${filter}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const handleFilterChange = (target) => {
    setFilter(target);
  };

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const searchBooks = async () => {
      if (!searchQuery.trim()) {
        setSearchData([]);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/books/search/${searchQuery}`);
        if (!response.ok) {
          throw new Error('Search failed');
        }
        const results = await response.json();
        // Flatten results from all categories
        const allResults = Object.values(results).flat();
        setSearchData(allResults);
      } catch (err) {
        console.error('Search error:', err);
        setSearchData([]);
      }
    };

    searchBooks();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="m-8 mt-32 lg:mt-8">
        <Filter onStateChange={handleFilterChange} />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-8 mt-32 lg:mt-8">
        <Filter onStateChange={handleFilterChange} />
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='m-8 mt-32 lg:mt-8'>
      <Filter onStateChange={handleFilterChange} />
      <div className='flex flex-wrap gap-5'>
        {searchQuery ? (
          searchData.length > 0 ? (
            searchData.map((res, i) => (
              <Card
                key={res.title}
                title={res.title}
                link={res.link}
                description={res.description}
                i={i}
                img={res.img}
              />
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No results found for "{searchQuery}"</p>
          )
        ) : (
          data.length > 0 ? (
            data.map((res, i) => (
              <Card
                key={res.title}
                title={res.title}
                link={res.link}
                description={res.description}
                i={i}
                img={res.img}
              />
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No books available in this category.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Index;