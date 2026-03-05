import { getProducts } from '@/services/product/get-products';
import { formatPrice } from '@/lib/utils/price';

export default async function ProductsPage() {
  try {
    const items = await getProducts();

    if (items.length === 0) {
      return (
        <main>
          <h1>Products</h1>
          <p>No products available.</p>
        </main>
      );
    }

    return (
      <main>
        <h1>Products</h1>
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name} - {formatPrice(item.price)}</li>
          ))}
        </ul>
      </main>
    );
  } catch {
    return (
      <main>
        <h1>Products</h1>
        <p>Failed to load products.</p>
      </main>
    );
  }
}
