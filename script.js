const app = document.getElementById("app");
const demoAccounts = [
  {
    email: "committee@cmu.edu.ph",
    password: "committee123",
    role: "Committee Head",
    name: "Committee Head",
  },
  {
    email: "president@cmu.edu.ph",
    password: "president123",
    role: "SSC President",
    name: "SSC President",
  },
  {
    email: "applicant@cmu.edu.ph",
    password: "applicant123",
    role: "Applicant",
    name: "Student Applicant",
  },
];

const state = {
  screen: "login",
  role: "",
  currentUser: null,
  showPassword: false,
  applicantView: "status",
  evaluatorView: "dashboard",
  selectedApplicantId: null,
  auditFilter: "All",
};

const documentLabels = {
  cor: "Validated Certificate of Registration (COR)",
  indigency: "Certificate of Indigency / ITR",
  employmentProof: "Proof of Employment or Income-Generating Activity",
  academicRecord: "Academic Record",
};

const auditFilters = [
  "All",
  "Application submitted",
  "AI pre-screen completed",
  "Profile reviewed",
  "Notes added",
  "Final decision saved",
  "Override recorded",
];

const applicants = [
  {
    id: "WSFA-2026-001",
    name: "Maria Santos",
    email: "maria.santos@cmu.edu.ph",
    college: "College of Information Sciences and Computing",
    course: "BS Information Technology",
    contactNumber: "0917-234-5678",
    employerParentContact: "09XX-XXX-XXXX",
    documents: {
      cor: { uploaded: true, fileName: "COR.pdf" },
      indigency: { uploaded: true, fileName: "Indigency.pdf" },
      employmentProof: { uploaded: true, fileName: "EmploymentProof.pdf" },
      academicRecord: { uploaded: true, fileName: "AcademicRecord.pdf" },
    },
    eligibility: {
      enrolled: true,
      workingStudent: true,
      noFailingGrades: true,
      fullScholarship: false,
      previousRecipient: false,
    },
    submittedAt: "2026-05-10T09:00:00",
    status: "Committee Review",
    reviewStatus: "Pending Review",
    evaluatorNotes: "",
    interviewRemarks: "",
    humanDecision: "",
    decisionReason: "",
    committeeDecision: "Pending committee review",
  },
  {
    id: "WSFA-2026-002",
    name: "Ana Cruz",
    email: "ana.cruz@cmu.edu.ph",
    college: "College of Education",
    course: "BSEd English",
    contactNumber: "0918-100-7788",
    employerParentContact: "09XX-XXX-XXXX",
    documents: {
      cor: { uploaded: true, fileName: "COR.pdf" },
      indigency: { uploaded: true, fileName: "ITR.pdf" },
      employmentProof: { uploaded: true, fileName: "PartTimeWork.pdf" },
      academicRecord: { uploaded: true, fileName: "Grades.pdf" },
    },
    eligibility: {
      enrolled: true,
      workingStudent: true,
      noFailingGrades: true,
      fullScholarship: false,
      previousRecipient: false,
    },
    submittedAt: "2026-05-10T09:15:00",
    status: "Committee Review",
    reviewStatus: "Ready for Final Decision",
    evaluatorNotes: "Strong supporting documents and clear work status.",
    interviewRemarks: "",
    humanDecision: "Confirm AI recommendation",
    decisionReason: "Confirmed after committee review.",
    committeeDecision: "Approved by committee",
  },
  {
    id: "WSFA-2026-003",
    name: "John Reyes",
    email: "john.reyes@cmu.edu.ph",
    college: "College of Agriculture",
    course: "BS Agriculture",
    contactNumber: "0915-441-7782",
    employerParentContact: "09XX-XXX-XXXX",
    documents: {
      cor: { uploaded: true, fileName: "COR.pdf" },
      indigency: { uploaded: true, fileName: "Indigency.pdf" },
      employmentProof: { uploaded: false, fileName: "" },
      academicRecord: { uploaded: true, fileName: "AcademicRecord.pdf" },
    },
    eligibility: {
      enrolled: true,
      workingStudent: true,
      noFailingGrades: true,
      fullScholarship: false,
      previousRecipient: false,
    },
    submittedAt: "2026-05-10T09:35:00",
    status: "Committee Review",
    reviewStatus: "Needs Further Review",
    evaluatorNotes: "Proof of income activity needs follow-up.",
    interviewRemarks: "",
    humanDecision: "Mark as Needs Further Review",
    decisionReason: "",
    committeeDecision: "Needs further review",
  },
  {
    id: "WSFA-2026-004",
    name: "Carlo Dela Cruz",
    email: "carlo.delacruz@cmu.edu.ph",
    college: "College of Business and Management",
    course: "BS Business Administration",
    contactNumber: "0920-444-1122",
    employerParentContact: "09XX-XXX-XXXX",
    documents: {
      cor: { uploaded: true, fileName: "COR.pdf" },
      indigency: { uploaded: true, fileName: "ITR.pdf" },
      employmentProof: { uploaded: true, fileName: "Employment.pdf" },
      academicRecord: { uploaded: true, fileName: "Grades.pdf" },
    },
    eligibility: {
      enrolled: true,
      workingStudent: false,
      noFailingGrades: true,
      fullScholarship: false,
      previousRecipient: false,
    },
    submittedAt: "2026-05-10T10:05:00",
    status: "Eligibility Checking",
    reviewStatus: "Pending Review",
    evaluatorNotes: "",
    interviewRemarks: "",
    humanDecision: "",
    decisionReason: "",
    committeeDecision: "Pending committee review",
  },
];

