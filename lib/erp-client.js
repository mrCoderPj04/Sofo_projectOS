/**
 * Pjsofonic EMS & ERP Dual Backend Integration Client
 * EMS Backend API: https://erp-backend-1-02lc.onrender.com/api
 * ERP Backend API: https://pjsofonic-erp-backend.onrender.com/api
 */

const EMS_API_BASE_URL = process.env.EMS_API_URL || 'https://erp-backend-1-02lc.onrender.com/api';
const ERP_API_BASE_URL = process.env.ERP_API_URL || 'https://pjsofonic-erp-backend.onrender.com/api';

/**
 * Checks whether an employee's department or role corresponds to "Team Leader".
 */
export function isTeamLeaderDepartment(user) {
  if (!user) return false;

  const department = String(user.department || user.dept || '').trim().toLowerCase();
  const role = String(user.role || user.userRole || '').trim().toLowerCase();
  const designation = String(user.designation || user.title || user.position || '').trim().toLowerCase();

  const keywords = ['team leader', 'team lead', 'teamleader', 'team_lead', 'team_leader', 'tl', 'lead'];

  const isDeptMatch = keywords.some(k => department.includes(k));
  const isRoleMatch = keywords.some(k => role.includes(k));
  const isDesigMatch = keywords.some(k => designation.includes(k));

  return isDeptMatch || isRoleMatch || isDesigMatch;
}

export function isTeamLeaderRoleOrDepartment(user) {
  return isTeamLeaderDepartment(user);
}

/**
 * Authenticates user credentials against EMS and ERP Backends, attempting payload normalization.
 */
export async function authenticateWithEms(identifier, password) {
  const cleanId = (identifier || '').trim();
  const cleanPass = (password || '').trim();

  const backends = [
    { name: 'Pjsofonic EMS', baseUrl: EMS_API_BASE_URL },
    { name: 'Pjsofonic ERP', baseUrl: ERP_API_BASE_URL }
  ];

  const endpoints = ['/auth/login', '/login', '/auth', '/employee/login'];

  const idCandidates = [
    cleanId,
    cleanId.toUpperCase(),
    cleanId.toLowerCase()
  ];

  let lastErrorMessage = '';

  for (const backend of backends) {
    for (const endpoint of endpoints) {
      for (const id of idCandidates) {
        const payload = {
          employeeId: id,
          email: id,
          loginId: id,
          username: id,
          password: cleanPass
        };

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 7000);

          const res = await fetch(`${backend.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          const data = await res.json().catch(() => ({}));

          if (res.ok && (data.user || data.employee || data.data?.user || data.token || data.success)) {
            const user = data.user || data.employee || data.data?.user || data.data || {};

            const empDepartment = user.department || user.dept || 'Team Leader';
            const isTeamLead = isTeamLeaderDepartment(user);

            // Extract EMS profile picture / avatar URL
            const rawAvatar =
              user.avatarUrl ||
              user.avatar ||
              user.profilePic ||
              user.profilePicture ||
              user.profile_picture ||
              user.image ||
              user.photo ||
              user.profileImage ||
              user.img ||
              user.picture ||
              data.avatarUrl ||
              data.avatar ||
              data.profilePic ||
              null;

            let avatarUrl = null;
            if (rawAvatar && typeof rawAvatar === 'string' && rawAvatar.trim()) {
              const trimmed = rawAvatar.trim();
              if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
                avatarUrl = trimmed;
              } else {
                const cleanBase = backend.baseUrl.replace(/\/api\/?$/, '');
                const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
                avatarUrl = `${cleanBase}${cleanPath}`;
              }
            } else {
              const nameSeed = user.name || user.fullName || user.username || cleanId;
              avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nameSeed)}`;
            }

            return {
              success: true,
              isTeamLead,
              systemName: backend.name,
              emsUser: {
                employeeId: user.employeeId || user.empId || user.loginId || cleanId,
                name: user.name || user.fullName || user.username || cleanId,
                email: user.email || `${cleanId.toLowerCase()}@pjsofonic.com`,
                role: (user.role || 'EMPLOYEE').toUpperCase(),
                department: empDepartment,
                avatarUrl
              },
              rawResponse: data
            };
          }

          if (data.error || data.message) {
            const msg = data.error || data.message;
            if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('credentials') || msg.toLowerCase().includes('invalid')) {
              lastErrorMessage = msg;
            }
          }

        } catch (err) {
          // Continue
        }
      }
    }
  }

  if (lastErrorMessage) {
    return {
      success: false,
      isInvalidCredentials: true,
      message: lastErrorMessage
    };
  }

  return {
    success: false,
    message: 'Invalid Employee ID or Password. User not found in Pjsofonic EMS/ERP backend.'
  };
}

export async function authenticateWithEmsAndErp(identifier, password) {
  return await authenticateWithEms(identifier, password);
}

export async function authenticateWithErpBackend(identifier, password) {
  return await authenticateWithEms(identifier, password);
}

/**
 * Fetches active projects from Pjsofonic ERP & EMS Backends.
 */
export async function fetchErpProjects() {
  const endpoints = [
    'https://pjsofonic-erp-backend.onrender.com/api/projects',
    'https://erp-backend-1-02lc.onrender.com/api/projects',
    'https://erp-backend-1-02lc.onrender.com/api/tasks'
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const projectsList = data.projects || data.data || (Array.isArray(data) ? data : null);

        if (Array.isArray(projectsList) && projectsList.length > 0) {
          return projectsList.map(p => ({
            id: p.id || p._id || `erp-${Math.random().toString(36).substring(2, 9)}`,
            name: p.name || p.title || p.projectName || 'Pjsofonic ERP Project',
            description: p.description || p.desc || 'Fetched from Pjsofonic ERP Backend',
            type: p.type || 'ERP Sync',
            priority: (p.priority || 'HIGH').toUpperCase(),
            status: (p.status || 'ACTIVE').toUpperCase(),
            startDate: p.startDate || new Date().toISOString().split('T')[0],
            targetDate: p.targetDate || p.dueDate || null,
            logoUrl: p.logoUrl || p.logo || p.icon || p.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(p.name || p.title || 'PJ')}`,
            techStack: Array.isArray(p.techStack) ? JSON.stringify(p.techStack) : (p.techStack || '[]')
          }));
        }
      }
    } catch (err) {
      // Continue
    }
  }

  return [];
}
