'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, MessageSquare, PenTool, Youtube, AtSign, FileText, Image as ImageIcon, Sparkles, MicVocal, Music, ShoppingCart, Podcast, Newspaper, Mails } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    title: 'AI Chat',
    description: 'Engage in a conversation with an advanced AI assistant.',
    icon: MessageSquare,
    href: '/chat',
    color: 'text-blue-500',
     bgColor: 'bg-blue-500/10'
  },
  {
    title: 'Generate Script',
    description: 'Create video scripts for YouTube, TikTok, and more.',
    icon: Youtube,
    href: '/tools/generate-script',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  {
    title: 'Generate Captions',
    description: 'Craft perfect, engaging captions for social media posts.',
    icon: PenTool,
    href: '/tools/generate-captions',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    title: 'Generate Social Media Bios',
    description: 'Create a compelling and professional bio for any platform.',
    icon: AtSign,
    href: '/tools/generate-bios',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    title: 'Generate Descriptions',
    description: 'Write engaging descriptions for videos and products.',
    icon: FileText,
    href: '/tools/generate-descriptions',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  {
    title: 'Image to Text',
    description: 'Extract text from any image with high accuracy.',
    icon: ImageIcon,
    href: '/tools/image-to-text',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10'
  },
  {
    title: 'Voiceover Script Generator',
    description: 'Create professional voiceover scripts for videos.',
    icon: MicVocal,
    href: '/tools/generate-voiceover-script',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10'
  },
  {
    title: 'Song/Rap Lyrics Generator',
    description: 'Write creative lyrics for your next hit song.',
    icon: Music,
    href: '/tools/generate-song-lyrics',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  {
    title: 'Product Description Generator',
    description: 'Create compelling descriptions for e-commerce stores.',
    icon: ShoppingCart,
    href: '/tools/generate-product-description',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10'
  },
  {
    title: 'Podcast Script Generator',
    description: 'Plan and write your next podcast episode script.',
    icon: Podcast,
    href: '/tools/generate-podcast-script',
    color: 'text-red-600',
    bgColor: 'bg-red-600/10'
  },
  {
    title: 'Blog Post Generator',
    description: 'Generate SEO-optimized articles for your blog.',
    icon: Newspaper,
    href: '/tools/generate-blog-post',
    color: 'text-lime-500',
    bgColor: 'bg-lime-500/10'
  },
  {
    title: 'Newsletter Generator',
    description: 'Craft engaging newsletters for your email campaigns.',
    icon: Mails,
    href: '/tools/generate-newsletter',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
];

export default function ToolsPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
       <div className="flex items-center gap-4 p-4 md:p-6 border-b">
          <Sparkles className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Tools</h1>
            <p className="text-muted-foreground">A suite of AI-powered tools to supercharge your workflow.</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => (
              <Link href={tool.href} key={tool.title} className="group">
                  <Card className="glass-card h-full flex flex-col justify-between transition-all duration-300 hover:border-primary/60 hover:shadow-xl hover:-translate-y-1.5">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                         <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tool.bgColor}`}>
                           <tool.icon className={`h-6 w-6 ${tool.color}`} />
                         </div>
                         <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-lg font-semibold">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tool.description}</p>
                    </CardContent>
                  </Card>
              </Link>
            ))}
          </div>
        </div>
    </div>
  );
}
