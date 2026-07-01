# EXECUTION LOG -- AWS Free Tier Hands-On Learning

Append-only log of every lab Chadi completes, with timestamps, commands run, outputs observed, and resources created. Each phase updates this file as labs finish.

**Account:** 703091483538 (chadi-admin)
**Default Region:** eu-central-1 (Frankfurt)
**Billing/IAM Region:** us-east-1

---

## Progress Overview

| Phase | Lab | Status | Date |
|-------|-----|--------|------|
| 01 Billing & IAM | Lab 1 -- Know Your Account | Complete (CLI + GUI) | 2026-04-21 |
| 01 Billing & IAM | Lab 2 -- Billing Safety Net | Pending | -- |
| 01 Billing & IAM | Lab 3 -- Explore IAM | Pending | -- |
| 01 Billing & IAM | Lab 4 -- Create Lambda Role | Pending | -- |
| 01 Billing & IAM | Lab 5 -- Free Tier Monitor | Pending | -- |

---

## Pre-Existing Account Resources (NOT for cleanup)

Discovered during Lab 2 cost audit (2026-04-21). These are production PLAI
client resources and must NOT be touched by this course.

| Resource | Type | Region | Purpose | Monthly Cost |
|----------|------|--------|---------|--------------|
| i-0c86d0533c9580e05 (emarx-prod-frankfurt) | EC2 t4g.medium | eu-central-1 | Emaar X production hosting | ~$3.96 |
| Z0904240W7S1B6L0A75S (emaarx.ai) | Route 53 hosted zone | global | emaarx.ai DNS | ~$0.50 |
| VPC / NAT / EBS attached to above | network + storage | eu-central-1 | supports emarx-prod | ~$0.80 |

**Baseline monthly spend:** ~$8-10/mo (including VAT)
**Alarm threshold implication:** $1 alarm is wrong for this account.
Use $25 real-guardrail alarm + optional $1 tutorial alarm.

## Resources Created By This Course (for cleanup tracking)

_None yet. Labs 2+ will populate this section._

| Resource | Type | Region | Created | Purpose | Keep/Delete |
|----------|------|--------|---------|---------|-------------|

---

## Phase 01: Billing Safety & IAM Foundations

### Lab 1 -- Know Your Account (2026-04-21)

**Goal:** Confirm identity from CLI and GUI, understand region selection.

**CLI commands run:**

```bash
aws sts get-caller-identity --region us-east-1
# Output: UserId=AIDA2HM4EUOJPD4X4TTWY, Account=703091483538,
#         Arn=arn:aws:iam::703091483538:user/chadi-admin

aws configure list
# Output: region=me-south-1 (initially), then changed to eu-central-1

aws ec2 describe-regions --query 'Regions[].RegionName' --output table --region us-east-1
# Output: 18 regions listed, including us-east-1, eu-west-1, me-south-1, eu-central-1
```

**Region change (mid-lab):**

```bash
aws configure set region eu-central-1
aws configure list   # Confirmed region=eu-central-1
aws sts get-caller-identity   # No --region flag needed, works via default
```

**Why changed:** me-south-1 (Bahrain) reported degraded. Frankfurt (eu-central-1)
chosen for low latency from the region and full service availability.

**GUI side (completed 2026-04-21):**
- [x] Clicked username top-right, confirmed account 703091483538
- [x] Clicked region selector, confirmed switching works
- [x] Navigated to IAM -> Users, confirmed chadi-admin is listed
- [x] Observed IAM has no region picker (global service)

**Chadi's insight after doing both sides:**
> "I just learned that understanding CLI first is so much better."

Why this matters: CLI forces you to learn AWS's actual ontology
(service -> action -> resource -> properties). Once you see that
tree, the GUI becomes a skin over it. Every button in the console
is a pre-filled CLI command. GUI-first users get lost in menus
because they don't know the underlying model.

**Lessons learned:**
- `aws <service> <action>` is the required pattern -- `aws sts-caller-identity`
  as a single token fails; `aws sts get-caller-identity` works
- Cost Explorer, billing alarms, and Free Tier API only work in us-east-1
  regardless of default region -- always pass `--region us-east-1` for those
- IAM is a global service, region flag is cosmetic for IAM calls
- `aws health describe-events` requires Business/Enterprise Support
  (returns SubscriptionRequiredException on free accounts)

**Verification:**
- [x] Arn ends with `user/chadi-admin`
- [x] Account = 703091483538
- [x] Region successfully changed to eu-central-1
- [x] Region list includes core regions needed for course

---

### Lab 2 -- Billing Safety Net (pending)

**Goal:** Create a $1 CloudWatch billing alarm that emails on trigger.

**Planned CLI sequence:**
1. `aws ce get-cost-and-usage` -- baseline spend check
2. `aws sns create-topic --name billing-alarm --region us-east-1`
3. `aws sns subscribe` with email endpoint
4. Confirm email subscription (out-of-band click)
5. `aws cloudwatch put-metric-alarm` -- the $1 alarm
6. `aws cloudwatch describe-alarms` -- verify state OK or INSUFFICIENT_DATA

**Resources to create:**
- SNS topic: `billing-alarm` (us-east-1)
- SNS email subscription (chadi@peaklight.ai)
- CloudWatch alarm: `billing-alarm-1-dollar` (us-east-1)

**Pre-req check:** Confirm IAM user has billing data access (set by root earlier).

---

### Lab 3 -- Explore IAM (pending)

**Goal:** Understand current IAM setup -- users, policies, roles.

---

### Lab 4 -- Create Lambda Role (pending)

**Goal:** Build the IAM role Lambda functions will assume in Phase 2.

**Resources to create:**
- IAM role: `lambda-free-tier-role` (global)
- Attached managed policy: `AWSLambdaBasicExecutionRole`

---

### Lab 5 -- Free Tier Monitor (pending)

**Goal:** Learn to check free tier usage and cost forecasts.

---

## How This File Is Used

- **Append-only:** never delete past entries, even if labs are redone
- **Per-lab:** update the entry as that lab completes (CLI output, GUI confirmations, lessons)
- **Resource table:** add EVERY AWS resource created, so Lab 5+ can audit and cleanup
- **Cross-phase:** future phases (Lambda, DynamoDB, S3, ...) append their own sections below
- **Verification:** each lab's checkboxes prove it's really done, not just "felt done"
