import { Heart, ShoppingBag } from 'lucide-react'

import { ProductCard } from '../components/ProductCard'
import { Button, ButtonLink, Card, Container, EmptyState, SectionHeading } from '../components/ui'
import { bySlug } from '../content'
import { useStore } from '../lib/store'
import { useTitle } from '../lib/title'

export function Wishlist() {
  useTitle('Wishlist')
  const { wishlist, addMany } = useStore()
  const list = wishlist.map((s) => bySlug(s)!).filter(Boolean)
  return (
    <Container className="mt-12">
      <SectionHeading
        as="h1"
        eyebrow={`${list.length} saved`}
        title="Your wishlist"
        action={
          list.length > 0 && (
            <Button onClick={() => addMany(list)}>
              <ShoppingBag aria-hidden /> Add all to bag
            </Button>
          )
        }
      />
      {list.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <Card className="mt-8">
          <EmptyState icon={<Heart aria-hidden />} title="Nothing saved yet" body="Tap the heart on any product to keep it here for later. Your list stays in this browser." action={<ButtonLink to="/shop">Browse products</ButtonLink>} />
        </Card>
      )}
    </Container>
  )
}
