with open('temp_script.jsx', encoding='utf-8') as f:
    code = f.read()

import re

# 1. Update checkCentralData loop in useEffect
old_polling = r'''      // Real-time Central Polling Loop \(fetches live updates from owner server every 5 seconds\)
      useEffect\(\(\) => \{
        let isMounted = true;

        const checkCentralData = async \(\) => \{
          try \{
            const res = await fetch\('/api/data'\);
            if \(res\.ok\) \{
              const data = await res\.json\(\);
              if \(data && data\.students && Array\.isArray\(data\.students\) && data\.students\.length > 0\) \{
                if \(!lastSyncTime || \(data\.updatedAt && data\.updatedAt > lastSyncTime\)\) \{
                  if \(isMounted\) \{
                    setStudents\(data\.students\);
                    if \(data\.attendance\) setAttendance\(data\.attendance\);
                    if \(data\.sheetUrl && !sheetUrl\) setSheetUrl\(data\.sheetUrl\);
                    if \(data\.updatedAt\) setLastSyncTime\(data\.updatedAt\);
                    localStorage\.setItem\('harmony_music_students', JSON\.stringify\(data\.students\)\);
                    if \(data\.attendance\) localStorage\.setItem\('harmony_music_attendance', JSON\.stringify\(data\.attendance\)\);
                  \}
                \}
              \}
            \}
          \} catch\(e\) \{
            // Local server API offline
          \}
        \};

        checkCentralData\(\);
        const timer = setInterval\(checkCentralData, 5000\);
        return \(\) => \{ isMounted = false; clearInterval\(timer\); \};
      \}, \[lastSyncTime\]\);'''

new_polling = '''      // Real-time Central Polling Loop (fetches live updates from local server OR Google Sheet every 8s)
      useEffect(() => {
        let isMounted = true;

        const checkCentralData = async () => {
          let updatedFromLocal = false;
          try {
            const res = await fetch('/api/data');
            if (res.ok) {
              const data = await res.json();
              if (data && data.students && Array.isArray(data.students) && data.students.length > 0) {
                if (!lastSyncTime || (data.updatedAt && data.updatedAt > lastSyncTime)) {
                  if (isMounted) {
                    setStudents(data.students);
                    if (data.attendance) setAttendance(data.attendance);
                    if (data.sheetUrl && !sheetUrl) setSheetUrl(data.sheetUrl);
                    if (data.updatedAt) setLastSyncTime(data.updatedAt);
                    localStorage.setItem('harmony_music_students', JSON.stringify(data.students));
                    if (data.attendance) localStorage.setItem('harmony_music_attendance', JSON.stringify(data.attendance));
                    updatedFromLocal = true;
                  }
                }
              }
            }
          } catch(e) {}

          // If local Python server is offline (e.g. running on GitHub Pages), auto-fetch from Google Sheet!
          if (!updatedFromLocal) {
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
                  const currStr = localStorage.getItem('harmony_music_students') || '';
                  const newStr = JSON.stringify(importedStudents);
                  if (currStr !== newStr) {
                    setStudents(importedStudents);
                    localStorage.setItem('harmony_music_students', newStr);
                  }
                }
              } catch (err) {}
            }
          }
        };

        checkCentralData();
        const timer = setInterval(checkCentralData, 8000);
        return () => { isMounted = false; clearInterval(timer); };
      }, [lastSyncTime, sheetUrl]);'''

# 2. Add 1-click Sync button to top header
old_header_buttons = '''                {userRole === 'owner' && (
                  <button onClick={() => setIsAddStudentOpen(true)} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                    <i className="fa-solid fa-plus"></i> Add Student
                  </button>
                )}

                <button onClick={handleLockStudio} className="btn-secondary" style={{ padding: '0.65rem 0.85rem', color: '#B91C1C', borderColor: '#FECACA' }} title="Lock Studio Portal">
                  <i className="fa-solid fa-lock"></i>
                </button>'''

new_header_buttons = '''                <button 
                  onClick={() => handleFetchFromGoogleSheet(null, false)} 
                  disabled={isSyncing}
                  className="btn-secondary" 
                  style={{ fontSize: '0.85rem', background: '#EEF2FF', color: 'var(--primary)', borderColor: '#C7D2FE' }} 
                  title="Sync live data from Google Sheet"
                >
                  <i className={`fa-solid fa-arrows-rotate ${isSyncing ? 'fa-spin' : ''}`}></i> {isSyncing ? 'Syncing...' : 'Sync Live Data'}
                </button>

                {userRole === 'owner' && (
                  <button onClick={() => setIsAddStudentOpen(true)} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                    <i className="fa-solid fa-plus"></i> Add Student
                  </button>
                )}

                <button onClick={handleLockStudio} className="btn-secondary" style={{ padding: '0.65rem 0.85rem', color: '#B91C1C', borderColor: '#FECACA' }} title="Lock Studio Portal">
                  <i className="fa-solid fa-lock"></i>
                </button>'''

pos1 = code.find("const checkCentralData = async () => {")
if pos1 != -1:
    pos_end = code.find("}, [lastSyncTime]);", pos1)
    if pos_end != -1:
        code = code[:pos1-25] + new_polling + code[pos_end + len("}, [lastSyncTime]);"):]
        print("Replaced polling loop successfully!")

code = code.replace(old_header_buttons, new_header_buttons)
print("Updated header buttons!")

with open('temp_script.jsx', 'w', encoding='utf-8') as out:
    out.write(code)

print("Saved updated temp_script.jsx!")
