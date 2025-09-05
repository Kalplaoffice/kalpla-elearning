import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel Background */}
      <section className="relative bg-gradient-to-r from-[#2C4E41] via-[#FF804B] to-[#2C4E41] text-white py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C4E41]/90 via-[#FF804B]/90 to-[#2C4E41]/90"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            🚀 Featured in TechCrunch, Forbes & Entrepreneur
          </Badge>
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Launch Your Startup While You're Still in College
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Join 10,000+ students building real startups through our 12-month mentorship program. 
            Learn from industry experts, get funding, and launch your first product.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button asChild size="lg" className="bg-white text-[#2C4E41] hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              <Link href="/mentorship/apply">Apply Now - Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#2C4E41] px-8 py-4 text-lg font-semibold">
              <Link href="#intro-video">Watch Intro Video</Link>
            </Button>
          </div>
          <div className="flex justify-center items-center space-x-8 text-sm">
            <div className="flex items-center">
              <span className="text-2xl font-bold">10K+</span>
              <span className="ml-2">Students</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">500+</span>
              <span className="ml-2">Startups Launched</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">$50M+</span>
              <span className="ml-2">Funding Raised</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Kalpla?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-l-4 border-[#FF804B]">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <CardTitle className="text-xl mb-2 text-[#2C4E41]">Learn from Experts</CardTitle>
              <CardDescription>
                Industry leaders from Google, Microsoft, and successful startups teach you real-world skills
              </CardDescription>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-l-4 border-[#2C4E41]">
              <div className="text-4xl mb-4">🚀</div>
              <CardTitle className="text-xl mb-2 text-[#FF804B]">Build Real Startups</CardTitle>
              <CardDescription>
                Create and launch actual products, not just projects. Get real users and feedback
              </CardDescription>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-l-4 border-[#FF804B]">
              <div className="text-4xl mb-4">🤝</div>
              <CardTitle className="text-xl mb-2 text-[#2C4E41]">Get Mentorship & Networking</CardTitle>
              <CardDescription>
                1-on-1 mentorship from successful entrepreneurs and access to our exclusive network
              </CardDescription>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-l-4 border-[#2C4E41]">
              <div className="text-4xl mb-4">🏆</div>
              <CardTitle className="text-xl mb-2 text-[#FF804B]">Job-Ready Certifications</CardTitle>
              <CardDescription>
                Earn industry-recognized certificates that employers value and trust
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Featured Courses</h2>
            <Button asChild variant="outline" className="border-[#2C4E41] text-[#2C4E41] hover:bg-[#2C4E41] hover:text-white">
              <Link href="/courses">View All Courses</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Full-Stack Web Development",
                instructor: "Sarah Chen",
                rating: 4.9,
                students: 2500,
                price: 299,
                image: "https://via.placeholder.com/400x225/3B82F6/FFFFFF?text=Full-Stack+Web+Dev"
              },
              {
                title: "AI & Machine Learning",
                instructor: "Dr. Alex Kumar",
                rating: 4.8,
                students: 1800,
                price: 399,
                image: "https://via.placeholder.com/400x225/8B5CF6/FFFFFF?text=AI+%26+ML"
              },
              {
                title: "Digital Marketing Mastery",
                instructor: "Priya Sharma",
                rating: 4.9,
                students: 3200,
                price: 199,
                image: "https://via.placeholder.com/400x225/10B981/FFFFFF?text=Digital+Marketing"
              }
            ].map((course, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-2 right-2 bg-[#FF804B] text-white">Bestseller</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-2">by {course.instructor}</p>
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({course.rating}) • {course.students} students</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#2C4E41]">₹{course.price}</span>
                    <Button size="sm" className="bg-[#FF804B] hover:bg-[#FF804B]/90 text-white">Enroll Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Degree Programs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Degree Programs</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Startup MBA</h3>
                  <p className="text-gray-600">12-Month Intensive Program</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Most Popular</Badge>
              </div>
              <ul className="space-y-2 mb-6">
                <li>• Build and launch 3 real startups</li>
                <li>• 1-on-1 mentorship from successful entrepreneurs</li>
                <li>• Access to ₹10L funding pool</li>
                <li>• Industry networking events</li>
                <li>• Job placement assistance</li>
              </ul>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-3xl font-bold text-blue-600">₹2,99,000</span>
                  <span className="text-gray-600 ml-2">or ₹25,000/month EMI</span>
                </div>
                <Button>View Details</Button>
              </div>
            </Card>
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">AI for Business</h3>
                  <p className="text-gray-600">8-Month Specialized Program</p>
                </div>
                <Badge className="bg-purple-100 text-purple-800">New</Badge>
              </div>
              <ul className="space-y-2 mb-6">
                <li>• Master AI tools and frameworks</li>
                <li>• Build AI-powered business solutions</li>
                <li>• Industry case studies and projects</li>
                <li>• Expert-led workshops</li>
                <li>• Certification from top universities</li>
              </ul>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-3xl font-bold text-blue-600">₹1,99,000</span>
                  <span className="text-gray-600 ml-2">or ₹20,000/month EMI</span>
                </div>
                <Button>View Details</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Mini Courses */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Fast-Track Learning</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Quick-bite programs for trending skills. Learn in 7 days to 2 months and get job-ready.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "React in 7 Days", duration: "7 Days", price: "Free", tag: "Trending" },
              { title: "Python for Data Science", duration: "2 Months", price: "₹9,999", tag: "Popular" },
              { title: "Digital Marketing Bootcamp", duration: "1 Month", price: "₹4,999", tag: "Hot" }
            ].map((course, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <Badge className="mb-4 bg-[#FF804B]/10 text-[#FF804B] border-[#FF804B]/20">{course.tag}</Badge>
                <h3 className="text-xl font-semibold mb-2 text-[#2C4E41]">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.duration}</p>
                <div className="text-2xl font-bold text-[#2C4E41] mb-4">{course.price}</div>
                <Button size="sm" className="w-full bg-[#FF804B] hover:bg-[#FF804B]/90 text-white">Start Learning</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Kalpla Startup Mentorship Program - Highlight Section */}
      <section className="py-20 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              🏆 Our Flagship Program
            </Badge>
            <h2 className="text-5xl font-bold mb-6">Kalpla Startup Mentorship Program</h2>
            <p className="text-xl mb-8 leading-relaxed">
              A comprehensive 12-month program designed to take you from idea to IPO. 
              Join 2,000+ students who have launched successful startups.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-semibold mb-2">Build MVP</h3>
                <p>Turn your idea into a working product with expert guidance</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Raise Funding</h3>
                <p>Get access to our investor network and funding opportunities</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">Go-to-Market</h3>
                <p>Launch your product and acquire your first 1000 users</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                <Link href="/mentorship/apply">Join Now - Free Application</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                <Link href="/mentorship">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF804B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#FF804B]">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#2C4E41]">Enroll in a Program</h3>
                <p className="text-gray-600">Choose from our courses, degree programs, or mentorship program</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#2C4E41]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#2C4E41]">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#FF804B]">Learn via Courses + Mentorship</h3>
                <p className="text-gray-600">Get expert guidance, hands-on projects, and real-world experience</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF804B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#FF804B]">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#2C4E41]">Launch Your Startup</h3>
                <p className="text-gray-600">Build, fund, and launch your own successful startup</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Leaderboard Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Join Our Thriving Community</h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Discord-Style Learning Community</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <span className="text-[#FF804B] mr-3">✓</span>
                    Real-time chat with mentors and peers
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#FF804B] mr-3">✓</span>
                    Voice and video channels for collaboration
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#FF804B] mr-3">✓</span>
                    Leaderboards and gamification
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#FF804B] mr-3">✓</span>
                    File sharing and project collaboration
          </li>
                  <li className="flex items-center">
                    <span className="text-[#FF804B] mr-3">✓</span>
                    Exclusive events and workshops
          </li>
                </ul>
                <Button asChild size="lg" className="bg-[#2C4E41] hover:bg-[#2C4E41]/90 text-white">
                  <Link href="/community">Join the Community</Link>
                </Button>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-white">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <span className="text-sm">Kalpla Community</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold">S</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Sarah Chen</div>
                      <div className="text-xs text-gray-400">Just launched my MVP! 🚀</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold">A</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Alex Kumar</div>
                      <div className="text-xs text-gray-400">Congrats! Need any feedback?</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold">P</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Priya Sharma</div>
                      <div className="text-xs text-gray-400">Check out the new AI course! 🤖</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured In */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured In</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {['TechCrunch', 'Forbes', 'Entrepreneur', 'Inc. Magazine'].map((media, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-400">{media}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Sharma",
                role: "Founder, TechStart",
                image: "https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=RS",
                quote: "Kalpla helped me launch my startup in just 6 months. The mentorship program is incredible!",
                startup: "Raised ₹50L funding"
              },
              {
                name: "Priya Patel",
                role: "CEO, AI Solutions",
                image: "https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=PP",
                quote: "The community support and expert guidance made all the difference. Highly recommended!",
                startup: "10,000+ users"
              },
              {
                name: "Arjun Singh",
                role: "Founder, EduTech",
                image: "https://via.placeholder.com/80x80/10B981/FFFFFF?text=AS",
                quote: "From idea to IPO in 18 months. Kalpla's program is a game-changer for entrepreneurs.",
                startup: "₹2Cr revenue"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                <Badge className="bg-green-100 text-green-800">{testimonial.startup}</Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Upcoming Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Startup Pitch Competition",
                date: "Jan 25, 2024",
                time: "6:00 PM IST",
                type: "Competition",
                spots: "50 spots left"
              },
              {
                title: "AI & ML Workshop",
                date: "Jan 28, 2024",
                time: "2:00 PM IST",
                type: "Workshop",
                spots: "25 spots left"
              },
              {
                title: "Investor Meet & Greet",
                date: "Feb 2, 2024",
                time: "7:00 PM IST",
                type: "Networking",
                spots: "15 spots left"
              }
            ].map((event, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-blue-100 text-blue-800">{event.type}</Badge>
                  <span className="text-sm text-gray-600">{event.spots}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <div className="text-gray-600 mb-4">
                  <div>{event.date}</div>
                  <div>{event.time}</div>
                </div>
                <Button className="w-full">Register Now</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Flexible Payment Options</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">One-Time Payment</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">₹2,99,000</div>
                <p className="text-gray-600 mb-6">Pay once, learn forever</p>
                <ul className="space-y-2 mb-6 text-left">
                  <li>✓ Full program access</li>
                  <li>✓ Lifetime community access</li>
                  <li>✓ 5% discount</li>
                </ul>
                <Button className="w-full">Choose Plan</Button>
              </Card>
              <Card className="p-8 text-center border-2 border-blue-500 relative">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">Most Popular</Badge>
                <h3 className="text-2xl font-bold mb-4">EMI Plan</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">₹25,000<span className="text-lg text-gray-600">/month</span></div>
                <p className="text-gray-600 mb-6">12 months, 0% interest</p>
                <ul className="space-y-2 mb-6 text-left">
                  <li>✓ Full program access</li>
                  <li>✓ Lifetime community access</li>
                  <li>✓ No interest charges</li>
                </ul>
                <Button className="w-full">Choose Plan</Button>
              </Card>
              <Card className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Scholarship</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">Up to 100%</div>
                <p className="text-gray-600 mb-6">Based on merit and need</p>
                <ul className="space-y-2 mb-6 text-left">
                  <li>✓ Full program access</li>
                  <li>✓ Lifetime community access</li>
                  <li>✓ Apply for scholarship</li>
                </ul>
                <Button className="w-full">Apply Now</Button>
              </Card>
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">Accepted payment methods:</p>
              <div className="flex justify-center space-x-4">
                <span className="text-sm bg-gray-200 px-3 py-1 rounded">Razorpay</span>
                <span className="text-sm bg-gray-200 px-3 py-1 rounded">UPI</span>
                <span className="text-sm bg-gray-200 px-3 py-1 rounded">Credit Card</span>
                <span className="text-sm bg-gray-200 px-3 py-1 rounded">EMI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-[#2C4E41] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Get Startup Tips & Exclusive Offers</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join 50,000+ entrepreneurs getting weekly insights, funding opportunities, and exclusive discounts.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white text-gray-900 placeholder-gray-500"
            />
            <Button className="bg-white text-[#2C4E41] hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-80">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Launch Your Startup?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of students who are already building the next unicorn. 
            Your journey starts here.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-[#2C4E41] hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              <Link href="/mentorship/apply">Apply Now - Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#2C4E41] px-8 py-4 text-lg font-semibold">
              <Link href="/contact">Book Free Counseling</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}