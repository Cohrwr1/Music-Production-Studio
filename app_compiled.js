const {
useState,
useEffect,
Component
} = React;
const DEFAULT_SHEET_URL = ''; // Embed your https://script.google.com/macros/s/.../exec Web App URL here for instant global auto-connect!

const MUSIC_LESSON_OPTIONS = ['Vocal Lessons', 'Piano Lessons', 'App Lessons'];

// --- TUITION PACKAGE OPTIONS ---
const PACKAGE_OPTIONS = [{
id: 'pkg_4',
label: '4 Classes Package (₹6,000)',
price: 6000
}, {
id: 'pkg_12',
label: '12 Classes Package (₹15,000)',
price: 15000
}, {
id: 'pkg_custom',
label: 'Custom Package',
price: 0
}];
const getPackageLimit = pkgType => {
const p = (pkgType || '').toLowerCase();
if (p.includes('12')) return 12;
if (p.includes('4')) return 4;
return 4;
};
const calculateAge = dobString => {
if (!dobString) return 0;
const today = new Date();
const birthDate = new Date(dobString);
let age = today.getFullYear() - birthDate.getFullYear();
const monthDiff = today.getMonth() - birthDate.getMonth();
if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
age--;
}
return age > 0 ? age : 0;
};
const getDayNameFromDate = dateStr => {
if (!dateStr) return 'Monday';
const parts = dateStr.split('-');
const d = new Date(parts[0], parts[1] - 1, parts[2]);
return d.toLocaleDateString('en-US', {
weekday: 'long'
});
};
const generateInitialMusicStudents = () => {
const firstNames = ['Aarav', 'Ananya', 'Rohan', 'Priya', 'Vivaan', 'Diya', 'Aditya', 'Sanya', 'Kabir', 'Isha', 'Arjun', 'Sneha', 'Vihaan', 'Tanvi', 'Dev', 'Kavya', 'Reyansh', 'Meera', 'Krishna', 'Riya', 'Ishaan', 'Kriti', 'Shaurya', 'Aanya', 'Yash', 'Avani', 'Ayush', 'Zara', 'Dhruv', 'Pari', 'Neer', 'Bhavya', 'Atharv', 'Nisha', 'Rudra', 'Prisha', 'Manan', 'Tanya', 'Samarth', 'Anika', 'Siddharth', 'Navya', 'Harsh', 'Tara', 'Karan'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Mehta', 'Joshi', 'Shah', 'Nair', 'Rao', 'Chopra', 'Malhotra', 'Bhatia', 'Kapoor'];
const sampleSchedules = ['Mon & Thu', 'Tue & Fri', 'Wed & Sat', 'Mon & Thu', 'Saturday Only', 'Sunday Only', 'Tue & Fri'];
const colors = ['#6366F1', '#0284C7', '#0D9488', '#16A34A', '#D97706', '#9333EA', '#DB2777'];
return Array.from({
length: 45
}, (_, i) => {
const fn = firstNames[i % firstNames.length];
const ln = lastNames[i % lastNames.length];
const birthYear = 2012 - i % 20;
const birthMonth = String(i % 12 + 1).padStart(2, '0');
const birthDay = String(i % 28 + 1).padStart(2, '0');
const dob = `${birthYear}-${birthMonth}-${birthDay}`;
const age = calculateAge(dob);
const is12Pkg = i % 3 === 0;
return {
id: `music_std_${i + 1}`,
name: `${fn} ${ln}`,
dob: dob,
age: age,
email: `${fn.toLowerCase()}.${ln.toLowerCase()}@gmail.com`,
phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
joiningDate: `2026-0${i % 5 + 1}-10`,
musicClass: MUSIC_LESSON_OPTIONS[i % MUSIC_LESSON_OPTIONS.length],
classDays: sampleSchedules[i % sampleSchedules.length],
packageType: is12Pkg ? '12 Classes Package (₹15,000)' : '4 Classes Package (₹6,000)',
packageAmount: is12Pkg ? 15000 : 6000,
completedClassesCount: i % 4,
// Initial class progress
lastClassDate: '2026-10-01',
feeStatus: i % 5 === 0 ? 'pending' : i % 9 === 0 ? 'overdue' : 'paid',
avatarColor: colors[i % colors.length]
};
});
};
const APPS_SCRIPT_CODE = `function doGet(e) {
var ss = SpreadsheetApp.getActiveSpreadsheet();
if (e && e.parameter && e.parameter.payload) {
try {
var c = JSON.parse(e.parameter.payload);
if (c.studentsHeaders && c.studentsData) updateSheet(ss, "Students", c.studentsHeaders, c.studentsData);
if (c.attendanceHeaders && c.attendanceData) updateSheet(ss, "Attendance", c.attendanceHeaders, c.attendanceData);
} catch(err) {}
}
var sheet = ss.getSheetByName("Students") || ss.getSheets()[0];
var data = sheet.getDataRange().getValues();
return ContentService.createTextOutput(JSON.stringify({ status: "success", data: data })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
try {
var contents = {};
if (e && e.parameter && e.parameter.payload) {
contents = JSON.parse(e.parameter.payload);
} else if (e && e.postData && e.postData.contents) {
contents = JSON.parse(e.postData.contents);
}
var ss = SpreadsheetApp.getActiveSpreadsheet();
if (contents.studentsHeaders && contents.studentsData) {
updateSheet(ss, "Students", contents.studentsHeaders, contents.studentsData);
}
if (contents.attendanceHeaders && contents.attendanceData) {
updateSheet(ss, "Attendance", contents.attendanceHeaders, contents.attendanceData);
}
return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Written to Google Sheet successfully!" })).setMimeType(ContentService.MimeType.JSON);
} catch(err) {
return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
}
}

function updateSheet(ss, sheetName, headers, rows) {
var sheet = ss.getSheetByName(sheetName);
if (!sheet) { sheet = ss.insertSheet(sheetName); }
sheet.clear();
sheet.appendRow(headers);
if (rows && rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}`;
const parseCSVRows = text => {
const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
return lines.map(line => {
const result = [];
let current = '';
let inQuotes = false;
for (let i = 0; i < line.length; i++) {
const char = line[i];
if (char === '"') {
inQuotes = !inQuotes;
} else if (char === ',' && !inQuotes) {
result.push(current.trim());
current = '';
} else if (char === '\t' && !inQuotes) {
result.push(current.trim());
current = '';
} else {
current += char;
}
}
result.push(current.trim());
return result;
});
};

// --- MAIN APP COMPONENT ---
function App() {
// Security Dual-Passcode Lock System (Owner vs User)
const [ownerPasscode, setOwnerPasscode] = useState(() => localStorage.getItem('harmony_owner_passcode') || localStorage.getItem('harmony_master_passcode') || '2026');
const [userPasscode, setUserPasscode] = useState(() => localStorage.getItem('harmony_user_passcode') || '1234');
const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem('harmony_is_unlocked') === 'true');
const [userRole, setUserRole] = useState(() => sessionStorage.getItem('harmony_user_role') || 'owner');
const [enteredPin, setEnteredPin] = useState('');
const [pinError, setPinError] = useState('');

// Change Passcode Form (Owner Only)
const [isChangePasscodeOpen, setIsChangePasscodeOpen] = useState(false);
const [currentOwnerPinCheck, setCurrentOwnerPinCheck] = useState('');
const [newOwnerPinForm, setNewOwnerPinForm] = useState('');
const [newUserPinForm, setNewUserPinForm] = useState('');
const [changePasscodeError, setChangePasscodeError] = useState('');

// Quick Class Progress Edit Modal State
const [studentForProgressEdit, setStudentForProgressEdit] = useState(null);
const [customCompletedCount, setCustomCompletedCount] = useState(0);
const [customLastClassDate, setCustomLastClassDate] = useState('');

// Reschedule & Extra Class Modal States
const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
const [studentForReschedule, setStudentForReschedule] = useState(null);
const [rescheduleTargetDate, setRescheduleTargetDate] = useState(new Date().toISOString().split('T')[0]);
const [rescheduleOriginalDate, setRescheduleOriginalDate] = useState(new Date().toISOString().split('T')[0]);
const [rescheduleReason, setRescheduleReason] = useState('');
const [isExtraClassOpen, setIsExtraClassOpen] = useState(false);
const [studentForExtraClass, setStudentForExtraClass] = useState(null);
const [extraClassDate, setExtraClassDate] = useState(new Date().toISOString().split('T')[0]);
const [extraClassNotes, setExtraClassNotes] = useState('Extra practice session');
const [activeTab, setActiveTab] = useState('attendance');
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [students, setStudents] = useState(() => {
const local = localStorage.getItem('harmony_music_students');
return local ? JSON.parse(local) : [];
});
const [attendance, setAttendance] = useState(() => {
const local = localStorage.getItem('harmony_music_attendance');
if (local) return JSON.parse(local);
const today = new Date().toISOString().split('T')[0];
return [{
id: `${today}_All`,
date: today,
className: 'All',
records: {}
}];
});
const [sheetUrl, setSheetUrl] = useState(() => localStorage.getItem('harmony_sheet_url') || DEFAULT_SHEET_URL || '');

// Initial startup check: auto-fetch from Google Sheet on launch so all devices see live roster
useEffect(() => {
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
}, []);
const [isSyncing, setIsSyncing] = useState(false);
const [lastSyncTime, setLastSyncTime] = useState(0);
const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
const [selectedLessonFilter, setSelectedLessonFilter] = useState('All');
const [showOnlyTodayScheduled, setShowOnlyTodayScheduled] = useState(true);
const [searchQuery, setSearchQuery] = useState('');

// Modal States
const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
const [studentToEdit, setStudentToEdit] = useState(null);
const [isPasteDataOpen, setIsPasteDataOpen] = useState(false);
const [pastedText, setPastedText] = useState('');
const [formData, setFormData] = useState({
name: '',
dob: '2005-01-15',
age: 21,
email: '',
phone: '',
joiningDate: new Date().toISOString().split('T')[0],
musicClass: 'Vocal Lessons',
classDays: 'Mon & Thu',
packageType: '4 Classes Package (₹6,000)',
packageAmount: 6000,
completedClassesCount: 0,
lastClassDate: new Date().toISOString().split('T')[0],
feeStatus: 'paid'
});

// --- CENTRAL MULTI-DEVICE SYNCHRONIZATION ENGINE ---
async function syncCentralData(newStudents, newAttendance = attendance, targetSheetUrl = sheetUrl) {
const now = Date.now();
setStudents(newStudents);
setAttendance(newAttendance);
setLastSyncTime(now);
localStorage.setItem('harmony_music_students', JSON.stringify(newStudents));
localStorage.setItem('harmony_music_attendance', JSON.stringify(newAttendance));
if (targetSheetUrl) localStorage.setItem('harmony_sheet_url', targetSheetUrl);

// 1. Send update to central Python server API (/api/data) if running
try {
await fetch('/api/data', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({
students: newStudents,
attendance: newAttendance,
sheetUrl: targetSheetUrl,
updatedAt: now
})
});
} catch (e) {
// Local Python server endpoint offline
}

// 2. Auto-push to Google Sheet if Web App URL is connected & user is Owner
if (targetSheetUrl && targetSheetUrl.trim() && userRole === 'owner') {
autoPushToGoogleSheet(targetSheetUrl, newStudents, newAttendance);
}
}
async function autoPushToGoogleSheet(url, studs, atts) {
if (!url || !url.trim() || url.includes('docs.google.com/spreadsheets/d/')) {
return;
}
try {
const studentsHeaders = ['Name', 'Date of Birth', 'Age', 'Email ID', 'Phone Number', 'Joining Date', 'Music Lesson Type', 'Class Days Schedule', 'Tuition Package', 'Package Fee (INR)', 'Classes Used', 'Last Class Date', 'Payment Status'];
const studentsData = studs.map(s => [s.name, s.dob, s.age, s.email, s.phone, s.joiningDate, s.musicClass, s.classDays || 'Mon & Thu', s.packageType || '4 Classes Package (₹6,000)', s.packageAmount || 6000, `${s.completedClassesCount || 0}/${getPackageLimit(s.packageType)}`, s.lastClassDate || 'N/A', s.feeStatus]);
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

// 1. Fetch POST
try {
await fetch(url, {
method: 'POST',
headers: {
'Content-Type': 'text/plain;charset=utf-8'
},
body: JSON.stringify(payload),
mode: 'no-cors'
});
} catch (e) {}

// 2. Hidden Form POST (Bypasses 302 redirect payload drops in browsers guaranteed)
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
input.value = JSON.stringify(payload);
form.appendChild(input);
document.body.appendChild(form);
form.submit();
setTimeout(() => {
if (form.parentNode) form.parentNode.removeChild(form);
}, 1000);
} catch (e) {}
} catch (err) {
console.log('Background Google Sheet sync:', err);
}
}
;

// Real-time Central Polling Loop (fetches live updates from owner server every 5 seconds)
useEffect(() => {
let isMounted = true;
const checkCentralData = async () => {
try {
const res = await fetch('/api/data');
if (res.ok) {
const data = await res.json();
if (data && data.students && Array.isArray(data.students) && data.students.length > 0) {
if (!lastSyncTime || data.updatedAt && data.updatedAt > lastSyncTime) {
if (isMounted) {
setStudents(data.students);
if (data.attendance) setAttendance(data.attendance);
if (data.sheetUrl && !sheetUrl) setSheetUrl(data.sheetUrl);
if (data.updatedAt) setLastSyncTime(data.updatedAt);
localStorage.setItem('harmony_music_students', JSON.stringify(data.students));
if (data.attendance) localStorage.setItem('harmony_music_attendance', JSON.stringify(data.attendance));
}
}
}
}
} catch (e) {
// Local server API offline
}
};
checkCentralData();
const timer = setInterval(checkCentralData, 5000);
return () => {
isMounted = false;
clearInterval(timer);
};
}, [lastSyncTime]);

// Role-Based Unlock Handler
const handleUnlockStudio = e => {
e.preventDefault();
const pin = enteredPin.trim();
if (pin === ownerPasscode) {
sessionStorage.setItem('harmony_is_unlocked', 'true');
sessionStorage.setItem('harmony_user_role', 'owner');
setIsUnlocked(true);
setUserRole('owner');
setEnteredPin('');
setPinError('');
} else if (pin === userPasscode) {
sessionStorage.setItem('harmony_is_unlocked', 'true');
sessionStorage.setItem('harmony_user_role', 'user');
setIsUnlocked(true);
setUserRole('user');
setEnteredPin('');
setPinError('');
} else {
setPinError('❌ Incorrect Passcode. Please try again!');
}
};
const handleLockStudio = () => {
sessionStorage.removeItem('harmony_is_unlocked');
sessionStorage.removeItem('harmony_user_role');
setIsUnlocked(false);
setUserRole(null);
setIsMobileMenuOpen(false);
};