const auditEntries = [
  makeAudit(
    "Application submitted",
    "Applicant",
    "Maria Santos",
    "Application submitted through applicant portal.",
    "2026-05-10T09:00:00",
  ),
  makeAudit(
    "AI pre-screen completed",
    "System",
    "Maria Santos",
    "Eligibility checked and AI recommendation generated.",
    "2026-05-10T09:05:00",
  ),
  makeAudit(
    "Profile reviewed",
    "Committee",
    "Maria Santos",
    "Applicant profile viewed by committee.",
    "2026-05-10T10:00:00",
  ),
  makeAudit(
    "Notes added",
    "Committee",
    "Ana Cruz",
    "Evaluator notes saved.",
    "2026-05-10T10:30:00",
  ),
  makeAudit(
    "Final decision saved",
    "SSC President",
    "Ana Cruz",
    "Approved by committee.",
    "2026-05-10T11:00:00",
  ),
];

let draftApplication = createEmptyDraft();

document.addEventListener("DOMContentLoaded", () => {
  applicants.forEach(evaluateApplicant);
  renderApp();
});

/* Core rendering */
function renderApp() {
  if (state.screen === "login") renderLogin();
  if (state.screen === "privacy") renderPrivacyNotice();
  if (state.screen === "application") renderApplicationSubmission();
  if (state.screen === "applicant-status") renderApplicantStatus();
  if (state.screen === "evaluator") renderEvaluatorShell();

  updateHeaderAction();
}

function updateHeaderAction() {
  const headerAction = document.getElementById("headerAction");
  if (!headerAction) return;

  if (state.screen === "login") {
    headerAction.textContent = "◎";
    headerAction.setAttribute("aria-label", "User account");
    headerAction.onclick = null;
    return;
  }

  headerAction.textContent = "Logout";
  headerAction.setAttribute("aria-label", "Logout");
  headerAction.onclick = logout;
}

function logout() {
  state.screen = "login";
  state.role = "";
  state.selectedApplicantId = null;
  state.evaluatorView = "dashboard";
  state.applicantView = "status";
  renderApp();
  showToast("Logged out. You can choose another role.");
}

function togglePassword() {
  state.showPassword = !state.showPassword;
  renderLogin();
}

function renderPrivacyNotice() {
  app.className = "app-root center-stage";
  app.innerHTML = `
    <section class="consent-card">
      <div class="card-header">
        <h2>Privacy and Consent Notice</h2>
      </div>
      <div class="divider"></div>
      <p>
        This system collects applicant information and documents only for the CMU
        SSC Working Student Financial Assistance evaluation. The information
        provided will be used only for evaluating the application.
      </p>
      <h3 class="section-title">Data to be collected</h3>
      <div class="data-list">
        ${["Personal details", "Contact number of employer/parent", "Validated COR", "Certificate of Indigency or ITR", "Proof of employment or income-generating activity", "Academic record"].map((item) => `<label><input type="checkbox" checked disabled /> ${item}</label>`).join("")}
      </div>
      <div class="divider"></div>
      <h3 class="section-title">Who can access the data</h3>
      <ul class="access-list">
        <li>Committee heads for the financial assistance program</li>
        <li>SSC President</li>
      </ul>
      <div class="divider"></div>
      <label class="consent-line">
        <input type="checkbox" id="privacyConsent" />
        <span>I understand and agree that the submitted data will be used only for application evaluation.</span>
      </label>
      <p class="warning-text" id="consentWarning"></p>
      <div class="btn-row">
        <button class="btn btn-primary" type="button" onclick="acceptPrivacyConsent()">Continue</button>
      </div>
    </section>
  `;
}

function acceptPrivacyConsent() {
  if (!document.getElementById("privacyConsent").checked) {
    document.getElementById("consentWarning").textContent =
      "Please accept the consent notice before continuing.";
    return;
  }
  addAudit(
    "Privacy consent accepted",
    "Applicant",
    state.currentUser?.name || "Student Applicant",
    "Applicant accepted privacy and consent notice.",
  );
  state.screen = "application";
  renderApp();
}

function renderApplicationSubmission() {
  app.className = "app-root center-stage";
  app.innerHTML = `
    <section class="application-card">
      <h2 class="section-title">Application Submission</h2>
      <div class="stepper">
        <div class="step"><span>1</span>Step 1 of 3</div>
        <div class="step"><span>2</span>Step 2 of 3</div>
        <div class="step"><span>3</span>Step 3 of 3</div>
      </div>
      <form id="applicationForm">
        <section class="form-section">
          <h3>1. Personal Information</h3>
          <div class="form-grid">
            ${textField("Name", "draftName", draftApplication.name, "Enter your full name")}
            ${textField("College", "draftCollege", draftApplication.college, "Enter your college")}
            ${textField("Course", "draftCourse", draftApplication.course, "Enter your course")}
            ${textField("Contact No.", "draftContact", draftApplication.contactNumber, "Enter your contact number")}
            ${textField("Employer / Parent Contact Number", "draftEmployerContact", draftApplication.employerParentContact, "Enter employer or parent contact number", "full")}
          </div>
        </section>
        <section class="form-section">
          <h3>2. Required Documents</h3>
          <div class="upload-list">
            ${uploadRow("cor", "Validated Certificate of Registration (COR)")}
            ${uploadRow("indigency", "Certificate of Indigency or ITR")}
            ${uploadRow("employmentProof", "Proof of Employment or Income-Generating Activity")}
            ${uploadRow("academicRecord", "Academic Record")}
          </div>
        </section>
        <section class="form-section">
          <h3>3. Eligibility Information</h3>
          <div class="eligibility-grid">
            ${yesNoRow("enrolled", "Are you currently enrolled?")}
            ${yesNoRow("workingStudent", "Are you a working student?")}
            ${yesNoRow("noFailingGrades", "Do you have no failing grade from the previous semester?")}
            ${yesNoRow("fullScholarship", "Are you a beneficiary of a major scholarship with full coverage?")}
            ${yesNoRow("previousRecipient", "Have you previously received this financial assistance?")}
          </div>
        </section>
        <div class="btn-row">
          <button type="button" class="btn btn-secondary" onclick="saveDraft()">Save Draft</button>
          <button type="submit" class="btn btn-primary">Submit Application</button>
        </div>
      </form>
    </section>
  `;
  document
    .getElementById("applicationForm")
    .addEventListener("submit", submitApplication);
}

