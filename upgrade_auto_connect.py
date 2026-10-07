with open('temp_script.jsx', encoding='utf-8') as f:
    code = f.read()

# Replace sheetUrl state declaration
old_sheet_state = "const [sheetUrl, setSheetUrl] = useState(() => localStorage.getItem('harmony_sheet_url') || DEFAULT_SHEET_URL || '');"

new_sheet_state = '''const [sheetUrl, setSheetUrl] = useState(() => {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const paramUrl = urlParams.get('sheetUrl') || urlParams.get('url');
          if (paramUrl && paramUrl.trim()) {
            localStorage.setItem('harmony_sheet_url', paramUrl.trim());
            return paramUrl.trim();
          }
        } catch(e) {}
        return localStorage.getItem('harmony_sheet_url') || DEFAULT_SHEET_URL || '';
      });'''

code = code.replace(old_sheet_state, new_sheet_state)

# Replace startup useEffect to fetch sheet before demo data
old_startup = r'''      useEffect\(\(\) => \{
        const urlToUse = sheetUrl \|\| localStorage\.getItem\('harmony_sheet_url'\) \|\| DEFAULT_SHEET_URL;
        if \(urlToUse && urlToUse\.trim\(\)\) \{
          handleFetchFromGoogleSheet\(urlToUse, true\);
        \} else \{
          const local = localStorage\.getItem\('harmony_music_students'\);
          if \(!local \|\| JSON\.parse\(local\)\.length === 0\) \{
            const demo = generateInitialMusicStudents\(\);
            syncCentralData\(demo, attendance\);
          \}
        \}
      \}, \[\]\);'''

new_startup = '''useEffect(() => {
        const urlToUse = sheetUrl || localStorage.getItem('harmony_sheet_url') || DEFAULT_SHEET_URL;
        if (urlToUse && urlToUse.trim()) {
          handleFetchFromGoogleSheet(urlToUse, true);
        } else {
          const local = localStorage.getItem('harmony_music_students');
          if (!local || JSON.parse(local).length === 0) {
            const demo = generateInitialMusicStudents();
            syncCentralData(demo, attendance);
          }
        }
      }, []);'''

with open('temp_script.jsx', 'w', encoding='utf-8') as out:
    out.write(code)

print("SUCCESSFULLY UPGRADED sheetUrl auto-connect logic in temp_script.jsx!")
