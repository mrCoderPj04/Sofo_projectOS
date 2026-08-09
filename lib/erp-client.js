/**
 * Pjsofonic ERP Backend Integration Client
 * Live Backend: https://erp-backend-1-02lc.onrender.com
 */

const ERP_BASE_URL = process.env.ERP_BACKEND_URL || 'https://erp-backend-1-02lc.onrender.com';

export async function authenticateWithErpBackend(identifier, password) {
  const possibleEndpoints = [
    '/api/auth/login',
    '/api/login',
    '/api/users/login',
    '/api/employee/login',
    '/api/v1/auth/login'
  ];

  const payloadCandidates = [
    { loginId: identifier, password },
    { employeeId: identifier, password },
    { email: identifier, password },
    { username: identifier, password }
  ];

  for (const endpoint of possibleEndpoints) {
    for (const payload of payloadCandidates) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout for Render cold start

        const res = await fetch(`${ERP_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const user = data.user || data.employee || data.data?.user || data.data;

          if (user) {
            return {
              success: true,
              erpUser: {
                employeeId: user.employeeId || user.empId || user.loginId || identifier,
                name: user.name || user.fullName || user.username || identifier,
                email: user.email || `${identifier.toLowerCase()}@pjsofonic-erp.com`,
                role: (user.role || 'EMPLOYEE').toUpperCase(),
                department: user.department || 'Pjsofonic ERP Unit'
              },
              rawResponse: data
            };
          }
        }
      } catch (err) {
        // Continue checking other candidates/endpoints
      }
    }
  }

  // ERP backend didn't accept API call directly or cold-starting endpoint signature differs
  return { success: false, message: 'ERP Authentication endpoint unreached or invalid credentials' };
}
