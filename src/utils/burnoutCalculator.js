// Negative moods that indicate burnout risk
const NEGATIVE_MOODS = ['sad', 'anxious'];

// Stress keywords to detect in diary content
const STRESS_KEYWORDS = [
  'overwhelmed',
  'exhausted',
  'burnout',
  'stressed',
  'frustrated',
  'tired',
  'drained',
  'hopeless',
  'helpless',
  'can\'t cope',
  'breaking down',
  'falling apart',
  'can\'t handle',
  'too much',
  'pressure',
  'panic',
  'desperate',
];

/**
 * Calculate burnout risk score (0-100)
 * Algorithm: 50% negative moods + 30% confusion frequency + 20% stress keywords
 * Bonus: +10-15 for 3+ consecutive negative days
 * Uses last 14 entries only
 */
export const calculateBurnoutScore = (entries) => {
  if (!entries || entries.length === 0) return 0;

  // Use only last 14 entries
  const recentEntries = entries.slice(-14);

  // Calculate individual components
  const negativeScore = calculateNegativeMoodScore(recentEntries); // 50%
  const confusionScore = calculateConfusionScore(recentEntries); // 30%
  const stressScore = calculateStressScore(recentEntries); // 20%

  // Weighted calculation
  let burnoutScore = negativeScore * 0.5 + confusionScore * 0.3 + stressScore * 0.2;

  // Bonus for consecutive negative days
  const consecutiveBonus = checkConsecutiveNegativeDays(recentEntries);
  burnoutScore += consecutiveBonus;

  // Cap at 100
  return Math.min(100, Math.round(burnoutScore));
};

/**
 * Calculate negative mood score (50% weight)
 * Sad and anxious moods increase score
 */
const calculateNegativeMoodScore = (entries) => {
  if (entries.length === 0) return 0;

  const negativeCount = entries.filter((entry) =>
    NEGATIVE_MOODS.includes(entry.mood)
  ).length;

  // Percentage of negative moods * 100
  return (negativeCount / entries.length) * 100;
};

/**
 * Calculate confusion frequency score (30% weight)
 * Frequency of "confused" mood
 */
const calculateConfusionScore = (entries) => {
  if (entries.length === 0) return 0;

  const confusionCount = entries.filter(
    (entry) => entry.mood === 'confused'
  ).length;

  // Percentage of confused moods * 100
  return (confusionCount / entries.length) * 100;
};

/**
 * Calculate stress keyword score (20% weight)
 * Presence of stress keywords in content
 */
const calculateStressScore = (entries) => {
  if (entries.length === 0) return 0;

  let totalStressMatches = 0;

  entries.forEach((entry) => {
    const contentLower = entry.content.toLowerCase();
    STRESS_KEYWORDS.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = contentLower.match(regex);
      totalStressMatches += matches ? matches.length : 0;
    });
  });

  // Normalize: assume 5+ stress mentions across entries = 100%
  const stressFrequency = (totalStressMatches / entries.length) * 20;
  return Math.min(100, stressFrequency);
};

/**
 * Check for 3+ consecutive negative days
 * Returns bonus points (10-15)
 */
const checkConsecutiveNegativeDays = (entries) => {
  if (entries.length < 3) return 0;

  let maxConsecutive = 0;
  let currentConsecutive = 0;

  entries.forEach((entry) => {
    if (NEGATIVE_MOODS.includes(entry.mood)) {
      currentConsecutive++;
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    } else {
      currentConsecutive = 0;
    }
  });

  // Bonus: 3-4 consecutive = +10, 5+ consecutive = +15
  if (maxConsecutive >= 5) return 15;
  if (maxConsecutive >= 3) return 10;
  return 0;
};

/**
 * Get risk level with detailed information
 * Returns: {level, color, emoji, message, action}
 */
export const getRiskLevel = (score) => {
  if (score <= 30) {
    return {
      level: 'Low',
      color: '#4CAF50',
      emoji: '😊',
      message: 'You\'re doing well! Keep maintaining your mental health.',
      action: 'Continue your current routine and self-care practices.',
    };
  }

  if (score <= 50) {
    return {
      level: 'Moderate',
      color: '#FFC107',
      emoji: '😐',
      message: 'You\'re showing some signs of stress. Time to take action.',
      action: 'Try the Mental Reset exercise or talk to someone you trust.',
    };
  }

  if (score <= 75) {
    return {
      level: 'High',
      color: '#FF9800',
      emoji: '😟',
      message: 'Your burnout risk is elevated. Please prioritize self-care.',
      action: 'Use the AI coach for support and consider taking a break.',
    };
  }

  return {
    level: 'Critical',
    color: '#F44336',
    emoji: '😰',
    message: 'Your burnout risk is critical. Seek professional support.',
    action: 'Please reach out to a mental health professional or counselor.',
  };
};

/**
 * Get mood trend over time
 * Returns array of {date, mood} for charting
 */
export const getMoodTrend = (entries) => {
  if (!entries || entries.length === 0) return [];

  return entries
    .slice(-14)
    .map((entry) => ({
      date: entry.date,
      mood: entry.mood,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Analyze mood patterns
 * Returns insights about mood distribution
 */
export const analyzeMoodPatterns = (entries) => {
  if (!entries || entries.length === 0) {
    return {
      dominantMood: null,
      moodDistribution: {},
      negativePercentage: 0,
      confusionPercentage: 0,
    };
  }

  const recentEntries = entries.slice(-14);
  const moodCounts = {};

  recentEntries.forEach((entry) => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });

  const dominantMood = Object.keys(moodCounts).reduce((a, b) =>
    moodCounts[a] > moodCounts[b] ? a : b
  );

  const moodDistribution = {};
  Object.keys(moodCounts).forEach((mood) => {
    moodDistribution[mood] = Math.round(
      (moodCounts[mood] / recentEntries.length) * 100
    );
  });

  const negativeCount = recentEntries.filter((entry) =>
    NEGATIVE_MOODS.includes(entry.mood)
  ).length;

  const confusionCount = recentEntries.filter(
    (entry) => entry.mood === 'confused'
  ).length;

  return {
    dominantMood,
    moodDistribution,
    negativePercentage: Math.round((negativeCount / recentEntries.length) * 100),
    confusionPercentage: Math.round((confusionCount / recentEntries.length) * 100),
  };
};

/**
 * Get stress indicators from recent entries
 * Returns array of detected stress keywords
 */
export const getStressIndicators = (entries) => {
  if (!entries || entries.length === 0) return [];

  const detectedKeywords = new Set();
  const recentEntries = entries.slice(-14);

  recentEntries.forEach((entry) => {
    const contentLower = entry.content.toLowerCase();
    STRESS_KEYWORDS.forEach((keyword) => {
      if (contentLower.includes(keyword)) {
        detectedKeywords.add(keyword);
      }
    });
  });

  return Array.from(detectedKeywords);
};

/**
 * Get comprehensive burnout analysis
 * Returns all metrics needed for dashboard
 */
export const getBurnoutAnalysis = (entries) => {
  const score = calculateBurnoutScore(entries);
  const riskLevel = getRiskLevel(score);
  const patterns = analyzeMoodPatterns(entries);
  const trend = getMoodTrend(entries);
  const stressIndicators = getStressIndicators(entries);

  return {
    score,
    riskLevel,
    patterns,
    trend,
    stressIndicators,
    entriesAnalyzed: Math.min(entries.length, 14),
  };
};
