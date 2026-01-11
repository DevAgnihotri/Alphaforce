# 🚀 AlphaForce - Salesforce Data Setup Guide

> **Your Salesforce instance is empty!** Follow this step-by-step guide to add the data needed for AlphaForce to work properly.

---

## 📋 Quick Overview

AlphaForce is a **Financial Advisor CRM** that syncs with Salesforce. You need to add these records:

| Record Type   | How Many | Purpose                                     |
| ------------- | -------- | ------------------------------------------- |
| Leads         | 5-10     | Potential clients who haven't converted yet |
| Accounts      | 5-10     | Companies or individual client accounts     |
| Contacts      | 10-15    | People associated with accounts             |
| Opportunities | 5-8      | Deals/investments you're working on         |

---

## ✅ Step 1: Add Leads (Potential Clients)

**What is a Lead?** A person who showed interest but hasn't become a client yet.

### How to Add:

1. Click **"Leads"** in the top navigation bar
2. Click the **"New"** button (top-right corner)
3. Fill in the form

### Add These 5 Sample Leads:

#### Lead 1:

- **First Name:** Sarah
- **Last Name:** Johnson
- **Company:** Self-Employed
- **Email:** sarah.johnson@email.com
- **Phone:** (555) 123-4567
- **Lead Source:** Website
- **Status:** Open - Not Contacted

#### Lead 2:

- **First Name:** Michael
- **Last Name:** Chen
- **Company:** Chen Family Trust
- **Email:** m.chen@email.com
- **Phone:** (555) 234-5678
- **Lead Source:** Referral
- **Status:** Working - Contacted

#### Lead 3:

- **First Name:** Emily
- **Last Name:** Rodriguez
- **Company:** Rodriguez Enterprises
- **Email:** emily.r@email.com
- **Phone:** (555) 345-6789
- **Lead Source:** Partner Referral
- **Status:** Open - Not Contacted

#### Lead 4:

- **First Name:** David
- **Last Name:** Thompson
- **Company:** Thompson Holdings
- **Email:** d.thompson@email.com
- **Phone:** (555) 456-7890
- **Lead Source:** Web
- **Status:** Working - Contacted

#### Lead 5:

- **First Name:** Jennifer
- **Last Name:** Williams
- **Company:** Williams & Associates
- **Email:** jen.williams@email.com
- **Phone:** (555) 567-8901
- **Lead Source:** Referral
- **Status:** Open - Not Contacted

---

## ✅ Step 2: Add Accounts (Client Accounts)

**What is an Account?** A company or individual you do business with.

### How to Add:

1. Click **"Accounts"** in the top navigation bar
2. Click the **"New"** button
3. Fill in the form

### Add These 5 Sample Accounts:

#### Account 1:

- **Account Name:** Anderson Family Investments
- **Phone:** (555) 111-2222
- **Website:** www.andersonfamily.com
- **Industry:** Financial Services
- **Type:** Customer
- **Description:** High-net-worth family seeking long-term growth investments

#### Account 2:

- **Account Name:** Bright Future Retirement Fund
- **Phone:** (555) 222-3333
- **Industry:** Financial Services
- **Type:** Customer
- **Description:** Retirement planning for corporate executives

#### Account 3:

- **Account Name:** Martinez Capital Group
- **Phone:** (555) 333-4444
- **Website:** www.martinezcapital.com
- **Industry:** Investment Banking
- **Type:** Prospect
- **Description:** Looking for diversified portfolio management

#### Account 4:

- **Account Name:** Oakwood Trust Company
- **Phone:** (555) 444-5555
- **Industry:** Banking
- **Type:** Customer
- **Description:** Trust management and estate planning

#### Account 5:

- **Account Name:** Summit Wealth Advisors
- **Phone:** (555) 555-6666
- **Website:** www.summitwealthadv.com
- **Industry:** Financial Services
- **Type:** Partner
- **Description:** Partner firm for cross-referrals

---

## ✅ Step 3: Add Contacts (People at Accounts)

**What is a Contact?** An individual person associated with an Account.

### How to Add:

1. Click **"Contacts"** in the top navigation bar
2. Click the **"New"** button
3. **Important:** Link each contact to an Account!

### Add These 8 Sample Contacts:

#### Contact 1 (Link to Anderson Family Investments):

- **First Name:** Robert
- **Last Name:** Anderson
- **Account:** Anderson Family Investments
- **Title:** Managing Director
- **Email:** robert@andersonfamily.com
- **Phone:** (555) 111-2223
- **Mailing City:** New York

#### Contact 2 (Link to Anderson Family Investments):

- **First Name:** Lisa
- **Last Name:** Anderson
- **Account:** Anderson Family Investments
- **Title:** CFO
- **Email:** lisa@andersonfamily.com
- **Phone:** (555) 111-2224

#### Contact 3 (Link to Bright Future Retirement Fund):

- **First Name:** James
- **Last Name:** Mitchell
- **Account:** Bright Future Retirement Fund
- **Title:** CEO
- **Email:** j.mitchell@brightfuture.com
- **Phone:** (555) 222-3334

#### Contact 4 (Link to Martinez Capital Group):

- **First Name:** Carlos
- **Last Name:** Martinez
- **Account:** Martinez Capital Group
- **Title:** Founder
- **Email:** carlos@martinezcapital.com
- **Phone:** (555) 333-4445

