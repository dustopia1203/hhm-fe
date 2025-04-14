function ProductCard() {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4">
      <div className="aspect-square bg-gray-100 rounded-xl mb-3"></div>
      <h3 className="text-sm font-medium text-white truncate">Product Name</h3>
      <div className="mt-1 text-white font-bold">₫199,000</div>
    </div>
  );
}

export default ProductCard;
