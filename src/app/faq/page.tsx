import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const faqs = [
  {
    category: "General",
    questions: [
      {
        question: "What is Kalpla?",
        answer: "Kalpla is a comprehensive e-learning platform that offers courses, 12-month mentorship programs, and accredited degree programs. We provide expert-led education with hands-on projects and real-world applications."
      },
      {
        question: "How do I get started?",
        answer: "Simply create an account, browse our course catalog, and enroll in any course that interests you. You can start learning immediately after enrollment."
      },
      {
        question: "Do I need any prior experience?",
        answer: "No prior experience is required for most of our courses. We offer courses for all skill levels, from complete beginners to advanced professionals."
      },
      {
        question: "Can I learn at my own pace?",
        answer: "Yes! All our courses are self-paced. You can access course materials 24/7 and learn at your own speed. Some courses have drip content that releases over time to maintain learning momentum."
      }
    ]
  },
  {
    category: "Courses & Learning",
    questions: [
      {
        question: "What types of courses do you offer?",
        answer: "We offer courses in web development, data science, cloud computing, mobile development, artificial intelligence, DevOps, and many other technology fields. Each course includes video lessons, hands-on projects, and assignments."
      },
      {
        question: "How long do I have access to course materials?",
        answer: "You have lifetime access to all course materials once you enroll. This includes video lessons, downloadable resources, and any future updates to the course content."
      },
      {
        question: "Are there any prerequisites for courses?",
        answer: "Prerequisites vary by course. Most beginner courses have no prerequisites, while advanced courses may require completion of foundational courses or specific technical knowledge. Prerequisites are clearly listed on each course page."
      },
      {
        question: "Can I get help if I'm stuck?",
        answer: "Absolutely! We provide multiple support channels including discussion forums, Q&A sessions with instructors, and peer-to-peer help from the community. Premium students also get direct access to mentors."
      }
    ]
  },
  {
    category: "Certificates & Credentials",
    questions: [
      {
        question: "Do I get a certificate after completing a course?",
        answer: "Yes! You'll receive a certificate of completion for each course you finish. These certificates are industry-recognized and can be shared on LinkedIn and other professional networks."
      },
      {
        question: "Are the certificates accredited?",
        answer: "Our degree programs are accredited and recognized by industry partners. Individual course certificates are industry-recognized and valued by employers in the tech sector."
      },
      {
        question: "Can I use these certificates for job applications?",
        answer: "Absolutely! Our certificates are designed to be valuable for job applications and career advancement. Many of our students have successfully used them to land new jobs or get promotions."
      }
    ]
  },
  {
    category: "Payment & Pricing",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and bank transfers. We also offer installment plans for higher-priced programs."
      },
      {
        question: "Do you offer refunds?",
        answer: "Yes, we offer a 30-day money-back guarantee for all courses. If you're not satisfied with your purchase, contact our support team for a full refund."
      },
      {
        question: "Are there any hidden fees?",
        answer: "No hidden fees! The price you see is the price you pay. All course materials, certificates, and support are included in the course price."
      },
      {
        question: "Do you offer discounts or scholarships?",
        answer: "Yes! We regularly offer discounts and have scholarship programs for students in need. Follow us on social media and subscribe to our newsletter to stay updated on current offers."
      }
    ]
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "What if I have technical issues?",
        answer: "Our technical support team is available 24/7 to help with any issues. You can contact us through the support portal, email, or live chat during business hours."
      },
      {
        question: "What devices can I use to access courses?",
        answer: "You can access courses on any device with an internet connection - desktop computers, laptops, tablets, and smartphones. Our platform is fully responsive and optimized for all screen sizes."
      },
      {
        question: "Do I need to download any software?",
        answer: "No additional software is required! All courses are accessible through your web browser. Some courses may recommend specific tools for hands-on practice, but these are clearly listed in the course description."
      },
      {
        question: "Can I download course videos?",
        answer: "Yes, most course videos can be downloaded for offline viewing. This feature is available on our mobile app and desktop platform."
      }
    ]
  },
  {
    category: "Mentorship Program",
    questions: [
      {
        question: "What is the 12-month mentorship program?",
        answer: "Our mentorship program pairs you with an industry expert who provides personalized guidance, career advice, project reviews, and networking opportunities throughout your learning journey."
      },
      {
        question: "How are mentors selected?",
        answer: "All mentors are carefully vetted industry professionals with extensive experience in their fields. They undergo training to ensure they can provide effective guidance and support."
      },
      {
        question: "What's included in the mentorship program?",
        answer: "The program includes 1-on-1 mentor sessions, career guidance, project reviews, industry networking, job placement assistance, and access to exclusive mentorship events."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Find answers to common questions about our courses, programs, and platform. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF804B] focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
              <div className="grid gap-4">
                {category.questions.map((faq, faqIndex) => (
                  <Card key={faqIndex} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-xl mb-6">
            Our support team is here to help you succeed in your learning journey.
          </p>
          <div className="space-x-4">
            <a
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/auth/register"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
