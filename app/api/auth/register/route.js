import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    error: 'Registration is disabled on ProjectOS. Accounts are created and provisioned exclusively via Pjsofonic ERP Central Administration (https://erp-backend-1-02lc.onrender.com).'
  }, { status: 403 });
}
