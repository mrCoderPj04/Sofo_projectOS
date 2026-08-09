import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, hashPassword, signToken } from '@/lib/auth';
import { authenticateWithErpBackend } from '@/lib/erp-client';

export async function POST(request) {
  try {
    const { loginId, email, password } = await request.json();
    const identifier = (loginId || email || '').trim();

    if (!identifier || !password) {
      return NextResponse.json({
        error: 'Pjsofonic ERP Employee ID / Login ID and Password are required'
      }, { status: 400 });
    }

    // Step 1: Attempt Live ERP Backend Authentication (https://erp-backend-1-02lc.onrender.com)
    const erpResult = await authenticateWithErpBackend(identifier, password);

    if (erpResult.success && erpResult.erpUser) {
      const erpUser = erpResult.erpUser;
      const hashedPassword = await hashPassword(password);

      // Sync/Upsert verified Pjsofonic ERP employee into system
      let user = await prisma.user.findFirst({
        where: { email: erpUser.email.toLowerCase() }
      });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            employeeId: erpUser.employeeId,
            name: erpUser.name,
            role: erpUser.role,
            department: erpUser.department,
            isErpVerified: true,
            password: hashedPassword
          }
        });
      } else {
        user = await prisma.user.create({
          data: {
            employeeId: erpUser.employeeId,
            name: erpUser.name,
            email: erpUser.email.toLowerCase(),
            password: hashedPassword,
            role: erpUser.role,
            department: erpUser.department,
            erpSystem: 'Pjsofonic ERP',
            isErpVerified: true,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(erpUser.name)}`
          }
        });
      }

      const token = await signToken({
        userId: user.id,
        employeeId: user.employeeId,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        erpSystem: 'Pjsofonic ERP'
      });

      const response = NextResponse.json({
        success: true,
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

      response.cookies.set('sofo_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });

      return response;
    }

    // Step 2: Fallback check against Pjsofonic ERP DB verified registered employees
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { employeeId: { equals: identifier } },
          { employeeId: { equals: identifier.toUpperCase() } },
          { email: { equals: identifier.toLowerCase() } }
        ]
      }
    });

    if (!user) {
      return NextResponse.json({
        error: 'Access Denied: Login ID is not registered in Pjsofonic ERP (https://erp-backend-1-02lc.onrender.com). Only registered Pjsofonic ERP Employees and Admins can log in.'
      }, { status: 401 });
    }

    if (user.isErpVerified === false) {
      return NextResponse.json({
        error: 'Access Denied: Account is not verified in Pjsofonic ERP system.'
      }, { status: 403 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({
        error: 'Invalid ERP Password. Please check your Pjsofonic ERP credentials.'
      }, { status: 401 });
    }

    const token = await signToken({
      userId: user.id,
      employeeId: user.employeeId,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      erpSystem: user.erpSystem
    });

    const response = NextResponse.json({
      success: true,
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

    response.cookies.set('sofo_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Pjsofonic ERP Login error:', error);
    return NextResponse.json({ error: 'Internal Pjsofonic ERP Authentication Error' }, { status: 500 });
  }
}
