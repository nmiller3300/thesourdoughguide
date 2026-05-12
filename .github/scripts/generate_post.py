import anthropic
import os
import json
import re
import random
from datetime import datetime
from pathlib import Path

api_key = os.environ.get("ANTHROPIC_API_KEY", "")
client = anthropic.Anthropic(api_key=api_key)

script_dir = Path(__file__).resolve().parent
repo_root = script_dir.parent.parent
posts_dir = repo_root / "posts"
print(f"Posts directory: {posts_dir}")

existing_titles = []
existing_categories = []
for f in posts_dir.glob("*.md"):
    content = f.read_text()
    tm = re.search(r'^title:\s*(.+)$', content, re.MULTILINE)
    cm = re.search(r'^category:\s*(.+)$', content, re.MULTILINE)
    if tm: existing_titles.append(tm.group(1).strip())
    if cm: existing_categories.append(cm.group(1).strip())

existing_str = "\n".join(f"- {t}" for t in existing_titles) if existing_titles else "None yet"
cat_counts = {c: existing_categories.count(c) for c in ['recipe','beginner','troubleshooting','equipment','advanced']}

weights = {'recipe': 40, 'beginner': 20, 'troubleshooting': 20, 'equipment': 12, 'advanced': 8}
for cat, count in cat_counts.items():
    if count > 5:
        weights[cat] = max(5, weights[cat] - (count * 3))

chosen = random.choices(list(weights.keys()), weights=list(weights.values()), k=1)[0]
print(f"Writing category: {chosen}")

instructions = {
    'recipe': """Write a COMPLETE SOURDOUGH RECIPE with ALL of the following:\n- Yield\n- Full ingredients with grams AND cups\n- Step-by-step numbered method with timing\n- At least one tip\n- Storage instructions\n- At least one variation\nChoose something not already published. Options: sourdough pretzels, sourdough waffles, sourdough pita, sourdough naan, sourdough dinner rolls, sourdough brioche, sourdough scones, sourdough tortillas, sourdough brownies, sourdough banana bread, sourdough crepes, sourdough ciabatta.\nMinimum 700 words.""",
    'beginner': """Write a BEGINNER GUIDE on ONE sourdough topic not yet covered.\nOptions: choosing flour, temperature and fermentation, reading your dough, autolyse method, stretch and fold, shaping a boule, shaping a batard, scoring patterns, why steam matters, maintaining a starter, baker percentages.\nInclude: clear explanation, common mistakes, FAQ with 3 questions, practical takeaways.\nMinimum 650 words.""",
    'troubleshooting': """Write a TROUBLESHOOTING GUIDE for ONE problem not yet covered.\nOptions: bread sticks to Dutch oven, loaf cracks on side, bread too pale, huge holes but gummy, starter smells like acetone, crust softens after cooling, lopsided loaf, scoring doesn't open up.\nFor each cause: explain WHY, HOW to fix, HOW to prevent.\nMinimum 600 words.""",
    'equipment': """Write an EQUIPMENT GUIDE on ONE item not yet covered.\nOptions: bread lame guide, instant-read thermometer, bench scraper, proofing box, baking steel vs Dutch oven, loaf pan materials, starter jars, flour storage, kitchen scale comparison.\nInclude honest pros/cons and product recommendations at budget/mid/premium.\nMinimum 600 words.""",
    'advanced': """Write an ADVANCED TECHNIQUE guide on ONE topic not yet covered.\nOptions: lamination, coil folding, open crumb scoring, building a levain, bassinage, 72 hour cold retard, shaping high-hydration dough, desired dough temperature, feeding ratios, multiple starters.\nInclude: science, step-by-step, common mistakes, when to use it.\nMinimum 650 words."""
}

prompt = f"""You are an expert sourdough baker writing for TheSourdoughGuide.com.

Category: **{chosen}**

Already published — DO NOT duplicate:
{existing_str}

{instructions[chosen]}

Write warmly and practically. Real measurements. Real timing. No filler.

Respond with ONLY valid JSON (no markdown code blocks, no other text):
{{
  "title": "Complete post title",
  "category": "{chosen}",
  "readtime": "X min read",
  "excerpt": "One sentence under 150 chars",
  "body": "Full markdown body"
}}"""

print("Calling Claude API...")
msg = client.messages.create(model="claude-opus-4-5", max_tokens=4000, messages=[{"role":"user","content":prompt}])
raw = msg.content[0].text.strip()
raw = re.sub(r'^```json\s*', '', raw)
raw = re.sub(r'\s*```$', '', raw)
data = json.loads(raw)
print(f"Generated: [{data['category']}] {data['title']}")

sl = re.sub(r'[^a-z0-9]+', '-', data['title'].lower()).strip('-')[:60]
content = f"---\ntitle: {data['title']}\ndate: {datetime.now().strftime('%Y-%m-%d')}\ncategory: {data['category']}\nreadtime: {data['readtime']}\nexcerpt: {data['excerpt']}\n---\n\n{data['body']}"
output_path = posts_dir / f"{sl}.md"
output_path.write_text(content)
print(f"Saved: {output_path}")