function textField(label, id, value, placeholder, extraClass = "") {
  return `<label class="field ${extraClass}">${label}<input id="${id}" value="${escapeHtml(value)}" placeholder="${placeholder}" /></label>`;
}

function uploadRow(key, label) {
  const doc = draftApplication.documents[key];
  return `
    <div class="upload-row">
      <span>${label}</span>
      <input type="file" id="${key}Upload" onchange="markDocumentUploaded('${key}', this)" />
      ${badge(doc.uploaded ? "Uploaded" : "Not yet uploaded", doc.uploaded ? "good" : "neutral")}
    </div>
  `;
}

function yesNoRow(key, question) {
  const value = draftApplication.eligibility[key];
  return `
    <div class="eligibility-row">
      <span>${question}</span>
      <label><input type="radio" name="${key}" value="true" ${value === true ? "checked" : ""} /> Yes</label>
      <label><input type="radio" name="${key}" value="false" ${value === false ? "checked" : ""} /> No</label>
    </div>
  `;
}

function markDocumentUploaded(key, input) {
  draftApplication.documents[key] = {
    uploaded: Boolean(input.files.length),
    fileName: input.files[0]?.name || "",
  };
  renderApplicationSubmission();
}

function saveDraft() {
  collectDraftForm();
  showToast("Draft saved locally for prototype demo.");
}

function submitApplication(event) {
  event.preventDefault();
  collectDraftForm();
  const newApplicant = {
    ...draftApplication,
    id: createApplicationId(),
    email: "applicant@cmu.edu.ph",
    submittedAt: new Date().toISOString(),
    status: "Committee Review",
    reviewStatus: "Pending Review",
    evaluatorNotes: "",
    interviewRemarks: "",
    humanDecision: "",
    decisionReason: "",
    committeeDecision: "Pending committee review",
  };
  evaluateApplicant(newApplicant);
  applicants.unshift(newApplicant);
  state.selectedApplicantId = newApplicant.id;
  addAudit(
    "Application submitted",
    "Applicant",
    newApplicant.name,
    "Application and document statuses submitted.",
  );
  addAudit(
    "Eligibility checked",
    "System",
    newApplicant.name,
    "Rule-based eligibility checking completed.",
  );
  addAudit(
    "AI recommendation generated",
    "System",
    newApplicant.name,
    `${newApplicant.aiRecommendation} with score ${newApplicant.score}.`,
  );
  addAudit(
    "AI pre-screen completed",
    "System",
    newApplicant.name,
    "Eligibility checked and AI recommendation generated.",
  );
  draftApplication = createEmptyDraft();
  state.screen = "applicant-status";
  renderApp();
}

function collectDraftForm() {
  draftApplication.name = valueOf("draftName") || "Applicant";
  draftApplication.college = valueOf("draftCollege") || "College not specified";
  draftApplication.course = valueOf("draftCourse") || "Course not specified";
  draftApplication.contactNumber = valueOf("draftContact");
  draftApplication.employerParentContact = valueOf("draftEmployerContact");
  Object.keys(draftApplication.eligibility).forEach((key) => {
    const selected = document.querySelector(`input[name="${key}"]:checked`);
    if (selected) draftApplication.eligibility[key] = selected.value === "true";
  });
}

function renderApplicantStatus() {
  app.className = "app-root center-stage";
  const applicant = getSelectedApplicant() || applicants[0];
  app.innerHTML = `
    <section class="status-card">
      <div class="card-header">
        <h2>Application Status</h2>
      </div>
      <div class="divider"></div>
      <div class="status-meta">
        <div class="meta-row"><strong>Application ID:</strong><span>${applicant.id}</span></div>
        <div class="meta-row"><strong>Applicant Name:</strong><span>${applicant.name}</span></div>
        <div class="meta-row"><strong>Program:</strong><span>Working Student Financial Assistance</span></div>
      </div>
      <div class="divider"></div>
      <div class="status-layout">
        <div>
          <h3 class="section-title">Submission Status</h3>
          <ul class="checklist">
            <li><span class="check-icon">✓</span>Personal details submitted</li>
            ${Object.entries(documentLabels)
              .map(
                ([key, label]) =>
                  `<li><span class="check-icon">${applicant.documents[key].uploaded ? "✓" : "!"}</span>${label} ${applicant.documents[key].uploaded ? "uploaded" : "missing"}</li>`,
              )
              .join("")}
          </ul>
        </div>
        ${badge(applicant.status, statusBadgeType(applicant.status))}
      </div>
      <div class="divider"></div>
      <h3 class="section-title">Application Progress</h3>
      <div class="progress-track">
        ${["Application Submitted", "Eligibility Checking", "Committee Review", "Interview", "Final Decision"].map((step) => progressStep(step, applicant.status)).join("")}
      </div>
      <div class="notice">
        <strong>i</strong>
        <span>Your application will still be reviewed by the committee. The system recommendation is not the final decision.</span>
      </div>
      <div class="btn-row">
        <button class="btn btn-secondary" type="button" onclick="goHome()">Back to Home</button>
      </div>
    </section>
  `;
}