// Owner-Only Dual Passcode Change Handler
const handleChangePasscode = e => {
e.preventDefault();
if (userRole !== 'owner') {
setChangePasscodeError('🔒 Permission Denied: User Mode cannot modify passcodes or permissions.');
return;
}
if (currentOwnerPinCheck.trim() !== ownerPasscode) {
setChangePasscodeError('🔒 Incorrect Current Owner Passcode! Only the studio owner who knows the current owner passcode can update security settings.');
return;
}
if (!newOwnerPinForm.trim()) {
setChangePasscodeError('❌ Owner passcode cannot be empty.');
return;
}
if (!newUserPinForm.trim()) {
setChangePasscodeError('❌ User passcode cannot be empty.');
return;
}
localStorage.setItem('harmony_owner_passcode', newOwnerPinForm.trim());
localStorage.setItem('harmony_user_passcode', newUserPinForm.trim());
setOwnerPasscode(newOwnerPinForm.trim());
setUserPasscode(newUserPinForm.trim());
setIsChangePasscodeOpen(false);
setCurrentOwnerPinCheck('');
setChangePasscodeError('');
alert(`✅ Security Passcodes successfully updated!\n\n👑 Owner Passcode: ${newOwnerPinForm.trim()}\n👤 User Passcode: ${newUserPinForm.trim()}`);
};
const handleClearAllStudents = () => {
if (confirm('🧹 Are you sure you want to clear all student records from central database?')) {
syncCentralData([], attendance);
alert('✅ All student records cleared centrally! Your app is now starting fresh.');
}
};
const handleLoadSampleStudents = () => {
if (confirm('📥 Load sample demo students?')) {
const demo = generateInitialMusicStudents();
syncCentralData(demo, attendance);
alert(`✅ Loaded ${demo.length} sample demo students centrally across all devices.`);
}
};

// Payment Status & Package Renewal Handler (Owner Only)
const handleSetPaymentStatus = (studentId, newStatus) => {
if (userRole !== 'owner') {
alert('🔒 Permission Denied: User Mode is View-Only. Log in with the Owner Passcode to change payment status.');
return;
}
const updatedList = students.map(s => {
if (s.id === studentId) {
if (newStatus === 'paid') {
const limit = getPackageLimit(s.packageType);
alert(`✅ Payment recorded for ${s.name}! Package renewed (0 / ${limit} classes used in new package cycle).`);
return {
...s,
feeStatus: 'paid',
completedClassesCount: 0,
lastClassDate: new Date().toISOString().split('T')[0]
};
}
return {
...s,
feeStatus: newStatus
};
}
return s;
});
syncCentralData(updatedList, attendance);
};

// Open Quick Class Progress Edit Modal (Owner Only)
const handleOpenProgressEdit = student => {
if (userRole !== 'owner') {
alert('🔒 Permission Denied: User Mode is View-Only. Log in with the Owner Passcode to edit class progress.');
return;
}
setStudentForProgressEdit(student);
setCustomCompletedCount(student.completedClassesCount || 0);
setCustomLastClassDate(student.lastClassDate || new Date().toISOString().split('T')[0]);
};
const handleSaveProgressEdit = e => {
e.preventDefault();
if (userRole !== 'owner') return;
if (!studentForProgressEdit) return;
const limit = getPackageLimit(studentForProgressEdit.packageType);
const count = Math.max(0, Number(customCompletedCount) || 0);
const isExpired = count >= limit;
const updatedList = students.map(s => {
if (s.id === studentForProgressEdit.id) {
return {
...s,
completedClassesCount: count,
lastClassDate: customLastClassDate || new Date().toISOString().split('T')[0],
feeStatus: isExpired ? 'pending' : s.feeStatus
};
}
return s;
});
syncCentralData(updatedList, attendance);
setStudentForProgressEdit(null);
alert(`✅ Updated class progress for ${studentForProgressEdit.name}: ${count}/${limit} classes completed as of ${customLastClassDate}! Saved centrally.`);
};

// Reschedule Class Handlers (Owner Only)
const handleOpenRescheduleModal = student => {
if (userRole !== 'owner') {
alert('🔒 Permission Denied: User Mode is View-Only. Log in with Owner Passcode to reschedule classes.');
return;
}
setStudentForReschedule(student);
setRescheduleTargetDate(selectedDate);
setRescheduleOriginalDate(selectedDate);
setRescheduleReason('');
setIsRescheduleOpen(true);
};
const handleSaveReschedule = e => {
e.preventDefault();
if (userRole !== 'owner') return;
if (!studentForReschedule || !rescheduleTargetDate) return;
const newRescheduleItem = {
id: `resch_${Date.now()}`,
date: rescheduleTargetDate,
originalDate: rescheduleOriginalDate || selectedDate,
reason: rescheduleReason.trim() || 'Student request'
};
const updatedStudents = students.map(s => {
if (s.id === studentForReschedule.id) {
const existing = s.rescheduledClasses || [];
return {
...s,
rescheduledClasses: [...existing, newRescheduleItem]
};
}
return s;
});
syncCentralData(updatedStudents, attendance);
setIsRescheduleOpen(false);
setStudentForReschedule(null);
alert(`🔄 Class rescheduled for ${studentForReschedule.name} to ${rescheduleTargetDate}! Saved centrally.`);
};
const handleRemoveReschedule = (studentId, rescheduleId) => {
if (userRole !== 'owner') {
alert('🔒 Permission Denied: User Mode is View-Only.');
return;
}
const updatedStudents = students.map(s => {
if (s.id === studentId) {
return {
...s,
rescheduledClasses: (s.rescheduledClasses || []).filter(r => r.id !== rescheduleId)
};
}
return s;
});
syncCentralData(updatedStudents, attendance);
};

// Extra Class Handlers (Owner Only)
const handleOpenExtraClassModal = student => {
if (userRole !== 'owner') {
alert('🔒 Permission Denied: User Mode is View-Only. Log in with Owner Passcode to log extra classes.');
return;
}
setStudentForExtraClass(student);
setExtraClassDate(selectedDate);
setExtraClassNotes('Extra practice session');
setIsExtraClassOpen(true);
};
const handleSaveExtraClass = e => {
e.preventDefault();
if (userRole !== 'owner') return;
if (!studentForExtraClass) return;
const newExtraItem = {
id: `extra_${Date.now()}`,
date: extraClassDate,
notes: extraClassNotes.trim() || 'Extra practice session'
};
const updatedStudents = students.map(s => {
if (s.id === studentForExtraClass.id) {
const existing = s.extraClasses || [];
const currentCount = s.completedClassesCount || 0;
const newCount = currentCount + 1;
const limit = getPackageLimit(s.packageType);
const isExpiredNow = newCount >= limit;
if (isExpiredNow) {
alert(`⚠️ ${s.name} has completed all ${limit} classes in their ${s.packageType || 'package'} after taking an extra class! Payment status is now set to PENDING for package renewal.`);
}
return {
...s,
extraClasses: [...existing, newExtraItem],
completedClassesCount: newCount,
lastClassDate: extraClassDate,
feeStatus: isExpiredNow ? 'pending' : s.feeStatus
};
}
return s;
});

// Update attendance record for that date to 'extra'
const recIndex = attendance.findIndex(r => r.date === extraClassDate);
let updatedAttendance = [...attendance];
if (recIndex >= 0) {
const rec = {
...updatedAttendance[recIndex]
};
rec.records = {
...rec.records,
[studentForExtraClass.id]: 'extra'
};
updatedAttendance[recIndex] = rec;
} else {
updatedAttendance.push({
id: `${extraClassDate}_All`,
date: extraClassDate,
className: 'All',
records: {
[studentForExtraClass.id]: 'extra'
}
});
}
syncCentralData(updatedStudents, updatedAttendance);
setIsExtraClassOpen(false);
setStudentForExtraClass(null);
alert(`⭐ Extra class logged for ${studentForExtraClass.name} on ${extraClassDate}! Saved centrally.`);
};
const handleDobChange = (e, isEditing = false) => {
const dobVal = e.target.value;
const computedAge = calculateAge(dobVal);
if (isEditing && studentToEdit) {
setStudentToEdit({
...studentToEdit,
dob: dobVal,
age: computedAge
});
} else {
setFormData({
...formData,
dob: dobVal,
age: computedAge
});
}
};
const handleOpenEditStudent = student => {
if (userRole !== 'owner') {
alert('🔒 Permission Denied: User Mode is View-Only. Log in with the Owner Passcode to edit student profiles.');
return;
}
setStudentToEdit({
...student
});
setIsEditStudentOpen(true);
};
const handleSaveEditedStudent = e => {
e.preventDefault();
if (userRole !== 'owner') return;
if (!studentToEdit || !studentToEdit.name) return;
const updatedAge = calculateAge(studentToEdit.dob);
const limit = getPackageLimit(studentToEdit.packageType);
const count = Number(studentToEdit.completedClassesCount) || 0;
const isExpired = count >= limit;
const finalStudent = {
...studentToEdit,
age: updatedAge,
completedClassesCount: count,
feeStatus: isExpired ? 'pending' : studentToEdit.feeStatus
};
const updatedList = students.map(s => s.id === studentToEdit.id ? finalStudent : s);
syncCentralData(updatedList, attendance);
setIsEditStudentOpen(false);
setStudentToEdit(null);
alert(`✅ Updated profile for ${finalStudent.name}! Saved centrally.`);
};
const handleDeleteStudent = (id, name) => {
if (userRole !== 'owner') {
alert('🔒 Permission Denied: User Mode is View-Only. Log in with the Owner Passcode to delete student records.');
return;
}
if (confirm(`Are you sure you want to remove student ${name}?`)) {
const updated = students.filter(s => s.id !== id);
syncCentralData(updated, attendance);
}
};
const getStudentStatus = studentId => {
const rec = attendance.find(r => r.date === selectedDate);
return rec?.records?.[studentId] || 'unmarked';
};

