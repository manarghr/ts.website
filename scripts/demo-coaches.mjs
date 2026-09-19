// Demo coach directory
// File: scripts/demo-coaches.mjs
//
// Ten coaches in each of six categories, so every filter on /coaches has a
// populated row rather than one or two cards.
//
// No photographs. Every coach is seeded with an empty `image_url`, and the
// components fall back to /coach-avatar.svg -- a neutral silhouette in the site
// palette. These are invented people; putting a real person's face on an
// invented profile reads as impersonation however harmless the intent.
//
// Ids are explicit rather than generated from names, because programs and
// videos reference them and a rename should not silently orphan that link.

export const coachPool = {
  Strength: [
    { id: "demo_coach_amine", name: "Amine Belkacem", bio: "Powerlifting coach with twelve years under the bar and eight coaching. Works mostly with intermediate lifters who can already perform the lifts and want them heavier without getting hurt." },
    { id: "demo_coach_omar", name: "Omar Fathi", bio: "Strength and conditioning for team-sport athletes. Builds around the reality that most athletes have limited gym time and a season to survive, so the programming prioritises what transfers." },
    { id: "demo_coach_rania", name: "Rania Toumi", bio: "Specialises in getting women past the first strength plateau. Heavy emphasis on technique work before load, and on not letting the scale dictate a training decision." },
    { id: "demo_coach_hakim", name: "Hakim Saidi", bio: "Olympic weightlifting coach. Teaches the snatch and clean and jerk from positions rather than from full lifts, which is slower at first and considerably faster after three months." },
    { id: "demo_coach_yasmine", name: "Yasmine Larbi", bio: "Strongman and odd-object training. Loading a heavy sandbag onto a shoulder carries over to daily life better than most barbell work, and she builds programmes around that idea." },
    { id: "demo_coach_tarek", name: "Tarek Mahmoud", bio: "Coaches lifters returning after injury, in close contact with their physiotherapists. Cautious with load progression and unusually patient about it." },
    { id: "demo_coach_samira", name: "Samira Haddadi", bio: "Beginner-focused barbell coach. Her first month with a new lifter is almost entirely about the setup: grip, brace, foot position, bar path." },
    { id: "demo_coach_bilal", name: "Bilal Chennoufi", bio: "Powerbuilding -- strength work paired with enough hypertrophy volume to actually change how someone looks. Popular with lifters bored of pure five-by-five." },
    { id: "demo_coach_nour", name: "Nour Belhadj", bio: "Works with older lifters, where the priority shifts from maximal load to retaining muscle and bone density. Sessions are shorter and considerably more frequent." },
    { id: "demo_coach_idriss", name: "Idriss Kaddour", bio: "Grip, posterior chain and the unglamorous accessories most programmes skip. Believes most deadlift plateaus are grip plateaus wearing a disguise." },
  ],

  Yoga: [
    { id: "demo_coach_leila", name: "Leila Nouri", bio: "Vinyasa and mobility. Came to yoga through rehabilitation after a running injury, and her teaching keeps that practical edge: sequences built around what a joint needs, not how a pose photographs." },
    { id: "demo_coach_ines", name: "Inès Bouraoui", bio: "Restorative yoga and breathwork for people carrying desk-job shoulders and too little sleep. Deliberately unambitious about intensity, very ambitious about consistency." },
    { id: "demo_coach_mariam", name: "Mariam Zouaoui", bio: "Yoga for athletes. Short sessions designed to sit alongside a heavy training week rather than compete with it for recovery." },
    { id: "demo_coach_sofiane", name: "Sofiane Rahal", bio: "Ashtanga in the traditional sequence, taught slowly. Expects students to spend months on the primary series and says so before they sign up." },
    { id: "demo_coach_hana", name: "Hana Meddeb", bio: "Prenatal and postnatal yoga. Trained specifically in what changes trimester by trimester and confident about what to avoid at each stage." },
    { id: "demo_coach_walid", name: "Walid Amrani", bio: "Yin yoga and long holds. Three-to-five minute positions that people find far harder than a fast flow, for reasons that are mostly mental." },
    { id: "demo_coach_dounia", name: "Dounia Ferhat", bio: "Chair and accessible yoga for limited mobility, including students recovering from surgery or managing chronic pain." },
    { id: "demo_coach_reda", name: "Reda Boukhari", bio: "Power yoga with a strength bias. Arm balances and inversions built up through progressions rather than attempted whole." },
    { id: "demo_coach_amina", name: "Amina Slimani", bio: "Morning practice specialist. Twenty-minute sequences designed to be done before work without a shower, which turns out to be the constraint that matters most." },
    { id: "demo_coach_khalil", name: "Khalil Ouali", bio: "Breath-led practice and meditation. Spends as much time on the exhale as most teachers spend on the whole sequence." },
  ],

  Cardio: [
    { id: "demo_coach_youssef", name: "Youssef Haddad", bio: "Endurance coach and former 1500m runner. Builds plans for a first 10K or a faster half, and is blunt that most amateurs run their easy days far too hard." },
    { id: "demo_coach_selma", name: "Selma Gharbi", bio: "Marathon coaching with a long build. Will not take an athlete who wants to go from nothing to 42km in twelve weeks, and explains why in the first conversation." },
    { id: "demo_coach_anis", name: "Anis Berrada", bio: "Cycling and indoor trainer work. Structures sessions around power zones for riders with a meter and around perceived effort for everyone else." },
    { id: "demo_coach_lina", name: "Lina Trabelsi", bio: "Swimming technique for adults who learned late. Most of the first block is spent on breathing and body position rather than on distance." },
    { id: "demo_coach_fares", name: "Fares Belkhir", bio: "Triathlon coaching across all three disciplines, with a strong bias toward fixing whichever one the athlete avoids." },
    { id: "demo_coach_nesrine", name: "Nesrine Kacem", bio: "Rowing and erg conditioning. Technique-first, because a bad stroke repeated ten thousand times is how rowers acquire back pain." },
    { id: "demo_coach_zied", name: "Zied Mansour", bio: "Interval and HIIT programming for people short on time. Honest that thirty minutes three times a week has limits, and works within them." },
    { id: "demo_coach_rim", name: "Rim Ayadi", bio: "Trail and hill running. Teaches descending, which is where most road runners lose time and occasionally ankles." },
    { id: "demo_coach_mehdi", name: "Mehdi Khelifi", bio: "Return-to-running coaching after injury or a long layoff. Walk-run progressions that feel too easy for the first fortnight by design." },
    { id: "demo_coach_farah", name: "Farah Bensalem", bio: "Sprint mechanics for recreational athletes. Acceleration, posture and the fact that most people have never been taught how to run fast." },
  ],

  CrossFit: [
    { id: "demo_coach_karim", name: "Karim Ziani", bio: "CrossFit L2 coach who spends most of his time teaching people to scale properly. The fastest route to a big engine is two years of not getting injured." },
    { id: "demo_coach_maya", name: "Maya Chaouch", bio: "Gymnastics skills within CrossFit -- muscle-ups, handstand walks, toes-to-bar. Progression-based, with strict standards before anything kipping." },
    { id: "demo_coach_ayoub", name: "Ayoub Nasri", bio: "Competition-focused programming for athletes chasing a local podium, with an honest filter for who actually needs it." },
    { id: "demo_coach_sabrine", name: "Sabrine Dridi", bio: "On-ramp coaching for complete beginners. Six weeks before anyone touches a clock, which some find frustrating and all find useful." },
    { id: "demo_coach_hamza", name: "Hamza Lounis", bio: "Olympic lifting inside CrossFit. Fixing the snatch of people who learned it from a video and have been reinforcing the same error for a year." },
    { id: "demo_coach_aicha", name: "Aicha Benali", bio: "Engine work and pacing strategy. Teaches athletes to finish a workout faster by starting it slower, which nobody believes until they try it." },
    { id: "demo_coach_ilyes", name: "Ilyes Guedri", bio: "Masters athletes, 40 and over. More warm-up, more recovery, and a frank conversation about which movements are worth the risk." },
    { id: "demo_coach_wassim", name: "Wassim Rekik", bio: "Accessory and weak-point programming for people who plateau in the middle of the pack and cannot work out why." },
    { id: "demo_coach_syrine", name: "Syrine Mabrouk", bio: "Mobility and positions for CrossFit athletes. Most missed lifts are ankle and thoracic restrictions rather than strength problems." },
    { id: "demo_coach_nabil", name: "Nabil Saadi", bio: "Home and minimal-equipment CrossFit. One kettlebell, a pull-up bar and a small space, programmed properly." },
  ],

  Boxing: [
    { id: "demo_coach_nadia", name: "Nadia Cherif", bio: "Boxing and conditioning. Teaches footwork before power, which frustrates beginners for about a month and then stops frustrating them entirely." },
    { id: "demo_coach_sami", name: "Sami Brahmi", bio: "Amateur competition coaching, corner work included. Realistic with fighters about where they are in relation to who they want to fight." },
    { id: "demo_coach_ghada", name: "Ghada Ouerghi", bio: "White-collar and fitness boxing. All the technique, none of the sparring, for people who want the training rather than the fight." },
    { id: "demo_coach_riad", name: "Riad Messaoudi", bio: "Defence and head movement. Spends entire sessions on slipping and rolling because most beginners learn only how to throw." },
    { id: "demo_coach_imen", name: "Imen Jaziri", bio: "Women's boxing, beginner to amateur. Strong focus on building the confidence to hold ground under pressure." },
    { id: "demo_coach_adel", name: "Adel Bencheikh", bio: "Muay Thai and kickboxing crossover. Clinch, kicks and the timing differences that catch pure boxers out." },
    { id: "demo_coach_sonia", name: "Sonia Rebai", bio: "Boxing conditioning -- rope work, circuits and round-based energy systems, without the technical coaching." },
    { id: "demo_coach_kamel", name: "Kamel Hammami", bio: "Pad work specialist. Reads a fighter's habits through the pads and adjusts the round in real time." },
    { id: "demo_coach_hiba", name: "Hiba Sassi", bio: "Youth boxing, ages twelve and up. Discipline and fundamentals, with contact introduced slowly and only with consent from everyone involved." },
    { id: "demo_coach_fouad", name: "Fouad Zerrouki", bio: "Southpaw and orthodox switching. Teaches fighters to be genuinely competent in both stances rather than merely capable of standing in one." },
  ],

  Nutrition: [
    { id: "demo_coach_sara", name: "Sara Mansouri", bio: "Registered dietitian working with athletes and with people who want to stop guessing. Builds plans around food you already eat rather than a shopping list you will abandon." },
    { id: "demo_coach_yacine", name: "Yacine Boudiaf", bio: "Sports nutrition for endurance athletes. Carbohydrate periodisation and race-day fuelling, practised in training rather than improvised on the day." },
    { id: "demo_coach_meriem", name: "Meriem Chelbi", bio: "Plant-based nutrition with a focus on hitting protein and iron targets, which is where most new vegetarians quietly fall short." },
    { id: "demo_coach_othmane", name: "Othmane Riahi", bio: "Body-composition coaching through slow, sustainable deficits. Declines clients who want a twelve-week transformation and says why." },
    { id: "demo_coach_lamia", name: "Lamia Ben Youssef", bio: "Nutrition for shift workers and irregular schedules, where standard meal-timing advice simply does not apply." },
    { id: "demo_coach_hatem", name: "Hatem Guesmi", bio: "Weight-gain coaching for people who genuinely struggle to eat enough. Calorie density and meal frequency rather than more willpower." },
    { id: "demo_coach_narjes", name: "Narjes Ammar", bio: "Family and household nutrition -- feeding several people with different goals from one kitchen without cooking three dinners." },
    { id: "demo_coach_zakaria", name: "Zakaria Hamdi", bio: "Supplements, assessed honestly. Spends most consultations explaining which of a client's existing supplements they can stop buying." },
    { id: "demo_coach_ines_n", name: "Inès Nafti", bio: "Relationship with food, restrictive-diet recovery, and rebuilding regular eating. Works alongside therapists where appropriate." },
    { id: "demo_coach_bassem", name: "Bassem Trigui", bio: "Ramadan and fasting-period nutrition. Training timing, hydration and how to maintain muscle across a month of altered eating." },
  ],
};

/** Flat list, category attached, in the order the pool defines. */
export const coaches = Object.entries(coachPool).flatMap(([category, list]) =>
  list.map((coach) => ({ ...coach, category }))
);
