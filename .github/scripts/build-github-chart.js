// Generates a self-hosted GitHub contribution chart as an SVG.
//
// Replaces the third-party ghchart.rshah.org hotlink, which intermittently
// timed out and left a blank card on the homepage.
//
// Primary source is the GraphQL API (authenticated with the workflow's
// GITHUB_TOKEN); if that is unavailable it falls back to the public
// contributions HTML fragment, which needs no auth at all.

import fs from 'fs';
import path from 'path';

const LOGIN = process.env.GITHUB_CHART_LOGIN || 'akshaychugh-xyz';
const OUTPUT = process.env.GITHUB_CHART_OUTPUT || 'assets/images/github-contributions.svg';

// GitHub's standard green ramp, indexed by contribution level 0-4. The site's
// dark mode inverts this image via CSS, so keep the light-mode palette here.
const LEVEL_COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const LEVEL_NAMES = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

const CELL = 10;
const GAP = 3;
const RADIUS = 2;

async function fetchFromGraphQL(login, token) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays { date contributionCount contributionLevel }
            }
          }
        }
      }
    }`;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'akshaychugh.xyz-chart-builder',
    },
    body: JSON.stringify({ query, variables: { login } }),
  });

  if (!res.ok) throw new Error(`GraphQL responded ${res.status}`);

  const body = await res.json();
  if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join('; '));

  const weeks = body.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!weeks?.length) throw new Error('GraphQL returned no contribution weeks');

  return weeks.map((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: LEVEL_NAMES[day.contributionLevel] ?? 0,
    }))
  );
}

// The public contributions fragment renders one <td> per day carrying
// data-date / data-level / data-count attributes.
async function fetchFromPublicHTML(login) {
  const res = await fetch(`https://github.com/users/${encodeURIComponent(login)}/contributions`, {
    headers: { 'User-Agent': 'akshaychugh.xyz-chart-builder' },
  });
  if (!res.ok) throw new Error(`Contributions page responded ${res.status}`);

  const html = await res.text();
  const days = [];
  const cellPattern = /<td[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g;

  for (const [tag, date] of html.matchAll(cellPattern)) {
    days.push({
      date,
      count: Number(tag.match(/data-count="(\d+)"/)?.[1] ?? 0),
      level: Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0),
    });
  }

  if (!days.length) throw new Error('Could not parse any days from the contributions page');

  // Bucket the flat day list back into calendar weeks, Sunday-first, so a
  // partial leading week keeps its correct vertical offset.
  days.sort((a, b) => a.date.localeCompare(b.date));
  const weeks = [];
  let current = [];
  for (const day of days) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (weekday === 0 && current.length) {
      weeks.push(current);
      current = [];
    }
    if (!current.length && weekday !== 0) current.length = weekday;
    current.push(day);
  }
  if (current.length) weeks.push(current);

  return weeks;
}

function buildSvg(weeks) {
  const width = weeks.length * (CELL + GAP) - GAP;
  const height = 7 * (CELL + GAP) - GAP;

  const rects = weeks.flatMap((week, x) =>
    week.map((day, y) => {
      if (!day) return null;
      const color = LEVEL_COLORS[Math.min(day.level, LEVEL_COLORS.length - 1)];
      const title = day.date
        ? `<title>${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}</title>`
        : '';
      return (
        `<rect x="${x * (CELL + GAP)}" y="${y * (CELL + GAP)}" width="${CELL}" height="${CELL}" ` +
        `rx="${RADIUS}" ry="${RADIUS}" fill="${color}">${title}</rect>`
      );
    })
  ).filter(Boolean);

  const total = weeks.flat().reduce((sum, day) => sum + (day?.count ?? 0), 0);

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" ` +
    `width="${width}" height="${height}" role="img" ` +
    `aria-label="GitHub contribution graph: ${total} contributions in the last year">\n` +
    `  ${rects.join('\n  ')}\n</svg>\n`
  );
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  let weeks;

  if (token) {
    try {
      weeks = await fetchFromGraphQL(LOGIN, token);
      console.log('Fetched contributions via the GraphQL API.');
    } catch (error) {
      console.warn(`GraphQL fetch failed (${error.message}); falling back to the public page.`);
    }
  }

  if (!weeks) {
    weeks = await fetchFromPublicHTML(LOGIN);
    console.log('Fetched contributions via the public contributions page.');
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, buildSvg(weeks));

  const days = weeks.flat().filter(Boolean).length;
  console.log(`Wrote ${OUTPUT} (${weeks.length} weeks, ${days} days).`);
}

export { buildSvg, fetchFromGraphQL, fetchFromPublicHTML };

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`Failed to build the contribution chart: ${error.message}`);
    process.exit(1);
  });
}
