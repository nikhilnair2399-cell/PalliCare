# PalliCare Attribution Notice

**Project:** PalliCare -- Palliative Care & Pain Management mHealth Platform
**Institution:** All India Institute of Medical Sciences (AIIMS), Bhopal, India
**Version:** 0.1.0
**Last Updated:** 2026-03-08

This document provides a complete inventory of all content sources, clinical instruments, data references, open-source libraries, and design assets used in the PalliCare application. All materials are used in accordance with their respective licenses, fair use provisions, or institutional agreements.

---

## Table of Contents

1. [Clinical Guidelines & Protocols](#1-clinical-guidelines--protocols)
2. [Assessment Instruments](#2-assessment-instruments)
3. [Medication References](#3-medication-references)
4. [Breathing & Wellness Content](#4-breathing--wellness-content)
5. [Disease Information](#5-disease-information)
6. [Legal & Regulatory References](#6-legal--regulatory-references)
7. [Open-Source Libraries -- Mobile App (Flutter)](#7-open-source-libraries--mobile-app-flutter)
8. [Open-Source Libraries -- API Backend (NestJS)](#8-open-source-libraries--api-backend-nestjs)
9. [Open-Source Libraries -- Clinician Dashboard (Next.js)](#9-open-source-libraries--clinician-dashboard-nextjs)
10. [Fonts & Design Assets](#10-fonts--design-assets)

---

## 1. Clinical Guidelines & Protocols

| Source | Authors / Organization | Year | License / Usage | Where Used in App |
|---|---|---|---|---|
| WHO Guidelines for the Pharmacological and Radiotherapeutic Management of Cancer Pain in Adults and Adolescents | World Health Organization | 2018 | CC BY-NC-SA 3.0 IGO | Pain management protocols, medication dosing guidelines, educational content |
| WHO Palliative Care Fact Sheet (updated) | World Health Organization | 2020 | Public domain (WHO) | Disease information module, patient education screens |
| IAHPC Essential List of Medicines for Palliative Care | International Association for Hospice and Palliative Care | 2021 | Open access for clinical use | Medication reference database, formulary module |
| IAPC Guidelines on Palliative Care | Indian Association of Palliative Care | 2014, updated 2019 | Used with attribution per IAPC policy | Clinical protocols, symptom management algorithms, caregiver education |
| AIIMS Bhopal Palliative Care Unit Protocols | AIIMS Bhopal, Department of Palliative Medicine | 2023--2025 | Institutional -- internal use authorized | Clinical workflows, alert thresholds, escalation pathways, default assessment schedules |
| National Programme for Palliative Care (NPPC) India | Ministry of Health and Family Welfare, Government of India | 2012, updated 2021 | Government of India -- open access | Service delivery model, referral framework, policy compliance documentation |
| National Cancer Control Programme (NCCP) Guidelines | Directorate General of Health Services, India | 2019 | Government of India -- open access | Cancer pain management pathways, patient education |

---

## 2. Assessment Instruments

| Instrument | Full Name | Authors / Organization | Year | Citation | License / Usage | Where Used in App |
|---|---|---|---|---|---|---|
| ESAS-r | Edmonton Symptom Assessment System -- Revised | Bruera E, Kuehn N, Miller MJ, Selmser P, Macmillan K; revised by Watanabe SM, Nekolaichuk C, Beaumont C, Johnson L, Myers J, Strasser F | 1991; revised 2011 | Watanabe SM et al. "A multicenter study comparing two numerical versions of the ESAS-r." *J Pain Symptom Manage.* 2011;41(2):456-468 | Public domain for clinical use. Originally developed at Cross Cancer Institute, Edmonton, Alberta, Canada | Symptom logging feature -- patients rate 9 symptoms (pain, tiredness, nausea, depression, anxiety, drowsiness, appetite, wellbeing, shortness of breath) on 0-10 scale |
| NRS | Numeric Rating Scale | Public domain; widely attributed to Downie WW et al. | 1978 | Downie WW et al. "Studies with pain rating scales." *Ann Rheum Dis.* 1978;37(4):378-381 | Public domain | Pain assessment -- standard 0-10 pain intensity scale used in daily symptom logs and clinical assessments |
| PAINAD | Pain Assessment in Advanced Dementia | Warden V, Hurley AC, Volicer L | 2003 | Warden V, Hurley AC, Volicer L. "Development and psychometric evaluation of the Pain Assessment in Advanced Dementia (PAINAD) scale." *J Am Med Dir Assoc.* 2003;4(1):9-15 | Used under fair use for clinical assessment purposes. Non-commercial clinical application | Caregiver-administered pain assessment for patients with cognitive impairment -- 5-item observational scale (breathing, vocalization, facial expression, body language, consolability) |
| SUS | System Usability Scale | Brooke J | 1996 | Brooke J. "SUS: A 'quick and dirty' usability scale." In: Jordan PW et al., eds. *Usability Evaluation in Industry.* Taylor & Francis; 1996:189-194 | Public domain -- freely available for use without permission | App usability evaluation -- 10-item questionnaire administered to patients and caregivers during pilot study |
| PPS | Palliative Performance Scale | Victoria Hospice Society | 1996, v2 2001 | Anderson F, Downing GM, Hill J, Casorso L, Lerch N. "Palliative Performance Scale (PPSv2): a new tool." *J Palliat Care.* 2001;12(1):5-11 | Used with attribution to Victoria Hospice Society, Victoria, BC, Canada. Free for clinical use with acknowledgment | Functional status tracking -- clinician-assessed 11-point scale measuring ambulation, activity, self-care, intake, consciousness |
| AKPS | Australia-modified Karnofsky Performance Status | Abernethy AP, Shelby-James T, Fazekas BS, Woods D, Currow DC | 2005 | Abernethy AP et al. "The Australia-modified Karnofsky Performance Status (AKPS) scale." *BMC Palliat Care.* 2005;4:7 | Licensed for clinical use -- open access publication (BioMed Central, CC BY 2.0) | Performance status tracking -- alternative functional scale for clinician assessment, 0-100 scale |

---

## 3. Medication References

| Source | Authors / Organization | Year | License / Usage | Where Used in App |
|---|---|---|---|---|
| National List of Essential Medicines (NLEM) India 2022 | Ministry of Health and Family Welfare, Government of India | 2022 | Government of India -- public document | Medication database -- drug names, categories, availability classifications for Indian formulary |
| WHO Model List of Essential Medicines (23rd List) | World Health Organization | 2023 | CC BY-NC-SA 3.0 IGO | Medication reference -- international essential medicines cross-reference, palliative care section |
| CDSCO Drug Monographs | Central Drugs Standard Control Organisation, Government of India | Ongoing | Government of India -- public regulatory documents | Drug information module -- approved indications, dosage forms, contraindications for Indian market |
| Equianalgesic Opioid Conversion Tables (MEDD/MOMED) | Pereira J, Lawlor P, Vigano A, Dorgan M, Bruera E | 2001 | Pereira J et al. "Equianalgesic dose ratios for opioids: a critical review and proposals for long-term dosing." *J Pain Symptom Manage.* 2001;22(2):672-687. Academic citation, clinical application | MEDD calculator -- morphine equivalent daily dose conversion factors for opioid rotation and safety threshold alerts |
| Palliative Care Formulary (PCF) -- Reference | Twycross R, Wilcock A, Howard P | 2017 (7th ed.) | Referenced, not reproduced. Institutional library access | Clinical decision support -- cross-referenced for off-label indications and symptom-specific prescribing |

---

## 4. Breathing & Wellness Content

| Technique / Source | Authors / Organization | Year | License / Usage | Where Used in App |
|---|---|---|---|---|
| Pranayama Breathing Techniques | Adapted from Iyengar BKS, *Light on Pranayama.* Crossroad Publishing, 1981; and clinical yoga therapy guidelines (IAYT) | 1981, adapted 2024 | Traditional practices -- public domain concept. Adapted with clinical modifications for palliative care | Breathing exercises module -- Anulom Vilom (alternate nostril), Bhramari (humming bee), Ujjayi (ocean breath). Adapted for seated/supine positions |
| 4-7-8 Breathing Technique | Weil A (Dr. Andrew Weil) | Popularized ~2010 | Public domain description -- widely published relaxation technique | Guided breathing exercise -- 4-second inhale, 7-second hold, 8-second exhale cycle with animated visual guide |
| Box Breathing (Tactical Breathing) | US Navy SEALs; widely published by Divine M, *Unbeatable Mind* | ~2010 | Public domain -- widely published technique | Guided breathing exercise -- equal 4-second inhale, hold, exhale, hold cycle with square animation |
| Progressive Muscle Relaxation (PMR) | Jacobson E, *Progressive Relaxation.* University of Chicago Press, 1938; adapted by Bernstein DA, Borkovec TD, 1973 | 1938, adapted 2024 | Public domain (original 1938). Adapted for palliative care context -- bed-bound modifications | Relaxation module -- guided body-region tension-release sequence, modified for limited mobility patients |
| Guided Imagery for Pain Management | Based on Naparstek B, *Staying Well with Guided Imagery,* 1994; and Kwekkeboom KL et al., *J Pain Symptom Manage,* 2010 | Adapted 2024 | Original guided scripts created for PalliCare. Concepts from public domain therapeutic practices | Wellness exercises -- audio-guided visualization scripts for pain distraction and anxiety reduction |

---

## 5. Disease Information

| Source | Authors / Organization | Year | License / Usage | Where Used in App |
|---|---|---|---|---|
| Oxford Textbook of Palliative Medicine, 6th Edition | Cherny NI, Fallon MT, Kaasa S, Portenoy RK, Currow DC (eds.) | 2021 | Referenced, not reproduced -- institutional access. Original content written for PalliCare | Disease information module -- clinical content structure and topic coverage informed by OTPMed chapter organization |
| WHO Fact Sheets (Palliative Care, Cancer Pain, NCDs) | World Health Organization | 2020--2024 | CC BY-NC-SA 3.0 IGO | Patient education screens -- adapted statistics, disease prevalence, general information |
| IAPC Position Papers (Opioid Availability in India, Palliative Care Integration) | Indian Association of Palliative Care | 2016--2023 | Open access -- academic publications | Medication education, opioid safety information, caregiver education on opioid myths |
| GLOBOCAN / IARC Cancer Statistics | International Agency for Research on Cancer, WHO | 2022 | Open access data | Epidemiological context in disease information screens |
| National Health Portal India -- Palliative Care Content | Ministry of Health and Family Welfare, Government of India | 2019--2024 | Government of India -- open access | Hindi-language disease information adaptation, patient education |

---

## 6. Legal & Regulatory References

| Source | Issuing Authority | Year | Usage | Where Used in App |
|---|---|---|---|---|
| Digital Personal Data Protection Act, 2023 (DPDPA) | Parliament of India, Government of India | 2023 | Regulatory compliance -- governs all personal data processing | Consent framework, data retention policies, erasure workflows, privacy policy, DPO designation |
| Information Technology Act, 2000 (IT Act) and IT (Reasonable Security Practices) Rules, 2011 | Ministry of Electronics and IT, Government of India | 2000, amended 2008; Rules 2011 | Regulatory compliance -- security standards | Security architecture, encryption standards, data handling procedures |
| ICMR National Ethical Guidelines for Biomedical and Health Research Involving Human Participants | Indian Council of Medical Research | 2017 | Research ethics compliance | Research consent module, anonymization pipeline, ethics committee documentation |
| Clinical Establishments (Registration and Regulation) Act, 2010 | Government of India | 2010 | Clinical data retention requirements | Data retention policy -- 3-year clinical data retention minimum |
| Narcotic Drugs and Psychotropic Substances Act, 1985 (NDPS Act) | Government of India | 1985, amended 2014 | Opioid prescribing regulation compliance | Opioid medication tracking, MEDD alerts, prescription verification workflows |
| Drugs and Cosmetics Act, 1940 and Rules, 1945 | CDSCO, Government of India | 1940, ongoing amendments | Drug information and scheduling compliance | Medication database -- schedule classifications (H, H1, X) |

---

## 7. Open-Source Libraries -- Mobile App (Flutter)

| Library | Version | License | Purpose in PalliCare |
|---|---|---|---|
| Flutter SDK | >=3.3.0 | BSD 3-Clause | Cross-platform mobile framework |
| flutter_riverpod | ^2.5.1 | MIT | State management |
| riverpod_annotation | ^2.3.5 | MIT | Riverpod code generation annotations |
| freezed_annotation | ^2.4.1 | MIT | Immutable data class annotations |
| json_annotation | ^4.9.0 | BSD 3-Clause | JSON serialization annotations |
| go_router | ^14.6.2 | BSD 3-Clause | Declarative routing |
| dio | ^5.4.3 | MIT | HTTP client for API communication |
| connectivity_plus | ^6.0.5 | BSD 3-Clause | Network connectivity detection (offline-first) |
| hive | ^2.2.3 | Apache 2.0 | Lightweight local NoSQL database (offline storage) |
| hive_flutter | ^1.1.0 | Apache 2.0 | Flutter adapter for Hive |
| flutter_secure_storage | ^9.2.2 | BSD 3-Clause | Encrypted storage for auth tokens and sensitive data |
| google_fonts | ^6.2.1 | Apache 2.0 | Dynamic font loading (Inter, Noto Sans Devanagari) |
| flutter_svg | ^2.0.10+1 | MIT | SVG rendering for icons and illustrations |
| cached_network_image | ^3.3.1 | MIT | Image caching for educational content |
| shimmer | ^3.0.0 | BSD 2-Clause | Loading placeholder animations |
| fl_chart | ^0.69.0 | MIT | Symptom trend charts and analytics visualizations |
| intl | ^0.20.2 | BSD 3-Clause | Internationalization (Hindi/English) |
| speech_to_text | ^6.6.0 | MIT | Voice input for symptom logging |
| uuid | ^4.3.3 | MIT | UUID generation for offline-created records |
| path_provider | ^2.1.2 | BSD 3-Clause | File system path resolution |
| url_launcher | ^6.2.4 | BSD 3-Clause | External URL/phone launching (helpline numbers) |
| share_plus | ^7.2.2 | BSD 3-Clause | System share sheet for data export |
| firebase_core | ^3.0.0 | BSD 3-Clause | Firebase initialization |
| firebase_messaging | ^15.0.0 | BSD 3-Clause | Push notifications (FCM) |
| flutter_local_notifications | ^17.2.3 | BSD 3-Clause | Local notification scheduling |
| freezed | ^2.5.2 | MIT | Code generation for immutable classes (dev) |
| json_serializable | ^6.8.0 | BSD 3-Clause | JSON serialization code generation (dev) |
| riverpod_generator | ^2.4.3 | MIT | Riverpod provider code generation (dev) |
| build_runner | ^2.4.9 | BSD 3-Clause | Dart code generation runner (dev) |
| hive_generator | ^2.0.1 | Apache 2.0 | Hive TypeAdapter code generation (dev) |
| mocktail | ^1.0.3 | MIT | Test mocking framework (dev) |
| flutter_lints | ^4.0.0 | BSD 3-Clause | Linting rules (dev) |

---

## 8. Open-Source Libraries -- API Backend (NestJS)

| Library | Version | License | Purpose in PalliCare |
|---|---|---|---|
| @nestjs/common | ^10.4.0 | MIT | NestJS core common utilities |
| @nestjs/core | ^10.4.0 | MIT | NestJS application core |
| @nestjs/config | ^3.2.0 | MIT | Configuration management |
| @nestjs/jwt | ^10.2.0 | MIT | JWT token generation and validation |
| @nestjs/passport | ^10.0.3 | MIT | Authentication middleware |
| @nestjs/platform-express | ^10.4.0 | MIT | Express HTTP adapter |
| @nestjs/platform-socket.io | ^10.4.22 | MIT | Socket.IO WebSocket adapter |
| @nestjs/swagger | ^7.3.0 | MIT | OpenAPI/Swagger documentation |
| @nestjs/terminus | ^10.2.0 | MIT | Health check endpoints |
| @nestjs/throttler | ^5.2.0 | MIT | Rate limiting |
| @nestjs/websockets | ^10.4.22 | MIT | WebSocket gateway support |
| @aws-sdk/client-s3 | ^3.993.0 | Apache 2.0 | AWS S3 client for file storage |
| @aws-sdk/s3-request-presigner | ^3.993.0 | Apache 2.0 | S3 presigned URL generation |
| bcryptjs | ^2.4.3 | MIT | Password hashing |
| class-transformer | ^0.5.1 | MIT | Object transformation and serialization |
| class-validator | ^0.14.1 | MIT | DTO validation decorators |
| helmet | ^7.1.0 | MIT | HTTP security headers |
| ioredis | ^5.3.2 | MIT | Redis client for caching and sessions |
| passport | ^0.7.0 | MIT | Authentication framework |
| passport-jwt | ^4.0.1 | MIT | JWT authentication strategy |
| pg | ^8.11.5 | MIT | PostgreSQL client driver |
| reflect-metadata | ^0.2.1 | Apache 2.0 | Metadata reflection (decorators) |
| rxjs | ^7.8.1 | Apache 2.0 | Reactive programming (NestJS internals) |
| socket.io | ^4.8.3 | MIT | Real-time WebSocket communication |
| uuid | ^9.0.1 | MIT | UUID generation |
| typescript | ^5.3.3 | Apache 2.0 | TypeScript compiler (dev) |
| jest | ^29.7.0 | MIT | Testing framework (dev) |
| ts-jest | ^29.1.2 | MIT | TypeScript Jest transformer (dev) |

---

## 9. Open-Source Libraries -- Clinician Dashboard (Next.js)

| Library | Version | License | Purpose in PalliCare |
|---|---|---|---|
| next | ^15.2.0 | MIT | React framework for clinician dashboard |
| react | ^19.0.0 | MIT | UI component library |
| react-dom | ^19.0.0 | MIT | React DOM renderer |
| @headlessui/react | ^2.2.1 | MIT | Accessible UI primitives (modals, dropdowns, tabs) |
| @tanstack/react-query | ^5.65.0 | MIT | Server state management and caching |
| axios | ^1.8.1 | MIT | HTTP client for API calls |
| clsx | ^2.1.1 | MIT | Conditional CSS class utility |
| date-fns | ^4.1.0 | MIT | Date manipulation and formatting |
| lucide-react | ^0.476.0 | ISC | Icon library |
| next-auth | ^5.0.0-beta.25 | ISC | Authentication (clinician login) |
| recharts | ^2.15.1 | MIT | Chart library (symptom trends, analytics) |
| tailwind-merge | ^3.0.1 | MIT | Tailwind CSS class merging |
| zod | ^3.24.2 | MIT | Schema validation |
| zustand | ^5.0.3 | MIT | Client-side state management |
| tailwindcss | ^4.0.6 | MIT | Utility-first CSS framework (dev) |
| eslint | ^9.20.0 | MIT | Code linting (dev) |
| vitest | ^3.2.4 | MIT | Testing framework (dev) |

---

## 10. Fonts & Design Assets

| Asset | Source | License | Where Used |
|---|---|---|---|
| Inter | Google Fonts (Rasmus Andersson) | SIL Open Font License 1.1 | Primary UI typeface -- all Latin-script text throughout mobile app and dashboard |
| Noto Sans Devanagari | Google Fonts (Google) | SIL Open Font License 1.1 | Hindi-language text rendering in mobile app |
| Georgia | System font (Matthew Carter, Microsoft) | Bundled with OS -- proprietary system font | Dashboard body text (fallback serif) |
| Lucide Icons | Lucide Contributors | ISC License | Clinician dashboard -- all UI icons |
| Material Design Icons | Google | Apache 2.0 | Mobile app -- Flutter Material icons throughout UI |
| Flutter Material Components | Google | BSD 3-Clause | Mobile app -- buttons, cards, dialogs, navigation |

---

## Notes on Usage and Compliance

1. **No content is reproduced verbatim** from copyrighted textbooks. All educational content in PalliCare is original, informed by referenced sources.
2. **Clinical instruments** (ESAS-r, NRS, SUS) used under their respective public domain or open-access terms. PAINAD is used under fair use for non-commercial clinical assessment.
3. **Government documents** from India (NLEM, DPDPA, NDPS Act, etc.) are public documents freely available for reference and compliance.
4. **WHO materials** are used under CC BY-NC-SA 3.0 IGO where applicable.
5. **Open-source licenses** are preserved in their original form in the `node_modules/` and Flutter package cache directories. Full license texts are available in each package's LICENSE file.
6. **Institutional content** from AIIMS Bhopal is used under internal institutional authorization for the PalliCare project.

---

## Contact

For attribution questions or to report missing attributions, contact:

- **Project Lead:** PalliCare Development Team, AIIMS Bhopal
- **Email:** pallicare@aiimsbhopal.edu.in
- **Institution:** All India Institute of Medical Sciences, Bhopal, Madhya Pradesh 462020, India
