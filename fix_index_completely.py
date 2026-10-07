import urllib.request

print("Fetching React and ReactDOM production bundles...")
react_url = "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"
react_dom_url = "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"

req1 = urllib.request.Request(react_url, headers={'User-Agent': 'Mozilla/5.0'})
react_code = urllib.request.urlopen(req1).read().decode('utf-8')

req2 = urllib.request.Request(react_dom_url, headers={'User-Agent': 'Mozilla/5.0'})
react_dom_code = urllib.request.urlopen(req2).read().decode('utf-8')

with open('app_compiled.js', encoding='utf-8') as f:
    app_js = f.read()

full_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Music Production Studio - Private Portal</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

  <style>
    :root {{
      --bg-app: #F4F6FC;
      --bg-surface: rgba(255, 255, 255, 0.92);
      --bg-surface-subtle: #F1F5F9;
      
      --text-main: #0F172A;
      --text-muted: #64748B;
      
      --border-color: #E2E8F0;
      --primary: #6366F1;
      --primary-gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      --primary-light: #EEF2FF;
      --primary-hover: #4F46E5;
      
      /* Status Colors */
      --present-bg: #ECFDF5;
      --present-border: #A7F3D0;
      --present-text: #047857;
      --present-accent: #10B981;

      --absent-bg: #FEF2F2;
      --absent-border: #FECACA;
      --absent-text: #B91C1C;
      --absent-accent: #EF4444;

      --pending-bg: #FFFBEB;
      --pending-border: #FDE68A;
      --pending-text: #B45309;

      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 20px;
      --radius-full: 9999px;

      --shadow-sm: 0 2px 5px rgba(0, 0, 0, 0.03);
      --shadow-md: 0 8px 24px -4px rgba(99, 102, 241, 0.08);
      --shadow-lg: 0 16px 32px -8px rgba(15, 23, 42, 0.12);
      
      --font-main: 'Plus Jakarta Sans', sans-serif;
      --font-heading: 'Outfit', var(--font-main);
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}

    html, body {{
      overflow-x: hidden !important;
      width: 100% !important;
      max-width: 100vw !important;
      margin: 0;
      padding: 0;
      position: relative;
    }}

    #root, .app-layout, .main-content {{
      overflow-x: hidden !important;
      width: 100% !important;
      max-width: 100vw !important;
    }}

    body {{
      font-family: var(--font-main);
      background: linear-gradient(135deg, #F0F4FF 0%, #F5F3FF 50%, #EEF2FF 100%);
      background-attachment: fixed;
      color: var(--text-main);
      line-height: 1.5;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }}

    h1, h2, h3, h4 {{ font-family: var(--font-heading); font-weight: 700; color: var(--text-main); }}

    button {{
      font-family: var(--font-main);
      cursor: pointer;
      border: none;
      background: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      touch-action: manipulation;
    }}

    input, select, textarea {{
      font-family: var(--font-main);
      font-size: 0.925rem;
    }}

    .app-layout {{ display: flex; min-height: 100vh; position: relative; }}
    
    .sidebar {{
      width: 260px;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(16px);
      border-right: 1px solid var(--border-color);
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-shrink: 0;
      z-index: 100;
      transition: transform 0.3s ease;
    }}

    .nav-btn {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.8rem 1.1rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.925rem;
      color: var(--text-main);
      text-align: left;
    }}
    .nav-btn:hover {{ background: var(--primary-light); color: var(--primary); transform: translateX(3px); }}
    .nav-btn.active {{
      background: var(--primary-gradient);
      color: white;
      font-weight: 700;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
    }}

    .main-content {{
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }}

    header {{
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 90;
    }}

    .mobile-bar {{
      display: none;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      padding: 0.65rem 0.85rem;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 110;
      box-shadow: var(--shadow-sm);
    }}

    .mobile-bottom-nav {{
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(16px);
      border-top: 1px solid var(--border-color);
      z-index: 105;
      justify-content: space-around;
      align-items: center;
      padding: 0 0.25rem;
      box-shadow: 0 -4px 16px rgba(0,0,0,0.06);
    }}
    .mobile-nav-item {{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      font-size: 0.675rem;
      font-weight: 700;
      color: var(--text-muted);
      flex: 1;
      padding: 6px 0;
      border-radius: var(--radius-sm);
    }}
    .mobile-nav-item i {{ font-size: 1.1rem; }}
    .mobile-nav-item.active {{
      color: var(--primary);
      background: var(--primary-light);
    }}

    .sidebar-overlay {{
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(4px);
      z-index: 95;
    }}

    .content-area {{
      padding: 1.75rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }}

    .card {{
      background: var(--bg-surface);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: var(--radius-xl);
      padding: 1.35rem 1.65rem;
      box-shadow: var(--shadow-md);
    }}

    .btn-primary {{
      background: var(--primary-gradient);
      color: white;
      padding: 0.65rem 1.25rem;
      border-radius: var(--radius-md);
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }}
    .btn-primary:hover {{ transform: translateY(-2px); box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4); }}

    .btn-secondary {{
      background: rgba(241, 245, 249, 0.9);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      padding: 0.65rem 1.25rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }}
    .btn-secondary:hover {{ background: #E2E8F0; transform: translateY(-1px); }}

    .btn-edit {{
      background: var(--primary-light);
      color: var(--primary);
      border: 1px solid #C7D2FE;
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 0.825rem;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }}
    .btn-edit:hover {{ background: #E0E7FF; transform: translateY(-1px); }}

    .badge {{
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.3rem 0.8rem;
      border-radius: var(--radius-md);
      font-size: 0.8rem;
      font-weight: 700;
      white-space: nowrap;
    }}
    .badge-present {{ background: var(--present-bg); color: var(--present-text); border: 1px solid var(--present-border); }}
    .badge-absent {{ background: var(--absent-bg); color: var(--absent-text); border: 1px solid var(--absent-border); }}
    .badge-pending {{ background: var(--pending-bg); color: var(--pending-text); border: 1px solid var(--pending-border); }}

    .grid-2 {{ display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }}
    .grid-3 {{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }}

    .modal-overlay {{
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 1rem;
    }}
    .modal-content {{
      background: #FFFFFF; border-radius: var(--radius-xl); width: 100%; max-width: 640px;
      box-shadow: var(--shadow-lg); border: 1px solid var(--border-color); max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;
    }}
    .modal-header {{ padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; }}
    .modal-body {{ padding: 1.5rem; overflow-y: auto; }}
    .modal-footer {{ padding: 1rem 1.5rem; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 0.75rem; background: var(--bg-app); }}

    .table-responsive {{
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }}

    .desktop-table-view {{ display: block; }}
    .mobile-fee-cards-view {{ display: none; }}

    /* --- MOBILE RESPONSIVE MEDIA QUERIES --- */
    @media (max-width: 768px) {{
      .desktop-table-view {{ display: none !important; }}
      .mobile-fee-cards-view {{ display: flex !important; flex-direction: column; gap: 0.85rem; }}

      .mobile-bar {{ display: flex; }}
      .mobile-bottom-nav {{ display: flex; }}
      .sidebar-overlay.active {{ display: block; }}

      .sidebar {{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        width: 270px;
        z-index: 200;
        display: none !important; /* Fully hide off-screen to avoid horizontal viewport scrolling */
      }}
      .sidebar.open {{
        display: flex !important;
        box-shadow: var(--shadow-lg);
      }}

      header {{
        display: none !important;
      }}

      .content-area {{
        padding: 0.75rem;
        padding-bottom: 75px;
      }}

      .card {{
        padding: 0.95rem;
        border-radius: var(--radius-lg);
      }}

      .filter-bar {{
        grid-template-columns: 1fr !important;
        gap: 0.65rem !important;
      }}

      .student-grid {{
        grid-template-columns: 1fr !important;
        gap: 0.75rem !important;
      }}

      .grid-2, .grid-3 {{
        grid-template-columns: 1fr !important;
        gap: 0.65rem !important;
      }}

      .modal-overlay {{
        padding: 0;
        align-items: flex-end;
      }}

      .modal-content {{
        max-width: 100vw;
        max-height: 88vh;
        border-radius: 20px 20px 0 0;
      }}

      .modal-header {{
        padding: 1rem 1.15rem;
      }}

      .modal-body {{
        padding: 1rem 1.15rem;
      }}

      .modal-footer {{
        padding: 0.75rem 1.15rem;
      }}
    }}
  </style>
</head>
<body>
  <div id="root"></div>

  <!-- 100% INLINE SELF-CONTAINED REACT & REACT-DOM ENGINE -->
  <script>
{react_code}
  </script>
  <script>
{react_dom_code}
  </script>
  <script>
{app_js}
  </script>
</body>
</html>
'''

with open('index.html', 'w', encoding='utf-8') as out:
    out.write(full_html)

print("COMPLETELY REBUILT index.html with 100% INLINE React engine! Zero external JS dependencies!")
