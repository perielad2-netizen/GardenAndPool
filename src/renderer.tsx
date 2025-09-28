import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>מים וטבע - שירותי בריכות, גינון ונקיון מקצועי</title>
        <meta name="description" content="שירותי בריכות וגינון מקצועי - הכל במקום אחד" />
        
        {/* Hebrew Fonts - Heebo */}
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        {/* Tailwind CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        
        {/* FontAwesome Icons */}
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        
        {/* Custom CSS */}
        <link href="/static/style.css" rel="stylesheet" />
        
        {/* Tailwind Config for RTL and Custom Colors */}
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    'heebo': ['Heebo', 'sans-serif'],
                  },
                  colors: {
                    water: {
                      50: '#f0f9ff',
                      100: '#e0f2fe',
                      200: '#bae6fd',
                      300: '#7dd3fc',
                      400: '#38bdf8',
                      500: '#0ea5e9',
                      600: '#0284c7',
                      700: '#0369a1',
                      800: '#075985',
                      900: '#0c4a6e',
                    },
                    nature: {
                      50: '#ecfdf5',
                      100: '#d1fae5',
                      200: '#a7f3d0',
                      500: '#10b981',
                      600: '#059669',
                      700: '#047857',
                    }
                  },
                  backgroundImage: {
                    'water-gradient': 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                    'nature-gradient': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body class="font-heebo bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen" dir="rtl">
        {children}
      </body>
    </html>
  )
})
