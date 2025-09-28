import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>מים וטבע - שירותי בריכות, גינון ונקיון מקצועי</title>
        {/* Heebo Hebrew font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
        {/* Tailwind CDN for rapid prototyping (can swap to build later) */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#1e40af',
                  secondary: '#0891b2',
                  accent: '#059669'
                },
                fontFamily: {
                  heebo: ['Heebo', 'system-ui', 'sans-serif']
                }
              }
            }
          }
        ` }} />
        {/* Icons */}
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css" rel="stylesheet" />
        {/* App styles */}
        <link href="/static/styles.css" rel="stylesheet" />
      </head>
      <body className="font-heebo bg-gradient-to-b from-blue-500 via-sky-400 to-cyan-300 min-h-screen text-slate-900 selection:bg-cyan-200/70">
        {children}
        <script src="/static/app.js" defer></script>
      </body>
    </html>
  )
})
