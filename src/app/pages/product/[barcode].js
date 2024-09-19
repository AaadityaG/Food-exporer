'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // For Next.js dynamic routing
import Link from 'next/link';

const ProductDetail = () => {
  const router = useRouter();
  const { barcode } = router.query; // Get the barcode from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!barcode) return; // If there's no barcode, return early

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        const data = await response.json();
        setProduct(data.product);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [barcode]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>No product details available for this barcode.</div>;
  }

  return (
    <div className="p-4">
      <Link href="/">
        ← Back to Products
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image_url || 'https://via.placeholder.com/400'}
            alt={product.product_name}
            className="rounded-lg shadow-lg w-full"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.product_name}</h1>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Barcode:</strong> {barcode}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Category:</strong> {product.categories}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Brands:</strong> {product.brands}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Ingredients:</strong> {product.ingredients_text || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Nutrition Grade:</strong>{' '}
            {product.nutrition_grades || 'N/A'}
          </p>

          <h2 className="text-2xl font-bold mb-2">Nutritional Values</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>Energy: {product.nutriments.energy || 'N/A'} kJ</li>
            <li>Fat: {product.nutriments.fat || 'N/A'} g</li>
            <li>Carbohydrates: {product.nutriments.carbohydrates || 'N/A'} g</li>
            <li>Proteins: {product.nutriments.proteins || 'N/A'} g</li>
            {/* Add more nutrition values as needed */}
          </ul>

          <div>
            <h2 className="text-2xl font-bold mb-2">Labels</h2>
            <ul className="list-disc ml-6">
              {product.labels_tags.map((label) => (
                <li key={label} className="capitalize">
                  {label.replace('-', ' ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
