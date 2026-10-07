import re

with open(r'C:\Users\Dell\.gemini\antigravity\scratch\student-management-app\index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines, 1):
    # Check for unsafe array method calls
    if re.search(r'\b(students|attendance|filteredStudents|parsedRows|importedStudents|rows)\.(map|filter|forEach|find|reduce)\b', line):
        if not 'Array.isArray' in line and not '||' in line and not '?' in line and not 'if' in line:
            pass # print(f"Line {i}: {line.strip()}")

    # Check for unsafe string includes/toLowerCase
    if re.search(r'\.(toLowerCase|includes)\(', line):
        if not '?' in line and not '||' in line and not 'typeof' in line and not 'String(' in line:
            pass
