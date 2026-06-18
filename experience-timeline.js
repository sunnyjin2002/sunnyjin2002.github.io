const timelineItems = [
  {
    id: "govtech-2023",
    type: "work",
    title: "Data Analyst (Co-op)",
    subtitle: "Community Services Cluster, GovTechON",
    start: "2023-01-01",
    end: "2023-08-01",
    side: "left",
    bullets: [
      "Add the role, organization, and a concise summary of the work completed during this period."
    ]
  },
  {
    id: "govtech-2024",
    type: "work",
    title: "Data Analyst (Co-op)",
    subtitle: "Community Services Cluster, GovTechON",
    start: "2024-05-01",
    end: "2024-08-01",
    side: "left",
    bullets: [
      "Add the next milestone here, such as an internship, research placement, or project-based role."
    ]
  },
  {
    id: "roamer-2025",
    type: "work",
    title: "Research and Sourcing Analyst",
    subtitle: "Roamer Pet Utilities",
    start: "2025-10-01",
    end: "2026-08-01",
    displayDate: "OCT 2025 - PRESENT",
    side: "left",
    bullets: [
      "E-Commerce Product Sourcing: Supported Roamer with China-based sourcing and procurement.",
      "Data Analytics Development: Developed Python and AI-agent analytical modules to review historical data, forecast monthly demand, etc."
    ]
  },
  {
    id: "uoft",
    type: "education",
    title: "Honours Bachelor of Science, University of Toronto Scarborough",
    subtitle: "",
    start: "2020-09-01",
    end: "2025-06-01",
    side: "right",
    bullets: [
      "Specialist, Statistics - Statistical Machine Learning and Data Science Stream",
      "Minor, English and Chinese Translations",
      "Minor (Incomplete), Linguistics",
      "Clubs and Activities:",
      "Member, UTSC DS3 (Data Science & Statistics Society)",
      "Member, Chinese Language And Culture Club (CLCC) UTSC"
    ]
  },
  {
    id: "shsid",
    type: "education",
    title: "Shanghai High School, International Divisioan (SHSID)",
    subtitle: "",
    start: "2020-06-01",
    end: "2020-06-01",
    displayDate: "JUN 2020",
    side: "right",
    bullets: [
      "Clubs and Activities:",
      "Founding Member, SHSID Ultimate Frisbee Club"
    ]
  }
];

function toTime(dateString) {
  return new Date(dateString).getTime();
}

function getItemEnd(item) {
  return item.end ? toTime(item.end) : Date.now();
}

function getAnchorTime(item) {
  const start = toTime(item.start);
  const end = getItemEnd(item);
  return start + (end - start) / 2;
}

function getTimelineBounds(items) {
  const starts = items.map((item) => toTime(item.start));
  const ends = items.map((item) => getItemEnd(item));
  const earliestStart = Math.min(...starts);
  const earliestYear = new Date(earliestStart).getFullYear();
  const latestEnd = Math.max(...ends);
  const latestYear = new Date(latestEnd).getFullYear();
  const alignedStart = new Date(`${earliestYear - 1}-01-01`).getTime();
  const extendedEnd = new Date(`${latestYear + 2}-01-01`).getTime();

  return {
    start: alignedStart,
    end: extendedEnd
  };
}

function getTopPercent(item, bounds) {
  const total = bounds.end - bounds.start;

  if (total <= 0) {
    return 0;
  }

  return ((bounds.end - getAnchorTime(item)) / total) * 100;
}

function getStartPercent(item, bounds) {
  const total = bounds.end - bounds.start;

  if (total <= 0) {
    return 0;
  }

  return ((bounds.end - getItemEnd(item)) / total) * 100;
}

function getEndPercent(item, bounds) {
  const total = bounds.end - bounds.start;

  if (total <= 0) {
    return 100;
  }

  return ((bounds.end - toTime(item.start)) / total) * 100;
}

function formatDate(dateString) {
  const formatter = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short"
  });

  return formatter.format(new Date(dateString));
}

function formatDateRange(item) {
  if (item.displayDate) {
    return item.displayDate;
  }

  const start = formatDate(item.start);
  const end = item.end ? formatDate(item.end) : "Present";

  return `${start} - ${end}`;
}

