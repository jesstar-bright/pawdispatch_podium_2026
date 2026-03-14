/**
 * PawDispatch AI Marketing Agent — Market Research Foundation
 *
 * This data powers the AI Marketing Agent's strategy recommendations.
 * The agent uses Google Gemini to research and refresh these insights.
 */

export const MARKET_STATS = {
  nationalMarketSize: "$14-15 billion (2024)",
  annualGrowth: "6-7%",
  avgSpendPerDog: "$300-500/year",
  usHouseholdsWithPets: "67% (~87M homes)",
  dogHouseholds: "~65 million",
  mobileGroomingPremium: "20-40% over salon",
  mobileGroomingTrend: "Fastest-growing segment, post-COVID convenience",
};

export const UTAH_MARKET = {
  slcPopulation: "~1.2 million",
  utahCountyPopulation: "~700,000 (fastest-growing in US)",
  medianHouseholdIncome: { slc: "$75-80K", utahCounty: "$80-85K" },
  avgHouseholdSize: 3.5, // vs national 2.5
  petOwnershipRate: "High — family-oriented culture, suburban homes with yards",
  keySuburbs: [
    "Draper", "South Jordan", "Lehi", "Saratoga Springs",
    "Eagle Mountain", "Highland", "Daybreak", "Traverse Mountain",
    "Sugar House", "Murray", "Millcreek", "Cottonwood Heights"
  ],
  culturalNotes: "Large LDS population — strong family values, community trust networks, word-of-mouth influence",
};

export interface CustomerSegment {
  name: string;
  percentage: number;
  demographics: string;
  psychographics: string[];
  valuesRanked: string[];
  painPoints: string[];
  designRecommendations: {
    leadWith: string;
    show: string;
    cta: string;
    mustHaveFeatures: string[];
  };
}

export const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  {
    name: "Busy Families",
    percentage: 45,
    demographics: "Ages 30-50, married, 2-4 kids, $75K-$150K, suburban homes in South Jordan/Draper/Lehi/Saratoga Springs/Eagle Mountain/Highland",
    psychographics: [
      "Time-starved: juggling kids activities, work, church callings",
      "Pet is beloved family member but grooming is logistical headache",
      "Discover services through neighborhood Facebook groups, Nextdoor, word-of-mouth",
      "Value reliability and routine — want recurring schedule",
    ],
    valuesRanked: ["Convenience", "Trust/Safety", "Consistency", "Reasonable pricing"],
    painPoints: [
      "No time to drive to groomer and wait",
      "Dog gets anxious at salon around other dogs",
      "Forgot to book, now booked out 3 weeks",
      "Don't know if groomer is good with animals",
    ],
    designRecommendations: {
      leadWith: "Easy online booking + recurring appointment scheduling",
      show: "Family home with van in driveway; happy kid greeting freshly groomed dog",
      cta: "Book Your First Visit",
      mustHaveFeatures: ["Text reminders", "Recurring scheduling", "Multi-pet booking"],
    },
  },
  {
    name: "Pet-Obsessed Professionals",
    percentage: 25,
    demographics: "Ages 25-40, single or DINK, $60K-$120K, SLC proper/Sugar House/Murray/Millcreek",
    psychographics: [
      "Dog IS their baby — follow dog accounts on Instagram",
      "Already pay for premium food, training, daycare",
      "Research heavily: Google reviews, Instagram, r/SaltLakeCity",
      "Want breed-specific expertise and quality/natural products",
      "Will post before/after photos and tag the groomer",
    ],
    valuesRanked: ["Quality of grooming", "Groomer skill/credentials", "Convenience", "Social proof"],
    painPoints: [
      "Last groomer butchered the haircut",
      "Harsh products irritated dog's skin",
      "Want someone who understands the breed",
      "Want to see examples before booking",
    ],
    designRecommendations: {
      leadWith: "Before/after photo gallery, groomer credentials",
      show: "Breed-specific grooming expertise, product quality",
      cta: "See Our Work",
      mustHaveFeatures: ["Instagram integration", "Breed-specific service descriptions"],
    },
  },
  {
    name: "Senior Pet Parents",
    percentage: 15,
    demographics: "Ages 55+, retired or semi-retired, moderate income, may have mobility limitations",
    psychographics: [
      "Pet is daily companion — deep emotional bond",
      "Cannot easily transport 50-lb dog to salon",
      "Value personal relationships — want to chat with groomer",
      "Less price-sensitive because pet is priority",
      "Discover via referrals from vets, friends, family",
    ],
    valuesRanked: ["Trust/personal relationship", "Gentle handling", "Door-to-door convenience", "Communication"],
    painPoints: [
      "Can't lift dog into car anymore",
      "Dog is old and gets stressed at salons",
      "Want someone gentle and patient",
    ],
    designRecommendations: {
      leadWith: "Meet Your Groomer trust-building content",
      show: "Gentle handling, patient approach, groomer personality",
      cta: "Call or Book Online",
      mustHaveFeatures: ["Phone number prominently displayed", "Large readable text"],
    },
  },
  {
    name: "Multi-Pet Households",
    percentage: 15,
    demographics: "Any age, often families, 3+ pets, common in Utah suburban homes",
    psychographics: [
      "Logistics of grooming multiple pets at salon is a nightmare",
      "Want efficiency — all pets done in one visit",
    ],
    valuesRanked: ["Multi-pet discounts/packages", "One-stop convenience", "Efficiency"],
    painPoints: [
      "Multiple trips to salon for each pet",
      "Coordinating schedules for 3+ animals",
    ],
    designRecommendations: {
      leadWith: "Multi-pet pricing/packages on pricing page",
      show: "Multiple pets groomed in one visit",
      cta: "Book for Multiple Pets",
      mustHaveFeatures: ["Package pricing", "Multi-pet booking form"],
    },
  },
];

