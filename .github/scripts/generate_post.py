import anthropic
import os
import json
import re
import random
from datetime import datetime
from pathlib import Path

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
import os script_dir = Path(__file__).parent.parent.parent posts_dir = script_dir / "posts" print(f"Posts directory: {posts_dir}")

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
    'recipe': """Write a COMPLETE SOURDOUGH RECIPE with ALL of the following:
- Yield (servings/loaves/pieces)
- Full ingredients list with EXACT measurements in grams AND cups/tbsp
- Step-by-step numbered method with timing for each step
- At least one tip or callout
- Storage instructions
- At least one variation
Choose something not already published. Options: sourdough pretzels, sourdough waffles, sourdough pita, sourdough crumpets, sourdough naan, sourdough dinner rolls, sourdough brioche, sourdough muffins, sourdough scones, sourdough tortillas, sourdough brownies, sourdough banana bread, sourdough crepes, sourdough hot cross buns, sourdough ciabatta.
Minimum 700 words.""",
    'beginner': """Write a comprehensive BEGINNER GUIDE on ONE specific sourdough topic not yet covered.
Options: choosing the right flour, how temperature affects fermentation, how to read your dough, autolyse method, stretch and fold vs coil folding, shaping a boule, shaping a batard, scoring patterns, why steam matters, maintaining a starter long-term, baker's percentages explained.
Must include: clear explanation, common mistakes, FAQ with 3+ questions, practical takeaways.
Minimum 650 words.""",
    'troubleshooting': """Write a TROUBLESHOOTING GUIDE for ONE specific problem not yet covered.
Options: bread sticks to Dutch oven, loaf cracks on side not score, bread too pale, doesn't brown, crumb has huge holes but gummy, starter smells like acetone, crust softens after cooling, lopsided loaf, dough tears during shaping, scoring doesn't open up.
For each cause: explain WHY, HOW to fix it, HOW to prevent it.
Minimum 600 words.""",
    'equipment': """Write an EQUIPMENT GUIDE on ONE item not yet covered.
Options: bread lame buying guide, instant-read thermometer for bread, bench scraper uses, proofing box guide, baking steel vs Dutch oven, loaf pan materials, starter jar types, flour storage, kitchen scale comparison, oven thermometer importance.
Include: honest pros/cons, specific products at budget/mid/premium price points.
Minimum 600 words.""",
    'advanced': """Write an ADVANCED TECHNIQUE guide on ONE topic not yet covered.
Options: lamination technique, coil folding deep dive, open crumb scoring, building a levain, bassinage method, extended cold retard 72+ hours, shaping high-hydration dough, calculating desired dough temperature, feeding ratios explained, maintaining multiple starters.
Include: science behind it, step-by-step, common mistakes, when to use it.
Minimum 650 words."""
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
