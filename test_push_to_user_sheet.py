import urllib.request
import urllib.parse
import json

url = 'https://script.google.com/macros/s/AKfycbzD8tSq5esdph6EtAlGM73d0csC6Ev5l_NjmhAfIlPKeTwGpJQNfI_6kun5bcDBHXPc/exec'

test_payload = {
    'type': 'SYNC_ALL',
    'studentsHeaders': ['Name', 'Date of Birth', 'Age', 'Email ID', 'Phone Number', 'Joining Date', 'Music Lesson Type', 'Class Days Schedule', 'Tuition Package', 'Package Fee (INR)', 'Classes Used', 'Last Class Date', 'Payment Status'],
    'studentsData': [
        ['Aarav Sharma', '2005-04-12', '20', 'aarav@gmail.com', '+91 9876543210', '2026-04-01', 'Piano Lessons', 'Mon & Thu', '4 Classes Package (₹6,000)', 6000, '2/4', '2026-10-01', 'paid'],
        ['Priya Verma', '2006-08-20', '19', 'priya@gmail.com', '+91 9812345678', '2026-04-05', 'Vocal Lessons', 'Tue & Fri', '12 Classes Package (₹15,000)', 15000, '5/12', '2026-10-03', 'paid'],
        ['Kabir Gupta', '2004-11-15', '21', 'kabir@gmail.com', '+91 9898989898', '2026-04-10', 'App Lessons', 'Wed & Sat', '4 Classes Package (₹6,000)', 6000, '4/4', '2026-10-05', 'pending']
    ],
    'attendanceHeaders': ['Date', 'Student Name', 'Lesson', 'Status'],
    'attendanceData': [
        ['2026-10-07', 'Aarav Sharma', 'Piano Lessons', 'present'],
        ['2026-10-07', 'Priya Verma', 'Vocal Lessons', 'present']
    ]
}

encoded_payload = urllib.parse.quote(json.dumps(test_payload))
full_get_url = url + '?payload=' + encoded_payload

print("Sending test payload to user's Google Apps Script Web App URL...")

req = urllib.request.Request(full_get_url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        res_text = resp.read().decode('utf-8')
        print("Response HTTP Status:", resp.status)
        print("Response Text:", res_text)
except Exception as e:
    print("Push Error:", e)