function progressStep(step, status) {
  const order = [
    "Application Submitted",
    "Eligibility Checking",
    "Committee Review",
    "Interview",
    "Final Decision",
  ];
  const current = order.indexOf(status);
  const index = order.indexOf(step);
  const cls = index < current ? "done" : index === current ? "current" : "";
  return `<div class="progress-step ${cls}"><span>${index < current ? "✓" : index + 1}</span>${step}</div>`;
}

function goHome() {
  state.screen = "login";
  renderApp();
}

/* Evaluator side */
function renderEvaluatorShell() {
  app.className = "app-root";
  app.innerHTML = `
    <div class="evaluator-layout">
      <aside class="sidebar">
        <nav class="sidebar-nav">
          ${sidebarButton("dashboard", "Dashboard", "□")}
          ${sidebarButton("applicants", "Applicants", "♙")}
          ${sidebarButton("rankings", "Rankings / Final List", "▥")}
          ${sidebarButton("audit", "Audit Trail", "▤")}
          ${sidebarButton("settings", "Settings", "⚙")}
        </nav>
      </aside>
      <section class="main-content" id="evaluatorContent"></section>
    </div>
  `;
  renderEvaluatorContent();
}

function sidebarButton(view, label, icon) {
  return `<button class="sidebar-btn ${state.evaluatorView === view ? "active" : ""}" type="button" aria-label="${label}" onclick="showEvaluatorView('${view}')"><span>${icon}</span>${label}</button>`;
}

function showEvaluatorView(view) {
  state.evaluatorView = view;
  state.selectedApplicantId =
    view === "applicants"
      ? state.selectedApplicantId
      : state.selectedApplicantId;
  renderEvaluatorShell();
}

function renderEvaluatorContent() {
  if (state.evaluatorView === "dashboard") renderEvaluatorDashboard();
  if (state.evaluatorView === "applicants") renderApplicantList();
  if (state.evaluatorView === "profile") renderApplicantProfile();
  if (state.evaluatorView === "review") renderAiReview();
  if (state.evaluatorView === "rankings") renderFinalRanking();
  if (state.evaluatorView === "audit") renderAuditTrail();
  if (state.evaluatorView === "settings") renderSettings();
}

function renderEvaluatorDashboard() {
  const content = document.getElementById("evaluatorContent");
  const total = applicants.length;
  const eligible = applicants.filter(
    (a) => a.eligibilityStatus === "Eligible",
  ).length;
  const needsReview = applicants.filter(
    (a) =>
      ["Needs Further Review", "AI Recommended"].includes(a.aiRecommendation) ||
      a.reviewStatus === "Needs Further Review",
  ).length;
  const incomplete = applicants.filter(
    (a) => a.requirementStatus !== "Complete",
  ).length;
  const notEligible = applicants.filter(
    (a) => a.eligibilityStatus === "Not Eligible",
  ).length;
  content.innerHTML = `
    <div class="page-heading">
      <div>
        <h2 class="page-title">Welcome, ${state.currentUser?.name || state.role || "Committee Head"}</h2>
        <p class="body-muted">Review applications with AI-assisted summaries while keeping human decision-making final.</p>
      </div>
    </div>
    <div class="cards-grid">
      ${summaryCard("Total Applicants", total)}
      ${summaryCard("Eligible Applicants", eligible)}
      ${summaryCard("Needs Review", needsReview)}
      ${summaryCard("Incomplete Applications", incomplete)}
      ${summaryCard("Not Eligible", notEligible)}
    </div>
    <section class="panel-card">
      <h3>Recent Applications</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Course</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${applicants
              .slice(0, 5)
              .map(
                (applicant) => `
              <tr>
                <td>${applicant.name}</td>
                <td>${applicant.course}</td>
                <td>${badge(applicant.aiRecommendation, recommendationBadgeType(applicant.aiRecommendation))}</td>
                <td><button class="btn btn-secondary btn-small" onclick="openProfile('${applicant.id}')">View</button></td>
              </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
    <section class="panel-card">
      <h3>AI Processing Status</h3>
      <p><strong>${total}</strong> applications processed.</p>
      <p><strong>${needsReview}</strong> applications require manual review.</p>
    </section>
  `;
}

function summaryCard(label, count) {
  return `<article class="summary-card"><span>${label}</span><strong>${count}</strong></article>`;
}

function renderApplicantList() {
  const content = document.getElementById("evaluatorContent");
  const colleges = ["All", ...new Set(applicants.map((a) => a.college))];
  content.innerHTML = `
    <div class="page-heading">
      <div>
        <h2 class="page-title">Applicants</h2>
        <p class="body-muted">Use AI Recommendation as decision-support only. Human review remains required.</p>
      </div>
    </div>
    <div class="toolbar">
      <label class="field">Search applicant name<input id="searchApplicant" placeholder="Search applicant name" oninput="renderApplicantRows()" /></label>
      ${selectField("eligibilityFilter", "Eligibility Status", ["All", "Eligible", "Not Eligible"])}
      ${selectField("requirementFilter", "Requirement Status", ["All", "Complete", "Incomplete"])}
      ${selectField("recommendationFilter", "AI Recommendation", ["All", "Highly Recommended", "AI Recommended", "Needs Further Review", "Not Recommended", "Not Eligible"])}
      ${selectField("collegeFilter", "College", colleges)}
    </div>
    <div class="sort-row">
      ${selectField("sortBy", "Sort by", ["Highest Score", "Latest Submission"])}
      ${selectField("thenBy", "Then by", ["Latest Submission", "Highest Score"])}
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Rank</th><th>Name</th><th>Course</th><th>Req. Status</th><th>Score</th><th>AI Recommendation</th><th>Action</th></tr>
        </thead>
        <tbody id="applicantRows"></tbody>
      </table>
    </div>
  `;
  [
    "eligibilityFilter",
    "requirementFilter",
    "recommendationFilter",
    "collegeFilter",
    "sortBy",
    "thenBy",
  ].forEach((id) => {
    document.getElementById(id).addEventListener("change", renderApplicantRows);
  });
  renderApplicantRows();
}

function selectField(id, label, options) {
  return `<label class="field">${label}<select id="${id}">${options.map((option) => `<option>${option}</option>`).join("")}</select></label>`;
}

function renderApplicantRows() {
  const tbody = document.getElementById("applicantRows");
  if (!tbody) return;
  const search = valueOf("searchApplicant").toLowerCase();
  const eligibility = valueOf("eligibilityFilter");
  const requirement = valueOf("requirementFilter");
  const recommendation = valueOf("recommendationFilter");
  const college = valueOf("collegeFilter");
  const sortBy = valueOf("sortBy");
  const filtered = applicants
    .filter((a) => !search || a.name.toLowerCase().includes(search))
    .filter((a) => eligibility === "All" || a.eligibilityStatus === eligibility)
    .filter((a) => requirement === "All" || a.requirementStatus === requirement)
    .filter(
      (a) => recommendation === "All" || a.aiRecommendation === recommendation,
    )
    .filter((a) => college === "All" || a.college === college)
    .sort((a, b) =>
      sortBy === "Latest Submission"
        ? new Date(b.submittedAt) - new Date(a.submittedAt)
        : b.score - a.score,
    );
  tbody.innerHTML =
    filtered
      .map(
        (applicant, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><div class="applicant-name">${applicant.name}</div><div class="subtext">${applicant.id}</div></td>
      <td>${applicant.course}</td>
      <td>${badge(applicant.requirementStatus, applicant.requirementStatus === "Complete" ? "good" : "warn")}</td>
      <td>${applicant.score}</td>
      <td>${badge(applicant.aiRecommendation, recommendationBadgeType(applicant.aiRecommendation))}</td>
      <td><button class="btn btn-primary btn-small" onclick="openProfile('${applicant.id}')">View Profile</button></td>
    </tr>
  `,
      )
      .join("") ||
    `<tr><td colspan="7" class="empty-state">No applicants match the current filters.</td></tr>`;
}

