import re

with open(r'C:\Users\Dell\.gemini\antigravity\scratch\student-management-app\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('<script type="text/babel">')
end = content.find('</script>', start)
code = content[start:end]

print("Script length:", len(code))

# Check for render call at the bottom of the script
print("Last 300 chars of script:")
print(code[-300:])
