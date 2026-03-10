import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';
import { TransactionType } from '@/app/types/transaction';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
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
        else if (type === ("loan_disbursement" as TransactionType)) {
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
        else if (type === ("loan_repayment" as TransactionType)) {
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
        else if (type === ("payout" as TransactionType)) {
            // Assuming a 'payouts' table exists, or mapping to expenses
            const { member_id, amount, date: payout_date } = body;
            const { data, error } = await supabase
                .from('payouts') // Ensure this table exists in Supabase
                .insert([{
                    member_id,
                    amount,
                    payout_date
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
        const realId = searchParams.get('id');
        const prefix = searchParams.get('type');
        const body = await request.json();

        console.log(realId, prefix)

        if (!realId) {
            return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
        }

        let result = null;
        let errorResult = null;

        if (prefix === 'deposit') {
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
        } else if (prefix === 'loan_disbursement') {
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
        } else if (prefix === 'loan_repayment') {
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
        } else if (prefix === 'payout') {
            const { data, error } = await supabase
                .from('payouts')
                .update({
                    amount: body.amount,
                    payout_date: body.date
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
        const realId = searchParams.get('id');
        const prefix = searchParams.get('type');

        if (!realId) {
            return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
        }

        let errorResult = null;

        if (prefix === 'deposit') {
            const { error } = await supabase
                .from('contributions')
                .delete()
                .eq('id', realId);
            errorResult = error;
        } else if (prefix === 'loan_disbursement') {
            const { error } = await supabase
                .from('loans')
                .delete()
                .eq('id', realId);
            errorResult = error;
        } else if (prefix === 'loan_repayment') {
            const { error } = await supabase
                .from('repayments')
                .delete()
                .eq('id', realId);
            errorResult = error;
        } else if (prefix === 'payout') {
            const { error } = await supabase
                .from('payouts')
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
