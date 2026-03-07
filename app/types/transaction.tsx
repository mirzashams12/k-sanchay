export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';
export type TransactionType = 'deposit' | 'withdrawal' | 'loan_disbursement' | 'loan_repayment' | 'interest' | 'fine';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'upi' | 'check';

export interface Transaction {
    id: string;
    reference_id: string;
    member_id: string;
    member_name: string;
    amount: string;
    type: TransactionType;
    status: TransactionStatus;
    date: string;
    payment_method: PaymentMethod;
    description?: string;
    created_at: string;
    updated_at: string;
    approved_by?: string;
}