function createBulletList(item) {
  const list = document.createElement("ul");
  list.className = "timeline-bullets";

  item.bullets.forEach((bullet) => {
    const listItem = document.createElement("li");
    listItem.textContent = bullet;
    list.appendChild(listItem);
  });

  return list;
}

function createTimelineCard(item, bounds) {
  const card = document.createElement("article");
  const startPercent = getStartPercent(item, bounds);
  const endPercent = getEndPercent(item, bounds);
  const spanPercent = Math.max(endPercent - startPercent, 4);

  card.className = `timeline-card timeline-card-${item.side} timeline-card-${item.type}`;
  card.style.top = `${startPercent}%`;
  card.style.height = `${spanPercent}%`;
  card.dataset.startPercent = String(startPercent);
  card.dataset.spanPercent = String(spanPercent);

  const date = document.createElement("p");
  date.className = "timeline-date";
  date.textContent = formatDateRange(item);
  card.appendChild(date);

  const title = document.createElement("h2");
  title.textContent = item.title;
  card.appendChild(title);

  if (item.subtitle) {
    const subtitle = document.createElement("p");
    subtitle.className = "timeline-org";
    subtitle.textContent = item.subtitle;
    card.appendChild(subtitle);
  }

  card.appendChild(createBulletList(item));

  return card;
}

function normalizeCardHeights(cards, timeline) {
  const timelineHeight = timeline.clientHeight;

  cards.forEach((card) => {
    const contentPercent = (card.scrollHeight / timelineHeight) * 100;
    const spanPercent = parseFloat(card.dataset.spanPercent || "0");
    const safePercent = Math.max(spanPercent, contentPercent + 1.5);

    card.style.height = `${safePercent}%`;
  });
}

function createYearMarkers(container, bounds) {
  const startYear = new Date(bounds.start).getFullYear();
  const firstVisibleYear = startYear + 1;
  const endYear = new Date(bounds.end).getFullYear();

  for (let year = endYear; year >= firstVisibleYear; year -= 1) {
    const markerDate = Math.max(new Date(`${year}-01-01`).getTime(), bounds.start);
    const topPercent = ((bounds.end - markerDate) / (bounds.end - bounds.start)) * 100;

    if (topPercent < 0 || topPercent > 100) {
      continue;
    }

    const yearLabel = document.createElement("div");
    yearLabel.className = "timeline-year";
    yearLabel.textContent = String(year);
    yearLabel.style.top = `${topPercent}%`;
    container.appendChild(yearLabel);
  }
}

function applyCollisionOffsets(cards) {
  const lanes = {
    left: [],
    right: []
  };

  cards.forEach((card) => {
    const lane = card.classList.contains("timeline-card-left") ? lanes.left : lanes.right;
    const top = parseFloat(card.style.top);
    const height = parseFloat(card.style.height);
    const spacing = 1.2;

    let adjustedTop = top;

    if (lane.length > 0) {
      const previous = lane[lane.length - 1];
      const previousBottom = previous.top + previous.height + spacing;

      if (adjustedTop < previousBottom) {
        adjustedTop = previousBottom;
      }
    }

    card.style.top = `${Math.min(adjustedTop, 96)}%`;
    lane.push({
      top: adjustedTop,
      height
    });
  });
}

function expandTimelineToFit(cards, timeline) {
  const cardBottoms = cards.map((card) => card.offsetTop + card.offsetHeight);
  const requiredHeight = Math.max(...cardBottoms, timeline.clientHeight);

  timeline.style.minHeight = `${requiredHeight + 32}px`;
}

function renderTimeline() {
  const timeline = document.getElementById("timeline");

  if (!timeline) {
    return;
  }

  const bounds = getTimelineBounds(timelineItems);
  const sortedItems = [...timelineItems].sort((a, b) => getAnchorTime(b) - getAnchorTime(a));
  const cards = sortedItems.map((item) => createTimelineCard(item, bounds));

  cards.forEach((card) => timeline.appendChild(card));
  createYearMarkers(timeline, bounds);
  normalizeCardHeights(cards, timeline);
  applyCollisionOffsets(cards);
  expandTimelineToFit(cards, timeline);
}

renderTimeline();
