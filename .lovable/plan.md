## Feature 1: Bank Reconciliation (CSV Upload Matching)

### How it works
- New "Bank Reconciliation" page/tab in the portal
- User uploads a CSV bank statement
- System parses transactions (date, description, amount)
- Auto-matches against existing invoices (by amount & date proximity) and expenses
- Shows matched, partially matched, and unmatched items
- User can confirm matches, manually match, or mark as reconciled

### Implementation
1. Add a new "Reconciliation" page component in the portal
2. CSV parser that handles common bank statement formats (date, description, debit, credit, balance)
3. Matching algorithm: exact amount match → date proximity → description similarity
4. UI with three sections: Auto-matched, Needs Review, Unmatched
5. Store reconciliation state in `sas_documents` (or new table) with user_id

### No new database tables needed
- Bank statement data is transient (parsed in-memory from CSV)
- Reconciliation results can be stored as flags on existing invoice/expense records in their JSONB `data` field

---

## Feature 2: Automated Payment Reminders

### How it works
- A scheduled edge function runs daily
- Checks all invoices that are overdue by 7, 14, or 30 days
- Sends reminder emails to clients via the existing Resend integration
- Tracks which reminders have been sent to avoid duplicates

### Implementation
1. Add `remindersSent` tracking to invoice JSONB data (e.g., `{reminder7: true, reminder14: true}`)
2. Create a `send-payment-reminders` edge function that:
   - Queries all invoices across all users
   - Filters for overdue unpaid invoices
   - Checks which reminder tier applies (7/14/30 days)
   - Sends emails via the existing `send-document-email` pattern
   - Updates the invoice record to mark reminder as sent
3. Set up a pg_cron job to run the function daily
4. Add UI in Settings to enable/disable reminders and customize message
5. Add reminder history view on each invoice

### Database needs
- New migration: create a `sas_payment_reminders` table to log sent reminders (user_id, invoice_id, reminder_type, sent_at)
- This keeps reminder tracking separate from invoice data for cleaner querying
