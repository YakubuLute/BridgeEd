# AI-Powered Diagnostic Tools for Teachers

## Comprehensive User Stories & Acceptance Criteria

> Format: **As a *role***, I want ***capability*** so that ***benefit***.
> Each story includes clear **Acceptance Criteria (AC)**.

---

# EPIC 1 — Authentication, Access & Roles

## US-1.1 Phone OTP Login

**As a Teacher**, I want to log in using my phone number and OTP so that I can securely access the system on my smartphone.

**AC:**

* OTP is sent within 10 seconds.
* OTP expires after configurable duration.
* Invalid OTP shows clear error.
* Successful login creates secure session.

## US-1.2 Email Login

**As a User**, I want to log in using email/password so that I can access the system from multiple devices.

**AC:**

* Password validation rules enforced.
* Forgot password flow works.
* Account lockout after configurable failed attempts.

## US-1.3 Role-Based Access

**As a System Admin**, I want roles (Teacher, School Admin, District Officer, National Admin, Content Specialist, Support) so that data access is restricted appropriately.

**AC:**

* Users only see permitted modules.
* Data visibility is scoped by organization hierarchy.

---

# EPIC 2 — School & Class Management

## US-2.1 Create School

**As a National Admin**, I want to register schools so that teachers can be assigned.

**AC:**

* School name, district, region required.
* Unique school identifier generated.

## US-2.2 Create Class

**As a Teacher**, I want to create/manage classes so that learners are organized by grade.

**AC:**

* Class must belong to a school.
* Grade level required.

---

# EPIC 3 — Learner Management (Longitudinal Profiles)

## US-3.1 Add Learner

**As a Teacher**, I want to add learners individually or via CSV so that I can prepare them for assessment.

**AC:**

* Required fields: Name, Grade, Class.
* System generates Unique Learner ID.

## US-3.2 Learner Profile View

**As a Teacher**, I want to view a learner’s diagnostic history so that I can track progress.

**AC:**

* Shows assessment history timeline.
* Displays mastery trends per skill.

## US-3.3 Transfer Learner

**As a School Admin**, I want learners transferable across schools so that records remain intact.

**AC:**

* Learner ID remains unchanged.
* Previous history preserved.

---

# EPIC 4 — Assessment Administration

## US-4.1 Start Rapid Screener

**As a Teacher**, I want to administer a 5–15 minute screener so that I quickly identify foundational gaps.

**AC:**

* Select class and learners.
* Timer displayed.
* Auto-save enabled.

## US-4.2 Adaptive Assessment

**As a Teacher**, I want adaptive testing so that question difficulty adjusts based on learner responses.

**AC:**

* Difficulty increases after correct answers.
* Difficulty decreases after incorrect answers.

## US-4.3 Offline Mode

**As a Teacher in low connectivity areas**, I want assessments to work offline so that internet is not required during testing.

**AC:**

* Assessment fully functional without internet.
* Data stored locally.
* Sync occurs automatically when online.

---

# EPIC 5 — AI Diagnostics & Scoring

## US-5.1 Automatic Scoring

**As a Teacher**, I want objective questions auto-scored so that I save time.

**AC:**

* Multiple choice and numeric responses auto-scored instantly.

## US-5.2 AI Short Answer Scoring

**As a Teacher**, I want AI-assisted scoring for short answers so that marking time is reduced.

**AC:**

* AI provides score + explanation.
* Teacher can override AI score.

## US-5.3 Skill Mastery Estimation

**As a Teacher**, I want mastery levels per skill so that I know which areas require remediation.

**AC:**

* Mastery shown as percentage or band.
* Confidence level displayed.

## US-5.4 Misconception Detection

**As a Teacher**, I want common error patterns identified so that I understand learner misunderstandings.

**AC:**

* Wrong answer clustering enabled.
* Misconception labels displayed.

---

# EPIC 6 — Remediation & Intervention

## US-6.1 Personalized Remediation Plan

**As a Teacher**, I want suggested interventions per learner so that I can address gaps immediately.

**AC:**

* Recommendations tied to specific skills.
* Includes activity suggestions.

## US-6.2 Grouping Suggestions

**As a Teacher**, I want learners grouped by similar gaps so that I can run small group sessions.

**AC:**

* Auto grouping based on diagnostics.

## US-6.3 Assign Practice Work

**As a Teacher**, I want to assign practice tasks so that learners reinforce weak areas.

**AC:**

* Assignment status tracked.
* Completion recorded.

---

# EPIC 7 — Teacher Dashboard

## US-7.1 Class Overview

**As a Teacher**, I want to see class-level performance summary so that I understand overall gaps.

**AC:**

* Displays heatmap by domain.
* Shows at-risk learners.

## US-7.2 Progress Tracking

**As a Teacher**, I want pre/post comparison so that I can measure improvement.

**AC:**

* Trend line visualizations.

---

# EPIC 8 — School & National Reporting

## US-8.1 School Dashboard

**As a School Admin**, I want aggregated results so that I monitor performance.

**AC:**

* Coverage percentage displayed.
* Domain breakdown available.

## US-8.2 District/National Dashboard

**As a District Officer**, I want cross-school analytics so that I identify priority areas.

**AC:**

* Filter by region, grade, domain.
* Export capability.

---

# EPIC 9 — Content & Curriculum Management

## US-9.1 Item Bank Management

**As a Content Specialist**, I want to create/edit assessment items so that tests align with curriculum.

**AC:**

* Item tagged by skill & difficulty.
* Version control enabled.

## US-9.2 Remediation Content Management

**As a Content Specialist**, I want to manage lesson resources so that teachers access updated materials.

**AC:**

* Upload PDF/low-data content.
* Publish/unpublish control.

---

# EPIC 10 — Security & Compliance

## US-10.1 Data Encryption

**As a System Owner**, I want all data encrypted so that learner privacy is protected.

**AC:**

* TLS for all API calls.
* Encrypted storage for sensitive data.

## US-10.2 Audit Logs

**As an Admin**, I want audit trails so that actions are traceable.

**AC:**

* Logs include timestamp, user, action.

---

# EPIC 11 — Offline Sync & Reliability

## US-11.1 Sync Queue

**As a Teacher**, I want automatic background sync so that I don’t manually upload data.

**AC:**

* Failed sync retries automatically.
* User notified of persistent errors.

## US-11.2 Conflict Resolution

**As a System**, I want conflict resolution rules so that duplicate or mismatched data is handled correctly.

**AC:**

* Last-write-wins or admin review rule configurable.

---

# EPIC 12 — Notifications & Communication

## US-12.1 In-App Notifications

**As a Teacher**, I want alerts for pending tasks so that I don’t miss actions.

**AC:**

* Notifications show unread count.

## US-12.2 Broadcast Messaging

**As a District Officer**, I want to send announcements so that schools receive updates.

**AC:**

* Messages scoped by organization level.

---

# EPIC 13 — AI Governance

## US-13.1 Model Versioning

**As a System Admin**, I want model versions stored so that diagnostics are traceable.

**AC:**

* Diagnostic record includes model version.

## US-13.2 Human-in-the-Loop Review

**As a Teacher**, I want to review AI scoring so that I retain control over final grades.

**AC:**

* Override action logged.

---

# EPIC 14 — Analytics & Monitoring

## US-14.1 Usage Analytics

**As a Program Manager**, I want usage data so that adoption is measurable.

**AC:**

* DAU/WAU metrics available.

## US-14.2 System Health Monitoring

**As an Admin**, I want error logs and performance metrics so that reliability is maintained.

**AC:**

* Dashboard displays uptime and error rates.
