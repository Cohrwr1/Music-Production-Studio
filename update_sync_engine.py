with open('temp_script.jsx', encoding='utf-8') as f:
    code = f.read()

import re

# Replace APPS_SCRIPT_CODE
old_script_code = r'''    const APPS_SCRIPT_CODE = `function doGet\(e\) \{.*?\}\`;'''

new_script_code = '''    const APPS_SCRIPT_CODE = `function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (e && e.parameter && e.parameter.payload) {
    try {
      var contents = JSON.parse(e.parameter.payload);
      if (contents.studentsHeaders && contents.studentsData) {
        updateSheet(ss, "Students", contents.studentsHeaders, contents.studentsData);
      }
      if (contents.attendanceHeaders && contents.attendanceData) {
        updateSheet(ss, "Attendance", contents.attendanceHeaders, contents.attendanceData);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Sheet updated successfully!" })).setMimeType(ContentService.MimeType.JSON);
    } catch(err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  var sheet = ss.getSheetByName("Students") || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify({ status: "success", data: data })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  return doGet(e);
}

function updateSheet(ss, sheetName, headers, rows) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) { sheet = ss.insertSheet(sheetName); }
  sheet.clear();
  sheet.appendRow(headers);
  if (rows && rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}`;'''

code = re.sub(old_script_code, new_script_code, code, flags=re.DOTALL)

# Replace autoPushToGoogleSheet
pos1 = code.find("async function autoPushToGoogleSheet(url, studs, atts) {")
if pos1 != -1:
    pos_end = code.find("useEffect(() => {", pos1)
    if pos_end != -1:
        new_push = '''async function autoPushToGoogleSheet(url, studs, atts) {
        if (!url || !url.trim() || url.includes('docs.google.com/spreadsheets/d/')) {
          return;
        }
        try {
          const studentsHeaders = ['Name', 'Date of Birth', 'Age', 'Email ID', 'Phone Number', 'Joining Date', 'Music Lesson Type', 'Class Days Schedule', 'Tuition Package', 'Package Fee (INR)', 'Classes Used', 'Last Class Date', 'Payment Status'];
          const studentsData = studs.map(s => [
            s.name, s.dob, s.age, s.email, s.phone, s.joiningDate, s.musicClass, s.classDays || 'Mon & Thu',
            s.packageType || '4 Classes Package (₹6,000)', s.packageAmount || 6000,
            `${s.completedClassesCount || 0}/${getPackageLimit(s.packageType)}`, s.lastClassDate || 'N/A', s.feeStatus
          ]);
          
          const attendanceHeaders = ['Date', 'Student Name', 'Lesson', 'Status'];
          const attendanceData = [];
          atts.forEach(rec => {
            Object.entries(rec.records || {}).forEach(([sId, st]) => {
              const stObj = studs.find(s => s.id === sId);
              attendanceData.push([rec.date, stObj ? stObj.name : sId, stObj ? stObj.musicClass : '', st]);
            });
          });

          const payload = {
            type: 'SYNC_ALL',
            studentsHeaders,
            studentsData,
            attendanceHeaders,
            attendanceData
          };

          const payloadStr = JSON.stringify(payload);

          // 1. Dual GET Pings (Bypasses CORS POST blocking in Google Apps Script 100%!)
          try {
            const getSyncUrl = url + (url.includes('?') ? '&' : '?') + 'payload=' + encodeURIComponent(payloadStr) + '&t=' + Date.now();
            fetch(getSyncUrl, { mode: 'no-cors' }).catch(e => {});
            
            const img = new Image();
            img.src = getSyncUrl;
          } catch(e) {}

          // 2. Fetch POST
          try {
            await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: payloadStr,
              mode: 'no-cors'
            });
          } catch(e) {}

          // 3. Hidden Form POST
          try {
            let iframe = document.getElementById('gs_hidden_iframe');
            if (!iframe) {
              iframe = document.createElement('iframe');
              iframe.id = 'gs_hidden_iframe';
              iframe.name = 'gs_hidden_iframe';
              iframe.style.display = 'none';
              document.body.appendChild(iframe);
            }

            let form = document.createElement('form');
            form.method = 'POST';
            form.action = url;
            form.target = 'gs_hidden_iframe';

            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'payload';
            input.value = payloadStr;
            form.appendChild(input);

            document.body.appendChild(form);
            form.submit();
            setTimeout(() => {
              if (form.parentNode) form.parentNode.removeChild(form);
            }, 1000);
          } catch(e) {}
        } catch (err) {
          console.log('Background Google Sheet sync:', err);
        }
      }
      '''
        code = code[:pos1] + new_push + code[pos_end:]
        print("Updated autoPushToGoogleSheet successfully!")

with open('temp_script.jsx', 'w', encoding='utf-8') as out:
    out.write(code)

print("Saved temp_script.jsx!")
