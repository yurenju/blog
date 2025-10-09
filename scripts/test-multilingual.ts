/**
 * Test script for multilingual post support
 * This script tests the core functionality without building the entire site
 */

import {
  extractLocaleFromFilename,
  getPostData,
  getPostsByLocale,
  getPostCountByLocale
} from '../lib/posts'
import path from 'path'

async function main() {
  console.log('Testing multilingual post support...\n')

  // Test 1: extractLocaleFromFilename
  console.log('=== Test 1: extractLocaleFromFilename ===')
  const testFiles = [
    'index.md',
    'index.ja.md',
    'index.en.md',
    '叫 AI 幫我寫程式，結果他聽不懂人話？.md',
    'article.ja.md',
  ]

  testFiles.forEach(filename => {
    const locale = extractLocaleFromFilename(filename)
    console.log(`${filename} -> ${locale}`)
  })

  // Test 2: getPostData with multilingual support
  console.log('\n=== Test 2: getPostData ===')
  const testDir = 'public/posts/2025-04-23_ai-coding-doesnt-understand-me'
  const files = [
    '叫 AI 幫我寫程式，結果他聽不懂人話？.md',
    'index.ja.md',
    'index.en.md'
  ]

  for (const file of files) {
    try {
      const filePath = path.join(process.cwd(), testDir, file)
      const postData = await getPostData(filePath)
      console.log(`\nFile: ${file}`)
      console.log(`  Locale: ${postData.locale}`)
      console.log(`  Available locales: ${postData.availableLocales.join(', ')}`)
      console.log(`  Slug: ${postData.slug}`)
      console.log(`  Title: ${postData.title.substring(0, 50)}...`)
    } catch (error) {
      console.error(`Error processing ${file}:`, error)
    }
  }

  // Test 3: getPostsByLocale and getPostCountByLocale
  console.log('\n=== Test 3: getPostsByLocale ===')
  const locales = ['zh', 'ja', 'en'] as const

  for (const locale of locales) {
    try {
      const count = await getPostCountByLocale(locale)
      console.log(`${locale}: ${count} posts`)

      if (count > 0) {
        const posts = await getPostsByLocale(locale)
        console.log(`  First post slug: ${posts[0].slug}`)
      }
    } catch (error) {
      console.error(`Error getting posts for ${locale}:`, error)
    }
  }

  console.log('\n✅ All tests completed!')
}

main().catch(console.error)
