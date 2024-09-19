import Link from 'next/link';

const ProductCard = ({ product }) => {
  return (
    <div className="border p-4">
      <img src={product.image_url} alt={product.product_name} className="w-full" />
      <h2 className="text-xl mt-2">{product.product_name}</h2>
      <p>Category: {product.categories}</p>
      <p>Nutrition Grade: {product.nutrition_grades}</p>
      <Link href={`/product/${product.code}`}>
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
