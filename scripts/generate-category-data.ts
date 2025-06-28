import fs from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { allBlogs } from 'contentlayer/generated'

const categoryCounts: Record<string, number> = {}

allBlogs.forEach((post) => {
  const category = post.category ? slug(post.category) : 'undefined'
  if (category in categoryCounts) {
    categoryCounts[category] += 1
  } else {
    categoryCounts[category] = 1
  }
})

const filePath = path.join(process.cwd(), 'app', 'category-data.json')
fs.writeFileSync(filePath, JSON.stringify(categoryCounts, null, 2))
console.log('✅ category-data.json generated.')
