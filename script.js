const documentStatusOptions = ["Submitted", "Missing", "Unclear", "Needs manual verification"];
const filters = [
  "All",
  "Eligible",
  "Incomplete Requirements",
  "Needs Further Review",
  "Not Eligible",
  "For Interview",
  "Recommended",
  "Rejected",
];

let activeFilter = "All";
let selectedApplicantId = null;
const officerName = "SSC Committee";

// Static sample applicant data
const applicants = [
  {
    id: createId(),
    fullName: "Maria Santos",
    studentId: "2022-0148",
    college: "College of Information Sciences and Computing",
    course: "BS Information Technology",
    yearLevel: "3rd Year",
    contactNumber: "0917 234 5678",
    guardianContact: "0998 112 3344",
    employmentStatus: "Working student",
    scholarshipStatus: "None",
    previousAssistance: "No previous assistance",
    financialNeed: "High",
    hasFailingGrades: false,
    documents: {
      registration: "Submitted",
      indigency: "Submitted",
      employmentProof: "Submitted",
      gradeslip: "Submitted",
    },
    committeeDecision: "Pending committee review",
    evaluatorNotes: "",
    interviewNotes: "",
    overrideReason: "",
    approvalDate: "",
  },
  {
    id: createId(),
    fullName: "Kevin Mendoza",
    studentId: "2021-0912",
    college: "College of Engineering",
    course: "BS Civil Engineering",
    yearLevel: "4th Year",
    contactNumber: "0918 555 7822",
    guardianContact: "0921 778 9912",
    employmentStatus: "Part-time employee",
    scholarshipStatus: "Partial scholarship",
    previousAssistance: "No previous assistance",
    financialNeed: "Moderate",
    hasFailingGrades: false,
    documents: {
      registration: "Submitted",
      indigency: "Unclear",
      employmentProof: "Submitted",
      gradeslip: "Submitted",
    },
    committeeDecision: "Pending committee review",
    evaluatorNotes: "",
    interviewNotes: "",
    overrideReason: "",
    approvalDate: "",
  },
  {
    id: createId(),
    fullName: "Alyssa Lim",
    studentId: "2023-0660",
    college: "College of Business and Management",
    course: "BS Business Administration",
    yearLevel: "2nd Year",
    contactNumber: "0920 672 1100",
    guardianContact: "0916 220 8811",
    employmentStatus: "Business owner",
    scholarshipStatus: "None",
    previousAssistance: "No previous assistance",
    financialNeed: "High",
    hasFailingGrades: true,
    documents: {
      registration: "Submitted",
      indigency: "Submitted",
      employmentProof: "Submitted",
      gradeslip: "Submitted",
    },
    committeeDecision: "Pending committee review",
    evaluatorNotes: "",
    interviewNotes: "",
    overrideReason: "",
    approvalDate: "",
  },
  {
    id: createId(),
    fullName: "Jomar Reyes",
    studentId: "2020-0317",
    college: "College of Agriculture",
    course: "BS Agriculture",
    yearLevel: "4th Year",
    contactNumber: "0915 441 7782",
    guardianContact: "0917 801 7710",
    employmentStatus: "Income-generating activity",
    scholarshipStatus: "None",
    previousAssistance: "No previous assistance",
    financialNeed: "High",
    hasFailingGrades: false,
    documents: {
      registration: "Submitted",
      indigency: "Submitted",
      employmentProof: "Missing",
      gradeslip: "Submitted",
    },
    committeeDecision: "Missing document requested",
    evaluatorNotes: "Needs proof of income-generating activity before final review.",
    interviewNotes: "",
    overrideReason: "",
    approvalDate: "",
  },
  {
    id: createId(),
    fullName: "Christine Caballero",
    studentId: "2022-1104",
    college: "College of Education",
    course: "BSEd English",
    yearLevel: "3rd Year",
    contactNumber: "0999 424 2211",
    guardianContact: "0912 535 2001",
    employmentStatus: "Working student",
    scholarshipStatus: "Major full scholarship",
    previousAssistance: "No previous assistance",
    financialNeed: "Moderate",
    hasFailingGrades: false,
    documents: {
      registration: "Submitted",
      indigency: "Submitted",
      employmentProof: "Submitted",
      gradeslip: "Submitted",
    },
    committeeDecision: "Pending committee review",
    evaluatorNotes: "",
    interviewNotes: "",
    overrideReason: "",
    approvalDate: "",
  },
];

