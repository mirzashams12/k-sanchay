import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';
import { PaymentMethod, Transaction, TransactionStatus, TransactionType } from '@/app/types/transaction';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('members')
            .select(`
                id,
                full_name,
                contributions (
                    id,
                    amount,
                    contribution_date,
                    created_at,
                    updated_at
                ),
                loans (
                    id,
                    loan_amount,
                    loan_date,
                    status,
                    created_at,
                    updated_at,
                    repayments (
                        id,
                        amount_paid,
                        payment_date,
                        created_at,
                        updated_at
                    )
                )
                `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data into the Transaction interface
        const allTransactions: Transaction[] = data.flatMap((member) => {
            const memberName = member.full_name;
            const memberId = member.id;

            // 1. Map Contributions
            const contributions = member.contributions.map((c): Transaction => ({
                id: `cont-${c.id}`, // Ensuring unique ID across different tables
                reference_id: c.id.toString(),
                member_id: memberId,
                member_name: memberName,
                amount: c.amount.toString(),
                type: 'contribution' as TransactionType,
                status: 'completed' as TransactionStatus,
                date: c.contribution_date,
                payment_method: 'cash' as PaymentMethod, // Defaulting as per Sanchayika typical use
                created_at: c.created_at,
                updated_at: c.updated_at,
            }));

            // 2. Map Loans
            const loans = member.loans.map((l): Transaction => ({
                id: `loan-${l.id}`,
                reference_id: l.id.toString(),
                member_id: memberId,
                member_name: memberName,
                amount: l.loan_amount.toString(),
                type: 'loan' as TransactionType,
                status: (l.status === 'active' ? 'pending' : 'completed') as TransactionStatus,
                date: l.loan_date,
                payment_method: 'bank_transfer' as PaymentMethod,
                description: `Loan Disbursement`,
                created_at: l.created_at,
                updated_at: l.updated_at,
            }));

            // 3. Map Repayments
            const repayments = member.loans.flatMap((l) =>
                (l.repayments || []).map((r): Transaction => ({
                    id: `repay-${r.id}`,
                    reference_id: r.id.toString(),
                    member_id: memberId,
                    member_name: memberName,
                    amount: r.amount_paid.toString(),
                    type: 'repayment' as TransactionType,
                    status: 'completed' as TransactionStatus,
                    date: r.payment_date,
                    payment_method: 'cash' as PaymentMethod,
                    description: `Repayment for Loan #${l.id}`,
                    created_at: r.created_at,
                    updated_at: r.updated_at,
                }))
            );

            return [...contributions, ...loans, ...repayments];
        });

        // Sort all transactions by created_at in descending order (newest first)
        const sortedTransactions = allTransactions.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        return NextResponse.json(sortedTransactions);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        let result = null;
        let errorResult = null;

        const { type } = body;

        if (type === ("deposit" as TransactionType)) {
            const { member_id, amount, date: contribution_date } = body
            const { data, error } = await supabase
                .from('contributions')
                .insert([{ member_id, amount, contribution_date }])
                .select()
                .single();

            result = data;
            errorResult = error;
        }
        //update tables for loan and repayment based on the get
        else if (type === ("loan" as TransactionType)) {
            const { member_id, amount: loan_amount, date: loan_date } = body;
            const { data, error } = await supabase
                .from('loans')
                .insert([{
                    member_id,
                    loan_amount,
                    loan_date,
                    status: 'active'
                }])
                .select()
                .single();

            result = data;
            errorResult = error;
        }
        else if (type === ("repayment" as TransactionType)) {
            const { reference_id: loan_id, amount: amount_paid, date: payment_date } = body;
            const { data, error } = await supabase
                .from('repayments')
                .insert([{
                    loan_id,
                    amount_paid,
                    payment_date
                }])
                .select()
                .single();

            result = data;
            errorResult = error;
        }

        else {
            throw new Error('Invalid transaction type');
        }


        if (errorResult) throw errorResult;

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

//patch based on the put 
export async function PATCH(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id'); // This is the prefixed ID (e.g., 'cont-1')
        const body = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
        }

        const [prefix, realId] = id.split('-');
        let result = null;
        let errorResult = null;

        if (prefix === 'cont') {
            const { data, error } = await supabase
                .from('contributions')
                .update({
                    amount: body.amount,
                    contribution_date: body.date
                })
                .eq('id', realId)
                .select()
                .single();
            result = data;
            errorResult = error;
        } else if (prefix === 'loan') {
            const { data, error } = await supabase
                .from('loans')
                .update({
                    loan_amount: body.amount,
                    loan_date: body.date,
                    status: body.status === 'completed' ? 'paid' : 'active'
                })
                .eq('id', realId)
                .select()
                .single();
            result = data;
            errorResult = error;
        } else if (prefix === 'repay') {
            const { data, error } = await supabase
                .from('repayments')
                .update({
                    amount_paid: body.amount,
                    payment_date: body.date
                })
                .eq('id', realId)
                .select()
                .single();
            result = data;
            errorResult = error;
        } else {
            throw new Error('Invalid transaction ID format');
        }

        if (errorResult) throw errorResult;

        return NextResponse.json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

//delete based on the delete
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
        }

        const [prefix, realId] = id.split('-');
        let errorResult = null;

        if (prefix === 'cont') {
            const { error } = await supabase
                .from('contributions')
                .delete()
                .eq('id', realId);
            errorResult = error;
        } else if (prefix === 'loan') {
            const { error } = await supabase
                .from('loans')
                .delete()
                .eq('id', realId);
            errorResult = error;
        } else if (prefix === 'repay') {
            const { error } = await supabase
                .from('repayments')
                .delete()
                .eq('id', realId);
            errorResult = error;
        } else {
            throw new Error('Invalid transaction ID format');
        }

        if (errorResult) throw errorResult;

        return NextResponse.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
