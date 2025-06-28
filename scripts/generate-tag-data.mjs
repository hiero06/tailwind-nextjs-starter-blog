// scripts/generate-tag-data.mjs
import fs from 'fs'
import path from 'path'
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { slug } from 'github-slugger'

const tagCounts = {}

allBlogs.forEach((post) => {
  post.tags?.forEach((tag) => {
    const tagSlug = slug(tag)
    tagCounts[tagSlug] = (tagCounts[tagSlug] || 0) + 1
  })
})

fs.writeFileSync(path.join(process.cwd(), 'app/tag-data.json'), JSON.stringify(tagCounts, null, 2))

console.log('✅ tag-data.json generated.')
