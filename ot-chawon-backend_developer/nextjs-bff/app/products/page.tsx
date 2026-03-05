import { springFetch } from '../../lib/springFetch';

export default async function ProductsPage() {
  const result = await springFetch('/api/v1/products').catch(() => ({ data: { items: [] } }));
  const items = result?.data?.items ?? [];

  return (
    <main>
      <h1>Products from Gateway</h1>
      <ul>
        {items.map((item: { id: number; name: string; price: number }) => (
          <li key={item.id}>{item.name} - {item.price}</li>
        ))}
      </ul>
    </main>
  );
}
