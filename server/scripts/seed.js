const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Guideline = require('../models/Guideline');

// Sample data
const sampleUsers = [
  {
    email: 'admin@guidelinesync.com',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    trustName: 'System',
  },
  {
    email: 'clinician@stgeorges.nhs.uk',
    password: 'clinician123',
    name: 'Dr. Sarah Johnson',
    role: 'clinician',
    trustName: "St George's Hospital",
  },
];

const sampleGuidelines = [
  {
    trustName: "St George's Hospital",
    title: 'Acute Myocardial Infarction Management',
    description: 'Comprehensive guidelines for the management of acute myocardial infarction in the emergency department and cardiac care unit.',
    medicalSpeciality: 'cardiology',
    content: `# Acute Myocardial Infarction Management

## Initial Assessment
- Obtain 12-lead ECG within 10 minutes of arrival
- Check vital signs and oxygen saturation
- Assess for contraindications to thrombolysis

## Treatment Protocol
1. **Immediate Actions**
   - Aspirin 300mg chewed
   - Clopidogrel 600mg loading dose
   - Atorvastatin 80mg

2. **Pain Management**
   - Morphine 2.5-5mg IV PRN
   - GTN sublingual if systolic BP >90mmHg

3. **Reperfusion Strategy**
   - Primary PCI preferred if available within 120 minutes
   - Thrombolysis if PCI not available within timeframe

## Monitoring
- Continuous cardiac monitoring
- Serial troponin levels
- Daily ECGs for first 3 days

## Discharge Planning
- Dual antiplatelet therapy for 12 months
- ACE inhibitor unless contraindicated
- Beta-blocker unless contraindicated
- Cardiac rehabilitation referral`,
    fileType: 'text',
    tags: ['emergency', 'cardiology', 'acute care', 'STEMI', 'NSTEMI'],
    isActive: true,
  },
  {
    trustName: 'Royal London Hospital',
    title: 'Pediatric Asthma Management',
    description: 'Evidence-based guidelines for the assessment and management of acute asthma in children.',
    medicalSpeciality: 'pediatrics',
    content: `# Pediatric Asthma Management

## Severity Assessment
### Mild Attack
- Able to talk in sentences
- Pulse <100 (>5 years) or <120 (2-5 years)
- Respiratory rate normal
- Peak flow >75% predicted

### Moderate Attack
- Able to talk in phrases
- Pulse 100-120 (>5 years) or 120-140 (2-5 years)
- Respiratory rate increased
- Peak flow 50-75% predicted

### Severe Attack
- Unable to complete sentences
- Pulse >120 (>5 years) or >140 (2-5 years)
- Respiratory rate significantly increased
- Peak flow <50% predicted

## Treatment
### First Line
- Salbutamol inhaler 2-10 puffs via spacer
- Repeat every 20 minutes for first hour
- Prednisolone 1-2mg/kg (max 40mg) for 3 days

### Severe Cases
- Nebulized salbutamol 2.5-5mg
- Nebulized ipratropium 250mcg
- Consider IV magnesium sulfate

## Discharge Criteria
- Sustained improvement for 4 hours
- Peak flow >75% predicted
- Adequate home medication supply
- Follow-up arranged within 48 hours`,
    fileType: 'text',
    tags: ['pediatrics', 'respiratory', 'emergency', 'asthma'],
    isActive: true,
  },
  {
    trustName: 'Manchester Royal Infirmary',
    title: 'Stroke Thrombolysis Protocol',
    description: 'Time-critical protocol for acute stroke thrombolysis assessment and treatment.',
    medicalSpeciality: 'neurology',
    content: `# Stroke Thrombolysis Protocol

## Time Targets
- Door to CT: 25 minutes
- Door to needle: 60 minutes
- Onset to treatment: <4.5 hours

## Inclusion Criteria
- Clinical diagnosis of acute stroke
- Onset <4.5 hours (or wake-up stroke with DWI-FLAIR mismatch)
- Age ≥18 years
- NIHSS score ≥4 and ≤25

## Exclusion Criteria
### Absolute
- Intracranial hemorrhage on CT
- Recent major surgery (<14 days)
- Active bleeding
- Platelet count <100,000

### Relative
- Minor stroke symptoms (NIHSS <4)
- Rapidly improving symptoms
- Seizure at stroke onset
- Recent MI (<3 months)

## Treatment Protocol
1. **Pre-treatment**
   - Weight-based dosing: 0.9mg/kg (max 90mg)
   - 10% as bolus over 1 minute
   - Remainder over 60 minutes

2. **Monitoring**
   - Neurological observations every 15 minutes for 2 hours
   - Blood pressure monitoring
   - No anticoagulants for 24 hours

3. **Post-treatment**
   - CT head at 24 hours
   - Swallow assessment
   - Early mobilization`,
    fileType: 'text',
    tags: ['neurology', 'emergency', 'stroke', 'thrombolysis', 'time-critical'],
    isActive: true,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/guidelinesync');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Guideline.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.email}`);
    }

    // Find admin user for guideline creation
    const adminUser = createdUsers.find(user => user.role === 'admin');

    // Create guidelines
    for (const guidelineData of sampleGuidelines) {
      const guideline = new Guideline({
        ...guidelineData,
        createdBy: adminUser._id,
      });
      await guideline.save();
      console.log(`Created guideline: ${guideline.title}`);
    }

    console.log('\\n✅ Database seeded successfully!');
    console.log('\\n📋 Sample Users:');
    console.log('Admin: admin@guidelinesync.com / admin123');
    console.log('Clinician: clinician@stgeorges.nhs.uk / clinician123');
    
    console.log('\\n📚 Sample Guidelines:');
    sampleGuidelines.forEach(g => console.log(`- ${g.title} (${g.trustName})`));

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\\n🔌 Disconnected from MongoDB');
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

