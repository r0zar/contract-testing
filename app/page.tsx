'use client'

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content - center everything */}
      <main className="flex-1 flex flex-col justify-center items-center">
        {/* Hero Section */}
        <section className="w-full relative overflow-hidden bg-background flex items-center justify-center">
          <div className="container max-w-[1200px] px-4 md:px-6 py-12 md:py-24">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Test Report Management
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Analyze all smart contract testing results in one place.
                </p>
              </div>
              {/* <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Link href="/create-pool">
                  <Button size="lg" className="w-full min-[400px]:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                    View Dashboard
                  </Button>
                </Link>
              </div> */}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full flex items-center justify-center py-4 md:py-8">
          <div className="container max-w-[1200px] px-4 md:px-6">
            {/* View Test Reports header */}
            <h3 className="text-xl font-bold tracking-tighter sm:text-2xl">View Test Reports</h3>
            <p className="text-muted-foreground pb-4">
              View all your test reports and analytics in one place.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {/* <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-xl">Test Dashboard</CardTitle>
                  <CardDescription>
                    Access your comprehensive test analytics dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full">
                      Open Dashboard →
                    </Button>
                  </Link>
                </CardContent>
              </Card> */}
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-xl">Pool Creation Tests</CardTitle>
                  <CardDescription>
                    Testing pool creation with a variety of parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <Link href="/create-pool">
                    <Button variant="outline" className="w-full">
                      View Test Results →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background w-full">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              Test Report Management Platform © 2024
            </p>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" className="text-sm">Help</Button>
              <Button variant="ghost" className="text-sm">Documentation</Button>
              <Button variant="ghost" className="text-sm">Support</Button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
