import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Get total cases count
    const totalCasesResult = await query('SELECT COUNT(*) as count FROM cases')
    const totalCases = totalCasesResult[0]?.count || 0

    // Get active cases count
    const activeCasesResult = await query('SELECT COUNT(*) as count FROM cases WHERE status = "Active"')
    const activeCases = activeCasesResult[0]?.count || 0

    // Get total clients count
    const totalClientsResult = await query('SELECT COUNT(*) as count FROM clients')
    const totalClients = totalClientsResult[0]?.count || 0

    // Get total hearings count
    const totalHearingsResult = await query('SELECT COUNT(*) as count FROM hearings')
    const totalHearings = totalHearingsResult[0]?.count || 0

    // Get today's hearings count
    const todayHearingsResult = await query(
      'SELECT COUNT(*) as count FROM hearings WHERE DATE(date) = CURDATE()'
    )
    const todayHearings = todayHearingsResult[0]?.count || 0

    // Get pending cases count
    const pendingCasesResult = await query('SELECT COUNT(*) as count FROM cases WHERE status = "Pending"')
    const pendingCases = pendingCasesResult[0]?.count || 0

    // Get closed cases count
    const closedCasesResult = await query('SELECT COUNT(*) as count FROM cases WHERE status = "Closed"')
    const closedCases = closedCasesResult[0]?.count || 0

    // Get this week's hearings count
    const weekHearingsResult = await query(
      'SELECT COUNT(*) as count FROM hearings WHERE YEARWEEK(date) = YEARWEEK(CURDATE())'
    )
    const weekHearings = weekHearingsResult[0]?.count || 0

    const stats = {
      totalCases,
      activeCases,
      totalClients,
      totalHearings,
      todayHearings,
      pendingCases,
      closedCases,
      weekHearings
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