const auditEntries = [];

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  populateDocumentSelects();
  initializeAuditEntries();
  bindEvents();
  renderAll();
});

function createId() {
  return `app-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Form setup and submission
function populateDocumentSelects() {
  ["corStatus", "indigencyStatus", "employmentProofStatus", "gradeslipStatus"].forEach((id) => {
    const select = document.getElementById(id);
    select.innerHTML = documentStatusOptions.map((status) => `<option>${status}</option>`).join("");
  });
}

function bindEvents() {
  document.getElementById("applicationForm").addEventListener("submit", handleApplicationSubmit);
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("detailModal").addEventListener("click", (event) => {
    if (event.target.id === "detailModal") closeModal();
  });
}

function initializeAuditEntries() {
  applicants.forEach((applicant) => {
    evaluateApplicant(applicant);
    addAuditEntry(applicant, "Eligibility checked", "Initial rule-based eligibility check completed.", false);
    addAuditEntry(applicant, "AI summary generated", "Static AI-assisted summary generated from sample data.", false);
    addAuditEntry(applicant, "AI recommendation generated", `${applicant.recommendation} with score ${applicant.score}.`, false);
  });
}

function handleApplicationSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const applicant = {
    id: createId(),
    fullName: valueOf("fullName"),
    studentId: valueOf("studentId"),
    college: valueOf("college"),
    course: valueOf("course"),
    yearLevel: valueOf("yearLevel"),
    contactNumber: valueOf("contactNumber"),
    guardianContact: valueOf("guardianContact"),
    employmentStatus: valueOf("employmentStatus"),
    scholarshipStatus: valueOf("scholarshipStatus"),
    previousAssistance: valueOf("previousAssistance"),
    financialNeed: valueOf("financialNeed"),
    hasFailingGrades: valueOf("hasFailingGrades") === "Yes",
    documents: {
      registration: valueOf("corStatus"),
      indigency: valueOf("indigencyStatus"),
      employmentProof: valueOf("employmentProofStatus"),
      gradeslip: valueOf("gradeslipStatus"),
    },
    committeeDecision: "Pending committee review",
    evaluatorNotes: "",
    interviewNotes: "",
    overrideReason: "",
    approvalDate: "",
  };

  evaluateApplicant(applicant);
  applicants.unshift(applicant);
  addAuditEntry(applicant, "Application submitted", "Applicant data and document statuses were added to the static sample dataset.");
  addAuditEntry(applicant, "Eligibility checked", "Rule-based eligibility checker processed the new submission.");
  addAuditEntry(applicant, "AI summary generated", "Simulated AI summary generated without using an external API.");
  addAuditEntry(applicant, "AI recommendation generated", `${applicant.recommendation} with score ${applicant.score}.`);
  form.reset();
  renderAll();
  showToast("Sample application submitted and evaluated.");
}

function valueOf(id) {
  return document.getElementById(id).value.trim();
}

// Rule-based eligibility, simulated AI summary, and scoring
function evaluateApplicant(applicant) {
  const checks = getEligibilityChecks(applicant);
  const criticalFails = checks.filter((check) => check.critical && !check.passed);
  const documentsComplete = areDocumentsComplete(applicant);
  const score = calculateScore(applicant, documentsComplete);
  const recommendation = getRecommendation(score, criticalFails.length > 0);

  applicant.checks = checks;
  applicant.score = score;
  applicant.recommendation = recommendation;
  applicant.eligibilityStatus = criticalFails.length > 0 ? "Not Eligible" : documentsComplete ? "Eligible" : "Incomplete Requirements";
  applicant.documentStatus = getDocumentSummary(applicant);
  applicant.aiSummary = generateAiSummary(applicant);
  applicant.explanation = generateExplanation(applicant, criticalFails);
  return applicant;
}

function getEligibilityChecks(applicant) {
  const enrolled = applicant.documents.registration === "Submitted";
  const working = ["Working student", "Part-time employee", "Business owner", "Income-generating activity"].includes(applicant.employmentStatus);
  return [
    { label: "Currently enrolled", passed: enrolled, critical: true },
    { label: "Working student, employee, business owner, or income earner", passed: working, critical: true },
    { label: "No failing grades in the previous semester", passed: !applicant.hasFailingGrades, critical: true },
    { label: "Not a beneficiary of a major full scholarship", passed: applicant.scholarshipStatus !== "Major full scholarship", critical: true },
    { label: "Has not previously received assistance under the same program", passed: applicant.previousAssistance !== "Received under same program", critical: true },
    { label: "Required documents are complete", passed: areDocumentsComplete(applicant), critical: false },
  ];
}

function areDocumentsComplete(applicant) {
  return Object.values(applicant.documents).every((status) => status === "Submitted");
}

function calculateScore(applicant, documentsComplete) {
  let score = 0;
  if (applicant.documents.registration === "Submitted") score += 20;
  if (["Working student", "Part-time employee", "Business owner", "Income-generating activity"].includes(applicant.employmentStatus)) score += 20;
  if (!applicant.hasFailingGrades) score += 15;
  if (applicant.scholarshipStatus !== "Major full scholarship") score += 20;
  if (applicant.financialNeed === "High") score += 15;
  if (applicant.financialNeed === "Moderate") score += 10;
  if (documentsComplete) score += 10;
  return score;
}

function getRecommendation(score, hasCriticalFail) {
  if (hasCriticalFail) return "Not Eligible";
  if (score >= 90) return "Highly Recommended";
  if (score >= 75) return "Recommended";
  if (score >= 60) return "Needs Further Review";
  return "Not Recommended";
}

function getDocumentSummary(applicant) {
  if (areDocumentsComplete(applicant)) return "Complete";
  if (Object.values(applicant.documents).includes("Missing")) return "Missing requirements";
  return "Needs verification";
}

function generateAiSummary(applicant) {
  const workingText = applicant.employmentStatus === "Not employed"
    ? "does not currently show a qualifying working or income-generating status"
    : `is listed as a ${applicant.employmentStatus.toLowerCase()}`;
  const documentText = applicant.documentStatus === "Complete"
    ? "submitted complete requirements"
    : `has document concerns marked as ${applicant.documentStatus.toLowerCase()}`;
  const gradeText = applicant.hasFailingGrades
    ? "has reported failing grades from the previous semester"
    : "has no reported failing grades from the previous semester";
  const scholarshipText = applicant.scholarshipStatus === "Major full scholarship"
    ? "is already a beneficiary of a major full scholarship"
    : "is not listed as a beneficiary of a major full scholarship with full financial coverage";

  return `${applicant.fullName} is a ${applicant.yearLevel} ${applicant.course} student who ${workingText}. The applicant ${documentText}, ${gradeText}, and ${scholarshipText}. Based on the rule-based screening and static AI-assisted summary, the application is recommended for SSC committee review with the final decision reserved for the committee.`;
}

function generateExplanation(applicant, criticalFails) {
  const passed = applicant.checks.filter((check) => check.passed).map((check) => check.label);
  const failed = applicant.checks.filter((check) => !check.passed).map((check) => check.label);
  if (criticalFails.length > 0) {
    return `The application is marked Not Eligible because one or more critical requirements failed: ${criticalFails.map((item) => item.label).join(", ")}. Passed checks include ${passed.join(", ") || "none"}.`;
  }
  if (!areDocumentsComplete(applicant)) {
    return `The applicant passes the critical eligibility checks but cannot be finalized because some required documents are missing, unclear, or need manual verification: ${failed.join(", ")}.`;
  }
  return `The applicant meets the basic eligibility requirements. The score reflects enrollment, working status, academic standing, scholarship status, financial need, and complete documents. Final approval still requires SSC committee review.`;
}

// Rendering functions
function renderAll() {
  applicants.forEach(evaluateApplicant);
  renderSummaryCards();
  renderFilters();
  renderApplicantTable();
  renderBeneficiaries();
  renderAuditLog();
}

function renderSummaryCards() {
  const summary = {
    "Total applicants": applicants.length,
    "Eligible applicants": applicants.filter((a) => a.eligibilityStatus === "Eligible").length,
    "Incomplete applications": applicants.filter((a) => a.eligibilityStatus === "Incomplete Requirements").length,
    "Needs further review": applicants.filter((a) => a.recommendation === "Needs Further Review").length,
    "For interview": applicants.filter((a) => a.committeeDecision === "For interview").length,
    "Recommended applicants": applicants.filter((a) => ["Highly Recommended", "Recommended"].includes(a.recommendation)).length,
    "Rejected applicants": applicants.filter((a) => a.committeeDecision === "Rejected").length,
  };
  document.getElementById("summaryCards").innerHTML = Object.entries(summary)
    .map(([label, count]) => `<article class="summary-card"><span>${label}</span><strong>${count}</strong></article>`)
    .join("");
}

function renderFilters() {
  document.getElementById("filterButtons").innerHTML = filters
    .map((filter) => `<button type="button" class="filter-btn ${activeFilter === filter ? "active" : ""}" onclick="setFilter('${filter}')">${filter}</button>`)
    .join("");
}

function setFilter(filter) {
  activeFilter = filter;
  renderFilters();
  renderApplicantTable();
}

function renderApplicantTable() {
  const rows = getFilteredApplicants().map((applicant) => `
    <tr>
      <td><div class="applicant-name">${applicant.fullName}</div><div class="subtext">${applicant.college}</div></td>
      <td>${applicant.studentId}</td>
      <td>${applicant.course}</td>
      <td>${badge(applicant.documentStatus, documentBadgeType(applicant.documentStatus))}</td>
      <td>${badge(applicant.eligibilityStatus, applicant.eligibilityStatus === "Eligible" ? "good" : applicant.eligibilityStatus === "Not Eligible" ? "bad" : "warn")}</td>
      <td><strong>${applicant.score}</strong>/100</td>
      <td>${badge(applicant.recommendation, recommendationBadgeType(applicant.recommendation))}</td>
      <td>${badge(applicant.committeeDecision, decisionBadgeType(applicant.committeeDecision))}</td>
      <td><button type="button" class="btn btn-primary btn-small" onclick="openApplicantDetail('${applicant.id}')">Review</button></td>
    </tr>
  `);
  document.getElementById("applicantTable").innerHTML = rows.join("") || `<tr><td colspan="9" class="empty-state">No applicants match this filter.</td></tr>`;
}

function getFilteredApplicants() {
  return applicants.filter((applicant) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Eligible") return applicant.eligibilityStatus === "Eligible";
    if (activeFilter === "Incomplete Requirements") return applicant.eligibilityStatus === "Incomplete Requirements";
    if (activeFilter === "Needs Further Review") return applicant.recommendation === "Needs Further Review";
    if (activeFilter === "Not Eligible") return applicant.eligibilityStatus === "Not Eligible";
    if (activeFilter === "For Interview") return applicant.committeeDecision === "For interview";
    if (activeFilter === "Recommended") return ["Highly Recommended", "Recommended"].includes(applicant.recommendation);
    if (activeFilter === "Rejected") return applicant.committeeDecision === "Rejected";
    return true;
  });
}

function renderBeneficiaries() {
  const approved = applicants.filter((applicant) => applicant.committeeDecision === "Approved for final list");
  document.getElementById("beneficiaryTable").innerHTML = approved.map((applicant) => `
    <tr>
      <td><strong>${applicant.fullName}</strong></td>
      <td>${applicant.studentId}</td>
      <td>${applicant.course}</td>
      <td>${applicant.score}</td>
      <td>${applicant.committeeDecision}</td>
      <td>${applicant.evaluatorNotes || "Approved after committee review."}</td>
      <td>${applicant.approvalDate}</td>
    </tr>
  `).join("") || `<tr><td colspan="7" class="empty-state">No committee-approved beneficiaries yet.</td></tr>`;
}

function renderAuditLog() {
  document.getElementById("auditList").innerHTML = auditEntries.map((entry) => `
    <article class="audit-entry">
      <div class="subtext">${entry.dateTime}</div>
      <div><strong>${entry.action}</strong><br>${entry.applicantName}<br><span class="subtext">${entry.notes}</span></div>
      <div><strong>Officer</strong><br>${entry.officer}</div>
    </article>
  `).join("");
}

// Applicant detail modal and committee actions
function openApplicantDetail(id) {
  selectedApplicantId = id;
  const applicant = applicants.find((item) => item.id === id);
  evaluateApplicant(applicant);
  document.getElementById("modalContent").innerHTML = applicantDetailTemplate(applicant);
  document.getElementById("detailModal").classList.add("open");
  document.getElementById("detailModal").setAttribute("aria-hidden", "false");
}

function closeModal() {
  document.getElementById("detailModal").classList.remove("open");
  document.getElementById("detailModal").setAttribute("aria-hidden", "true");
}

function applicantDetailTemplate(applicant) {
  const passed = applicant.checks.filter((check) => check.passed);
  const failed = applicant.checks.filter((check) => !check.passed);
  return `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Applicant detail and committee review</p>
        <h2 id="modalTitle">${applicant.fullName}</h2>
        <p class="muted">${applicant.studentId} • ${applicant.course} • ${applicant.yearLevel}</p>
      </div>
      <div>
        ${badge(applicant.recommendation, recommendationBadgeType(applicant.recommendation))}
        ${badge(`${applicant.score}/100`, "neutral")}
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-card">
        <h3>Explainable Recommendation</h3>
        <p class="explanation"><strong>AI recommendation:</strong> ${applicant.recommendation}</p>
        <p class="explanation"><strong>Score:</strong> ${applicant.score}/100</p>
        <p class="explanation"><strong>Summary:</strong> ${applicant.aiSummary}</p>
        <p class="explanation"><strong>Explanation:</strong> ${applicant.explanation}</p>
      </div>
      <div class="detail-card">
        <h3>Document Tracking</h3>
        <ul class="document-list">
          ${documentRow("Certificate of Registration", applicant.documents.registration)}
          ${documentRow("Certificate of Indigency or ITR", applicant.documents.indigency)}
          ${documentRow("Proof of Employment or Income-generating Activity", applicant.documents.employmentProof)}
          ${documentRow("Gradeslip or Academic Record", applicant.documents.gradeslip)}
        </ul>
      </div>
      <div class="detail-card">
        <h3>Passed Requirements</h3>
        <ul class="requirement-list">
          ${passed.map((check) => `<li><span>${check.label}</span>${badge("Passed", "good")}</li>`).join("") || "<li>No passed requirements recorded.</li>"}
        </ul>
      </div>
      <div class="detail-card">
        <h3>Failed or Missing Requirements</h3>
        <ul class="requirement-list">
          ${failed.map((check) => `<li><span>${check.label}</span>${badge(check.critical ? "Critical" : "Needs action", check.critical ? "bad" : "warn")}</li>`).join("") || "<li>None. Applicant satisfies the listed checks.</li>"}
        </ul>
      </div>
      <div class="detail-card">
        <h3>Committee Review Notes</h3>
        <label>Evaluator notes
          <textarea id="evaluatorNotes">${applicant.evaluatorNotes}</textarea>
        </label>
        <label>Interview notes
          <textarea id="interviewNotes">${applicant.interviewNotes}</textarea>
        </label>
        <label>Override reason
          <textarea id="overrideReason" placeholder="Required when overriding the AI recommendation.">${applicant.overrideReason}</textarea>
        </label>
      </div>
      <div class="detail-card">
        <h3>Human Review and Override</h3>
        <p class="explanation">The AI recommendation is advisory. The SSC committee may approve, reject, interview, request documents, or override with a recorded reason.</p>
        <div class="review-actions">
          <button class="btn btn-primary" onclick="recordCommitteeDecision('Approved for final list')">Approve for final list</button>
          <button class="btn btn-danger" onclick="recordCommitteeDecision('Rejected')">Reject</button>
          <button class="btn btn-secondary" onclick="recordCommitteeDecision('For interview')">Mark for interview</button>
          <button class="btn btn-warning" onclick="recordCommitteeDecision('Missing document requested')">Request missing document</button>
          <button class="btn btn-secondary" onclick="recordCommitteeDecision('Override AI recommendation')">Override AI recommendation</button>
        </div>
      </div>
    </div>
  `;
}

function documentRow(label, status) {
  return `<li><span>${label}</span>${badge(status, documentStatusBadge(status))}</li>`;
}

function recordCommitteeDecision(decision) {
  const applicant = applicants.find((item) => item.id === selectedApplicantId);
  const evaluatorNotes = document.getElementById("evaluatorNotes").value.trim();
  const interviewNotes = document.getElementById("interviewNotes").value.trim();
  const overrideReason = document.getElementById("overrideReason").value.trim();

  if (decision === "Override AI recommendation" && !overrideReason) {
    showToast("Override reason is required before overriding the AI recommendation.");
    return;
  }

  applicant.evaluatorNotes = evaluatorNotes;
  applicant.interviewNotes = interviewNotes;
  applicant.overrideReason = overrideReason;

  if (decision === "Override AI recommendation") {
    applicant.committeeDecision = "Committee override recorded";
    addAuditEntry(applicant, "AI recommendation overridden", overrideReason);
  } else {
    applicant.committeeDecision = decision;
    if (decision === "Approved for final list") applicant.approvalDate = new Date().toLocaleDateString();
    const actionMap = {
      "Approved for final list": "Applicant approved",
      Rejected: "Applicant rejected",
      "For interview": "Marked for interview",
      "Missing document requested": "Missing document requested",
    };
    addAuditEntry(applicant, actionMap[decision], evaluatorNotes || interviewNotes || "Committee decision recorded.");
  }

  renderAll();
  openApplicantDetail(applicant.id);
  showToast("Committee action recorded in the audit trail.");
}

// Audit trail and UI helpers
function addAuditEntry(applicant, action, notes, rerender = true) {
  auditEntries.unshift({
    dateTime: new Date().toLocaleString(),
    applicantName: applicant.fullName,
    action,
    officer: officerName,
    notes,
  });
  if (rerender) renderAuditLog();
}

function badge(text, type) {
  return `<span class="badge ${type}">${text}</span>`;
}

function documentBadgeType(summary) {
  if (summary === "Complete") return "good";
  if (summary === "Missing requirements") return "bad";
  return "warn";
}

function documentStatusBadge(status) {
  if (status === "Submitted") return "good";
  if (status === "Missing") return "bad";
  return "warn";
}

function recommendationBadgeType(recommendation) {
  if (["Highly Recommended", "Recommended"].includes(recommendation)) return "good";
  if (recommendation === "Needs Further Review") return "warn";
  if (["Not Recommended", "Not Eligible"].includes(recommendation)) return "bad";
  return "neutral";
}

function decisionBadgeType(decision) {
  if (decision === "Approved for final list") return "good";
  if (decision === "Rejected") return "bad";
  if (decision === "For interview") return "info";
  if (decision === "Missing document requested") return "warn";
  if (decision === "Committee override recorded") return "info";
  return "neutral";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}
