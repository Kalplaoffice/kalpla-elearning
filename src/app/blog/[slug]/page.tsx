import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Mock blog post data - replace with actual GraphQL queries
const blogPost = {
  id: '1',
  title: 'The Future of Web Development: Trends to Watch in 2024',
  slug: 'future-web-development-trends-2024',
  content: `
    <p>Web development is evolving at an unprecedented pace, and 2024 promises to bring even more exciting changes to the industry. As we look ahead, several key trends are emerging that will shape how we build and interact with web applications.</p>

    <h2>1. AI-Powered Development Tools</h2>
    <p>Artificial Intelligence is revolutionizing the way developers write code. Tools like GitHub Copilot, ChatGPT, and other AI assistants are becoming indispensable for modern developers. These tools can help with code generation, debugging, documentation, and even architectural decisions.</p>

    <p>In 2024, we expect to see even more sophisticated AI tools that can understand context better and provide more accurate suggestions. This will make development faster and more accessible to newcomers.</p>

    <h2>2. WebAssembly (WASM) Goes Mainstream</h2>
    <p>WebAssembly is no longer just a niche technology. Major browsers now support it well, and we're seeing more applications leveraging WASM for performance-critical tasks. From image processing to game engines, WASM is enabling web applications to achieve near-native performance.</p>

    <p>Frameworks like Blazor and technologies like WASI (WebAssembly System Interface) are making it easier for developers to bring existing codebases to the web.</p>

    <h2>3. Edge Computing and Edge-First Development</h2>
    <p>As edge computing becomes more prevalent, developers are starting to think "edge-first" when building applications. This means designing applications that can run efficiently on edge servers, closer to users, for better performance and reduced latency.</p>

    <p>Technologies like Cloudflare Workers, Vercel Edge Functions, and AWS Lambda@Edge are making it easier to deploy code to the edge.</p>

    <h2>4. Progressive Web Apps (PWAs) 2.0</h2>
    <p>PWAs are getting a major upgrade with new capabilities like file system access, advanced caching strategies, and better offline support. The line between web and native apps continues to blur.</p>

    <p>New APIs like the File System Access API, Web Share API, and improved service workers are making PWAs more powerful and user-friendly.</p>

    <h2>5. Micro-Frontends Architecture</h2>
    <p>As applications grow in complexity, micro-frontends are becoming a popular architectural pattern. This approach allows teams to work independently on different parts of a frontend application, using different technologies and deployment cycles.</p>

    <p>Frameworks like Module Federation, Single-SPA, and tools like Nx are making micro-frontends more accessible and manageable.</p>

    <h2>6. Enhanced Developer Experience (DX)</h2>
    <p>Developer experience is becoming a key differentiator for frameworks and tools. We're seeing improvements in build tools, debugging capabilities, and development workflows that make developers more productive.</p>

    <p>Tools like Vite, esbuild, and SWC are making builds faster, while improved debugging tools and better error messages are making development more enjoyable.</p>

    <h2>Conclusion</h2>
    <p>The future of web development is bright and full of opportunities. By staying updated with these trends and continuously learning, developers can build better, faster, and more user-friendly web applications.</p>

    <p>Whether you're a seasoned developer or just starting out, embracing these trends will help you stay relevant and competitive in the ever-evolving world of web development.</p>
  `,
  author: {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/60/60',
    bio: 'Senior Web Developer with 10+ years of experience in modern web technologies. Passionate about creating user-friendly applications and sharing knowledge with the community.',
    social: {
      twitter: '@sarahjohnson',
      linkedin: 'sarahjohnson-dev',
      github: 'sarahjohnson'
    }
  },
  featuredImage: '/api/placeholder/800/400',
  tags: ['Web Development', 'Technology', 'Trends', 'JavaScript', 'React'],
  publishedAt: '2024-01-15',
  readTime: '5 min read',
  views: 1250,
  likes: 89
};

const relatedPosts = [
  {
    id: '2',
    title: 'Getting Started with React 18: New Features and Improvements',
    slug: 'react-18-getting-started',
    featuredImage: '/api/placeholder/300/200',
    readTime: '6 min read'
  },
  {
    id: '3',
    title: 'Building Modern Web Applications with Next.js 14',
    slug: 'nextjs-14-modern-web-apps',
    featuredImage: '/api/placeholder/300/200',
    readTime: '8 min read'
  },
  {
    id: '4',
    title: 'The Complete Guide to TypeScript for Web Developers',
    slug: 'typescript-complete-guide',
    featuredImage: '/api/placeholder/300/200',
    readTime: '10 min read'
  }
];

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li>/</li>
              <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
              <li>/</li>
              <li className="text-gray-900">{blogPost.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              {blogPost.tags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{blogPost.title}</h1>
            <div className="flex items-center justify-between text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={blogPost.author.avatar}
                    alt={blogPost.author.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{blogPost.author.name}</p>
                    <p className="text-sm">{blogPost.publishedAt}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span>{blogPost.readTime}</span>
                <span>{blogPost.views} views</span>
                <Button variant="outline" size="sm">
                  ♥ {blogPost.likes}
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={blogPost.featuredImage}
              alt={blogPost.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
          </div>

          {/* Author Bio */}
          <Card className="mb-12">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={blogPost.author.avatar}
                  alt={blogPost.author.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About {blogPost.author.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{blogPost.author.bio}</p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      Twitter: {blogPost.author.social.twitter}
                    </a>
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      LinkedIn: {blogPost.author.social.linkedin}
                    </a>
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      GitHub: {blogPost.author.social.github}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-32 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600">{post.readTime}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl mb-6">
              Put these trends into practice with our comprehensive web development courses.
            </p>
            <div className="space-x-4">
              <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/courses">Browse Courses</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
