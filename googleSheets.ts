import { Student, AttendanceRecord, FeePayment, GoogleSheetsConfig } from '../types';

export const APPS_SCRIPT_TEMPLATE = `
// --- GOOGLE APPS SCRIPT FOR EDUFLOW STUDENT MANAGEMENT ---
// 1. Open your Google Sheet -> Extensions -> Apps Script
// 2. Erase any existing code and paste this code completely
// 3. Click 'Deploy' -> 'New Deployment' -> Select 'Web App'
// 4. Set 'Execute as': 'Me'
// 5. Set 'Who has access': 'Anyone'
// 6. Click 'Deploy' and copy your Web App URL into EduFlow Settings!

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var studentsSheet = ss.getSheetByName("Students") || ss.getSheets()[0];
  var data = studentsSheet.getDataRange().getValues();
  
  return ContentService
    .createTextOutput(JSON.stringify({ status: "success", data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (contents.type === "SYNC_ALL") {
      updateSheet(ss, "Students", contents.studentsHeaders, contents.studentsData);
      updateSheet(ss, "Attendance", contents.attendanceHeaders, contents.attendanceData);
      updateSheet(ss, "Fees", contents.feesHeaders, contents.feesData);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Google Sheet updated successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateSheet(ss, sheetName, headers, rows) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  sheet.clear();
  sheet.appendRow(headers);
  if (rows && rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}
`.trim();

export const googleSheetsService = {
  // Sync all local data with Google Sheet Webhook
  async syncToGoogleSheet(
    config: GoogleSheetsConfig,
    students: Student[],
    attendance: AttendanceRecord[],
    fees: FeePayment[]
  ): Promise<{ success: boolean; message: string }> {
    if (!config.scriptUrl || !config.scriptUrl.trim()) {
      return { success: false, message: 'Google Apps Script Webhook URL is missing.' };
    }

    try {
      const studentsHeaders = ['ID', 'Roll No', 'Name', 'Class', 'Parent Name', 'Parent Phone', 'Email', 'Monthly Fee', 'Fee Status', 'Joining Date'];
      const studentsData = students.map(s => [
        s.id, s.rollNumber, s.name, s.className, s.parentName, s.parentPhone, s.email || '', s.monthlyFee, s.feeStatus, s.joiningDate
      ]);

      const attendanceHeaders = ['Record ID', 'Date', 'Class', 'Student ID', 'Status'];
      const attendanceData: any[][] = [];
      attendance.forEach(rec => {
        Object.entries(rec.records).forEach(([studentId, status]) => {
          attendanceData.push([rec.id, rec.date, rec.className, studentId, status]);
        });
      });

      const feesHeaders = ['Receipt No', 'Date', 'Student ID', 'Student Name', 'Class', 'Amount', 'Month For', 'Payment Method'];
      const feesData = fees.map(f => [
        f.receiptNo, f.date, f.studentId, f.studentName, f.className, f.amount, f.monthFor, f.paymentMethod
      ]);

      const payload = {
        type: 'SYNC_ALL',
        studentsHeaders,
        studentsData,
        attendanceHeaders,
        attendanceData,
        feesHeaders,
        feesData
      };

      // Send payload via POST
      await fetch(config.scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        mode: 'no-cors' // Google Apps Script Web App standard CORS fallback
      });

      return {
        success: true,
        message: 'Successfully submitted data to Google Sheet! Data is being updated.'
      };
    } catch (err: any) {
      console.error('Google Sheet Sync Error:', err);
      return {
        success: false,
        message: err.message || 'Failed to communicate with Google Sheet endpoint.'
      };
    }
  },

  // Export database as CSV file suitable for Google Sheets paste/import
  exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Import CSV text into Students
  parseStudentsCSV(csvText: string): Partial<Student>[] {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length <= 1) return [];

    const parsed: Partial<Student>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.replace(/^"|"$/g, '').trim());
      if (parts.length >= 3) {
        parsed.push({
          rollNumber: parts[1] || `${100 + i}`,
          name: parts[2] || parts[0] || 'Unknown Student',
          className: parts[3] || 'Class 10-A',
          parentName: parts[4] || 'Parent',
          parentPhone: parts[5] || '',
          email: parts[6] || '',
          monthlyFee: Number(parts[7]) || 2500,
          feeStatus: (parts[8] as any) || 'paid',
          joiningDate: parts[9] || new Date().toISOString().split('T')[0]
        });
      }
    }
    return parsed;
  }
};
