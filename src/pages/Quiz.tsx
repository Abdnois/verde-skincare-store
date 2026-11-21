import { ArrowLeft, ArrowRight, RotateCcw, ShoppingBag } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { Link } from 'react-router'

import { SerumStill } from '../components/Art'
import { ProductArt } from '../components/ProductArt'
import { Button, Card, Container, OptionCard } from '../components/ui'
import { products, quiz, type Category, type Concern, type Product, type SkinType } from '../content'
import { money } from '../lib/money'
import { usePersistent } from '../lib/persist'
import { useStore } from '../lib/store'
import { useTitle } from '../lib/title'

type Answers = Partial<Record<'type' | 'concern' | 'sensitive' | 'length', string>>

/** Picks one product per routine step, scored on concern and skin type. */
export function recommend(a: Answers): { product: Product; why: string }[] {
  const steps: Category[] = a.length === '3' ? ['Cleanse', 'Treat', 'Protect'] : ['Cleanse', 'Tone', 'Treat', 'Moisturise', 'Protect']
  const concern = a.concern as Concern | undefined
  const type = a.type as SkinType | undefined
  const sensitive = a.sensitive === 'yes' || a.sensitive === 'sometimes'
  return steps.map((cat) => {
    const scored = products
      .filter((p) => p.category === cat && !(cat === 'Treat' && p.name.includes('Eye')))
      .map((p) => {
        let s = p.rating
        if (concern && p.concerns.includes(concern)) s += 3
        if (type && p.skinTypes.includes(type)) s += 2
        if (sensitive && p.skinTypes.includes('Sensitive')) s += 1.5
        if (sensitive && /salicylic|ascorbic/i.test(p.fullIngredients)) s -= 2
        return { p, s }
      })
      .sort((x, y) => y.s - x.s)
    const product = scored[0].p
    const hit = concern && product.concerns.includes(concern)
    const why = hit ? `Targets ${concern!.toLowerCase()} with ${product.ingredients[0].name.toLowerCase()}.` : `${product.ingredients[0].role} for ${type?.toLowerCase() ?? 'all'} skin.`
    return { product, why }
  })
}

export function Quiz() {
  useTitle('Skin quiz')
  const [answers, setAnswers] = usePersistent<Answers>('verde-quiz', {}, undefined, 'dewlab-quiz')
  const [step, setStep] = useState(() => (Object.keys(answers).length >= quiz.questions.length ? quiz.questions.length : 0))
  const heading = useRef<HTMLHeadingElement>(null)
  const done = step >= quiz.questions.length
  const q = quiz.questions[Math.min(step, quiz.questions.length - 1)]
  const value = answers[q.id as keyof Answers]

  const go = (n: number) => {
    setStep(n)
    window.setTimeout(() => heading.current?.focus(), 50)
  }

  return (
    <Container className="mt-8">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="wall-calm on-dark relative min-h-[300px] overflow-hidden rounded-panel p-8 text-white shadow-card sm:p-12 lg:min-h-[640px]">
          <p className="text-[14px] font-medium">Skin quiz</p>
          <h1 className="mt-3 max-w-sm text-balance text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[52px]">{quiz.title}</h1>
          <p className="mt-4 max-w-sm text-pretty text-[17px] leading-relaxed">{quiz.intro}</p>
          <div className="absolute bottom-8 right-6 hidden h-[48%] w-[50%] lg:block">
            <SerumStill className="h-full w-full" />
          </div>
        </div>

        <Card className="p-6 sm:p-10">
          {!done ? (
            <>
              <div className="flex items-center justify-between gap-4 text-[14px] text-muted">
                <span>
                  Question {step + 1} of {quiz.questions.length}
                </span>
                <div className="h-1.5 w-40 overflow-hidden rounded-pill bg-surface-2" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={quiz.questions.length} aria-valuenow={step}>
                  <motion.div className="h-full rounded-pill bg-ink" animate={{ width: `${(step / quiz.questions.length) * 100}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.fieldset key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }} className="mt-8">
                  <legend className="contents">
                    <h2 ref={heading} tabIndex={-1} className="text-balance text-[28px] font-medium leading-tight tracking-[-0.03em] focus:outline-none sm:text-[34px]">
                      {q.question}
                    </h2>
                  </legend>
                  <div className="mt-6 grid gap-3">
                    {q.options.map((o) => (
                      <OptionCard key={o.value} name={q.id} value={o.value} checked={value === o.value} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} title={o.label} detail={'hint' in o ? o.hint : undefined} />
                    ))}
                  </div>
                </motion.fieldset>
              </AnimatePresence>
              <div className="mt-8 flex justify-between gap-3">
                <Button variant="ghost" disabled={step === 0} onClick={() => go(step - 1)}>
                  <ArrowLeft aria-hidden /> Back
                </Button>
                <Button disabled={!value} onClick={() => go(step + 1)}>
                  {step === quiz.questions.length - 1 ? 'See my routine' : 'Next'} <ArrowRight aria-hidden />
                </Button>
              </div>
            </>
          ) : (
            <Result
              answers={answers}
              headingRef={heading}
              onRestart={() => {
                setAnswers({})
                go(0)
              }}
            />
          )}
        </Card>
      </div>
    </Container>
  )
}

function Result({ answers, onRestart, headingRef }: { answers: Answers; onRestart: () => void; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const { addMany } = useStore()
  const routine = recommend(answers)
  const total = routine.reduce((n, r) => n + r.product.sizes[0].price, 0)
  return (
    <div>
      <p className="text-[14px] text-muted">
        {answers.type} skin / focus on {answers.concern?.toLowerCase()}
      </p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-[30px] font-medium leading-tight tracking-[-0.03em] focus:outline-none sm:text-[36px]">
        Your {routine.length}-step routine
      </h2>
      <ol className="mt-6 space-y-3">
        {routine.map(({ product, why }, i) => (
          <li key={product.slug} className="flex items-center gap-4 rounded-[24px] border border-line p-3">
            <div className="grid size-20 shrink-0 place-items-center rounded-[18px] bg-surface-2 p-2">
              <ProductArt product={product} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-muted">
                Step {i + 1} / {product.category}
              </p>
              <Link to={`/product/${product.slug}`} className="font-medium hover:underline">
                {product.name}
              </Link>
              <p className="text-[14px] text-muted">{why}</p>
            </div>
            <p className="shrink-0 font-semibold tabular-nums">{money(product.sizes[0].price)}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <Button variant="ghost" onClick={onRestart}>
          <RotateCcw aria-hidden /> Retake quiz
        </Button>
        <Button size="lg" onClick={() => addMany(routine.map((r) => r.product))}>
          <ShoppingBag aria-hidden /> Add routine, {money(total)}
        </Button>
      </div>
    </div>
  )
}
