import json
import re
from pathlib import Path

posts_dir = Path("posts")
posts = []

for f in sorted(posts_dir.glob("*.md"), key=lambda x: x.stat().st_mtime, reverse=True):
    content = f.read_text()
    def get(key):
        m = re.search(rf'^{key}:\s*(.+)$', content, re.MULTILINE)
        return m.group(1).strip().strip("\"'") if m else ''
    title = get('title')
    if not title:
        continue
    date = get('date')
    if 'T' in date:
        date = date.split('T')[0]
    posts.append({
        'slug': f.stem,
        'title': title,
        'date': date,
        'category': get('category'),
        'readtime': get('readtime'),
        'excerpt': get('excerpt')
    })

posts.sort(key=lambda x: x.get('date', ''), reverse=True)
Path('posts/manifest.json').write_text(json.dumps(posts, indent=2))
print(f"Manifest rebuilt: {len(posts)} posts")
