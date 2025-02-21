'use client'

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4">
            <Image
              className="dark:invert w-24 sm:w-28"
              src="/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
            />
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6">
              <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary">
                Documentation
              </Button>
              <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary">
                Components
              </Button>
              <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary">
                Examples
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 md:py-10">
        <div className="flex flex-col gap-8">
          {/* Hero Section */}
          <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Build your Next.js application
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Get started by editing your pages. Fast, modern, and responsive web applications.
            </p>
          </section>

          {/* Features Section */}
          <Tabs defaultValue="getting-started" className="max-w-[980px] mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="getting-started">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start Guide</CardTitle>
                  <CardDescription>Everything you need to get your Next.js app running.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">1. Edit your first page</h3>
                        <code className="block bg-muted px-4 py-3 my-2 rounded-md">
                          app/page.tsx
                        </code>
                        <p className="text-sm text-muted-foreground">
                          Make changes and see them instantly in your browser.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold">2. Add new components</h3>
                        <p className="text-sm text-muted-foreground">
                          Create reusable UI components in the components directory.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold">3. Deploy your application</h3>
                        <p className="text-sm text-muted-foreground">
                          Push to your repository and deploy with Vercel.
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View Documentation</Button>
                  <Button>Deploy Now</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="features">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Server Components",
                    description: "Built-in support for React Server Components"
                  },
                  {
                    title: "Fast Refresh",
                    description: "Instant feedback for component changes"
                  },
                  {
                    title: "Route Handlers",
                    description: "API routes with support for modern features"
                  },
                  {
                    title: "Image Optimization",
                    description: "Automatic image optimization and resizing"
                  },
                  {
                    title: "Built-in CSS Support",
                    description: "Support for your favorite CSS solutions"
                  },
                  {
                    title: "Zero Config",
                    description: "Automatic compilation and bundling"
                  }
                ].map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="resources">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation</CardTitle>
                    <CardDescription>
                      Learn more about Next.js features and API.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
                        Visit Documentation →
                      </a>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Examples</CardTitle>
                    <CardDescription>
                      Discover and deploy example Next.js projects.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://vercel.com/templates" target="_blank" rel="noopener noreferrer">
                        View Examples →
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Built with Next.js and shadcn/ui
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Button variant="ghost" className="text-sm" asChild>
              <a href="https://nextjs.org/learn" target="_blank" rel="noopener noreferrer">
                Learn
              </a>
            </Button>
            <Button variant="ghost" className="text-sm" asChild>
              <a href="https://vercel.com/templates" target="_blank" rel="noopener noreferrer">
                Templates
              </a>
            </Button>
            <Button variant="ghost" className="text-sm" asChild>
              <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
                Next.js →
              </a>
            </Button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
