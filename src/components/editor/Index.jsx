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
        console.log('Fetching data for category:', filter);
        const response = await fetch(`${API_URL}/editor/${filter}`);
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        console.log('Received data:', result);
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const handleFilterChange = (target) => {
    setFilter(target);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Filter onStateChange={handleFilterChange} />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Filter onStateChange={handleFilterChange} />
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Filter onStateChange={handleFilterChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length > 0 ? (
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
          <p className="text-gray-600 dark:text-gray-400 col-span-full text-center">
            No editors available in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Index;