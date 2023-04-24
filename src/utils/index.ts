import { marked } from 'marked'
import hljs from 'highlight.js/lib/common'

const rendererPost = new marked.Renderer()
rendererPost.link = (href, title, text) =>
  `<a href=${href} target="_blank" class="relative px-1 z-10 hover:text-white after:link hover:after:link-hover transition-colors">${text}</a>`
rendererPost.blockquote = quote =>
  `<blockquote class="pl-4 pr-2 py-2 border-l-4 border-gray-300 bg-gray-300/20">${quote}</blockquote>`

marked.setOptions({
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-',
  renderer: rendererPost,
})

function replaceShortcode(text: string) {
  return text
    .replaceAll('[notice]', '<div class="bg-orange-200/20 border-l-4 border-orange-400 pl-4 pr-2 py-2 my-1">')
    .replaceAll('[/notice]', '</div>')
}

export function formatTime(time: string | number) {
  const date = new Date(time)
  let timeStr = ''
  timeStr += `${date.getFullYear()}-`
  timeStr += (date.getMonth() + 1) > 9 ? `${date.getMonth() + 1}-` : `0${date.getMonth() + 1}-`
  timeStr += date.getDate() > 9 ? `${date.getDate()} ` : `0${date.getDate()} `
  timeStr += date.getHours() > 9 ? `${date.getHours()}:` : `0${date.getHours()}:`
  timeStr += date.getMinutes() > 9 ? `${date.getMinutes()}:` : `0${date.getMinutes()}:`
  timeStr += date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`
  return timeStr
}

export function renderMarkdown(text: string) {
  return replaceShortcode(marked.parse(text))
}
