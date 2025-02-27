import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import BlogPostClient from './BlogPostClient'
import Image from 'next/image'
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'
import remarkGfm from 'remark-gfm'

const components = {
  img: (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    const { src, alt } = props
    if (!src) return null
    
    return (
      <div className="relative w-full h-[300px] my-4">
        <Image
          src={src}
          alt={alt || ''}
          fill
          className="object-contain"
          loading="lazy"
          onError={(e: any) => {
            e.currentTarget.src = '/images/placeholder.png'
          }}
        />
      </div>
    )
  }
}

export async function generateStaticParams() {
  try {
    const postsDirectory = path.join(process.cwd(), 'src/content/blog')
    const files = await fs.readdir(postsDirectory)
    
    return files.map((file) => ({
      slug: file.replace(/\.md$/, ''),
    }))
  } catch (error) {
    console.error('Error reading blog directory:', error)
    return []
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`)
    const fileContent = await fs.readFile(filePath, 'utf8')
    const { content, data } = matter(fileContent)

    // 在服务器端渲染 MDX 内容
    const mdxContent = await MDXRemote({
      source: content,
      components,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          format: 'md'
        }
      }
    })

    return <BlogPostClient mdxContent={mdxContent} data={data} />
  } catch (error) {
    console.error('Error loading blog post:', error)
    return (
      <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-500">
          文章加载失败: {error instanceof Error ? error.message : String(error)}
        </h1>
      </div>
    )
  }
}