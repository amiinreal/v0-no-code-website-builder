import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Webara</h1>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">Build websites without code</h2>
        <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
          Webara is a powerful no-code website builder that generates real HTML, CSS, and JavaScript. Create stunning
          websites with drag & drop, connect databases, and publish instantly.
        </p>
        <div className="mt-10 flex gap-4">
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">Start building for free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Learn more</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
