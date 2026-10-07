import re

with open('temp_script.jsx', encoding='utf-8') as f:
    lines = f.readlines()

paren_count = 0
in_str = False
str_char = None

for idx, line in enumerate(lines, 1):
    i = 0
    while i < len(line):
        ch = line[i]
        # handle line comments
        if not in_str and ch == '/' and i + 1 < len(line) and line[i+1] == '/':
            break
        # handle strings
        if ch in ('"', "'", '`'):
            if not in_str:
                in_str = True
                str_char = ch
            elif str_char == ch and line[i-1] != '\\':
                in_str = False
        elif not in_str:
            if ch == '(':
                paren_count += 1
            elif ch == ')':
                paren_count -= 1
                if paren_count < 0:
                    print(f"Paren count became negative at line {idx}: {line.strip()}")
                    break
        i += 1

print(f"Final Paren Count: {paren_count}")