// Automated Class-Count Expiry Logic on Attendance Marking (Owner Only)
const setSingleAttendance = (studentId, status) => {
if (userRole !== 'owner') {
alert('🔒 Permission Denied: User Mode is View-Only. Log in with the Owner Passcode to mark attendance.');
return;
}
const recIndex = attendance.findIndex(r => r.date === selectedDate);
let updated = [...attendance];
const previousStatus = getStudentStatus(studentId);
const isNewMark = (previousStatus === 'unmarked' || !previousStatus) && (status === 'present' || status === 'absent');
if (recIndex >= 0) {
const rec = {
...updated[recIndex]
};
rec.records = {
...rec.records,
[studentId]: status
};
updated[recIndex] = rec;
} else {
updated.push({
id: `${selectedDate}_All`,
date: selectedDate,
className: 'All',
records: {
[studentId]: status
}
});
}

// Auto Class Counter & Auto Status Expiry (Switching to PENDING when limit is reached)
let updatedStudents = students;
if (isNewMark) {
updatedStudents = students.map(s => {
if (s.id === studentId) {
const limit = getPackageLimit(s.packageType);
const currentCount = s.completedClassesCount || 0;
const newCount = currentCount + 1;
const isExpiredNow = newCount >= limit;
if (isExpiredNow) {
alert(`⚠️ ${s.name} has completed all ${limit} classes in their ${s.packageType || 'package'}! Payment status is now automatically set to PENDING for package renewal.`);
}
return {
...s,
completedClassesCount: newCount,
lastClassDate: selectedDate,
feeStatus: isExpiredNow ? 'pending' : s.feeStatus
};
}
return s;
});
}
syncCentralData(updatedStudents, updated);
};
const setBulkAttendance = status => {
if (userRole !== 'owner') {
alert('🔒 Permission Denied: User Mode is View-Only. Log in with the Owner Passcode to mark attendance.');
return;
}
const recIndex = attendance.findIndex(r => r.date === selectedDate);
let updated = [...attendance];
const newMap = recIndex >= 0 ? {
...updated[recIndex].records
} : {};
filteredStudents.forEach(s => {
newMap[s.id] = status;
});
if (recIndex >= 0) {
updated[recIndex] = {
...updated[recIndex],
records: newMap
};
} else {
updated.push({
id: `${selectedDate}_All`,
date: selectedDate,
className: 'All',
records: newMap
});
}
syncCentralData(students, updated);
};
const selectedDayName = getDayNameFromDate(selectedDate);
const isStudentScheduledOnDate = (student, dateStr) => {
// Rescheduled classes check
if (student.rescheduledClasses && student.rescheduledClasses.some(r => r.date === dateStr)) {
return true;
}

// Extra classes check
if (student.extraClasses && student.extraClasses.some(e => e.date === dateStr)) {
return true;
}
const dayFull = getDayNameFromDate(dateStr).toLowerCase();
const dayShort = dayFull.slice(0, 3);
const sched = (student.classDays || '').toLowerCase();
if (!sched || sched.includes('flex') || sched.includes('all') || sched.includes('custom')) return true;
if (sched.includes(dayFull) || sched.includes(dayShort)) return true;
const existingStatus = getStudentStatus(student.id);
if (existingStatus === 'present' || existingStatus === 'absent' || existingStatus === 'extra') return true;
return false;
};
function processRowsIntoStudents(rows) {
if (!rows || rows.length < 2) return [];
const headers = rows[0].map(h => String(h).trim().toLowerCase());
const findCol = possibleNames => {
for (let name of possibleNames) {
const idx = headers.findIndex(h => h.includes(name));
if (idx !== -1) return idx;
}
return -1;
};
const nameCol = findCol(['name', 'student name', 'full name', 'student']);
const dobCol = findCol(['dob', 'date of birth', 'birth', 'birthdate']);
const ageCol = findCol(['age']);
const emailCol = findCol(['email', 'email id', 'mail']);
const phoneCol = findCol(['phone', 'phone number', 'contact', 'mobile']);
const joinCol = findCol(['joining date', 'joining', 'joined', 'date']);
const statusCol = findCol(['payment status', 'status', 'fee status', 'payment']);
const classCol = findCol(['music class', 'lesson', 'instrument', 'class', 'batch']);
const daysCol = findCol(['class days', 'classes per week', 'schedule', 'days', 'frequency']);
const pkgCol = findCol(['package', 'tuition package', 'plan', 'bundle']);
const countCol = findCol(['completed classes', 'classes completed', 'classes used', 'completed', 'progress']);
const lastDateCol = findCol(['last class date', 'class date', 'last date', 'payment date']);
const actualNameCol = nameCol !== -1 ? nameCol : 0;
const imported = [];
for (let i = 1; i < rows.length; i++) {
const row = rows[i];
if (!row[actualNameCol] || String(row[actualNameCol]).trim() === '') continue;
const name = String(row[actualNameCol]).trim();
const dob = dobCol !== -1 && row[dobCol] ? String(row[dobCol]).trim() : '2005-01-01';
const age = ageCol !== -1 && row[ageCol] ? Number(row[ageCol]) : calculateAge(dob);
const email = emailCol !== -1 && row[emailCol] ? String(row[emailCol]).trim() : `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
const phone = phoneCol !== -1 && row[phoneCol] ? String(row[phoneCol]).trim() : '+91 9800000000';
const joiningDate = joinCol !== -1 && row[joinCol] ? String(row[joinCol]).trim() : '2026-04-01';
let rawClass = classCol !== -1 && row[classCol] ? String(row[classCol]).trim() : 'Vocal Lessons';
let musicClass = 'Vocal Lessons';
if (rawClass.toLowerCase().includes('piano')) musicClass = 'Piano Lessons';
if (rawClass.toLowerCase().includes('app') || rawClass.toLowerCase().includes('ipad')) musicClass = 'App Lessons';
let classDays = daysCol !== -1 && row[daysCol] ? String(row[daysCol]).trim() : 'Mon & Thu';
let packageType = pkgCol !== -1 && row[pkgCol] ? String(row[pkgCol]).trim() : '4 Classes Package (₹6,000)';
let packageAmount = packageType.includes('12') ? 15000 : 6000;
let completedClassesCount = countCol !== -1 && row[countCol] ? parseInt(row[countCol]) || 0 : 0;
let lastClassDate = lastDateCol !== -1 && row[lastDateCol] ? String(row[lastDateCol]).trim() : new Date().toISOString().split('T')[0];
let rawStatus = statusCol !== -1 && row[statusCol] ? String(row[statusCol]).trim().toLowerCase() : 'paid';
let feeStatus = 'paid';
if (rawStatus.includes('pend') || rawStatus.includes('due') || rawStatus.includes('unpaid')) feeStatus = 'pending';
if (rawStatus.includes('overdue') || rawStatus.includes('late')) feeStatus = 'overdue';
imported.push({
id: `music_gs_${i}_${Date.now()}`,
name,
dob,
age: age || 20,
email,
phone,
joiningDate,
musicClass,
classDays,
packageType,
packageAmount,
completedClassesCount,
lastClassDate,
feeStatus,
avatarColor: '#6366F1'
});
}
return imported;
}
async function handleFetchFromGoogleSheet(overrideUrl = null, silent = false) {
const targetUrl = overrideUrl || sheetUrl;
if (userRole !== 'owner' && !overrideUrl) {
if (!silent) alert('🔒 Permission Denied: User Mode is View-Only. Log in with the Owner Passcode to fetch sheet data.');
return;
}
if (!targetUrl || !targetUrl.trim()) {
if (!silent) setActiveTab('sheets');
return;
}
setIsSyncing(true);
try {
let urlToFetch = targetUrl.trim();
if (urlToFetch.includes('docs.google.com/spreadsheets/d/')) {
const match = urlToFetch.match(/\/d\/([a-zA-Z0-9-_]+)/);
if (match && match[1]) {
urlToFetch = `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:csv`;
}
}
const response = await fetch(urlToFetch, {
redirect: 'follow'
});
const textData = await response.text();
let parsedRows = [];
try {
const jsonData = JSON.parse(textData);
if (jsonData && jsonData.data && Array.isArray(jsonData.data)) {
parsedRows = jsonData.data;
}
} catch (e) {
parsedRows = parseCSVRows(textData);
}
const importedStudents = processRowsIntoStudents(parsedRows);
if (importedStudents.length > 0) {
syncCentralData(importedStudents, attendance, targetUrl);
if (!silent) alert(`🎧 Loaded ${importedStudents.length} students from Google Sheet! Synced centrally for all devices.`);
} else {
if (!silent) alert('Could not find student rows in the connected Google Sheet.');
}
} catch (err) {
if (!silent) alert(`⚠️ Fetch failed: ${err.message}. You can click "Paste Sheet Data" to paste directly!`);
} finally {
setIsSyncing(false);
}
}
const handleImportPastedData = () => {
if (userRole !== 'owner') {
alert('🔒 Permission Denied: User Mode is View-Only. Log in with the Owner Passcode to import data.');
return;
}
if (!pastedText.trim()) return;
const rows = parseCSVRows(pastedText);
const imported = processRowsIntoStudents(rows);
if (imported.length > 0) {
syncCentralData(imported, attendance);
setIsPasteDataOpen(false);
setPastedText('');
alert(`🎉 Successfully imported ${imported.length} students centrally for all devices!`);
} else {
alert('Could not parse student records. Ensure copied text includes column headers.');
}
};
const handlePushToGoogleSheet = async () => {
if (userRole !== 'owner') {
alert('🔒 Permission Denied: User Mode is View-Only. Log in with the Owner Passcode to push data to Google Sheet.');
return;
}
if (!sheetUrl.trim()) {
setActiveTab('sheets');
return;
}
if (sheetUrl.includes('docs.google.com/spreadsheets/d/')) {
alert("⚠️ Action Required for Direct Google Sheets Sync:\n\nYou pasted a Google Sheet document link (docs.google.com/spreadsheets/...).\n\nGoogle security does NOT allow web applications to write directly to document links without an Apps Script Web App.\n\n📋 30-Second Fix to Enable Automatic Writing:\n1. Open your Google Sheet -> Click Extensions -> Apps Script\n2. Copy & paste the Apps Script code shown in Tab 4 ('Google Sheet Connector')\n3. Click Deploy -> New Deployment -> Web App (Execute as: Me, Who has access: Anyone)\n4. Copy your resulting Web App URL (starts with https://script.google.com/...) into the app!\n\n💡 Zero-Setup Alternative:\nClick 'Paste Cells' or copy/paste rows directly to import your Google Sheet instantly with 0 setup!");
setActiveTab('sheets');
return;
}
setIsSyncing(true);
try {
await autoPushToGoogleSheet(sheetUrl, students, attendance);
localStorage.setItem('harmony_sheet_url', sheetUrl);
alert('✅ Google Sheet Web App synced successfully with all student records & class counts!');
} catch (err) {
alert('⚠️ Sync failed: ' + err.message);
} finally {
setIsSyncing(false);
}
};
const handleCopyAllDataToClipboard = () => {
if (students.length === 0) {
alert('No student records to copy!');
return;
}
const headers = ['Name', 'Date of Birth', 'Age', 'Email ID', 'Phone Number', 'Joining Date', 'Music Lesson Type', 'Class Days Schedule', 'Tuition Package', 'Package Fee (INR)', 'Classes Used', 'Last Class Date', 'Payment Status'];
const rows = students.map(s => [s.name, s.dob, s.age, s.email, s.phone, s.joiningDate, s.musicClass, s.classDays || 'Mon & Thu', s.packageType || '4 Classes Package (₹6,000)', s.packageAmount || 6000, `${s.completedClassesCount || 0}/${getPackageLimit(s.packageType)}`, s.lastClassDate || 'N/A', s.feeStatus]);
const tsvText = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(tsvText).then(() => {
alert(`📋 COPIED TO CLIPBOARD!\n\nAll ${students.length} student records copied formatted for Google Sheets!\n\nNow open your Google Sheet, click cell A1, and press Ctrl+V to paste everything instantly!`);
}).catch(err => {
handleExportCSV();
});
} else {
handleExportCSV();
}
};
const handleExportCSV = () => {
const headers = ['Name', 'Date of Birth', 'Age', 'Email ID', 'Phone Number', 'Joining Date', 'Music Lesson Type', 'Class Days Schedule', 'Tuition Package', 'Package Fee (INR)', 'Classes Used', 'Last Class Date', 'Payment Status'];
const rows = students.map(s => [s.name, s.dob, s.age, s.email, s.phone, s.joiningDate, s.musicClass, s.classDays || 'Mon & Thu', s.packageType || '4 Classes Package (₹6,000)', s.packageAmount || 6000, `${s.completedClassesCount || 0}/${getPackageLimit(s.packageType)}`, s.lastClassDate || 'N/A', s.feeStatus]);
const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
const blob = new Blob([csvContent], {
type: 'text/csv;charset=utf-8;'
});
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', `Student_Database_${new Date().toISOString().split('T')[0]}.csv`);
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
};
const filteredStudents = students.filter(s => {
const matchesLesson = selectedLessonFilter === 'All' || s.musicClass === selectedLessonFilter;
const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()) || s.phone.includes(searchQuery) || s.classDays && s.classDays.toLowerCase().includes(searchQuery.toLowerCase()) || s.packageType && s.packageType.toLowerCase().includes(searchQuery.toLowerCase());
const matchesDayOfWeek = activeTab !== 'attendance' || !showOnlyTodayScheduled ? true : isStudentScheduledOnDate(s, selectedDate);
return matchesLesson && matchesSearch && matchesDayOfWeek;
});
let presentCount = 0,
absentCount = 0,
extraCount = 0;
filteredStudents.forEach(s => {
const st = getStudentStatus(s.id);
if (st === 'present') presentCount++;
if (st === 'absent') absentCount++;
if (st === 'extra') extraCount++;
});
const renderPaymentButtonGroup = student => {
const status = student.feeStatus;
return /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
gap: '0.35rem',
flexWrap: 'wrap'
}
}, /*#__PURE__*/React.createElement("button", {
onClick: () => handleSetPaymentStatus(student.id, 'paid'),
style: {
padding: '0.35rem 0.65rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.75rem',
fontWeight: 700,
border: status === 'paid' ? '2px solid #10B981' : '1px solid #A7F3D0',
background: status === 'paid' ? '#10B981' : '#ECFDF5',
color: status === 'paid' ? 'white' : '#047857',
boxShadow: status === 'paid' ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none'
},
title: "Record payment and reset class counter for new package"
}, "\u2713 PAID"), /*#__PURE__*/React.createElement("button", {
onClick: () => handleSetPaymentStatus(student.id, 'pending'),
style: {
padding: '0.35rem 0.65rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.75rem',
fontWeight: 700,
border: status === 'pending' ? '2px solid #F59E0B' : '1px solid #FDE68A',
background: status === 'pending' ? '#F59E0B' : '#FFFBEB',
color: status === 'pending' ? 'white' : '#B45309',
boxShadow: status === 'pending' ? '0 2px 6px rgba(245, 158, 11, 0.3)' : 'none'
}
}, "\u23F3 PENDING"), /*#__PURE__*/React.createElement("button", {
onClick: () => handleSetPaymentStatus(student.id, 'overdue'),
style: {
padding: '0.35rem 0.65rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.75rem',
fontWeight: 700,
border: status === 'overdue' ? '2px solid #EF4444' : '1px solid #FECACA',
background: status === 'overdue' ? '#EF4444' : '#FEF2F2',
color: status === 'overdue' ? 'white' : '#B91C1C',
boxShadow: status === 'overdue' ? '0 2px 6px rgba(239, 68, 68, 0.3)' : 'none'
}
}, "\u26A0\uFE0F OVERDUE"));
};
const renderClassProgressBar = student => {
const limit = getPackageLimit(student.packageType);
const count = student.completedClassesCount || 0;
const isCompleted = count >= limit;
const percentage = Math.min(100, Math.round(count / limit * 100));
return /*#__PURE__*/React.createElement("div", {
style: {
marginTop: '0.4rem',
background: isCompleted ? '#FEF2F2' : 'rgba(241, 245, 249, 0.9)',
border: isCompleted ? '1px solid #FECACA' : '1px solid var(--border-color)',
padding: '0.55rem 0.75rem',
borderRadius: 'var(--radius-md)'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
fontSize: '0.775rem',
fontWeight: 700,
color: isCompleted ? '#B91C1C' : 'var(--text-main)',
marginBottom: '0.3rem'
}
}, /*#__PURE__*/React.createElement("div", null, "\uD83D\uDCCA Classes Completed: ", /*#__PURE__*/React.createElement("strong", {
style: {
color: isCompleted ? '#B91C1C' : 'var(--primary)'
}
}, count, " / ", limit), student.lastClassDate && /*#__PURE__*/React.createElement("span", {
style: {
fontSize: '0.7rem',
color: 'var(--text-muted)',
fontWeight: 500,
marginLeft: 6
}
}, "(", student.lastClassDate, ")")), userRole === 'owner' && /*#__PURE__*/React.createElement("button", {
onClick: () => handleOpenProgressEdit(student),
style: {
fontSize: '0.725rem',
padding: '0.15rem 0.45rem',
borderRadius: '4px',
background: '#EEF2FF',
color: 'var(--primary)',
border: '1px solid #C7D2FE',
fontWeight: 700
},
title: "Edit completed classes & date manually"
}, "\u270F\uFE0F Edit Progress")), /*#__PURE__*/React.createElement("div", {
style: {
width: '100%',
height: 7,
background: '#E2E8F0',
borderRadius: 99,
overflow: 'hidden'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
width: `${percentage}%`,
height: '100%',
background: isCompleted ? '#EF4444' : 'var(--primary-gradient)',
transition: 'width 0.3s ease'
}
})));
};

// --- IF STUDIO IS LOCKED: SHOW DUAL PASSCODE LOCK SCREEN ---
if (!isUnlocked) {
return /*#__PURE__*/React.createElement("div", {
style: {
minHeight: '100vh',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
padding: '1rem',
background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #311042 100%)',
color: 'white'
}
}, /*#__PURE__*/React.createElement("div", {
className: "card",
style: {
maxWidth: '460px',
width: '100%',
background: 'rgba(255, 255, 255, 0.08)',
backdropFilter: 'blur(20px)',
border: '1px solid rgba(255, 255, 255, 0.15)',
borderRadius: '24px',
padding: '2.5rem 2rem',
color: 'white',
boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
textAlign: 'center'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
width: 64,
height: 64,
background: 'var(--primary-gradient)',
borderRadius: '20px',
display: 'grid',
placeItems: 'center',
margin: '0 auto 1.25rem',
fontSize: '2rem',
boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
}
}, "\uD83D\uDD12"), /*#__PURE__*/React.createElement("h2", {
style: {
fontSize: '1.4rem',
fontWeight: 800,
color: 'white',
marginBottom: '0.35rem'
}
}, "Music Production Studio"), /*#__PURE__*/React.createElement("p", {
style: {
fontSize: '0.85rem',
color: '#94A3B8',
marginBottom: '1.75rem'
}
}, "Enter Owner Passcode or User Passcode to continue"), /*#__PURE__*/React.createElement("form", {
onSubmit: handleUnlockStudio,
style: {
display: 'flex',
flexDirection: 'column',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
type: "password",
required: true,
autoFocus: true,
placeholder: "Enter Security Passcode...",
value: enteredPin,
onChange: e => {
setEnteredPin(e.target.value);
setPinError('');
},
style: {
width: '100%',
padding: '0.85rem 1rem',
borderRadius: 'var(--radius-md)',
border: pinError ? '2px solid #EF4444' : '1px solid rgba(255,255,255,0.2)',
background: 'rgba(15, 23, 42, 0.6)',
color: 'white',
textAlign: 'center',
fontSize: '1.2rem',
letterSpacing: '3px',
outline: 'none'
}
}), pinError && /*#__PURE__*/React.createElement("p", {
style: {
color: '#FCA5A5',
fontSize: '0.8rem',
marginTop: '0.5rem',
fontWeight: 600
}
}, pinError)), /*#__PURE__*/React.createElement("button", {
type: "submit",
className: "btn-primary",
style: {
justifyContent: 'center',
padding: '0.85rem',
fontSize: '0.95rem'
}
}, "Unlock Studio Portal ", /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-arrow-right"
}))), /*#__PURE__*/React.createElement("div", {
style: {
marginTop: '1.5rem',
paddingTop: '1.25rem',
borderTop: '1px solid rgba(255,255,255,0.1)',
fontSize: '0.775rem',
color: '#94A3B8',
textAlign: 'center',
display: 'flex',
flexDirection: 'column',
gap: '0.4rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
fontSize: '0.775rem',
color: '#94A3B8',
lineHeight: '1.6'
}
}, "\uD83D\uDC51 ", /*#__PURE__*/React.createElement("strong", null, "Owner Access"), ": Full Admin Control & Settings", /*#__PURE__*/React.createElement("br", null), "\uD83D\uDC64 ", /*#__PURE__*/React.createElement("strong", null, "User Access"), ": Attendance & Roster Only"), /*#__PURE__*/React.createElement("div", {
style: {
fontSize: '0.725rem',
color: '#64748B',
marginTop: '0.25rem'
}
}, "\uD83D\uDD12 Secure Portal \u2022 Enter your assigned security passcode above"))));
}
return /*#__PURE__*/React.createElement("div", {
className: "app-layout"
}, /*#__PURE__*/React.createElement("div", {
className: "mobile-bar"
}, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
alignItems: 'center',
gap: '0.5rem'
}
}, /*#__PURE__*/React.createElement("button", {
onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
style: {
fontSize: '1.3rem',
color: 'var(--primary)',
padding: '0.25rem 0.4rem'
},
"aria-label": "Toggle menu"
}, /*#__PURE__*/React.createElement("i", {
className: `fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`
})), /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
alignItems: 'center',
gap: '0.35rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
width: 30,
height: 30,
background: 'var(--primary-gradient)',
borderRadius: 'var(--radius-sm)',
display: 'grid',
placeItems: 'center',
color: 'white',
fontWeight: 800,
fontSize: '0.85rem'
}
}, "\uD83C\uDFA7"), /*#__PURE__*/React.createElement("span", {
style: {
fontSize: '0.95rem',
fontWeight: 800
}
}, "Music Production"))), /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
alignItems: 'center',
gap: '0.35rem'
}
}, userRole === 'owner' ? /*#__PURE__*/React.createElement("span", {
className: "badge",
style: {
background: '#EEF2FF',
color: '#4F46E5',
border: '1px solid #C7D2FE',
fontSize: '0.675rem',
padding: '0.25rem 0.45rem'
}
}, "\uD83D\uDC51 Owner") : /*#__PURE__*/React.createElement("span", {
className: "badge",
style: {
background: '#F0FDF4',
color: '#166534',
border: '1px solid #BBF7D0',
fontSize: '0.675rem',
padding: '0.25rem 0.45rem'
}
}, "\uD83D\uDC64 User"), userRole === 'owner' && /*#__PURE__*/React.createElement("button", {
onClick: () => setIsAddStudentOpen(true),
className: "btn-primary",
style: {
padding: '0.35rem 0.65rem',
fontSize: '0.75rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-plus"
})), /*#__PURE__*/React.createElement("button", {
onClick: handleLockStudio,
style: {
padding: '0.35rem 0.55rem',
borderRadius: 'var(--radius-md)',
border: '1px solid #FECACA',
background: '#FEF2F2',
color: '#B91C1C',
fontSize: '0.75rem'
},
title: "Lock Studio"
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-lock"
})))), /*#__PURE__*/React.createElement("div", {
className: `sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`,
onClick: () => setIsMobileMenuOpen(false)
}), /*#__PURE__*/React.createElement("aside", {
className: `sidebar ${isMobileMenuOpen ? 'open' : ''}`
}, /*#__PURE__*/React.createElement("div", {
style: {
padding: '0.5rem 0.5rem 1.25rem',
display: 'flex',
alignItems: 'center',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
width: 44,
height: 44,
background: 'var(--primary-gradient)',
borderRadius: 'var(--radius-md)',
display: 'grid',
placeItems: 'center',
color: 'white',
fontWeight: 800,
fontSize: '1.3rem',
boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
}
}, "\uD83C\uDFA7"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
style: {
fontSize: '1.2rem',
fontWeight: 800,
lineHeight: '1.1',
background: 'linear-gradient(135deg, #1E293B, #6366F1)',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent'
}
}, "Music Production"), /*#__PURE__*/React.createElement("span", {
style: {
fontSize: '0.725rem',
color: 'var(--text-muted)',
fontWeight: 600
}
}, "Studio & Student Manager"))), /*#__PURE__*/React.createElement("button", {
className: `nav-btn ${activeTab === 'attendance' ? 'active' : ''}`,
onClick: () => {
setActiveTab('attendance');
setIsMobileMenuOpen(false);
}
}, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-calendar-check",
style: {
marginRight: 10
}
}), " Attendance Register")), /*#__PURE__*/React.createElement("button", {
className: `nav-btn ${activeTab === 'students' ? 'active' : ''}`,
onClick: () => {
setActiveTab('students');
setIsMobileMenuOpen(false);
}
}, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-sliders",
style: {
marginRight: 10
}
}), " Students (", students.length, ")")), /*#__PURE__*/React.createElement("button", {
className: `nav-btn ${activeTab === 'fees' ? 'active' : ''}`,
onClick: () => {
setActiveTab('fees');
setIsMobileMenuOpen(false);
}
}, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-credit-card",
style: {
marginRight: 10
}
}), " Fee Payment Status")), /*#__PURE__*/React.createElement("button", {
className: `nav-btn ${activeTab === 'sheets' ? 'active' : ''}`,
onClick: () => {
setActiveTab('sheets');
setIsMobileMenuOpen(false);
}
}, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-file-excel",
style: {
marginRight: 10
}
}), " Google Sheets Sync")), /*#__PURE__*/React.createElement("div", {
style: {
marginTop: 'auto',
display: 'flex',
flexDirection: 'column',
gap: '0.5rem'
}
}, userRole === 'owner' ? /*#__PURE__*/React.createElement("button", {
onClick: () => {
setCurrentOwnerPinCheck('');
setNewOwnerPinForm(ownerPasscode);
setNewUserPinForm(userPasscode);
setChangePasscodeError('');
setIsChangePasscodeOpen(true);
},
style: {
width: '100%',
padding: '0.55rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
fontSize: '0.775rem',
fontWeight: 700,
color: 'var(--text-main)',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
gap: '0.4rem',
background: 'white'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-user-shield",
style: {
color: 'var(--primary)'
}
}), " \uD83D\uDC51 Owner Passcode Settings") : /*#__PURE__*/React.createElement("div", {
style: {
width: '100%',
padding: '0.55rem',
borderRadius: 'var(--radius-md)',
border: '1px solid #E2E8F0',
fontSize: '0.75rem',
fontWeight: 600,
color: 'var(--text-muted)',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
gap: '0.4rem',
background: '#F8FAFC'
},
title: "User mode cannot alter owner settings"
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-lock",
style: {
color: '#94A3B8'
}
}), " \uD83D\uDC64 User Mode (Settings Locked)"), /*#__PURE__*/React.createElement("button", {
onClick: handleLockStudio,
style: {
width: '100%',
padding: '0.55rem',
borderRadius: 'var(--radius-md)',
border: '1px solid #FECACA',
fontSize: '0.775rem',
fontWeight: 700,
color: '#B91C1C',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
gap: '0.4rem',
background: '#FEF2F2'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-lock"
}), " Lock Studio"))), /*#__PURE__*/React.createElement("div", {
className: "main-content"
}, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
alignItems: 'center',
gap: '0.65rem',
flexWrap: 'wrap'
}
}, /*#__PURE__*/React.createElement("h1", {
style: {
fontSize: '1.35rem',
fontWeight: 800
}
}, "Music Production Portal"), userRole === 'owner' ? /*#__PURE__*/React.createElement("span", {
className: "badge",
style: {
background: '#EEF2FF',
color: '#4F46E5',
border: '1px solid #C7D2FE',
fontSize: '0.725rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-crown",
style: {
color: '#F59E0B'
}
}), " Owner Mode") : /*#__PURE__*/React.createElement("span", {
className: "badge",
style: {
background: '#F0FDF4',
color: '#166534',
border: '1px solid #BBF7D0',
fontSize: '0.725rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-user-check",
style: {
color: '#10B981'
}
}), " User Mode (Restricted)"), /*#__PURE__*/React.createElement("span", {
className: "badge",
style: {
background: '#ECFDF5',
color: '#047857',
border: '1px solid #A7F3D0',
fontSize: '0.725rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-cloud",
style: {
color: '#10B981',
marginRight: '4px'
}
}), " Central Live Sync Active")), /*#__PURE__*/React.createElement("p", {
style: {
fontSize: '0.8rem',
color: 'var(--text-muted)',
marginTop: '0.15rem'
}
}, "\uD83C\uDFA7 Managing ", students.length, " Production Students \u2022 ", userRole === 'owner' ? '👑 Full Access Unlocked' : '👤 User Access Activated')), /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
alignItems: 'center',
gap: '0.5rem',
flexWrap: 'wrap'
}
}, /*#__PURE__*/React.createElement("button", {
onClick: handleFetchFromGoogleSheet,
disabled: isSyncing,
className: "btn-secondary",
style: {
fontSize: '0.825rem',
background: '#EEF2FF',
color: '#4F46E5',
borderColor: '#C7D2FE'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-cloud-arrow-down"
}), " ", isSyncing ? 'Fetching...' : 'Fetch Sheet'), /*#__PURE__*/React.createElement("button", {
onClick: () => setIsPasteDataOpen(true),
className: "btn-secondary",
style: {
fontSize: '0.825rem',
background: '#FAF5FF',
color: '#7E22CE',
borderColor: '#E9D5FF'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-paste"
}), " Paste Cells"), /*#__PURE__*/React.createElement("button", {
onClick: handleCopyAllDataToClipboard,
className: "btn-secondary",
style: {
fontSize: '0.825rem',
background: '#F0FDF4',
color: '#166534',
borderColor: '#BBF7D0'
},
title: "Copy all student data formatted for instant paste into Google Sheets (Ctrl+V)"
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-copy"
}), " Copy for Sheet"), /*#__PURE__*/React.createElement("button", {
onClick: handlePushToGoogleSheet,
disabled: isSyncing,
className: "btn-secondary",
style: {
fontSize: '0.825rem',
background: sheetUrl ? 'var(--present-bg)' : 'var(--pending-bg)'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-file-csv"
}), " ", sheetUrl ? isSyncing ? 'Syncing...' : 'Sync Sheet' : 'Link Sheet'), userRole === 'owner' && /*#__PURE__*/React.createElement("button", {
onClick: () => setIsAddStudentOpen(true),
className: "btn-primary",
style: {
fontSize: '0.85rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-plus"
}), " Add Student"), /*#__PURE__*/React.createElement("button", {
onClick: handleLockStudio,
className: "btn-secondary",
style: {
padding: '0.65rem 0.85rem',
color: '#B91C1C',
borderColor: '#FECACA'
},
title: "Lock Studio Portal"
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-lock"
})))), /*#__PURE__*/React.createElement("div", {
className: "content-area"
}, userRole !== 'owner' && /*#__PURE__*/React.createElement("div", {
style: {
background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
border: '1px solid #FDE68A',
padding: '0.85rem 1.25rem',
borderRadius: 'var(--radius-lg)',
marginBottom: '1.25rem',
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
color: '#B45309',
fontSize: '0.875rem',
fontWeight: 700,
boxShadow: 'var(--shadow-sm)',
flexWrap: 'wrap',
gap: '0.5rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
alignItems: 'center',
gap: '0.6rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-eye",
style: {
fontSize: '1.1rem',
color: '#D97706'
}
}), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\uD83D\uDC41\uFE0F User View-Only Mode Active"), " \u2014 Showing live central student database set by owner. All edits are reserved for Owner Mode.")), /*#__PURE__*/React.createElement("button", {
onClick: handleLockStudio,
className: "btn-primary",
style: {
padding: '0.4rem 0.85rem',
fontSize: '0.775rem',
background: 'linear-gradient(135deg, #D97706, #B45309)'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-key"
}), " Switch to Owner Mode")), activeTab === 'attendance' && /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
flexDirection: 'column',
gap: '1.25rem'
}
}, /*#__PURE__*/React.createElement("div", {
className: "card",
style: {
display: 'flex',
flexDirection: 'column',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
flexWrap: 'wrap',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
style: {
fontSize: '1.25rem',
fontWeight: 800
}
}, "Daily Attendance Register"), /*#__PURE__*/React.createElement("p", {
style: {
fontSize: '0.825rem',
color: 'var(--text-muted)'
}
}, "Showing students scheduled for ", /*#__PURE__*/React.createElement("strong", null, selectedDayName), ". Toggle filters to view all.")), /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
gap: '0.5rem',
flexWrap: 'wrap',
width: '100%',
maxWidth: '340px'
}
}, /*#__PURE__*/React.createElement("button", {
onClick: () => setBulkAttendance('present'),
style: {
flex: 1,
padding: '0.5rem 0.75rem',
borderRadius: 'var(--radius-md)',
background: 'var(--present-bg)',
color: 'var(--present-text)',
border: '1px solid var(--present-border)',
fontWeight: 700,
fontSize: '0.775rem',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
gap: '0.35rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-check-double"
}), " Mark All Present"), /*#__PURE__*/React.createElement("button", {
onClick: () => setBulkAttendance('absent'),
style: {
flex: 1,
padding: '0.5rem 0.75rem',
borderRadius: 'var(--radius-md)',
background: 'var(--absent-bg)',
color: 'var(--absent-text)',
border: '1px solid var(--absent-border)',
fontWeight: 700,
fontSize: '0.775rem',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
gap: '0.35rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-xmark"
}), " Mark All Absent"))), /*#__PURE__*/React.createElement("div", {
className: "filter-bar",
style: {
display: 'grid',
gridTemplateColumns: '1.2fr 1.6fr 1.3fr 1.8fr',
gap: '1rem',
paddingTop: '0.85rem',
borderTop: '1px solid var(--border-color)'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.75rem',
fontWeight: 700,
color: 'var(--text-muted)',
display: 'block',
marginBottom: '0.25rem'
}
}, "Date (", selectedDayName, ")"), /*#__PURE__*/React.createElement("input", {
type: "date",
value: selectedDate,
onChange: e => setSelectedDate(e.target.value),
style: {
width: '100%',
padding: '0.55rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
fontWeight: 600
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.75rem',
fontWeight: 700,
color: 'var(--text-muted)',
display: 'block',
marginBottom: '0.25rem'
}
}, "Day Roster Filter"), /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
gap: '0.35rem'
}
}, /*#__PURE__*/React.createElement("button", {
onClick: () => setShowOnlyTodayScheduled(true),
style: {
flex: 1,
padding: '0.5rem 0.6rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.775rem',
fontWeight: 700,
background: showOnlyTodayScheduled ? '#EEF2FF' : 'var(--bg-app)',
color: showOnlyTodayScheduled ? 'var(--primary)' : 'var(--text-muted)',
border: showOnlyTodayScheduled ? '2px solid var(--primary)' : '1px solid var(--border-color)'
}
}, "\uD83D\uDCC5 ", selectedDayName, " Only"), /*#__PURE__*/React.createElement("button", {
onClick: () => setShowOnlyTodayScheduled(false),
style: {
padding: '0.5rem 0.6rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.775rem',
fontWeight: 700,
background: !showOnlyTodayScheduled ? '#EEF2FF' : 'var(--bg-app)',
color: !showOnlyTodayScheduled ? 'var(--primary)' : 'var(--text-muted)',
border: !showOnlyTodayScheduled ? '2px solid var(--primary)' : '1px solid var(--border-color)'
}
}, "\uD83D\uDC65 All (", students.length, ")"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.75rem',
fontWeight: 700,
color: 'var(--text-muted)',
display: 'block',
marginBottom: '0.25rem'
}
}, "Lesson Filter"), /*#__PURE__*/React.createElement("select", {
value: selectedLessonFilter,
onChange: e => setSelectedLessonFilter(e.target.value),
style: {
width: '100%',
padding: '0.55rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
}, /*#__PURE__*/React.createElement("option", {
value: "All"
}, "All Lessons"), MUSIC_LESSON_OPTIONS.map(c => /*#__PURE__*/React.createElement("option", {
key: c,
value: c
}, c)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.75rem',
fontWeight: 700,
color: 'var(--text-muted)',
display: 'block',
marginBottom: '0.25rem'
}
}, "Search Student"), /*#__PURE__*/React.createElement("input", {
type: "text",
placeholder: "Search name or phone...",
value: searchQuery,
onChange: e => setSearchQuery(e.target.value),
style: {
width: '100%',
padding: '0.55rem 0.85rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})))), /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
gap: '0.75rem',
alignItems: 'center',
flexWrap: 'wrap'
}
}, /*#__PURE__*/React.createElement("span", {
className: "badge badge-present",
style: {
fontSize: '0.85rem'
}
}, "\u2713 ", presentCount, " Present"), /*#__PURE__*/React.createElement("span", {
className: "badge badge-absent",
style: {
fontSize: '0.85rem'
}
}, "\u2717 ", absentCount, " Absent"), extraCount > 0 && /*#__PURE__*/React.createElement("span", {
className: "badge",
style: {
background: '#FFFBEB',
color: '#B45309',
border: '1px solid #FDE68A',
fontSize: '0.85rem'
}
}, "\u2B50 ", extraCount, " Extra"), /*#__PURE__*/React.createElement("span", {
style: {
fontSize: '0.85rem',
color: 'var(--text-main)',
fontWeight: 600
}
}, "Showing ", filteredStudents.length, " Students ", showOnlyTodayScheduled ? `scheduled for ${selectedDayName}` : 'in total')), /*#__PURE__*/React.createElement("div", {
className: "student-grid",
style: {
display: 'grid',
gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
gap: '1rem'
}
}, filteredStudents.length === 0 ? /*#__PURE__*/React.createElement("div", {
className: "card",
style: {
gridColumn: '1 / -1',
padding: '3rem 1rem',
textAlign: 'center',
color: 'var(--text-muted)'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-calendar-day",
style: {
fontSize: '2rem',
marginBottom: '0.75rem',
color: 'var(--primary)'
}
}), /*#__PURE__*/React.createElement("h3", {
style: {
fontSize: '1.1rem',
fontWeight: 700
}
}, "No students scheduled for ", selectedDayName), /*#__PURE__*/React.createElement("p", {
style: {
fontSize: '0.85rem',
marginTop: '0.25rem'
}
}, "Click ", /*#__PURE__*/React.createElement("strong", null, "\"\uD83D\uDC65 All (", students.length, ")\""), " above to view all students.")) : filteredStudents.map(student => {
const st = getStudentStatus(student.id);
const isPresent = st === 'present';
const isAbsent = st === 'absent';
const isExtra = st === 'extra';
const reschForSelectedDate = (student.rescheduledClasses || []).filter(r => r.date === selectedDate);
return /*#__PURE__*/React.createElement("div", {
key: student.id,
className: "card",
style: {
borderLeft: isPresent ? '5px solid #10B981' : isAbsent ? '5px solid #EF4444' : isExtra ? '5px solid #D97706' : '1px solid var(--border-color)',
background: isPresent ? 'rgba(240, 253, 244, 0.85)' : isAbsent ? 'rgba(254, 242, 242, 0.85)' : isExtra ? 'rgba(255, 251, 235, 0.85)' : 'rgba(255, 255, 255, 0.95)',
display: 'flex',
flexDirection: 'column',
justifyContent: 'space-between',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("div", null, reschForSelectedDate.map(resch => /*#__PURE__*/React.createElement("div", {
key: resch.id,
style: {
background: '#FFF7ED',
border: '1px solid #FFEDD5',
color: '#C2410C',
padding: '0.4rem 0.65rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.75rem',
fontWeight: 700,
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
marginBottom: '0.5rem'
}
}, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD04 ", /*#__PURE__*/React.createElement("strong", null, "Rescheduled Class"), " (From: ", resch.originalDate, ") ", resch.reason ? `• ${resch.reason}` : ''), userRole === 'owner' && /*#__PURE__*/React.createElement("button", {
onClick: () => handleRemoveReschedule(student.id, resch.id),
style: {
color: '#EF4444',
fontSize: '0.7rem',
fontWeight: 800,
cursor: 'pointer'
},
title: "Remove reschedule tag"
}, "\u2715"))), /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
marginBottom: '0.65rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
alignItems: 'center',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
width: 44,
height: 44,
borderRadius: '50%',
background: student.avatarColor || 'var(--primary-gradient)',
color: 'white',
display: 'grid',
placeItems: 'center',
fontWeight: 800,
fontSize: '1.05rem',
boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
}
}, student.name.charAt(0)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
style: {
fontSize: '1.05rem',
fontWeight: 800
}
}, student.name), /*#__PURE__*/React.createElement("div", {
style: {
fontSize: '0.775rem',
color: 'var(--text-muted)'
}
}, /*#__PURE__*/React.createElement("strong", {
style: {
color: 'var(--primary)'
}
}, student.musicClass), " \u2022 Age: ", student.age, " yrs"))), userRole === 'owner' && /*#__PURE__*/React.createElement("button", {
onClick: () => handleOpenEditStudent(student),
className: "btn-edit"
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-pen-to-square"
}), " Edit")), /*#__PURE__*/React.createElement("div", {
style: {
background: 'rgba(248, 250, 252, 0.8)',
padding: '0.65rem 0.75rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
fontSize: '0.775rem',
color: 'var(--text-muted)',
display: 'flex',
flexDirection: 'column',
gap: '0.4rem',
marginBottom: '0.5rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
justifyContent: 'space-between',
flexWrap: 'wrap',
gap: '0.2rem'
}
}, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDDD3\uFE0F Schedule: ", /*#__PURE__*/React.createElement("strong", {
style: {
color: 'var(--text-main)'
}
}, student.classDays || 'Mon & Thu')), /*#__PURE__*/React.createElement("span", {
style: {
fontWeight: 700,
color: '#7E22CE'
}
}, "\uD83D\uDCE6 ", student.packageType || '4 Classes Package (₹6,000)')), /*#__PURE__*/React.createElement("div", null, "\uD83D\uDCDE ", student.phone, " | \u2709\uFE0F ", student.email), renderClassProgressBar(student), student.extraClasses && student.extraClasses.length > 0 && /*#__PURE__*/React.createElement("div", {
style: {
fontSize: '0.725rem',
color: '#7E22CE',
fontWeight: 700
}
}, "\u2B50 ", student.extraClasses.length, " Extra Class", student.extraClasses.length > 1 ? 'es' : '', " Recorded"), /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
flexWrap: 'wrap',
gap: '0.4rem',
marginTop: '0.15rem'
}
}, /*#__PURE__*/React.createElement("span", {
style: {
fontSize: '0.75rem',
fontWeight: 700,
color: 'var(--text-main)'
}
}, "Payment:"), renderPaymentButtonGroup(student)))), /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
flexDirection: 'column',
gap: '0.4rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
display: 'grid',
gridTemplateColumns: '1fr 1fr 1fr',
gap: '0.35rem'
}
}, /*#__PURE__*/React.createElement("button", {
onClick: () => setSingleAttendance(student.id, 'present'),
style: {
padding: '0.6rem 0.35rem',
borderRadius: 'var(--radius-md)',
fontWeight: 800,
fontSize: '0.775rem',
border: isPresent ? '2px solid #10B981' : '1px solid var(--present-border)',
background: isPresent ? '#10B981' : 'var(--present-bg)',
color: isPresent ? 'white' : 'var(--present-text)',
boxShadow: isPresent ? '0 3px 10px rgba(16, 185, 129, 0.3)' : 'none'
}
}, "\u2713 PRESENT"), /*#__PURE__*/React.createElement("button", {
onClick: () => setSingleAttendance(student.id, 'absent'),
style: {
padding: '0.6rem 0.35rem',
borderRadius: 'var(--radius-md)',
fontWeight: 800,
fontSize: '0.775rem',
border: isAbsent ? '2px solid #EF4444' : '1px solid var(--absent-border)',
background: isAbsent ? '#EF4444' : 'var(--absent-bg)',
color: isAbsent ? 'white' : 'var(--absent-text)',
boxShadow: isAbsent ? '0 3px 10px rgba(239, 68, 68, 0.3)' : 'none'
}
}, "\u2717 ABSENT"), /*#__PURE__*/React.createElement("button", {
onClick: () => setSingleAttendance(student.id, 'extra'),
style: {
padding: '0.6rem 0.35rem',
borderRadius: 'var(--radius-md)',
fontWeight: 800,
fontSize: '0.775rem',
border: isExtra ? '2px solid #D97706' : '1px solid #FDE68A',
background: isExtra ? '#D97706' : '#FFFBEB',
color: isExtra ? 'white' : '#B45309',
boxShadow: isExtra ? '0 3px 10px rgba(217, 119, 6, 0.3)' : 'none'
}
}, "\u2B50 EXTRA")), userRole === 'owner' && /*#__PURE__*/React.createElement("div", {
style: {
display: 'grid',
gridTemplateColumns: '1fr 1fr',
gap: '0.35rem'
}
}, /*#__PURE__*/React.createElement("button", {
onClick: () => handleOpenRescheduleModal(student),
style: {
padding: '0.4rem 0.5rem',
borderRadius: 'var(--radius-md)',
fontWeight: 700,
fontSize: '0.725rem',
border: '1px solid #FFEDD5',
background: '#FFF7ED',
color: '#C2410C'
}
}, "\uD83D\uDD04 Reschedule"), /*#__PURE__*/React.createElement("button", {
onClick: () => handleOpenExtraClassModal(student),
style: {
padding: '0.4rem 0.5rem',
borderRadius: 'var(--radius-md)',
fontWeight: 700,
fontSize: '0.725rem',
border: '1px solid #E9D5FF',
background: '#FAF5FF',
color: '#7E22CE'
}
}, "\u2B50 Log Extra"))));
}))), activeTab === 'students' && /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
flexDirection: 'column',
gap: '1.25rem'
}
}, /*#__PURE__*/React.createElement("div", {
className: "card",
style: {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
flexWrap: 'wrap',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
style: {
fontSize: '1.25rem',
fontWeight: 800
}
}, "Music Production Student Directory"), /*#__PURE__*/React.createElement("p", {
style: {
fontSize: '0.825rem',
color: 'var(--text-muted)'
}
}, "Managing 4 Classes (\u20B96,000) & 12 Classes (\u20B915,000) packages for ", students.length, " students.")), /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
gap: '0.5rem',
flexWrap: 'wrap'
}
}, userRole === 'owner' && students.length > 0 && /*#__PURE__*/React.createElement("button", {
onClick: handleClearAllStudents,
className: "btn-secondary",
style: {
color: '#B91C1C',
borderColor: '#FECACA',
background: '#FEF2F2',
fontSize: '0.8rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-trash-can"
}), " Clear All Data"), /*#__PURE__*/React.createElement("button", {
onClick: () => setIsAddStudentOpen(true),
className: "btn-primary"
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-user-plus"
}), " Add Student"))), /*#__PURE__*/React.createElement("div", {
className: "student-grid",
style: {
display: 'grid',
gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
gap: '1rem'
}
}, filteredStudents.length === 0 ? /*#__PURE__*/React.createElement("div", {
className: "card",
style: {
gridColumn: '1 / -1',
padding: '3.5rem 1.5rem',
textAlign: 'center',
color: 'var(--text-muted)'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-users-slash",
style: {
fontSize: '2.5rem',
marginBottom: '0.75rem',
color: 'var(--primary)'
}
}), /*#__PURE__*/React.createElement("h3", {
style: {
fontSize: '1.25rem',
fontWeight: 800,
color: 'var(--text-main)'
}
}, "No Student Records Found"), /*#__PURE__*/React.createElement("p", {
style: {
fontSize: '0.875rem',
marginTop: '0.35rem',
color: 'var(--text-muted)'
}
}, "Your database is clean and ready! Click ", /*#__PURE__*/React.createElement("strong", null, "\"+ Add Student\""), " above or ", /*#__PURE__*/React.createElement("strong", null, "\"Paste Cells\""), " to add your actual students."), userRole === 'owner' && /*#__PURE__*/React.createElement("button", {
onClick: handleLoadSampleStudents,
className: "btn-secondary",
style: {
marginTop: '1.25rem',
fontSize: '0.825rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-flask"
}), " Load Sample Demo Students")) : filteredStudents.map(s => /*#__PURE__*/React.createElement("div", {
key: s.id,
className: "card",
style: {
display: 'flex',
flexDirection: 'column',
justifyContent: 'space-between',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
marginBottom: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
alignItems: 'center',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
width: 44,
height: 44,
borderRadius: '50%',
background: s.avatarColor || 'var(--primary-gradient)',
color: 'white',
display: 'grid',
placeItems: 'center',
fontWeight: 800
}
}, s.name.charAt(0)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
style: {
fontSize: '1.05rem',
fontWeight: 800
}
}, s.name), /*#__PURE__*/React.createElement("span", {
style: {
fontSize: '0.8rem',
color: 'var(--primary)',
fontWeight: 700
}
}, s.musicClass))), userRole === 'owner' && /*#__PURE__*/React.createElement("button", {
onClick: () => handleOpenEditStudent(s),
className: "btn-edit"
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-user-pen"
}), " Edit")), /*#__PURE__*/React.createElement("div", {
style: {
background: 'rgba(248, 250, 252, 0.8)',
padding: '0.85rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
fontSize: '0.825rem',
display: 'flex',
flexDirection: 'column',
gap: '0.45rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\uD83C\uDFB5 Lesson Option:"), " ", /*#__PURE__*/React.createElement("strong", {
style: {
color: 'var(--primary)'
}
}, s.musicClass)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\uD83D\uDCE6 Tuition Package:"), " ", /*#__PURE__*/React.createElement("strong", {
style: {
color: '#7E22CE'
}
}, s.packageType || '4 Classes Package (₹6,000)')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\uD83D\uDDD3\uFE0F Weekly Schedule:"), " ", s.classDays || 'Mon & Thu'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\uD83C\uDF82 Date of Birth:"), " ", s.dob, " (Age: ", s.age, " yrs)"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\u2709\uFE0F Email ID:"), " ", s.email), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\uD83D\uDCDE Phone Number:"), " ", s.phone), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\uD83D\uDCC5 Joining Date:"), " ", s.joiningDate), renderClassProgressBar(s), s.rescheduledClasses && s.rescheduledClasses.length > 0 && /*#__PURE__*/React.createElement("div", {
style: {
fontSize: '0.725rem',
color: '#C2410C',
fontWeight: 700
}
}, "\uD83D\uDD04 ", s.rescheduledClasses.length, " Rescheduled Class", s.rescheduledClasses.length > 1 ? 'es' : ''), s.extraClasses && s.extraClasses.length > 0 && /*#__PURE__*/React.createElement("div", {
style: {
fontSize: '0.725rem',
color: '#7E22CE',
fontWeight: 700
}
}, "\u2B50 ", s.extraClasses.length, " Extra Class", s.extraClasses.length > 1 ? 'es' : '', " Recorded"), /*#__PURE__*/React.createElement("div", {
style: {
marginTop: '0.35rem',
paddingTop: '0.45rem',
borderTop: '1px solid var(--border-color)',
display: 'flex',
flexDirection: 'column',
gap: '0.35rem'
}
}, /*#__PURE__*/React.createElement("span", {
style: {
fontSize: '0.75rem',
fontWeight: 700,
color: 'var(--text-muted)'
}
}, "Payment Status:"), renderPaymentButtonGroup(s)))), userRole === 'owner' && /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
paddingTop: '0.4rem',
borderTop: '1px solid var(--border-color)',
flexWrap: 'wrap',
gap: '0.4rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
gap: '0.35rem'
}
}, /*#__PURE__*/React.createElement("button", {
onClick: () => handleOpenRescheduleModal(s),
style: {
padding: '0.3rem 0.5rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.725rem',
fontWeight: 700,
background: '#FFF7ED',
color: '#C2410C',
border: '1px solid #FFEDD5'
}
}, "\uD83D\uDD04 Reschedule"), /*#__PURE__*/React.createElement("button", {
onClick: () => handleOpenExtraClassModal(s),
style: {
padding: '0.3rem 0.5rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.725rem',
fontWeight: 700,
background: '#FAF5FF',
color: '#7E22CE',
border: '1px solid #E9D5FF'
}
}, "\u2B50 Log Extra")), /*#__PURE__*/React.createElement("button", {
onClick: () => handleDeleteStudent(s.id, s.name),
style: {
color: '#EF4444',
fontSize: '0.75rem',
fontWeight: 600
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-trash-can",
style: {
marginRight: 4
}
}), " Delete Record")))))), activeTab === 'fees' && /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
flexDirection: 'column',
gap: '1.25rem'
}
}, /*#__PURE__*/React.createElement("div", {
className: "card"
}, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: '1rem',
flexWrap: 'wrap',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
style: {
fontSize: '1.25rem',
fontWeight: 800
}
}, "Student Payment & Package Roster"), /*#__PURE__*/React.createElement("p", {
style: {
fontSize: '0.825rem',
color: 'var(--text-muted)'
}
}, "Overview of 4-class (\u20B96,000) and 12-class (\u20B915,000) package payment statuses."))), /*#__PURE__*/React.createElement("div", {
className: "table-responsive desktop-table-view"
}, /*#__PURE__*/React.createElement("table", {
style: {
width: '100%',
borderCollapse: 'collapse',
textAlign: 'left',
fontSize: '0.875rem',
minWidth: '750px'
}
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
style: {
background: 'var(--bg-surface-subtle)',
color: 'var(--text-muted)'
}
}, /*#__PURE__*/React.createElement("th", {
style: {
padding: '0.75rem'
}
}, "Student Name"), /*#__PURE__*/React.createElement("th", {
style: {
padding: '0.75rem'
}
}, "Lesson Type"), /*#__PURE__*/React.createElement("th", {
style: {
padding: '0.75rem'
}
}, "Tuition Package"), /*#__PURE__*/React.createElement("th", {
style: {
padding: '0.75rem'
}
}, "Class Counter"), /*#__PURE__*/React.createElement("th", {
style: {
padding: '0.75rem'
}
}, "Last Class Date"), /*#__PURE__*/React.createElement("th", {
style: {
padding: '0.75rem'
}
}, "Payment Status Buttons"), /*#__PURE__*/React.createElement("th", {
style: {
padding: '0.75rem',
textAlign: 'right'
}
}, "Action"))), /*#__PURE__*/React.createElement("tbody", null, filteredStudents.map(s => {
const limit = getPackageLimit(s.packageType);
const count = s.completedClassesCount || 0;
const isExpired = count >= limit;
return /*#__PURE__*/React.createElement("tr", {
key: s.id,
style: {
borderBottom: '1px solid var(--border-color)'
}
}, /*#__PURE__*/React.createElement("td", {
style: {
padding: '0.75rem',
fontWeight: 700
}
}, s.name), /*#__PURE__*/React.createElement("td", {
style: {
padding: '0.75rem',
fontWeight: 600,
color: 'var(--primary)'
}
}, s.musicClass), /*#__PURE__*/React.createElement("td", {
style: {
padding: '0.75rem',
fontWeight: 700,
color: '#7E22CE'
}
}, s.packageType || '4 Classes Package (₹6,000)'), /*#__PURE__*/React.createElement("td", {
style: {
padding: '0.75rem',
fontWeight: 700,
color: isExpired ? '#B91C1C' : 'var(--text-main)'
}
}, count, " / ", limit, " ", isExpired ? '⚠️ Due!' : '', userRole === 'owner' && /*#__PURE__*/React.createElement("button", {
onClick: () => handleOpenProgressEdit(s),
style: {
marginLeft: 6,
fontSize: '0.7rem',
color: 'var(--primary)'
},
title: "Edit progress"
}, "\u270F\uFE0F")), /*#__PURE__*/React.createElement("td", {
style: {
padding: '0.75rem',
fontSize: '0.8rem',
color: 'var(--text-muted)'
}
}, s.lastClassDate || 'N/A'), /*#__PURE__*/React.createElement("td", {
style: {
padding: '0.75rem'
}
}, renderPaymentButtonGroup(s)), /*#__PURE__*/React.createElement("td", {
style: {
padding: '0.75rem',
textAlign: 'right'
}
}, userRole === 'owner' ? /*#__PURE__*/React.createElement("button", {
onClick: () => handleOpenEditStudent(s),
className: "btn-edit"
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-pen-to-square"
}), " Edit") : /*#__PURE__*/React.createElement("span", {
style: {
fontSize: '0.75rem',
color: 'var(--text-muted)',
fontWeight: 600
}
}, "\uD83D\uDD12 View Only")));
})))), /*#__PURE__*/React.createElement("div", {
className: "mobile-fee-cards-view"
}, filteredStudents.map(s => {
const limit = getPackageLimit(s.packageType);
const count = s.completedClassesCount || 0;
const isExpired = count >= limit;
return /*#__PURE__*/React.createElement("div", {
key: s.id,
style: {
background: 'var(--bg-app)',
border: '1px solid var(--border-color)',
borderRadius: 'var(--radius-lg)',
padding: '1rem',
display: 'flex',
flexDirection: 'column',
gap: '0.65rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
style: {
fontSize: '1rem',
fontWeight: 800
}
}, s.name), /*#__PURE__*/React.createElement("span", {
style: {
fontSize: '0.775rem',
color: 'var(--primary)',
fontWeight: 700
}
}, s.musicClass)), userRole === 'owner' && /*#__PURE__*/React.createElement("button", {
onClick: () => handleOpenEditStudent(s),
className: "btn-edit",
style: {
fontSize: '0.75rem',
padding: '0.35rem 0.65rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-pen-to-square"
}), " Edit")), /*#__PURE__*/React.createElement("div", {
style: {
fontSize: '0.8rem',
color: '#7E22CE',
fontWeight: 700
}
}, "\uD83D\uDCE6 ", s.packageType || '4 Classes Package (₹6,000)'), renderClassProgressBar(s), /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
fontSize: '0.775rem',
color: 'var(--text-muted)'
}
}, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCC5 Last Class: ", /*#__PURE__*/React.createElement("strong", null, s.lastClassDate || 'N/A')), /*#__PURE__*/React.createElement("span", {
style: {
fontWeight: 700,
color: isExpired ? '#B91C1C' : 'var(--text-main)'
}
}, count, "/", limit, " Classes ", isExpired ? '⚠️ Due' : '')), /*#__PURE__*/React.createElement("div", {
style: {
paddingTop: '0.5rem',
borderTop: '1px solid var(--border-color)',
display: 'flex',
flexDirection: 'column',
gap: '0.35rem'
}
}, /*#__PURE__*/React.createElement("span", {
style: {
fontSize: '0.75rem',
fontWeight: 700,
color: 'var(--text-muted)'
}
}, "Set Payment Status:"), renderPaymentButtonGroup(s)));
})))), activeTab === 'sheets' && /*#__PURE__*/React.createElement("div", {
className: "card",
style: {
maxWidth: '750px',
margin: '0 auto',
display: 'flex',
flexDirection: 'column',
gap: '1.25rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
style: {
fontSize: '1.3rem',
fontWeight: 800
}
}, "Google Sheet Database Connector"), /*#__PURE__*/React.createElement("p", {
style: {
fontSize: '0.85rem',
color: 'var(--text-muted)',
marginTop: '0.25rem'
}
}, "Syncs Vocal/Piano/App Lessons, 4-class (\u20B96,000) & 12-class (\u20B915,000) packages, class counters, last class dates, and payment status.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
color: 'var(--text-main)',
display: 'block',
marginBottom: '0.35rem'
}
}, "Google Sheet URL or Apps Script URL"), /*#__PURE__*/React.createElement("input", {
type: "url",
placeholder: "Paste https://docs.google.com/spreadsheets/d/... or Web App URL",
value: sheetUrl,
onChange: e => setSheetUrl(e.target.value),
style: {
width: '100%',
padding: '0.7rem 0.85rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", {
style: {
display: 'grid',
gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("button", {
onClick: handleFetchFromGoogleSheet,
disabled: isSyncing,
className: "btn-secondary",
style: {
justifyContent: 'center',
padding: '0.75rem',
background: '#EEF2FF',
color: '#4F46E5',
borderColor: '#C7D2FE'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-cloud-arrow-down"
}), " \uD83D\uDCE5 Fetch Data"), /*#__PURE__*/React.createElement("button", {
onClick: handlePushToGoogleSheet,
disabled: isSyncing,
className: "btn-primary",
style: {
justifyContent: 'center',
padding: '0.75rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-cloud-arrow-up"
}), " \uD83D\uDCE4 Push App Data")), /*#__PURE__*/React.createElement("div", {
style: {
background: '#F0FDF4',
border: '1px solid #BBF7D0',
borderRadius: 'var(--radius-md)',
padding: '1rem',
fontSize: '0.85rem',
color: '#166534'
}
}, /*#__PURE__*/React.createElement("h4", {
style: {
fontWeight: 800,
fontSize: '0.95rem',
color: '#15803D',
marginBottom: '0.5rem',
display: 'flex',
alignItems: 'center',
gap: '0.4rem'
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-circle-question"
}), " How to Get your https://script.google.com/.../exec URL (1-Minute Setup):"), /*#__PURE__*/React.createElement("ol", {
style: {
paddingLeft: '1.25rem',
lineHeight: '1.6',
fontWeight: 600
}
}, /*#__PURE__*/React.createElement("li", null, "Open your Google Sheet \u2192 Click ", /*#__PURE__*/React.createElement("strong", null, "Extensions"), " \u2192 Click ", /*#__PURE__*/React.createElement("strong", null, "Apps Script"), "."), /*#__PURE__*/React.createElement("li", null, "Delete any code in the editor, paste the Apps Script Code below, and click ", /*#__PURE__*/React.createElement("strong", null, "Save (\uD83D\uDCBE)"), "."), /*#__PURE__*/React.createElement("li", null, "Click ", /*#__PURE__*/React.createElement("strong", null, "Deploy"), " (top right) \u2192 Choose ", /*#__PURE__*/React.createElement("strong", null, "New deployment"), "."), /*#__PURE__*/React.createElement("li", null, "Click the gear \u2699\uFE0F icon next to \"Select type\" \u2192 Select ", /*#__PURE__*/React.createElement("strong", null, "Web app"), "."), /*#__PURE__*/React.createElement("li", null, "Set ", /*#__PURE__*/React.createElement("em", null, "Execute as:"), " ", /*#__PURE__*/React.createElement("strong", null, "Me"), " and ", /*#__PURE__*/React.createElement("em", null, "Who has access:"), " ", /*#__PURE__*/React.createElement("strong", null, "Anyone"), " (Crucial for remote sync!)."), /*#__PURE__*/React.createElement("li", null, "Click ", /*#__PURE__*/React.createElement("strong", null, "Deploy"), " \u2192 Click ", /*#__PURE__*/React.createElement("strong", null, "Authorize access"), " (Click ", /*#__PURE__*/React.createElement("em", null, "Advanced"), " \u2192 ", /*#__PURE__*/React.createElement("em", null, "Go to Untitled project (unsafe)"), " \u2192 ", /*#__PURE__*/React.createElement("em", null, "Allow"), ")."), /*#__PURE__*/React.createElement("li", null, "Copy the generated Web App URL starting with ", /*#__PURE__*/React.createElement("strong", null, "https://script.google.com/macros/s/.../exec"), " and paste it above!"))), /*#__PURE__*/React.createElement("div", {
style: {
background: '#FAF5FF',
border: '1px solid #E9D5FF',
borderRadius: 'var(--radius-md)',
padding: '1rem',
display: 'flex',
flexDirection: 'column',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
style: {
fontSize: '0.9rem',
fontWeight: 700,
color: '#7E22CE'
}
}, "\u26A1 Zero-Setup Alternative: Copy & Paste Sheet Cells"), /*#__PURE__*/React.createElement("p", {
style: {
fontSize: '0.8rem',
color: '#6B21A8'
}
}, "Select all cells in your Google Sheet, copy (Ctrl+C), and paste directly into the app!")), /*#__PURE__*/React.createElement("button", {
onClick: () => setIsPasteDataOpen(true),
className: "btn-secondary",
style: {
background: '#F3E8FF',
color: '#7E22CE',
borderColor: '#D8B4FE',
width: 'fit-content'
}
}, "Paste Cells Now")), /*#__PURE__*/React.createElement("div", {
style: {
background: 'var(--bg-app)',
padding: '1rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
fontSize: '0.825rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: '0.5rem'
}
}, /*#__PURE__*/React.createElement("h4", {
style: {
fontWeight: 700
}
}, "Google Apps Script Code:"), /*#__PURE__*/React.createElement("button", {
onClick: () => {
navigator.clipboard.writeText(APPS_SCRIPT_CODE);
alert('📋 Google Apps Script Code copied to clipboard! Paste it into Extensions -> Apps Script.');
},
style: {
fontSize: '0.75rem',
padding: '0.25rem 0.6rem',
background: '#6366F1',
color: 'white',
borderRadius: '6px',
fontWeight: 700
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-copy"
}), " Copy Script Code")), /*#__PURE__*/React.createElement("textarea", {
readOnly: true,
value: APPS_SCRIPT_CODE,
style: {
width: '100%',
height: '140px',
fontFamily: 'monospace',
fontSize: '0.75rem',
padding: '0.5rem',
borderRadius: '6px',
border: '1px solid var(--border-color)'
}
}))))), studentForProgressEdit && /*#__PURE__*/React.createElement("div", {
className: "modal-overlay"
}, /*#__PURE__*/React.createElement("div", {
className: "modal-content",
style: {
maxWidth: '440px'
}
}, /*#__PURE__*/React.createElement("div", {
className: "modal-header"
}, /*#__PURE__*/React.createElement("h3", {
style: {
fontSize: '1.2rem',
fontWeight: 800
}
}, "\u270F\uFE0F Edit Class Progress"), /*#__PURE__*/React.createElement("button", {
onClick: () => setStudentForProgressEdit(null),
style: {
fontSize: '1.2rem'
}
}, "\u2715")), /*#__PURE__*/React.createElement("form", {
onSubmit: handleSaveProgressEdit
}, /*#__PURE__*/React.createElement("div", {
className: "modal-body",
style: {
display: 'flex',
flexDirection: 'column',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
background: 'var(--bg-surface-subtle)',
padding: '0.75rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.85rem'
}
}, /*#__PURE__*/React.createElement("strong", null, "Student:"), " ", studentForProgressEdit.name, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Package:"), " ", studentForProgressEdit.packageType || '4 Classes Package (₹6,000)', " (Limit: ", getPackageLimit(studentForProgressEdit.packageType), " classes)"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.3rem'
}
}, "Classes Completed So Far *"), /*#__PURE__*/React.createElement("input", {
type: "number",
min: "0",
max: "100",
required: true,
value: customCompletedCount,
onChange: e => setCustomCompletedCount(e.target.value),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
fontSize: '1.1rem',
fontWeight: 800,
color: 'var(--primary)'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.3rem'
}
}, "As of Date (Last Class / Payment Date) *"), /*#__PURE__*/React.createElement("input", {
type: "date",
required: true,
value: customLastClassDate,
onChange: e => setCustomLastClassDate(e.target.value),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
}))), /*#__PURE__*/React.createElement("div", {
className: "modal-footer"
}, /*#__PURE__*/React.createElement("button", {
type: "button",
className: "btn-secondary",
onClick: () => setStudentForProgressEdit(null)
}, "Cancel"), /*#__PURE__*/React.createElement("button", {
type: "submit",
className: "btn-primary"
}, "Save Class Progress"))))), isChangePasscodeOpen && /*#__PURE__*/React.createElement("div", {
className: "modal-overlay"
}, /*#__PURE__*/React.createElement("div", {
className: "modal-content",
style: {
maxWidth: '460px'
}
}, /*#__PURE__*/React.createElement("div", {
className: "modal-header"
}, /*#__PURE__*/React.createElement("h3", {
style: {
fontSize: '1.2rem',
fontWeight: 800
}
}, "\uD83D\uDC51 Owner Security Settings"), /*#__PURE__*/React.createElement("button", {
onClick: () => setIsChangePasscodeOpen(false),
style: {
fontSize: '1.2rem'
}
}, "\u2715")), /*#__PURE__*/React.createElement("form", {
onSubmit: handleChangePasscode
}, /*#__PURE__*/React.createElement("div", {
className: "modal-body",
style: {
display: 'flex',
flexDirection: 'column',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
background: '#EEF2FF',
padding: '0.75rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.8rem',
color: '#4F46E5',
fontWeight: 600
}
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-shield-halved",
style: {
marginRight: 5
}
}), " Verify current Owner Passcode to update security passcodes for both Owner & User access."), changePasscodeError && /*#__PURE__*/React.createElement("div", {
style: {
background: '#FEF2F2',
border: '1px solid #FECACA',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.8rem',
color: '#B91C1C',
fontWeight: 700
}
}, changePasscodeError), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.3rem'
}
}, "Verify Current Owner Passcode *"), /*#__PURE__*/React.createElement("input", {
type: "password",
required: true,
placeholder: "Enter current owner passcode...",
value: currentOwnerPinCheck,
onChange: e => {
setCurrentOwnerPinCheck(e.target.value);
setChangePasscodeError('');
},
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", {
style: {
borderTop: '1px solid var(--border-color)',
paddingTop: '0.75rem',
display: 'flex',
flexDirection: 'column',
gap: '0.85rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.3rem',
color: '#4F46E5'
}
}, "\uD83D\uDC51 New Owner Passcode (Full Admin Access) *"), /*#__PURE__*/React.createElement("input", {
type: "text",
required: true,
placeholder: "e.g. 2026",
value: newOwnerPinForm,
onChange: e => {
setNewOwnerPinForm(e.target.value);
setChangePasscodeError('');
},
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid #C7D2FE',
fontWeight: 700
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.3rem',
color: '#059669'
}
}, "\uD83D\uDC64 New User Passcode (Restricted User Access) *"), /*#__PURE__*/React.createElement("input", {
type: "text",
required: true,
placeholder: "e.g. 1234",
value: newUserPinForm,
onChange: e => {
setNewUserPinForm(e.target.value);
setChangePasscodeError('');
},
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid #A7F3D0',
fontWeight: 700
}
})))), /*#__PURE__*/React.createElement("div", {
className: "modal-footer"
}, /*#__PURE__*/React.createElement("button", {
type: "button",
className: "btn-secondary",
onClick: () => setIsChangePasscodeOpen(false)
}, "Cancel"), /*#__PURE__*/React.createElement("button", {
type: "submit",
className: "btn-primary"
}, "Save Security Settings"))))), isPasteDataOpen && /*#__PURE__*/React.createElement("div", {
className: "modal-overlay"
}, /*#__PURE__*/React.createElement("div", {
className: "modal-content"
}, /*#__PURE__*/React.createElement("div", {
className: "modal-header"
}, /*#__PURE__*/React.createElement("h3", {
style: {
fontSize: '1.2rem',
fontWeight: 800
}
}, "\uD83D\uDCCB Paste Google Sheet Data"), /*#__PURE__*/React.createElement("button", {
onClick: () => setIsPasteDataOpen(false),
style: {
fontSize: '1.2rem'
}
}, "\u2715")), /*#__PURE__*/React.createElement("div", {
className: "modal-body",
style: {
display: 'flex',
flexDirection: 'column',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("p", {
style: {
fontSize: '0.85rem',
color: 'var(--text-muted)'
}
}, "Copy your Google Sheet table cells (including header row) and paste below:"), /*#__PURE__*/React.createElement("textarea", {
rows: 8,
placeholder: `Name\tDate of Birth\tEmail ID\tPhone Number\tJoining Date\tMusic Class\tWeekly Classes\tTuition Package\tCompleted Classes\tLast Class Date\tPayment Status\nAnanya Verma\t2005-04-12\tananya@gmail.com\t9876543210\t2026-04-01\tPiano Lessons\tMon & Thu\t4 Classes Package (₹6,000)\t2\t2026-10-01\tPaid`,
value: pastedText,
onChange: e => setPastedText(e.target.value),
style: {
width: '100%',
padding: '0.75rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
fontFamily: 'monospace',
fontSize: '0.8rem'
}
})), /*#__PURE__*/React.createElement("div", {
className: "modal-footer"
}, /*#__PURE__*/React.createElement("button", {
className: "btn-secondary",
onClick: () => setIsPasteDataOpen(false)
}, "Cancel"), /*#__PURE__*/React.createElement("button", {
className: "btn-primary",
onClick: handleImportPastedData
}, "Import Students")))), isAddStudentOpen && /*#__PURE__*/React.createElement("div", {
className: "modal-overlay"
}, /*#__PURE__*/React.createElement("div", {
className: "modal-content"
}, /*#__PURE__*/React.createElement("div", {
className: "modal-header"
}, /*#__PURE__*/React.createElement("h3", {
style: {
fontSize: '1.2rem',
fontWeight: 800
}
}, "\uD83C\uDFA7 Add Music Production Student"), /*#__PURE__*/React.createElement("button", {
onClick: () => setIsAddStudentOpen(false),
style: {
fontSize: '1.2rem'
}
}, "\u2715")), /*#__PURE__*/React.createElement("form", {
onSubmit: e => {
e.preventDefault();
if (!formData.name) return;
const computedAge = calculateAge(formData.dob);
const count = Number(formData.completedClassesCount) || 0;
const limit = getPackageLimit(formData.packageType);
const isExpired = count >= limit;
const newSt = {
id: `music_std_${Date.now()}`,
name: formData.name,
dob: formData.dob,
age: computedAge,
email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
phone: formData.phone || '+91 9800000000',
joiningDate: formData.joiningDate || new Date().toISOString().split('T')[0],
musicClass: formData.musicClass || 'Vocal Lessons',
classDays: formData.classDays || 'Mon & Thu',
packageType: formData.packageType || '4 Classes Package (₹6,000)',
packageAmount: formData.packageType.includes('12') ? 15000 : 6000,
completedClassesCount: count,
lastClassDate: formData.lastClassDate || new Date().toISOString().split('T')[0],
feeStatus: isExpired ? 'pending' : formData.feeStatus || 'paid',
avatarColor: '#6366F1'
};
syncCentralData([newSt, ...students], attendance);
setIsAddStudentOpen(false);
setFormData({
name: '',
dob: '2005-01-15',
age: 21,
email: '',
phone: '',
joiningDate: new Date().toISOString().split('T')[0],
musicClass: 'Vocal Lessons',
classDays: 'Mon & Thu',
packageType: '4 Classes Package (₹6,000)',
packageAmount: 6000,
completedClassesCount: 0,
lastClassDate: new Date().toISOString().split('T')[0],
feeStatus: 'paid'
});
}
}, /*#__PURE__*/React.createElement("div", {
className: "modal-body",
style: {
display: 'flex',
flexDirection: 'column',
gap: '0.85rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Student Full Name *"), /*#__PURE__*/React.createElement("input", {
type: "text",
required: true,
placeholder: "e.g. Ananya Verma",
value: formData.name,
onChange: e => setFormData({
...formData,
name: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", {
style: {
display: 'grid',
gridTemplateColumns: '1fr 1fr',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Date of Birth *"), /*#__PURE__*/React.createElement("input", {
type: "date",
required: true,
value: formData.dob,
onChange: e => handleDobChange(e, false),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Calculated Age"), /*#__PURE__*/React.createElement("input", {
type: "text",
readOnly: true,
value: `${formData.age} years old`,
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
background: 'var(--bg-surface-subtle)',
fontWeight: 700
}
}))), /*#__PURE__*/React.createElement("div", {
style: {
display: 'grid',
gridTemplateColumns: '1fr 1fr',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Email ID *"), /*#__PURE__*/React.createElement("input", {
type: "email",
required: true,
placeholder: "student@gmail.com",
value: formData.email,
onChange: e => setFormData({
...formData,
email: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Phone Number *"), /*#__PURE__*/React.createElement("input", {
type: "text",
required: true,
placeholder: "+91 9876543210",
value: formData.phone,
onChange: e => setFormData({
...formData,
phone: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
}))), /*#__PURE__*/React.createElement("div", {
style: {
display: 'grid',
gridTemplateColumns: '1fr 1fr',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Lesson Option *"), /*#__PURE__*/React.createElement("select", {
value: formData.musicClass,
onChange: e => setFormData({
...formData,
musicClass: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
fontWeight: 700,
color: 'var(--primary)'
}
}, MUSIC_LESSON_OPTIONS.map(c => /*#__PURE__*/React.createElement("option", {
key: c,
value: c
}, c)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Tuition Package *"), /*#__PURE__*/React.createElement("select", {
value: formData.packageType,
onChange: e => {
const val = e.target.value;
setFormData({
...formData,
packageType: val,
packageAmount: val.includes('12') ? 15000 : 6000
});
},
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
fontWeight: 700,
color: '#7E22CE'
}
}, PACKAGE_OPTIONS.map(p => /*#__PURE__*/React.createElement("option", {
key: p.id,
value: p.label
}, p.label))))), /*#__PURE__*/React.createElement("div", {
style: {
background: '#FAF5FF',
border: '1px solid #E9D5FF',
padding: '0.75rem',
borderRadius: 'var(--radius-md)',
display: 'grid',
gridTemplateColumns: '1fr 1fr',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
color: '#7E22CE',
display: 'block',
marginBottom: '0.2rem'
}
}, "Classes Completed So Far *"), /*#__PURE__*/React.createElement("input", {
type: "number",
min: "0",
max: "100",
required: true,
value: formData.completedClassesCount,
onChange: e => setFormData({
...formData,
completedClassesCount: parseInt(e.target.value) || 0
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid #D8B4FE',
fontWeight: 800,
color: '#7E22CE'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
color: '#7E22CE',
display: 'block',
marginBottom: '0.2rem'
}
}, "Last Class / Payment Date *"), /*#__PURE__*/React.createElement("input", {
type: "date",
required: true,
value: formData.lastClassDate,
onChange: e => setFormData({
...formData,
lastClassDate: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid #D8B4FE'
}
}))), /*#__PURE__*/React.createElement("div", {
style: {
display: 'grid',
gridTemplateColumns: '1fr 1fr 1fr',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Weekly Schedule"), /*#__PURE__*/React.createElement("input", {
type: "text",
required: true,
placeholder: "e.g. Mon & Thu",
value: formData.classDays,
onChange: e => setFormData({
...formData,
classDays: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Joining Date"), /*#__PURE__*/React.createElement("input", {
type: "date",
value: formData.joiningDate,
onChange: e => setFormData({
...formData,
joiningDate: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Payment Status"), /*#__PURE__*/React.createElement("select", {
value: formData.feeStatus,
onChange: e => setFormData({
...formData,
feeStatus: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
}, /*#__PURE__*/React.createElement("option", {
value: "paid"
}, "Paid"), /*#__PURE__*/React.createElement("option", {
value: "pending"
}, "Pending"), /*#__PURE__*/React.createElement("option", {
value: "overdue"
}, "Overdue"))))), /*#__PURE__*/React.createElement("div", {
className: "modal-footer"
}, /*#__PURE__*/React.createElement("button", {
type: "button",
className: "btn-secondary",
onClick: () => setIsAddStudentOpen(false)
}, "Cancel"), /*#__PURE__*/React.createElement("button", {
type: "submit",
className: "btn-primary"
}, "Add Student"))))), isEditStudentOpen && studentToEdit && /*#__PURE__*/React.createElement("div", {
className: "modal-overlay"
}, /*#__PURE__*/React.createElement("div", {
className: "modal-content"
}, /*#__PURE__*/React.createElement("div", {
className: "modal-header"
}, /*#__PURE__*/React.createElement("h3", {
style: {
fontSize: '1.2rem',
fontWeight: 800
}
}, "\u270F\uFE0F Edit Student Information"), /*#__PURE__*/React.createElement("button", {
onClick: () => setIsEditStudentOpen(false),
style: {
fontSize: '1.2rem'
}
}, "\u2715")), /*#__PURE__*/React.createElement("form", {
onSubmit: handleSaveEditedStudent
}, /*#__PURE__*/React.createElement("div", {
className: "modal-body",
style: {
display: 'flex',
flexDirection: 'column',
gap: '0.85rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Student Full Name *"), /*#__PURE__*/React.createElement("input", {
type: "text",
required: true,
value: studentToEdit.name,
onChange: e => setStudentToEdit({
...studentToEdit,
name: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", {
style: {
display: 'grid',
gridTemplateColumns: '1fr 1fr',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Date of Birth *"), /*#__PURE__*/React.createElement("input", {
type: "date",
required: true,
value: studentToEdit.dob || '',
onChange: e => handleDobChange(e, true),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Calculated Age"), /*#__PURE__*/React.createElement("input", {
type: "text",
readOnly: true,
value: `${studentToEdit.age} years old`,
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
background: 'var(--bg-surface-subtle)',
fontWeight: 700
}
}))), /*#__PURE__*/React.createElement("div", {
style: {
display: 'grid',
gridTemplateColumns: '1fr 1fr',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Email ID *"), /*#__PURE__*/React.createElement("input", {
type: "email",
required: true,
value: studentToEdit.email || '',
onChange: e => setStudentToEdit({
...studentToEdit,
email: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Phone Number *"), /*#__PURE__*/React.createElement("input", {
type: "text",
required: true,
value: studentToEdit.phone || '',
onChange: e => setStudentToEdit({
...studentToEdit,
phone: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
}))), /*#__PURE__*/React.createElement("div", {
style: {
display: 'grid',
gridTemplateColumns: '1fr 1fr',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Lesson Option *"), /*#__PURE__*/React.createElement("select", {
value: studentToEdit.musicClass || 'Vocal Lessons',
onChange: e => setStudentToEdit({
...studentToEdit,
musicClass: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
fontWeight: 700,
color: 'var(--primary)'
}
}, MUSIC_LESSON_OPTIONS.map(c => /*#__PURE__*/React.createElement("option", {
key: c,
value: c
}, c)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Tuition Package *"), /*#__PURE__*/React.createElement("select", {
value: studentToEdit.packageType || '4 Classes Package (₹6,000)',
onChange: e => {
const val = e.target.value;
setStudentToEdit({
...studentToEdit,
packageType: val,
packageAmount: val.includes('12') ? 15000 : 6000
});
},
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)',
fontWeight: 700,
color: '#7E22CE'
}
}, PACKAGE_OPTIONS.map(p => /*#__PURE__*/React.createElement("option", {
key: p.id,
value: p.label
}, p.label))))), /*#__PURE__*/React.createElement("div", {
style: {
background: '#FAF5FF',
border: '1px solid #E9D5FF',
padding: '0.75rem',
borderRadius: 'var(--radius-md)',
display: 'grid',
gridTemplateColumns: '1fr 1fr',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
color: '#7E22CE',
display: 'block',
marginBottom: '0.2rem'
}
}, "Classes Completed So Far *"), /*#__PURE__*/React.createElement("input", {
type: "number",
min: "0",
max: "100",
required: true,
value: studentToEdit.completedClassesCount || 0,
onChange: e => setStudentToEdit({
...studentToEdit,
completedClassesCount: parseInt(e.target.value) || 0
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid #D8B4FE',
fontWeight: 800,
color: '#7E22CE'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
color: '#7E22CE',
display: 'block',
marginBottom: '0.2rem'
}
}, "Last Class / Payment Date *"), /*#__PURE__*/React.createElement("input", {
type: "date",
required: true,
value: studentToEdit.lastClassDate || '',
onChange: e => setStudentToEdit({
...studentToEdit,
lastClassDate: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid #D8B4FE'
}
}))), /*#__PURE__*/React.createElement("div", {
style: {
display: 'grid',
gridTemplateColumns: '1fr 1fr 1fr',
gap: '0.75rem'
}
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Weekly Schedule"), /*#__PURE__*/React.createElement("input", {
type: "text",
placeholder: "e.g. Mon & Thu",
value: studentToEdit.classDays || '',
onChange: e => setStudentToEdit({
...studentToEdit,
classDays: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Joining Date"), /*#__PURE__*/React.createElement("input", {
type: "date",
value: studentToEdit.joiningDate || '',
onChange: e => setStudentToEdit({
...studentToEdit,
joiningDate: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.2rem'
}
}, "Payment Status"), /*#__PURE__*/React.createElement("select", {
value: studentToEdit.feeStatus,
onChange: e => setStudentToEdit({
...studentToEdit,
feeStatus: e.target.value
}),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
}, /*#__PURE__*/React.createElement("option", {
value: "paid"
}, "Paid"), /*#__PURE__*/React.createElement("option", {
value: "pending"
}, "Pending"), /*#__PURE__*/React.createElement("option", {
value: "overdue"
}, "Overdue"))))), /*#__PURE__*/React.createElement("div", {
className: "modal-footer"
}, /*#__PURE__*/React.createElement("button", {
type: "button",
className: "btn-secondary",
onClick: () => setIsEditStudentOpen(false)
}, "Cancel"), /*#__PURE__*/React.createElement("button", {
type: "submit",
className: "btn-primary"
}, "Save Changes"))))), isRescheduleOpen && studentForReschedule && /*#__PURE__*/React.createElement("div", {
className: "modal-overlay"
}, /*#__PURE__*/React.createElement("div", {
className: "modal-content",
style: {
maxWidth: '460px'
}
}, /*#__PURE__*/React.createElement("div", {
className: "modal-header"
}, /*#__PURE__*/React.createElement("h3", {
style: {
fontSize: '1.2rem',
fontWeight: 800
}
}, "\uD83D\uDD04 Reschedule Student Class"), /*#__PURE__*/React.createElement("button", {
onClick: () => setIsRescheduleOpen(false),
style: {
fontSize: '1.2rem'
}
}, "\u2715")), /*#__PURE__*/React.createElement("form", {
onSubmit: handleSaveReschedule
}, /*#__PURE__*/React.createElement("div", {
className: "modal-body",
style: {
display: 'flex',
flexDirection: 'column',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
background: '#FFF7ED',
border: '1px solid #FFEDD5',
padding: '0.75rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.85rem',
color: '#C2410C'
}
}, /*#__PURE__*/React.createElement("strong", null, "Student:"), " ", studentForReschedule.name, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Regular Schedule:"), " ", studentForReschedule.classDays || 'Mon & Thu'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.3rem'
}
}, "Original Scheduled Date *"), /*#__PURE__*/React.createElement("input", {
type: "date",
required: true,
value: rescheduleOriginalDate,
onChange: e => setRescheduleOriginalDate(e.target.value),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.3rem'
}
}, "New Rescheduled Date *"), /*#__PURE__*/React.createElement("input", {
type: "date",
required: true,
value: rescheduleTargetDate,
onChange: e => setRescheduleTargetDate(e.target.value),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid #F97316',
fontWeight: 700,
color: '#C2410C'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.3rem'
}
}, "Reason for Rescheduling (Optional)"), /*#__PURE__*/React.createElement("input", {
type: "text",
placeholder: "e.g. Sick leave, Travel, Personal request",
value: rescheduleReason,
onChange: e => setRescheduleReason(e.target.value),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
}))), /*#__PURE__*/React.createElement("div", {
className: "modal-footer"
}, /*#__PURE__*/React.createElement("button", {
type: "button",
className: "btn-secondary",
onClick: () => setIsRescheduleOpen(false)
}, "Cancel"), /*#__PURE__*/React.createElement("button", {
type: "submit",
className: "btn-primary",
style: {
background: 'linear-gradient(135deg, #EA580C, #C2410C)'
}
}, "Confirm Reschedule"))))), isExtraClassOpen && studentForExtraClass && /*#__PURE__*/React.createElement("div", {
className: "modal-overlay"
}, /*#__PURE__*/React.createElement("div", {
className: "modal-content",
style: {
maxWidth: '460px'
}
}, /*#__PURE__*/React.createElement("div", {
className: "modal-header"
}, /*#__PURE__*/React.createElement("h3", {
style: {
fontSize: '1.2rem',
fontWeight: 800
}
}, "\u2B50 Record Extra Class"), /*#__PURE__*/React.createElement("button", {
onClick: () => setIsExtraClassOpen(false),
style: {
fontSize: '1.2rem'
}
}, "\u2715")), /*#__PURE__*/React.createElement("form", {
onSubmit: handleSaveExtraClass
}, /*#__PURE__*/React.createElement("div", {
className: "modal-body",
style: {
display: 'flex',
flexDirection: 'column',
gap: '1rem'
}
}, /*#__PURE__*/React.createElement("div", {
style: {
background: '#FAF5FF',
border: '1px solid #E9D5FF',
padding: '0.75rem',
borderRadius: 'var(--radius-md)',
fontSize: '0.85rem',
color: '#7E22CE'
}
}, /*#__PURE__*/React.createElement("strong", null, "Student:"), " ", studentForExtraClass.name, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Current Package:"), " ", studentForExtraClass.packageType || '4 Classes Package (₹6,000)', " (", studentForExtraClass.completedClassesCount || 0, " classes completed)"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.3rem'
}
}, "Extra Class Date *"), /*#__PURE__*/React.createElement("input", {
type: "date",
required: true,
value: extraClassDate,
onChange: e => setExtraClassDate(e.target.value),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid #D8B4FE',
fontWeight: 700,
color: '#7E22CE'
}
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
style: {
fontSize: '0.8rem',
fontWeight: 700,
display: 'block',
marginBottom: '0.3rem'
}
}, "Class Topic / Notes (Optional)"), /*#__PURE__*/React.createElement("input", {
type: "text",
placeholder: "e.g. Extra exam prep, vocal warmups, catch-up session",
value: extraClassNotes,
onChange: e => setExtraClassNotes(e.target.value),
style: {
width: '100%',
padding: '0.65rem',
borderRadius: 'var(--radius-md)',
border: '1px solid var(--border-color)'
}
}))), /*#__PURE__*/React.createElement("div", {
className: "modal-footer"
}, /*#__PURE__*/React.createElement("button", {
type: "button",
className: "btn-secondary",
onClick: () => setIsExtraClassOpen(false)
}, "Cancel"), /*#__PURE__*/React.createElement("button", {
type: "submit",
className: "btn-primary",
style: {
background: 'linear-gradient(135deg, #7E22CE, #6B21A8)'
}
}, "Save Extra Class"))))), /*#__PURE__*/React.createElement("nav", {
className: "mobile-bottom-nav"
}, /*#__PURE__*/React.createElement("button", {
className: `mobile-nav-item ${activeTab === 'attendance' ? 'active' : ''}`,
onClick: () => setActiveTab('attendance')
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-calendar-check"
}), /*#__PURE__*/React.createElement("span", null, "Attendance")), /*#__PURE__*/React.createElement("button", {
className: `mobile-nav-item ${activeTab === 'students' ? 'active' : ''}`,
onClick: () => setActiveTab('students')
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-users"
}), /*#__PURE__*/React.createElement("span", null, "Students")), /*#__PURE__*/React.createElement("button", {
className: `mobile-nav-item ${activeTab === 'fees' ? 'active' : ''}`,
onClick: () => setActiveTab('fees')
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-credit-card"
}), /*#__PURE__*/React.createElement("span", null, "Fees")), /*#__PURE__*/React.createElement("button", {
className: `mobile-nav-item ${activeTab === 'sheets' ? 'active' : ''}`,
onClick: () => setActiveTab('sheets')
}, /*#__PURE__*/React.createElement("i", {
className: "fa-solid fa-file-excel"
}), /*#__PURE__*/React.createElement("span", null, "Sheets"))));
}
class ErrorBoundary extends React.Component {
constructor(props) {
super(props);
this.state = {
hasError: false,
error: null
};
}
static getDerivedStateFromError(error) {
return {
hasError: true,
error: error
};
}
componentDidCatch(error, errorInfo) {
console.error("React Error Boundary Caught Error:", error, errorInfo);
}
render() {
if (this.state.hasError) {
return /*#__PURE__*/React.createElement("div", {
style: {
padding: '2rem',
textAlign: 'center',
background: '#FEF2F2',
color: '#991B1B',
borderRadius: '16px',
margin: '2rem',
border: '1px solid #FECACA',
fontFamily: 'sans-serif'
}
}, /*#__PURE__*/React.createElement("h2", {
style: {
fontSize: '1.5rem',
fontWeight: 800,
marginBottom: '0.5rem'
}
}, "\u26A0\uFE0F App Display Error"), /*#__PURE__*/React.createElement("p", {
style: {
marginBottom: '1rem',
fontSize: '0.9rem'
}
}, "Something unexpected occurred while rendering:"), /*#__PURE__*/React.createElement("pre", {
style: {
background: '#FFF',
padding: '1rem',
borderRadius: '8px',
textAlign: 'left',
overflow: 'auto',
fontSize: '0.8rem',
color: '#B91C1C',
border: '1px solid #FECACA'
}
}, this.state.error && this.state.error.toString()), /*#__PURE__*/React.createElement("button", {
onClick: () => {
localStorage.clear();
sessionStorage.clear();
window.location.reload();
},
style: {
marginTop: '1rem',
padding: '0.65rem 1.25rem',
background: '#DC2626',
color: 'white',
borderRadius: '8px',
fontWeight: 'bold',
border: 'none',
cursor: 'pointer'
}
}, "Reset App Cache & Reload Page"));
}
return this.props.children;
}
}
ReactDOM.createRoot(document.getElementById('root')).render( /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(App, null)));