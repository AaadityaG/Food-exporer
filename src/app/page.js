"use client"

import { useEffect, useState } from 'react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1); // Pagination state
  const [totalPages, setTotalPages] = useState(1); // Total pages

  // Fetching categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://world.openfoodfacts.org/categories.json');
        const data = await response.json();
        setCategories(data.tags || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetching products based on search term, selected category, and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&json=true&page=${page}`;

      if (selectedCategory) {
        url = `https://world.openfoodfacts.org/category/${selectedCategory}.json?page=${page}`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data.products || []);
        setTotalPages(Math.ceil((data.count || 0) / 20)); // Assuming 20 products per page
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategory, page]);

  // Sorting function
  const handleSort = (criteria) => {
    if (sortCriteria === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortOrder('asc');
    }
  };

  // Sorting logic based on selected criteria
  const sortedProducts = [...products].sort((a, b) => {
    if (!sortCriteria) return 0;

    let comparison = 0;
    if (sortCriteria === 'product_name') {
      comparison = a.product_name?.localeCompare(b.product_name || '');
    } else if (sortCriteria === 'nutrition_grade') {
      comparison = (a.nutrition_grades || '').localeCompare(b.nutrition_grades || '');
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination handler
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Food Product Explorer</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded-md p-2 mb-4"
      />

      {/* Category Filter */}
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting Options */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => handleSort('product_name')}
          className={`mr-2 p-2 border rounded ${
            sortCriteria === 'product_name' ? 'bg-gray-200' : ''
          }`}
        >
          Sort by Name {sortCriteria === 'product_name' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('nutrition_grade')}
          className={`p-2 border rounded ${
            sortCriteria === 'nutrition_grade' ? 'bg-gray-200' : ''
          }`}
        >
          Sort by Nutrition Grade {sortCriteria === 'nutrition_grade' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>

          {loading ? 'Loading...' : 
          <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedProducts.map((product) => (
          <div key={product.code} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-bold mb-2">{product.product_name}</h2>
            <img
              src={product.image_url || 'https://via.placeholder.com/200'}
              alt={product.product_name}
              className="rounded-lg mb-4"
            />
            <p>Category: {product.categories || 'N/A'}</p>
            <p>Nutrition Grade: {product.nutrition_grades || 'N/A'}</p>
            <p>Ingredients: {product.ingredients_text || 'N/A'}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-lg">{`Page ${page} of ${totalPages}`}</span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      </>

          }

    </div>
  );
};

export default Home;
