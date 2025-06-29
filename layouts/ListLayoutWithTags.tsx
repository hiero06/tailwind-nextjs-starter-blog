'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import categoryData from 'app/category-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const basePath = pathname.replace(/\/page\/\d+$/, '').replace(/\/$/, '')
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage ? (
          <button className="cursor-auto disabled:opacity-50" disabled>
            Previous
          </button>
        ) : (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage ? (
          <button className="cursor-auto disabled:opacity-50" disabled>
            Next
          </button>
        ) : (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()

  const currentCategorySlug = pathname.includes('/category/')
    ? decodeURIComponent(pathname.split('/category/')[1]?.split('/')[0] ?? '')
    : ''
  const currentTagSlug = pathname.includes('/tags/')
    ? decodeURIComponent(pathname.split('/tags/')[1]?.split('/')[0] ?? '')
    : ''

  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])

  const categoryCounts = categoryData as Record<string, number>
  const sortedCategories = Object.keys(categoryCounts).sort(
    (a, b) => categoryCounts[b] - categoryCounts[a]
  )

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div>
        <div className="pt-6 pb-6">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-sm bg-gray-50 pt-5 shadow-md sm:flex dark:bg-gray-900/70 dark:shadow-gray-800/40">
            <div className="space-y-6 px-6 py-4">
              <div>
                <Link
                  href="/blog"
                  className="hover:text-primary-500 dark:hover:text-primary-500 font-bold text-gray-700 uppercase dark:text-gray-300"
                >
                  All Posts
                </Link>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 uppercase dark:text-white">
                  Categories
                </h3>
                <ul>
                  {sortedCategories.map((c) => {
                    const isActive = currentCategorySlug === slug(c)
                    return (
                      <li key={c} className="my-2">
                        {isActive ? (
                          <span className="text-primary-500 inline px-3 py-2 text-sm font-bold uppercase">
                            {`${c} (${categoryCounts[c]})`}
                          </span>
                        ) : (
                          <Link
                            href={`/category/${slug(c)}`}
                            className="hover:text-primary-500 dark:hover:text-primary-500 px-3 py-2 text-sm font-medium text-gray-500 uppercase dark:text-gray-300"
                          >
                            {`${c} (${categoryCounts[c]})`}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 uppercase dark:text-white">
                  Tags
                </h3>
                <ul>
                  {sortedTags.map((t) => {
                    const isActive = currentTagSlug === slug(t)
                    return (
                      <li key={t} className="my-2">
                        {isActive ? (
                          <span className="text-primary-500 inline px-3 py-2 text-sm font-bold uppercase">
                            {`${t} (${tagCounts[t]})`}
                          </span>
                        ) : (
                          <Link
                            href={`/tags/${slug(t)}`}
                            className="hover:text-primary-500 dark:hover:text-primary-500 px-3 py-2 text-sm font-medium text-gray-500 uppercase dark:text-gray-300"
                          >
                            {`${t} (${tagCounts[t]})`}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full">
            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags, category } = post
                return (
                  <li key={path} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                              {title}
                            </Link>
                          </h2>
                          {category && (
                            <Link
                              href={`/category/${slug(Array.isArray(category) ? category[0] : category)}`}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium uppercase"
                            >
                              {category}
                            </Link>
                          )}
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>

            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
