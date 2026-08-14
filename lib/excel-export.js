/**
 * Pjsofonic ERP — Excel Report Generator for Systemic Problems
 * Exports problem resolution reports in Microsoft Excel spreadsheet format (.csv / .xlsx openable).
 */

export function generateProblemsExcelData(problemsList = []) {
  const headers = [
    'Date',
    'Project Name',
    'Project Link',
    'Problem Id',
    'Title',
    'Environment Scope',
    'Severity',
    'Status',
    'Problem Overview & Symptoms',
    'Answer',
    'Whys Root Cause Traversal',
    'Confirmed Root Cause',
    'Solution',
    'Resolution Actions Taken ("Kya Kya Kra")',
    'Status',
    'Resolution Date',
    'System Verification: Verified by',
    'Engineer verification'
  ];

  const rows = problemsList.map((prob) => {
    // 1. Date
    const dateStr = prob.createdAt
      ? new Date(prob.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    // 2. Project Name
    const projName = prob.project?.name || 'N/A';

    // 3. Project Link
    const projLink = prob.projectId
      ? `https://sofo-projectos.onrender.com/projects/${prob.projectId}`
      : 'N/A';

    // 4. Problem ID
    const probId = prob.probId || 'PROB-201';

    // 5. Title
    const title = prob.title || '';

    // 6. Environment Scope
    const envScope = prob.environmentScope || 'Backend';

    // 7. Severity
    const severity = prob.severity || 'HIGH';

    // 8. Status
    const status = prob.status || 'IDENTIFIED';

    // 9. Symptoms
    const symptoms = (prob.symptoms || prob.description || '').replace(/\r?\n/g, ' ');

    // 10 & 11. Parse 5-Whys data
    let fiveWhysArr = [];
    if (prob.rca?.fiveWhysData) {
      try {
        fiveWhysArr = typeof prob.rca.fiveWhysData === 'string'
          ? JSON.parse(prob.rca.fiveWhysData)
          : prob.rca.fiveWhysData;
      } catch (e) {
        fiveWhysArr = [];
      }
    }

    const answersList = Array.isArray(fiveWhysArr)
      ? fiveWhysArr.map((w) => `Why #${w.whyNumber}: ${w.answer || 'N/A'}`).join(' | ')
      : 'N/A';

    const whysTraversal = Array.isArray(fiveWhysArr)
      ? fiveWhysArr.map((w) => `Q${w.whyNumber}: ${w.question} -> Ans: ${w.answer || 'N/A'}`).join(' || ')
      : 'N/A';

    // 12. Confirmed Root Cause
    const rootCause = prob.rca?.confirmedRootCause || 'Under Investigation';

    // 13. Solution
    let solText = 'No solution selected yet.';
    if (Array.isArray(prob.solutions) && prob.solutions.length > 0) {
      const selected = prob.solutions.find((s) => s.status === 'SELECTED') || prob.solutions[0];
      if (selected) {
        solText = `${selected.title} (${selected.approach || 'Standard approach'})`;
      }
    }

    // 14. Resolution Actions Taken ("Kya Kya Kra")
    let stepsArr = [];
    if (prob.resolutionSteps) {
      try {
        stepsArr = typeof prob.resolutionSteps === 'string'
          ? JSON.parse(prob.resolutionSteps)
          : prob.resolutionSteps;
      } catch (e) {
        if (typeof prob.resolutionSteps === 'string') {
          stepsArr = [prob.resolutionSteps];
        }
      }
    }
    const kyaKyaKra = Array.isArray(stepsArr) && stepsArr.length > 0
      ? stepsArr.map((s, idx) => `${idx + 1}. ${s}`).join(' ; ')
      : 'No step-by-step resolution actions logged.';

    // 15. Resolution Status
    const resStatus = prob.status || 'IDENTIFIED';

    // 16. Resolution Date
    const resDate = prob.resolvedAt
      ? new Date(prob.resolvedAt).toISOString().split('T')[0]
      : 'In Progress';

    // 17. System Verification
    const sysVerified = 'Verified by Pjsofonic ERP Systemic Engine';

    // 18. Engineer Verification
    const engVerified = prob.reporter?.name || prob.owner?.name || 'Verified by Team Leader';

    return [
      dateStr,
      projName,
      projLink,
      probId,
      title,
      envScope,
      severity,
      status,
      symptoms,
      answersList,
      whysTraversal,
      rootCause,
      solText,
      kyaKyaKra,
      resStatus,
      resDate,
      sysVerified,
      engVerified
    ];
  });

  return { headers, rows };
}

/**
 * Escapes a cell value for CSV format.
 */
function escapeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Downloads an Excel spreadsheet (.csv / .xlsx) directly in the browser.
 */
export function downloadProblemsAsExcel(problemsList, filename = 'Pjsofonic-Systemic-Problem-Reports.csv') {
  const { headers, rows } = generateProblemsExcelData(problemsList);

  const csvContent =
    '\uFEFF' + // UTF-8 Byte Order Mark for Excel
    headers.map(escapeCsvCell).join(',') + '\n' +
    rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
