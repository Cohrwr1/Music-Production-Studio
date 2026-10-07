with open('temp_script.jsx', encoding='utf-8') as f:
    code = f.read()

import re

# 1. Stable Student ID in processRowsIntoStudents
old_id = r"id:\s*`music_gs_\${i}_\${Date\.now\(\)}`"
new_id = "id: `music_gs_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`"
code = re.sub(old_id, new_id, code)

# 2. Simplified & bulletproof startup & polling loop
old_effect = r'''      // Real-time Central Polling Loop \(fetches live updates from local server OR Google Sheet every 8s\)
      useEffect\(\(\) => \{.*?\}, \[lastSyncTime, sheetUrl\]\);'''

new_effect = '''      // Bulletproof Continuous Google Sheet Sync Loop (Polls every 4 seconds)
      useEffect(() => {
        let isMounted = true;

        const checkCentralData = async () => {
          const urlToUse = sheetUrl || localStorage.getItem('harmony_sheet_url') || DEFAULT_SHEET_URL;
          if (urlToUse && urlToUse.trim()) {
            try {
              let urlToFetch = urlToUse.trim();
              if (urlToFetch.includes('docs.google.com/spreadsheets/d/')) {
                const match = urlToFetch.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (match && match[1]) {
                  urlToFetch = `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:csv`;
                }
              }

              const response = await fetch(urlToFetch, { redirect: 'follow' });
              const textData = await response.text();
              let parsedRows = [];
              try {
                const jsonData = JSON.parse(textData);
                if (jsonData && jsonData.data && Array.isArray(jsonData.data)) {
                  parsedRows = jsonData.data;
                }
              } catch(e) {
                parsedRows = parseCSVRows(textData);
              }

              const importedStudents = processRowsIntoStudents(parsedRows);
              if (importedStudents.length > 0 && isMounted) {
                setStudents(importedStudents);
                localStorage.setItem('harmony_music_students', JSON.stringify(importedStudents));
              }
            } catch (err) {}
          }
        };

        checkCentralData();
        const timer = setInterval(checkCentralData, 4000);
        return () => { isMounted = false; clearInterval(timer); };
      }, [sheetUrl]);'''

pos1 = code.find("useEffect(() => {")
if pos1 != -1:
    pos_end = code.find("}, [lastSyncTime, sheetUrl]);")
    if pos_end != -1:
        code = code[:pos1] + new_effect + code[pos_end + len("}, [lastSyncTime, sheetUrl]);"):]
        print("Replaced useEffect loop successfully!")

with open('temp_script.jsx', 'w', encoding='utf-8') as out:
    out.write(code)

print("Saved bulletproof temp_script.jsx!")
