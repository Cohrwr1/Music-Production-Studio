with open('temp_script.jsx', encoding='utf-8') as f:
    code = f.read()

import re

# 1. Update DEFAULT_SHEET_URL
my_url = 'https://script.google.com/macros/s/AKfycbzD8tSq5esdph6EtAlGM73d0csC6Ev5l_NjmhAfIlPKeTwGpJQNfI_6kun5bcDBHXPc/exec'

code = re.sub(
    r"const DEFAULT_SHEET_URL = '[^']*';",
    f"const DEFAULT_SHEET_URL = '{my_url}';",
    code
)

# 2. Update syncCentralData to ensure sheetUrlToUse is used
old_sync_push = '''        // 2. Auto-push to Google Sheet if Web App URL is connected & user is Owner
        if (targetSheetUrl && targetSheetUrl.trim() && userRole === 'owner') {
          autoPushToGoogleSheet(targetSheetUrl, newStudents, newAttendance);
        }'''

new_sync_push = '''        // 2. Auto-push to Google Sheet if Web App URL is connected & user is Owner
        const sheetUrlToUse = targetSheetUrl || sheetUrl || localStorage.getItem('harmony_sheet_url') || DEFAULT_SHEET_URL;
        if (sheetUrlToUse && sheetUrlToUse.trim() && userRole === 'owner') {
          autoPushToGoogleSheet(sheetUrlToUse, newStudents, newAttendance);
        }'''

code = code.replace(old_sync_push, new_sync_push)

# 3. Update polling timer from 8000 to 5000ms for fast multi-device sync
code = code.replace('setInterval(checkCentralData, 8000);', 'setInterval(checkCentralData, 5000);')

with open('temp_script.jsx', 'w', encoding='utf-8') as out:
    out.write(code)

print("Updated temp_script.jsx with baked Google Sheet Web App URL!")