#### Contact 5 (Link to Martinez Capital Group):

- **First Name:** Angela
- **Last Name:** Martinez
- **Account:** Martinez Capital Group
- **Title:** Investment Director
- **Email:** angela@martinezcapital.com
- **Phone:** (555) 333-4446

#### Contact 6 (Link to Oakwood Trust Company):

- **First Name:** Patricia
- **Last Name:** Oakwood
- **Account:** Oakwood Trust Company
- **Title:** President
- **Email:** p.oakwood@oakwoodtrust.com
- **Phone:** (555) 444-5556

#### Contact 7 (Link to Summit Wealth Advisors):

- **First Name:** Kevin
- **Last Name:** Park
- **Account:** Summit Wealth Advisors
- **Title:** Senior Partner
- **Email:** kevin@summitwealthadv.com
- **Phone:** (555) 555-6667

#### Contact 8 (Link to Summit Wealth Advisors):

- **First Name:** Michelle
- **Last Name:** Turner
- **Account:** Summit Wealth Advisors
- **Title:** Client Relations Manager
- **Email:** michelle@summitwealthadv.com
- **Phone:** (555) 555-6668

---

## ✅ Step 4: Add Opportunities (Deals/Investments)

**What is an Opportunity?** A potential deal or investment you're working on.

### How to Add:

1. Click **"Opportunities"** in the top navigation bar
2. Click the **"New"** button
3. **Important:** Link each opportunity to an Account!

### Add These 5 Sample Opportunities:

#### Opportunity 1:

- **Opportunity Name:** Anderson Portfolio Restructure
- **Account:** Anderson Family Investments
- **Close Date:** (pick a date 30 days from now)
- **Stage:** Negotiation/Review
- **Amount:** $500,000
- **Probability:** 75%

#### Opportunity 2:

- **Opportunity Name:** Bright Future 401k Rollover
- **Account:** Bright Future Retirement Fund
- **Close Date:** (pick a date 45 days from now)
- **Stage:** Proposal/Price Quote
- **Amount:** $1,200,000
- **Probability:** 60%

#### Opportunity 3:

- **Opportunity Name:** Martinez Initial Investment
- **Account:** Martinez Capital Group
- **Close Date:** (pick a date 60 days from now)
- **Stage:** Qualification
- **Amount:** $250,000
- **Probability:** 40%

#### Opportunity 4:

- **Opportunity Name:** Oakwood Trust Expansion
- **Account:** Oakwood Trust Company
- **Close Date:** (pick a date 15 days from now)
- **Stage:** Closed Won
- **Amount:** $750,000
- **Probability:** 100%

#### Opportunity 5:

- **Opportunity Name:** Summit Partnership Deal
- **Account:** Summit Wealth Advisors
- **Close Date:** (pick a date 90 days from now)
- **Stage:** Needs Analysis
- **Amount:** $2,100,000
- **Probability:** 25%

---

## ✅ Step 5: Add Some Activities (Optional but Recommended)

**What are Activities?** Calls, emails, and meetings you log.

### How to Add:

1. Go to any **Contact** or **Account** page
2. Look for the **"Activity"** or **"Log a Call"** button
3. Add some past activities

### Sample Activities to Log:

| Type    | Subject                | Related To       | Notes                                                  |
| ------- | ---------------------- | ---------------- | ------------------------------------------------------ |
| Call    | Intro call with Robert | Robert Anderson  | Discussed investment goals, risk tolerance is moderate |
| Email   | Follow-up on portfolio | James Mitchell   | Sent portfolio proposal                                |
| Meeting | Quarterly Review       | Patricia Oakwood | Reviewed Q4 performance                                |
| Call    | Cold call - interested | Carlos Martinez  | Wants more info, follow up next week                   |

---

## 🎯 Summary Checklist

When you're done, you should have:

- [ ] **5 Leads** added
- [ ] **5 Accounts** added
- [ ] **8 Contacts** added (linked to accounts)
- [ ] **5 Opportunities** added (linked to accounts)
- [ ] **4+ Activities** logged (optional)

---

## 🔗 Connecting to AlphaForce

Once you have data in Salesforce:

1. Open AlphaForce at **http://localhost:3000**
2. Go to the **Salesforce Sync** section (in sidebar)
3. Your Salesforce data will sync with the app!

> **Note:** Currently AlphaForce uses mock data for demo purposes. The Salesforce Sync feature shows you how it _would_ work with real integration.

---

## ❓ Need Help?

### Common Issues:

**Q: I can't find the "New" button**
A: Make sure you're in the correct tab (Leads, Accounts, etc.) and look at the top-right corner.

**Q: What's the difference between Lead and Contact?**
A:

- **Lead** = Someone who might become a client (not converted yet)
- **Contact** = A person linked to an Account (already a client or prospect)

**Q: Do I have to add all these?**
A: Add at least 3 of each type to see meaningful data in AlphaForce.

---

## 📅 Estimated Time

| Task                 | Time            |
| -------------------- | --------------- |
| Adding Leads         | 10 minutes      |
| Adding Accounts      | 10 minutes      |
| Adding Contacts      | 15 minutes      |
| Adding Opportunities | 10 minutes      |
| **Total**            | **~45 minutes** |

---

Good luck! 🍀 Once you've added the data, your Salesforce dashboard will show real numbers instead of zeros!
