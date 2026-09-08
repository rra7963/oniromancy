import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Tag } from "lucide-react";
import { blogPosts } from "../data";
import { WithContext, BlogPosting, BreadcrumbList } from "schema-dts";
import { ShareButtons } from "@/components/ShareButtons";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Blog Post Not Found" };
  
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.oniromancy.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.oniromancy.com/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.image,
          width: 800,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const post = blogPosts[postIndex];

  if (!post) {
    notFound();
  }

  // Determine Prev/Next posts
  const prevPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;
  const nextPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: new Date(post.date).toISOString(),
    image: post.image,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Oniromancy AI",
      logo: {
        "@type": "ImageObject",
        url: "https://www.oniromancy.com/icon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.oniromancy.com/blog/${slug}`,
    },
    keywords: post.tags?.join(", "),
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.oniromancy.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.oniromancy.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://www.oniromancy.com/blog/${slug}`,
      },
    ],
  };

  return (
    <article className="w-full max-w-6xl mx-auto pb-20 mt-4 md:mt-8 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      {/* Back Link */}
      <Link 
        href="/blog"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>

      {/* Header Section */}
      <header className="mb-12 text-center max-w-4xl mx-auto">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-mystic-gold/10 text-mystic-gold text-xs font-bold uppercase tracking-wider border border-mystic-gold/20">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-8 leading-tight drop-shadow-2xl tracking-tight">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <User className="w-4 h-4 text-slate-200" />
            </div>
            <span className="text-slate-200">{post.author}</span>
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-slate-600" />
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            {post.date}
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-slate-600" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            {post.readTime}
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10 ring-1 ring-white/5 group">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          unoptimized
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar (Desktop Share) */}
        <aside className="hidden lg:block w-16 shrink-0 sticky top-32 h-fit">
          <div className="flex flex-col gap-6 items-center">
             <ShareButtons title={post.title} url={`https://www.oniromancy.com/blog/${post.slug}`} />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow max-w-3xl mx-auto">
          <div 
            className="prose prose-invert prose-lg max-w-none 
            prose-headings:font-display prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
            prose-p:text-slate-300 prose-p:leading-8 prose-p:text-lg
            prose-a:text-mystic-gold hover:prose-a:text-white prose-a:transition-colors prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-bold
            prose-li:text-slate-300
            prose-blockquote:border-l-mystic-gold prose-blockquote:bg-white/5 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-200
            prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-lg
            prose-hr:border-white/10 prose-hr:my-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Mobile Share */}
          <div className="mt-12 py-8 border-t border-b border-white/10 lg:hidden flex justify-center">
            <ShareButtons title={post.title} url={`https://www.oniromancy.com/blog/${post.slug}`} />
          </div>

          {/* Tags Footer */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-3">
                {post.tags.map(tag => (
                  <Link 
                    key={tag} 
                    href="/blog" 
                    className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 hover:text-white transition-colors border border-white/5"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Previous/Next Navigation */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {prevPost ? (
              <Link 
                href={`/blog/${prevPost.slug}`}
                className="group relative h-48 rounded-2xl overflow-hidden border border-white/10 shadow-lg"
              >
                <Image
                  src={prevPost.image}
                  alt={prevPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-mystic-gold flex items-center gap-2">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Previous
                  </span>
                  <div>
                    <span className="font-display font-bold text-lg text-white group-hover:text-mystic-gold transition-colors line-clamp-2">
                      {prevPost.title}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block" /> 
            )}

            {nextPost ? (
              <Link 
                href={`/blog/${nextPost.slug}`}
                className="group relative h-48 rounded-2xl overflow-hidden border border-white/10 shadow-lg"
              >
                <Image
                  src={nextPost.image}
                  alt={nextPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between items-end text-right">
                  <span className="text-xs font-bold uppercase tracking-widest text-mystic-gold flex items-center gap-2">
                    Next
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div>
                    <span className="font-display font-bold text-lg text-white group-hover:text-mystic-gold transition-colors line-clamp-2">
                      {nextPost.title}
                    </span>
                  </div>
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-24 text-center border-t border-white/5 pt-12">
        <p className="text-slate-400 italic font-serif text-lg">
          &quot;The universe speaks in whispers. Listen closely.&quot;
        </p>
      </div>
    </article>
  );
}
