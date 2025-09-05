import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2C4E41] to-[#FF804B] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Kalpla</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're on a mission to democratize education and make high-quality learning 
            accessible to everyone, everywhere.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To provide world-class education through innovative technology, expert instructors, 
                and personalized learning experiences that empower individuals to achieve their 
                career goals and unlock their full potential.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To become the leading global platform for online education, where anyone can 
                learn anything, anywhere, at any time, and transform their lives through 
                the power of knowledge.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#FF804B] mb-2">50K+</div>
            <div className="text-gray-600">Students Worldwide</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#FF804B] mb-2">500+</div>
            <div className="text-gray-600">Expert Instructors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#FF804B] mb-2">1000+</div>
            <div className="text-gray-600">Courses Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#FF804B] mb-2">95%</div>
            <div className="text-gray-600">Job Placement Rate</div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We maintain the highest standards in everything we do, from course content 
                  to student support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">🤝</span>
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe in the power of community and peer learning to enhance 
                  the educational experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">🚀</span>
                  Innovation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We continuously innovate to provide cutting-edge learning experiences 
                  and technologies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="text-center pt-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Dr. Sarah Johnson</h3>
                <p className="text-[#FF804B] mb-2">Chief Executive Officer</p>
                <p className="text-gray-600 text-sm">
                  Former Stanford professor with 15+ years in education technology.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center pt-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Michael Chen</h3>
                <p className="text-[#FF804B] mb-2">Chief Technology Officer</p>
                <p className="text-gray-600 text-sm">
                  Ex-Google engineer passionate about scalable learning platforms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center pt-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Emily Rodriguez</h3>
                <p className="text-[#FF804B] mb-2">Head of Education</p>
                <p className="text-gray-600 text-sm">
                  Curriculum design expert with focus on student outcomes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#2C4E41] to-[#FF804B] text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8">
            Join thousands of students who are already transforming their careers with Kalpla.
          </p>
          <div className="space-x-4">
            <a
              href="/auth/register"
              className="inline-block bg-white text-[#2C4E41] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </a>
            <a
              href="/courses"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#2C4E41] transition-colors"
            >
              Browse Courses
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
