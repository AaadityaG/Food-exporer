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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
        setTotalPages(Math.ceil((data.count || 0) / 20)); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategory, page]);

  const handleSort = (criteria) => {
    if (sortCriteria === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortOrder('asc');
    }
  };

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

  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Food Product Explorer</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border-2 border-blue-500 rounded-md p-2 mb-4  text-blue-500"
      />

      {/* Category Filter */}
      

      {/* Sorting Options */}
      <div className="flex lg:flex-row md:flex-row flex-col justify-start gap-4 items-center mb-4">
        <button
          onClick={() => handleSort('product_name')}
          className={`mr-2 px-4 py-2 rounded-md border-2 lg:text-lg md:text-lg text-sm ${
            sortCriteria === 'product_name' ? 'bg-blue-200 text-blue-800' : 'bg-white text-blue-600 border-blue-600'
          }`}
        >
          Sort by Name {sortCriteria === 'product_name' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('nutrition_grade')}
          className={`px-4 py-2 rounded-md border-2 lg:text-lg md:text-lg text-sm ${
            sortCriteria === 'nutrition_grade' ? 'bg-blue-200 text-blue-800' : 'bg-white text-blue-600 border-blue-600'
          }`}
        >
          Sort by Nutrition Grade {sortCriteria === 'nutrition_grade' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <div className="max-h-20 lg:text-lg md:text-lg text-sm ">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border-2 bg-blue-200 border-blue-500 text-blue-600 rounded-md p-2 w-full "
        >
          <option value="" className='lg:text-lg md:text-lg text-sm  ' style={{fontFamily: "inter"}}>All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      </div>

      {loading ? (
        <div className="text-center text-blue-600">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {sortedProducts.map((product) => (
    <div
      key={product.code}
      className="bg-white border-2 border-gray-200 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl p-6"
    >
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">{product.product_name}</h2>
      <img
        src={product.image_url || 'https://via.placeholder.com/200'}
        alt={product.product_name}
        className="rounded-lg mb-4 h-48 w-full object-cover"
      />
      <p className="text-gray-600 mb-2 overflow-hidden">
        <span className="font-semibold">Category:</span> {product.categories || 'N/A'}
      </p>
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">Nutrition Grade:</span> {product.nutrition_grades || 'N/A'}
      </p>
      <p className="text-gray-600">
        <span className="font-semibold">Ingredients:</span> {product.ingredients_text || 'N/A'}
      </p>
    </div>
  ))}
</div>

          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-lg text-blue-600">{`Page ${page} of ${totalPages}`}</span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