export const MESSAGING_GUIDELINES = {
  emotionalTriggers: [
    { trigger: "Guilt relief", example: "Your dog deserves regular grooming, and you deserve to not stress about it." },
    { trigger: "Anxiety reduction", example: "Your pup stays calm in familiar surroundings — no scary salon, no cages, no waiting." },
    { trigger: "Time liberation", example: "We come to you. Spend your Saturday at the park, not at the groomer." },
    { trigger: "Pride/social sharing", example: "They'll look so good, you'll want to show everyone." },
  ],
  headlinesThatWork: [
    "Professional Grooming, Right in Your Driveway",
    "Happy Pups. Stress-Free Parents. Spotless Results.",
    "We Come to You — Because Your Dog (and Your Schedule) Deserve Better",
    "One Dog. One Groomer. Zero Stress.",
    "Mobile Pet Grooming, At Your Door",
  ],
  headlinesToAvoid: [
    "Anything overly cutesy (Pawsitively Purrfect!)",
    "Price-leading messages (Cheapest Mobile Grooming!)",
    "Generic (Quality Pet Grooming Services)",
  ],
  trustBuildingCopy: [
    "Licensed, insured, and background-checked",
    "Certified professional groomers with X years of experience",
    "X five-star reviews from families in [neighborhood name]",
    "We use gentle, pet-safe, all-natural products",
  ],
  utahSpecificAngles: [
    "Proudly serving families from Draper to Eagle Mountain",
    "One less errand for busy families",
    "Post-ski-season mud? We've got your pup covered",
    "Summer shedding under control",
    "We park right in your driveway — your dog never leaves your property",
  ],
  tone: "Warm, professional, confident. Not cutesy, not corporate.",
};

export const SEO_TARGETS = {
  highIntentKeywords: [
    "mobile dog grooming near me",
    "at-home grooming for anxious dogs in Utah County",
    "mobile pet grooming Salt Lake City",
    "dog grooming Draper UT",
    "mobile grooming Lehi",
    "in-home dog grooming South Jordan",
    "mobile pet grooming Utah County",
    "dog grooming at your door SLC",
  ],
  faqTopics: [
    "Is my dog safe with a mobile groomer?",
    "How does mobile grooming work?",
    "What if my dog is aggressive or anxious?",
    "Where does the grooming van park?",
    "How long does a mobile grooming appointment take?",
    "Do you groom cats too?",
    "What products do you use?",
    "What areas do you serve in Utah?",
  ],
};

export const COMPETITIVE_LANDSCAPE = {
  nationalBrands: ["Aussie Pet Mobile", "Scenthound", "Barkbus"],
  whatTheyDoWell: [
    "Clean, modern design with warm photography",
    "Lead with convenience messaging + trust signals",
    "Strong mobile-first design",
    "Easy online booking with no phone call required",
  ],
  differentiators: [
    "AI-powered instant pricing from photo (unique)",
    "Autonomous agent system managing entire business",
    "One-on-one attention, no cages, stress-free",
    "Local to SLC/Utah County — community presence",
  ],
};
