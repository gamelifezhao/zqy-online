// src/app/blog/[slug]/page.tsx
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'

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

    return (
      <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto">
        <article className="prose dark:prose-invert max-w-none">
          <h1>{data.title}</h1>
          <MDXRemote source={content} />
        </article>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-500">
          文章不存在或加载失败
        </h1>
      </div>
    )
  }
}