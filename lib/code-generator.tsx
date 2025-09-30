import type { EditorElement, Page } from "./types"

export function generateHTML(page: Page, elements: EditorElement[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.name}</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  ${elements.map((el) => generateElementHTML(el)).join("\n  ")}
  <script src="/script.js"></script>
</body>
</html>`
}

export function generateCSS(elements: EditorElement[]): string {
  let css = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
}

`

  const flatElements = flattenElements(elements)
  flatElements.forEach((el) => {
    if (Object.keys(el.styles).length > 0) {
      css += `[data-element-id="${el.id}"] {\n`
      Object.entries(el.styles).forEach(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase()
        css += `  ${cssKey}: ${value};\n`
      })
      css += `}\n\n`
    }
  })

  return css
}

export function generateJS(): string {
  return `// Generated JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('Website loaded successfully');
  
  // Add any interactive functionality here
  const buttons = document.querySelectorAll('button[data-element-type="button"]');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const href = this.getAttribute('data-href');
      if (href && href !== '#') {
        window.location.href = href;
      }
    });
  });
});`
}

function generateElementHTML(element: EditorElement, depth = 0): string {
  const indent = "  ".repeat(depth)
  const dataAttrs = `data-element-id="${element.id}" data-element-type="${element.type}"`

  switch (element.type) {
    case "section":
      return `${indent}<section ${dataAttrs}>
${element.children?.map((child) => generateElementHTML(child, depth + 1)).join("\n") || ""}
${indent}</section>`

    case "container":
      return `${indent}<div ${dataAttrs}>
${element.children?.map((child) => generateElementHTML(child, depth + 1)).join("\n") || ""}
${indent}</div>`

    case "text":
      const tag = element.content.tag || "p"
      return `${indent}<${tag} ${dataAttrs}>${element.content.text || ""}</${tag}>`

    case "image":
      return `${indent}<img ${dataAttrs} src="${element.content.src || ""}" alt="${element.content.alt || ""}">`

    case "button":
      return `${indent}<button ${dataAttrs} data-href="${element.content.href || "#"}">${element.content.text || "Button"}</button>`

    case "navbar":
      return `${indent}<nav ${dataAttrs}>
${indent}  <div class="navbar-brand">${element.content.brand || "Brand"}</div>
${indent}  <div class="navbar-links">
${element.content.links?.map((link: any) => `${indent}    <a href="${link.href}">${link.text}</a>`).join("\n") || ""}
${indent}  </div>
${indent}</nav>`

    case "footer":
      return `${indent}<footer ${dataAttrs}>
${indent}  <p>${element.content.text || "Footer"}</p>
${indent}</footer>`

    default:
      return `${indent}<div ${dataAttrs}>Unknown element</div>`
  }
}

function flattenElements(elements: EditorElement[]): EditorElement[] {
  const result: EditorElement[] = []
  elements.forEach((el) => {
    result.push(el)
    if (el.children && el.children.length > 0) {
      result.push(...flattenElements(el.children))
    }
  })
  return result
}

export function generateZipContent(
  pages: Page[],
  elementsMap: Map<string, EditorElement[]>,
): {
  files: { name: string; content: string }[]
} {
  const files: { name: string; content: string }[] = []

  // Generate HTML for each page
  pages.forEach((page) => {
    const elements = elementsMap.get(page.id) || []
    const html = generateHTML(page, elements)
    const filename = page.is_home ? "index.html" : `${page.slug}.html`
    files.push({ name: filename, content: html })
  })

  // Generate single CSS file
  const allElements: EditorElement[] = []
  elementsMap.forEach((elements) => allElements.push(...elements))
  const css = generateCSS(allElements)
  files.push({ name: "styles.css", content: css })

  // Generate single JS file
  const js = generateJS()
  files.push({ name: "script.js", content: js })

  // Generate README
  const readme = `# Website Export

This is your exported website from Webara.

## Files
- index.html - Home page
${pages
  .filter((p) => !p.is_home)
  .map((p) => `- ${p.slug}.html - ${p.name}`)
  .join("\n")}
- styles.css - All styles
- script.js - JavaScript functionality

## Deployment
You can deploy these files to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

Simply upload all files to your hosting provider.
`
  files.push({ name: "README.md", content: readme })

  return { files }
}
