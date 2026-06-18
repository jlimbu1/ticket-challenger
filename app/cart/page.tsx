import { useCart } from '../../src/context/CartContext';
import { CartItem } from '../../components/CartItem';
import { GothicEmptyState } from '../../components/GothicEmptyState';
import { ThemedButton } from '../../components/ThemedButton';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black p-8">
        <GothicEmptyState
          title="Your Ritual Circle is Empty"
          message="No items have been summoned yet. Browse the collection to begin."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-gothic text-4xl text-purple-400">
          Your Ritual Circle
        </h1>

        <div className="space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.product.id}
              product={item.product}
              quantity={item.quantity}
              onUpdateQuantity={(newQuantity: number) => {
                if (newQuantity <= 0) {
                  removeItem(item.product.id);
                } else {
                  updateQuantity(item.product.id, newQuantity);
                }
              }}
              onRemove={() => removeItem(item.product.id)}
            />
          ))}
        </div>

        <div className="mt-8 border-t border-purple-900/30 pt-6">
          <div className="flex items-center justify-between">
            <span className="font-gothic text-lg text-gray-400">
              Items: {totalItems}
            </span>
            <span className="font-gothic text-2xl text-purple-400">
              Subtotal: ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="mt-6 flex justify-end">
            <Link href="/checkout">
              <ThemedButton variant="primary" size="lg">
                Proceed to Checkout
              </ThemedButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}