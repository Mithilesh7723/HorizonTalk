"use client"

import type React from "react"
import Link from "next/link";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Mic,
  Brain,
  BookOpen,
  TrendingUp,
  Users,
  MessageCircle,
  Play,
  Star,
  ArrowRight,
  Menu,
  X,
  Mail,
  Send,
} from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)

  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Clear the intentional visit flag when component mounts
  useEffect(() => {
    // Clear the flag after a short delay to allow the page to load
    const timer = setTimeout(() => {
      sessionStorage.removeItem("intentional-landing-visit")
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Handle authenticated user redirection only if not intentional visit
  useEffect(() => {
    if (!loading && user && !sessionStorage.getItem("intentional-landing-visit")) {
      // Small delay to prevent flash
      const timer = setTimeout(() => {
        router.push("/dashboard")
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [user, loading, router])

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      setShowAuthModal(true)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingContact(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      })

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        })
        setContactForm({ name: "", email: "", subject: "", message: "" })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingContact(false)
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: Mic,
      title: "Real-time Speech Analysis",
      description: "Advanced AI analyzes your pronunciation, fluency, and speaking patterns in real-time",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "AI-Powered Coaching",
      description: "Personalized feedback using Google Gemini Pro to accelerate your learning journey",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: BookOpen,
      title: "Smart Vocabulary Builder",
      description: "Interactive flashcards with pronunciation audio and spaced repetition learning",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Detailed insights and visual progress tracking to monitor your improvement",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Users,
      title: "Practice Scenarios",
      description: "Real-world conversation practice with business, travel, and academic contexts",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: MessageCircle,
      title: "AI Conversation Partner",
      description: "Natural conversations with AI to practice speaking in a comfortable environment",
      color: "from-teal-500 to-blue-500",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      content:
        "HorizonTalk helped me improve my presentation skills for international meetings. The AI feedback is incredibly detailed!",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Ahmed Hassan",
      role: "University Student",
      content: "Perfect for IELTS preparation! The speaking practice sessions boosted my confidence significantly.",
      rating: 5,
      avatar: "AH",
    },
    {
      name: "Maria Rodriguez",
      role: "Business Analyst",
      content: "The vocabulary builder is amazing. I've learned over 200 business terms in just 2 months!",
      rating: 5,
      avatar: "MR",
    },
  ]

  const stats = [
    { number: "100+", label: "Active Learners" },
    { number: "500+", label: "Practice Sessions" },
    { number: "95%", label: "Improvement Rate" },
    { number: "24/7", label: "AI Availability" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HorizonTalk
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Reviews
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </a>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {user ? "Go to Dashboard" : "Get Started"}
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <nav className="flex flex-col space-y-4 pt-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Reviews
                </a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </a>
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
                >
                  {user ? "Go to Dashboard" : "Get Started"}
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100 px-4 py-2">
            🚀 AI-Powered English Coaching Platform
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            Master English Communication with AI
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your English speaking skills with personalized AI feedback, real-time pronunciation analysis, and
            interactive practice sessions. Join thousands of learners improving their communication confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              {user ? "Go to Dashboard" : "Start Learning Free"}
            </Button>
            <Link href="/demo">
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 h-auto">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{stat.number}</div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800">Features</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything You Need to Excel</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI-powered tools designed to accelerate your English learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">What Our Learners Say</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Real success stories from learners who transformed their English communication skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">Contact Us</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Get in Touch</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions or need support? We're here to help you succeed in your English learning journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      className="mt-1 min-h-[120px]"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSubmittingContact ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                      <p className="text-gray-600 mb-2">Get help with your account or technical issues</p>
                      <a href="mailto:info@horizonflare.in" className="text-blue-600 hover:text-blue-700 font-medium">
                        info@horizonflare.in
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
                      <p className="text-gray-600 mb-2">Chat with our support team in real-time</p>
                      <p className="text-sm text-gray-500">Available 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Help Center</h3>
                      <p className="text-gray-600 mb-2">Browse our comprehensive knowledge base</p>
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                        Visit Help Center →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
    <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-purple-50 via-white to-purple-50">
  <div className="container mx-auto text-center text-gray-800">
    <h2 className="text-3xl md:text-5xl font-bold mb-6">
      Ready to Transform Your English?
    </h2>
    <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
      Join thousands of learners who have already improved their communication skills with our AI-powered platform
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        size="lg"
        onClick={handleGetStarted}
        className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-4 h-auto"
      >
        {user ? "Go to Dashboard" : "Start Your Journey"}
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg px-8 py-4 h-auto"
      >
        Learn More
      </Button>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="py-12 md:py-16 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">HorizonTalk</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                AI-powered English communication coaching platform helping learners worldwide improve their speaking
                skills.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Speech Analysis
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    AI Coaching
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Vocabulary Builder
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Progress Tracking
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="mailto:info@horizonflare.in" className="hover:text-white transition-colors">
                    info@horizonflare.in
                  </a>
                </li>
                <li>
                  <a href="https://x.com/horizonflare" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/horizon-flare" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HorizonTalk. All rights reserved. Crafted with 💖 at Horizon Flare Innovation Studio.</p>
          </div>
        </div>
      </footer>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  )
}