function openProfile(id) {
  state.selectedApplicantId = id;
  state.evaluatorView = "profile";
  const applicant = getSelectedApplicant();
  addAudit(
    "Profile reviewed",
    "Committee",
    applicant.name,
    "Applicant profile viewed by evaluator.",
  );
  renderEvaluatorShell();
}

function renderApplicantProfile() {
  const applicant = getSelectedApplicant() || applicants[0];
  const content = document.getElementById("evaluatorContent");
  content.innerHTML = `
    <div class="page-heading">
      <div>
        <h2 class="page-title">Applicant Profile</h2>
        <p class="body-muted">${applicant.id}</p>
      </div>
      <button class="btn btn-secondary" onclick="showEvaluatorView('applicants')">Back to Applicants</button>
    </div>
    <div class="profile-grid">
      <section class="profile-card">
        <h3>Applicant Information</h3>
        <div class="info-list">
          ${infoRow("Name", applicant.name)}
          ${infoRow("College", applicant.college)}
          ${infoRow("Course", applicant.course)}
          ${infoRow("Employer/Parent Contact", applicant.employerParentContact)}
        </div>
      </section>
      <section class="profile-card">
        <h3>Requirement Checklist</h3>
        <ul class="checklist">
          ${Object.entries(documentLabels)
            .map(
              ([key, label]) =>
                `<li><span class="check-icon">${applicant.documents[key].uploaded ? "✓" : "!"}</span>${label}</li>`,
            )
            .join("")}
        </ul>
      </section>
      <section class="profile-card">
        <h3>Document Viewer</h3>
        <div class="doc-preview">Preview of selected file</div>
        <p>${applicant.documents.cor.fileName || "COR.pdf"}</p>
        <button class="btn btn-secondary" type="button">View Full Document</button>
      </section>
      <section class="profile-card">
        <h3>Eligibility Information</h3>
        <div class="info-list">
          ${infoRow("Currently Enrolled", yesNo(applicant.eligibility.enrolled))}
          ${infoRow("Working Student", yesNo(applicant.eligibility.workingStudent))}
          ${infoRow("No Failing Grades", yesNo(applicant.eligibility.noFailingGrades))}
          ${infoRow("Major Scholarship Beneficiary", yesNo(applicant.eligibility.fullScholarship))}
          ${infoRow("Previous Recipient", yesNo(applicant.eligibility.previousRecipient))}
        </div>
      </section>
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="proceedToAiReview('${applicant.id}')">Proceed to AI Recommendation</button>
    </div>
  `;
}

function infoRow(label, value) {
  return `<div class="info-row"><strong>${label}:</strong><span>${value}</span></div>`;
}

function proceedToAiReview(id) {
  state.selectedApplicantId = id;
  state.evaluatorView = "review";
  renderEvaluatorShell();
}

