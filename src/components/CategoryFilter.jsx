import { useEffect, useState } from 'react';

const CategoryFilter = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`https://world.openfoodfacts.org/categories.json`);
      const data = await res.json();
      setCategories(data.tags);
    };
    fetchCategories();
  }, []);

  return (
    <div className="mb-4">
      <select
        onChange={(e) => onSelectCategory(e.target.value)}
        className="border p-2 rounded w-full text-black"
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
