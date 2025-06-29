// tailwind-nextjs-starter-blog\app\category\[category]\[page]\page.tsx

import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

const POSTS_PER_PAGE = 5

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; page: string }>
}): Promise<Metadata> {
  const { category } = await params
  const rawCategory = decodeURIComponent(category)

  return genPageMetadata({
    title: rawCategory,
    description: `${siteMetadata.title} ${rawCategory} categorized content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/categories/${rawCategory}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const categoryCounts = categoryData as Record<string, number>
  const categoryKeys = Object.keys(categoryCounts)
  
  const paths: { category: string; page: string }[] = []
  
  categoryKeys.forEach((category) => {
    const filteredPosts = allBlogs.filter((post) => {
      const postCategory = post.category
      if (Array.isArray(postCategory)) {
        return postCategory.some(cat => slug(cat) === slug(category))
      } else {
        return slug(postCategory ?? 'uncategorized') === slug(category)
      }
    })
    
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
    
    for (let i = 1; i <= totalPages; i++) {
      paths.push({
        category: encodeURI(category),
        page: i.toString(),
      })
    }
  })
  
  return paths
}

export default async function CategoryPagePaginated({ 
  params 
}: { 
  params: Promise<{ category: string; page: string }> 
}) {
  const { category, page } = await params
  const rawCategory = decodeURIComponent(category)
  const categorySlug = slug(rawCategory)
  const pageNumber = parseInt(page)

  // ✅ Correction: Gérer le cas où category peut être un tableau
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter((post) => {
        const postCategory = post.category
        if (Array.isArray(postCategory)) {
          // Si category est un tableau, vérifier chaque élément
          return postCategory.some(cat => slug(cat) === categorySlug)
        } else {
          // Si category est une string (ou undefined)
          return slug(postCategory ?? 'uncategorized') === categorySlug
        }
      })
    )
  )

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (pageNumber - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const initialDisplayPosts = filteredPosts.slice(startIndex, endIndex)

  const pagination = {
    currentPage: pageNumber,
    totalPages,
  }

  const title = `Category: ${rawCategory}`

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}