function renderAiReview() {
  const applicant = getSelectedApplicant() || applicants[0];
  const content = document.getElementById("evaluatorContent");
  content.innerHTML = `
    <div class="page-heading">
      <div>
        <h2 class="page-title">AI Recommendation and Committee Review</h2>
        <p class="body-muted">The AI recommendation is advisory only. Human decision remains final.</p>
      </div>
    </div>
    <section class="panel-card">
      <div class="page-heading">
        <div><strong class="applicant-name">${applicant.name}</strong></div>
        <span>Application ID: ${applicant.id}</span>
      </div>
    </section>
    <section class="panel-card">
      <h3>AI Recommendation</h3>
      <div class="ai-review-grid">
        <div>
          ${badge(applicant.aiRecommendation, recommendationBadgeType(applicant.aiRecommendation))}
          <p>Eligibility Score</p>
          <div class="score-box">${applicant.score}<span>/ 100</span></div>
        </div>
        <div>
          <strong>Recommendation Summary</strong>
          <p>${applicant.aiSummary}</p>
        </div>
        <div>
          <strong>Explanation</strong>
          <ul class="checklist">
            ${applicant.checks.map((check) => `<li><span class="check-icon">${check.passed ? "✓" : "!"}</span>${check.label}</li>`).join("")}
          </ul>
        </div>
      </div>
    </section>
    <section class="panel-card">
      <h3>Committee Review</h3>
      <form id="reviewForm">
        <div class="review-grid">
          <label class="field">Review Status
            <select id="reviewStatus">
              ${["Pending Review", "For Interview", "Needs Further Review", "Ready for Final Decision"].map((status) => `<option ${applicant.reviewStatus === status ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </label>
          <label class="field">Interview Remarks
            <textarea id="interviewRemarks" placeholder="Enter interview remarks...">${applicant.interviewRemarks}</textarea>
          </label>
          <label class="field">Evaluator Notes
            <textarea id="evaluatorNotes" placeholder="Enter evaluator notes...">${applicant.evaluatorNotes}</textarea>
          </label>
          <section class="human-decision-panel">
            <h4 class="human-decision-title">Final Human Decision</h4>
            <p class="human-decision-note">This decision is made by the committee. The AI recommendation is advisory only.</p>
            <div class="decision-options">
              ${decisionRadio("Confirm AI recommendation", applicant.humanDecision)}
              ${decisionRadio("Mark as Needs Further Review", applicant.humanDecision)}
              ${decisionRadio("Reject Application", applicant.humanDecision)}
              ${decisionRadio("Override AI Recommendation", applicant.humanDecision)}
            </div>
            <label class="field decision-reason-field">Reason for Override / Decision
              <textarea id="decisionReason" placeholder="Required for override or rejection. Add notes for other decisions as needed.">${applicant.decisionReason}</textarea>
            </label>
          </section>
        </div>
        <p class="warning-text" id="reviewWarning"></p>
        <div class="btn-row">
          <button class="btn btn-secondary" type="button" onclick="saveReview(false)">Save Review</button>
          <button class="btn btn-primary" type="button" onclick="saveReview(true)">Submit Final Decision</button>
        </div>
      </form>
    </section>
  `;
}

function decisionRadio(value, current) {
  return `
    <label class="decision-option ${current === value ? "selected" : ""}">
      <input type="radio" name="humanDecision" value="${value}" ${current === value ? "checked" : ""} onchange="updateDecisionSelection()" />
      <span>${value}</span>
    </label>
  `;
}

function updateDecisionSelection() {
  document.querySelectorAll(".decision-option").forEach((option) => {
    const input = option.querySelector("input");
    option.classList.toggle("selected", Boolean(input?.checked));
  });
}

function saveReview(finalize) {
  const applicant = getSelectedApplicant();
  const humanDecision =
    document.querySelector("input[name='humanDecision']:checked")?.value || "";
  const reason = valueOf("decisionReason");
  if (finalize && !humanDecision) {
    document.getElementById("reviewWarning").textContent =
      "Please select a final human decision before submitting.";
    return;
  }
  if (
    ["Override AI Recommendation", "Reject Application"].includes(
      humanDecision,
    ) &&
    !reason
  ) {
    document.getElementById("reviewWarning").textContent =
      humanDecision === "Reject Application"
        ? "Reason for rejection is required before submitting this decision."
        : "Override reason is required before saving an override.";
    return;
  }
  applicant.reviewStatus = valueOf("reviewStatus");
  applicant.evaluatorNotes = valueOf("evaluatorNotes");
  applicant.interviewRemarks = valueOf("interviewRemarks");
  applicant.humanDecision = humanDecision;
  applicant.decisionReason = reason;
  if (humanDecision === "Override AI Recommendation") {
    addAudit(
      "AI recommendation overridden",
      getCurrentUserName(),
      applicant.name,
      reason,
    );
    addAudit("Override recorded", getCurrentUserName(), applicant.name, reason);
  }
  if (finalize) {
    applicant.committeeDecision = finalCommitteeDecision(
      humanDecision,
      applicant,
    );
    applicant.status =
      applicant.reviewStatus === "For Interview"
        ? "Interview"
        : "Final Decision";
    addAudit(
      "Final decision saved",
      getCurrentUserName(),
      applicant.name,
      applicant.committeeDecision,
    );
    showToast("Final committee decision saved.");
  } else {
    addAudit(
      "Notes added",
      getCurrentUserName(),
      applicant.name,
      applicant.evaluatorNotes || "Committee review notes saved.",
    );
    showToast("Review notes saved.");
  }
  evaluateApplicant(applicant);
  renderEvaluatorShell();
}

function finalCommitteeDecision(humanDecision, applicant) {
  if (humanDecision === "Reject Application") return "Rejected by committee";
  if (humanDecision === "Mark as Needs Further Review")
    return "Needs further review";
  if (humanDecision === "Override AI Recommendation")
    return `Override: ${applicant.decisionReason || "Committee override"}`;
  if (humanDecision === "Confirm AI recommendation")
    return applicant.aiRecommendation.includes("Recommended")
      ? "Approved by committee"
      : "Confirmed for further review";
  return "Pending final decision";
}

function renderFinalRanking() {
  const content = document.getElementById("evaluatorContent");
  const finalList = [...applicants].sort((a, b) => b.score - a.score);
  content.innerHTML = `
    <div class="page-heading">
      <div>
        <h2 class="page-title">Final Ranking</h2>
        <p class="body-muted">Final ranking is generated after committee review. AI score is only one decision-support factor.</p>
      </div>
      <button class="btn btn-secondary" onclick="showToast('Final list export prepared for prototype demo.')">Export Final List</button>
    </div>
    <section class="panel-card">
      <h3>Final Ranking Table</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Rank</th><th>Name</th><th>Score</th><th>Final Committee Decision</th></tr></thead>
          <tbody>
            ${finalList
              .map(
                (applicant, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${applicant.name}</td>
                <td>${applicant.score}</td>
                <td>${applicant.committeeDecision}</td>
              </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderAuditTrail() {
  const content = document.getElementById("evaluatorContent");
  const entries = filteredAuditEntries();
  content.innerHTML = `
    <div class="page-heading">
      <div>
        <h2 class="page-title">Audit Trail</h2>
        <p class="body-muted">Every important applicant, system, and committee action is recorded.</p>
      </div>
      <button class="btn btn-secondary" onclick="showToast('Audit log export prepared for prototype demo.')">Export Audit Log</button>
    </div>
    <div class="audit-filters">
      ${auditFilters.map((filter) => `<button class="btn btn-secondary btn-small ${state.auditFilter === filter ? "active" : ""}" onclick="setAuditFilter('${filter}')">${filter}</button>`).join("")}
    </div>
    <section class="panel-card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Date/time</th><th>Action</th><th>User</th><th>Applicant</th><th>Notes</th></tr></thead>
          <tbody>
            ${
              entries
                .map(
                  (entry) => `
              <tr>
                <td>${formatDateTime(entry.dateTime)}</td>
                <td>${entry.action}</td>
                <td>${entry.user}</td>
                <td>${entry.applicant}</td>
                <td>${entry.notes}</td>
              </tr>`,
                )
                .join("") ||
              `<tr><td colspan="5" class="empty-state">No audit entries match this filter.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function setAuditFilter(filter) {
  state.auditFilter = filter;
  renderAuditTrail();
}

function filteredAuditEntries() {
  if (state.auditFilter === "All") return auditEntries;
  return auditEntries.filter((entry) => entry.action === state.auditFilter);
}

function renderSettings() {
  document.getElementById("evaluatorContent").innerHTML = `
    <div class="page-heading">
      <div>
        <h2 class="page-title">Settings</h2>
        <p class="body-muted">Static prototype settings for demonstration only.</p>
      </div>
    </div>
    <section class="panel-card">
      <h3>Decision Support Notice</h3>
      <p>The AI does not make final decisions. The SSC committee reviews and approves final beneficiaries.</p>
    </section>
  `;
}

/* Eligibility and AI simulation */
function evaluateApplicant(applicant) {
  const checks = [
    {
      label: "Currently enrolled",
      passed: applicant.eligibility.enrolled,
      critical: true,
    },
    {
      label: "Proof of employment submitted",
      passed:
        applicant.eligibility.workingStudent &&
        applicant.documents.employmentProof.uploaded,
      critical: true,
    },
    {
      label: "No failing grades",
      passed: applicant.eligibility.noFailingGrades,
      critical: true,
    },
    {
      label: "Not a major scholarship beneficiary",
      passed: !applicant.eligibility.fullScholarship,
      critical: true,
    },
    {
      label: "No previous assistance record",
      passed: !applicant.eligibility.previousRecipient,
      critical: true,
    },
    {
      label: "Certificate of Indigency / ITR submitted",
      passed: applicant.documents.indigency.uploaded,
      critical: false,
    },
    {
      label: "Required documents complete",
      passed: documentsComplete(applicant),
      critical: false,
    },
  ];
  const criticalFail = checks.some((check) => check.critical && !check.passed);
  const score = calculateScore(applicant);
  applicant.checks = checks;
  applicant.score = score;
  applicant.requirementStatus = documentsComplete(applicant)
    ? "Complete"
    : "Incomplete";
  applicant.eligibilityStatus = criticalFail ? "Not Eligible" : "Eligible";
  applicant.aiRecommendation = getRecommendation(score, criticalFail);
  applicant.aiSummary = generateAiSummary(applicant);
}

function calculateScore(applicant) {
  let score = 0;
  if (applicant.eligibility.enrolled) score += 20;
  if (
    applicant.eligibility.workingStudent &&
    applicant.documents.employmentProof.uploaded
  )
    score += 20;
  if (applicant.eligibility.noFailingGrades) score += 15;
  if (!applicant.eligibility.fullScholarship) score += 20;
  if (applicant.documents.indigency.uploaded) score += 15;
  if (documentsComplete(applicant)) score += 10;
  return score;
}

function getRecommendation(score, criticalFail) {
  if (criticalFail) return "Not Eligible";
  if (score >= 90) return "Highly Recommended";
  if (score >= 75) return "AI Recommended";
  if (score >= 60) return "Needs Further Review";
  return "Not Recommended";
}

function generateAiSummary(applicant) {
  const complete = documentsComplete(applicant)
    ? "submitted complete requirements"
    : "has incomplete requirements";
  const grades = applicant.eligibility.noFailingGrades
    ? "has no failing grades"
    : "has a failing grade record";
  const scholarship = applicant.eligibility.fullScholarship
    ? "is a full scholarship beneficiary"
    : "is not a full scholarship beneficiary";
  const previous = applicant.eligibility.previousRecipient
    ? "has previously received this assistance"
    : "has not previously received this assistance";
  return `${applicant.name} is ${applicant.eligibility.enrolled ? "a currently enrolled" : "not confirmed as a currently enrolled"} student who ${applicant.eligibility.workingStudent ? "is a working student" : "does not meet the working student condition"} and ${complete}. The applicant ${grades}, ${scholarship}, and ${previous}. Based on rule-based screening, the application may be prioritized for committee review when requirements are satisfied. Final approval remains with the SSC committee.`;
}

function documentsComplete(applicant) {
  return Object.values(applicant.documents).every(
    (document) => document.uploaded,
  );
}

/* Helpers */
function createEmptyDraft() {
  return {
    name: "",
    college: "",
    course: "",
    contactNumber: "",
    employerParentContact: "",
    documents: {
      cor: { uploaded: false, fileName: "" },
      indigency: { uploaded: false, fileName: "" },
      employmentProof: { uploaded: false, fileName: "" },
      academicRecord: { uploaded: false, fileName: "" },
    },
    eligibility: {
      enrolled: true,
      workingStudent: true,
      noFailingGrades: true,
      fullScholarship: false,
      previousRecipient: false,
    },
  };
}

function createApplicationId() {
  return `WSFA-2026-${String(applicants.length + 1).padStart(3, "0")}`;
}

function getSelectedApplicant() {
  return applicants.find(
    (applicant) => applicant.id === state.selectedApplicantId,
  );
}

function valueOf(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

function badge(text, type) {
  return `<span class="badge ${type}">${text}</span>`;
}

function recommendationBadgeType(recommendation) {
  if (["Highly Recommended", "AI Recommended"].includes(recommendation))
    return "good";
  if (recommendation === "Needs Further Review") return "warn";
  if (["Not Recommended", "Not Eligible"].includes(recommendation))
    return "bad";
  return "neutral";
}

function statusBadgeType(status) {
  if (status === "Final Decision") return "good";
  if (status === "Interview") return "info";
  if (status === "Committee Review") return "warn";
  return "neutral";
}

function addAudit(action, user, applicant, notes) {
  auditEntries.unshift(makeAudit(action, user, applicant, notes));
}

function makeAudit(
  action,
  user,
  applicant,
  notes,
  dateTime = new Date().toISOString(),
) {
  return { dateTime, action, user, applicant, notes };
}

function formatDateTime(value) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function getCurrentUserName() {
  return state.currentUser?.name || state.currentUser?.role || "Committee Head";
}

function renderLogin() {
  app.className = "app-root center-stage";
  app.innerHTML = `
    <section class="auth-card">
      <div class="card-header">
        <img src="./assets/logo.png" alt="CMU SSC Logo" class="brand-logo brand-logo-login" />
        <h2>CMU SSC</h2>
        <p>Working Student Financial Assistance System</p>
      </div>
      <div class="divider"></div>
      <h3 class="section-title auth-title">Login to your account</h3>
      <form class="form-grid single" id="loginForm">
        <label class="field">Email Address
          <input type="email" id="loginEmail" placeholder="Enter your email address" autocomplete="username" />
        </label>
        <label class="field">Password
          <div class="password-row">
            <input type="${state.showPassword ? "text" : "password"}" id="loginPassword" placeholder="Enter your password" autocomplete="current-password" />
            <button type="button" class="icon-btn" onclick="togglePassword()">${state.showPassword ? "Hide" : "Show"}</button>
          </div>
        </label>
        <p class="warning-text" id="loginWarning"></p>
        <button class="btn btn-primary" type="submit">Login</button>
        <button class="link-btn" type="button">Forgot password?</button>
      </form>
      <aside class="demo-credentials">
        <strong>Demo Credentials</strong>
        <p>Applicant: applicant@cmu.edu.ph / applicant123</p>
        <p>Committee Head: committee@cmu.edu.ph / committee123</p>
        <p>SSC President: president@cmu.edu.ph / president123</p>
      </aside>
    </section>
  `;
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
}

function handleLogin(event) {
  event.preventDefault();
  const email = valueOf("loginEmail").toLowerCase();
  const password = valueOf("loginPassword");
  const account = demoAccounts.find(
    (demoAccount) =>
      demoAccount.email.toLowerCase() === email &&
      demoAccount.password === password,
  );

  if (!account) {
    document.getElementById("loginWarning").textContent =
      "Incorrect email or password. Use one of the static demo credentials.";
    return;
  }

  state.currentUser = account;
  state.role = account.role;
  if (account.role === "Applicant") {
    state.screen = "privacy";
  } else {
    state.screen = "evaluator";
    state.evaluatorView = "dashboard";
  }
  renderApp();
}

function updateHeaderAction() {
  const headerAction = document.getElementById("headerAction");
  if (!headerAction) return;

  if (state.screen === "login") {
    headerAction.textContent = "Account";
    headerAction.setAttribute("aria-label", "User account");
    headerAction.onclick = null;
    return;
  }

  headerAction.textContent = `${state.currentUser?.name || "User"} - Logout`;
  headerAction.setAttribute("aria-label", "Logout");
  headerAction.onclick = logout;
}

function logout() {
  state.screen = "login";
  state.role = "";
  state.currentUser = null;
  state.selectedApplicantId = null;
  state.evaluatorView = "dashboard";
  state.applicantView = "status";
  renderApp();
  showToast("Logged out. Use a demo account to sign in again.");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
