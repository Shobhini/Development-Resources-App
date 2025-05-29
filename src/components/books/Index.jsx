import { useEffect, useState } from 'react';
import Card from '../Card';
import Filter from '../filter/Index';
import html from '../../database/books/html.json';
import css from '../../database/books/css.json';
import js from '../../database/books/javascript.json';
import react from '../../database/books/reactjs.json';
import tailwind from '../../database/books/tailwindcss.json';
import nextjs from '../../database/books/nextjs.json';
import { useLocation } from "react-router-dom";

const Index = () => {
  const [filter, setFilter] = useState('html');
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  let location = useLocation();

  useEffect(() => {
    if (filter === 'html') {
      setData([...html]);
    } else if (filter === 'css') {
      setData([...css]);
    } else if (filter === 'js') {
      setData([...js]);
    } else if (filter === 'tailwind') {
      setData([...tailwind]);
    } else if (filter === 'nextjs') {
      setData([...nextjs]);
    } else {
      setData([...react]);
    }
  }, [filter]);

  const handleFilterChange = (target) => {
    setFilter(target);
  };

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchData([]);
      return;
    }

    const searchTerm = searchQuery.toLowerCase().trim();
    const filteredResults = data.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = item.description.toLowerCase().includes(searchTerm);
      return titleMatch || descriptionMatch;
    });
    
    setSearchData(filteredResults);
  }, [searchQuery, data]);

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