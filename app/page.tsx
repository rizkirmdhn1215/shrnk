import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const features = [
    {
      title: "Custom Slugs",
      description: "Create memorable short links with custom aliases tailored to your brand",
    },
    {
      title: "Link Analytics",
      description: "Track clicks, device types, browsers, and geographic data in real-time",
    },
    {
      title: "Password Protection",
      description: "Secure your links with optional password protection",
    },
    {
      title: "Link Expiration",
      description: "Set expiration dates to automatically deactivate links",
    },
    {
      title: "QR Codes",
      description: "Auto-generated QR codes for every short link",
    },
    {
      title: "User Dashboard",
      description: "Manage all your links from a beautiful, intuitive dashboard",
    },
  ]

  return (
    <div className="min-h-svh bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/shrnk-logo.png" alt="Shrnk Logo" width={40} height={40} className="w-10 h-10" />
            <h1 className="text-2xl font-bold">Shrnk</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-5xl font-bold text-balance">Create. Track. Optimize.</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The modern URL shortener with advanced analytics. Create custom short links, track traffic data, and
            optimize your digital presence.
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Link href="/auth/sign-up">
            <Button size="lg">Start Creating Links</Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 border-y">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold">100K+</p>
              <p className="text-muted-foreground">Links Created</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50M+</p>
              <p className="text-muted-foreground">Total Clicks</p>
            </div>
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-muted-foreground">Active Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-bold">Powerful Features</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create, manage, and track your short links
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
          <h3 className="text-3xl font-bold">Ready to Get Started?</h3>
          <p className="text-lg opacity-90">Join thousands of users tracking their links with Shrnk</p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary">
              Create Your First Link
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Shrnk</h4>
              <p className="text-sm text-muted-foreground">The modern URL shortener with advanced analytics.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Shrnk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
