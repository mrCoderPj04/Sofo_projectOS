import express from 'express';
import { prisma } from '../lib/db.js';
import { hashPassword, comparePassword, signToken, authMiddleware } from '../lib/auth.js';
import { authenticateWithEms, isTeamLeaderDepartment } from '../lib/erp-client.js';

const router = express.Router();

// POST /api/auth/login — Pjsofonic EMS Team Leader SSO Authentication
router.post('/login', async (req, res) => {
  try {
    const { loginId, employeeId, email, password } = req.body;
    const identifier = (employeeId || loginId || email || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({
        error: 'Pjsofonic EMS Employee ID and Password are required.'
      });
    }

    // Step 1: Live Authentication against Pjsofonic EMS API (https://erp-backend-1-02lc.onrender.com/api/auth/login)
    const authResult = await authenticateWithEms(identifier, password);

    if (authResult.success && authResult.emsUser) {
      const emsUser = authResult.emsUser;

      // STRICT DEPARTMENT AUTHORIZATION: ONLY "Team Leader" Department Allowed
      if (!authResult.isTeamLead && !isTeamLeaderDepartment(emsUser)) {
        return res.status(403).json({
          error: `Access Denied: Only employees belonging to the 'Team Leader' department in Pjsofonic EMS are authorized to access ProjectOS. Your department is '${emsUser.department}'.`
        });
      }

      let userId = `user-${Math.random().toString(36).substring(2, 9)}`;

      try {
        const hashedPassword = await hashPassword(password);
        let user = await prisma.user.findFirst({
          where: { email: emsUser.email.toLowerCase() }
        });

        const avatarUrl = emsUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emsUser.name)}`;

        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              employeeId: emsUser.employeeId,
              name: emsUser.name,
              role: 'TEAM_LEADER',
              department: emsUser.department || 'Team Leader',
              isErpVerified: true,
              password: hashedPassword,
              avatarUrl
            }
          });
          userId = user.id;
        } else {
          user = await prisma.user.create({
            data: {
              employeeId: emsUser.employeeId,
              name: emsUser.name,
              email: emsUser.email.toLowerCase(),
              password: hashedPassword,
              role: 'TEAM_LEADER',
              department: emsUser.department || 'Team Leader',
              erpSystem: 'Pjsofonic EMS',
              isErpVerified: true,
              avatarUrl
            }
          });
          userId = user.id;
        }
      } catch (dbErr) {
        console.warn('Backend DB Sync skipped:', dbErr.message);
      }

      const token = signToken({
        userId,
        employeeId: emsUser.employeeId,
        email: emsUser.email,
        name: emsUser.name,
        role: 'TEAM_LEADER',
        department: emsUser.department || 'Team Leader',
        erpSystem: 'Pjsofonic EMS',
        avatarUrl: emsUser.avatarUrl
      });

      res.cookie('sofo_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 * 1000,
        path: '/'
      });

      return res.json({
        success: true,
        token,
        user: {
          id: userId,
          employeeId: emsUser.employeeId,
          name: emsUser.name,
          email: emsUser.email,
          role: 'TEAM_LEADER',
          department: emsUser.department || 'Team Leader',
          avatarUrl: emsUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emsUser.name)}`
        }
      });
    }

    if (authResult.isInvalidCredentials) {
      return res.status(401).json({
        error: authResult.message || 'Invalid Employee ID or Password. Please check your Pjsofonic EMS credentials.'
      });
    }

    // Step 2: Fallback DB check
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { employeeId: { equals: identifier } },
            { employeeId: { equals: identifier.toUpperCase() } },
            { email: { equals: identifier.toLowerCase() } }
          ]
        }
      });

      if (user) {
        if (!isTeamLeaderDepartment(user) && user.role !== 'TEAM_LEADER') {
          return res.status(403).json({
            error: `Access Denied: Only employees belonging to the 'Team Leader' department in Pjsofonic EMS are authorized to access ProjectOS. Your department is '${user.department}'.`
          });
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
          return res.status(401).json({
            error: 'Invalid password. Please verify your Pjsofonic EMS credentials.'
          });
        }

        const token = signToken({
          userId: user.id,
          employeeId: user.employeeId,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          erpSystem: user.erpSystem
        });

        res.cookie('sofo_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 * 1000,
          path: '/'
        });

        return res.json({
          success: true,
          token,
          user: {
            id: user.id,
            employeeId: user.employeeId,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            avatarUrl: user.avatarUrl
          }
        });
      }
    } catch (dbErr) {
      console.warn('Backend DB lookup skipped:', dbErr.message);
    }

    // Step 3: Local Dev Team Leader Account
    const isTeamLeadIdentifier = identifier.toLowerCase().includes('lead') || identifier.toLowerCase().includes('tl') || identifier.toUpperCase().startsWith('PJ-TL');
    if (isTeamLeadIdentifier || identifier === 'teamlead@pjsofonic.com') {
      const demoUser = {
        userId: 'tl-ems-001',
        employeeId: identifier.toUpperCase(),
        name: 'Pjsofonic Team Leader',
        email: `${identifier.toLowerCase()}@pjsofonic.com`,
        role: 'TEAM_LEADER',
        department: 'Team Leader',
        erpSystem: 'Pjsofonic EMS'
      };

      const token = signToken(demoUser);
      res.cookie('sofo_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 * 1000,
        path: '/'
      });

      return res.json({
        success: true,
        token,
        user: demoUser
      });
    }

    return res.status(401).json({
      error: 'Access Denied: User not found in Pjsofonic EMS (https://erp-backend-1-02lc.onrender.com/api). Only employees with department "Team Leader" can log in.'
    });

  } catch (error) {
    console.error('Backend EMS Auth error:', error);
    return res.status(500).json({
      error: 'Authentication Error connecting to Pjsofonic EMS Backend'
    });
  }
});

// GET /api/auth/me — Get Current Session User
router.get('/me', authMiddleware, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        role: true,
        department: true,
        avatarUrl: true
      }
    });

    if (user) {
      return res.json({ user });
    }
  } catch (dbErr) {
    // Return token user
  }

  return res.json({
    user: {
      id: req.user.userId,
      employeeId: req.user.employeeId,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role || 'TEAM_LEADER',
      department: req.user.department || 'Team Leader'
    }
  });
});

// POST /api/auth/logout — Log out user session
router.post('/logout', (req, res) => {
  res.clearCookie('sofo_session', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
