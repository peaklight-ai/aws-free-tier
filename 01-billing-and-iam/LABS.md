# Lesson 01 -- Labs

Hands-on labs to run in your terminal. Each lab has a goal, commands to run, and what to verify.

**Convention:** Every command shows the CLI version. Run them yourself with `! command` in Claude Code.

---

## Lab 1: Know Your Account

**Goal:** Confirm your AWS identity and understand the output.

**Time:** 5 minutes

### Commands

```bash
# 1. Who are you?
aws sts get-caller-identity --region us-east-1
```

**What you'll see:**

```
+--------------------------------------------------+
|  JSON output with three fields:                   |
|                                                   |
|  UserId  -- internal AWS ID (starts with AIDA)    |
|  Account -- your 12-digit account number          |
|  Arn     -- your full identity path               |
|              arn:aws:iam::ACCOUNT:user/USERNAME    |
+--------------------------------------------------+
```

**Verify:**
- [ ] You see `user/chadi-admin` in the Arn
- [ ] Account number is `703091483538`

```bash
# 2. What region are you configured for?
aws configure list
```

**What you'll see:**

```
+--------------------------------------------------+
|  Table showing:                                   |
|                                                   |
|  profile    -- which profile (default if not set) |
|  access_key -- last 4 chars of your key           |
|  secret_key -- last 4 chars of your secret        |
|  region     -- your default region                |
+--------------------------------------------------+
```

**Verify:**
- [ ] access_key and secret_key show values (not `<not set>`)
- [ ] region shows `me-south-1`

```bash
# 3. What regions are available?
aws ec2 describe-regions --query 'Regions[].RegionName' --output table --region us-east-1
```

**What you'll see:** A table of all AWS regions worldwide. Note which ones are opt-in (like `me-south-1`).

**Verify:**
- [ ] You see `us-east-1`, `eu-west-1`, `me-south-1` in the list

---

## Lab 2: Set Up Your Billing Safety Net

**Goal:** Create a $1 billing alarm that emails you.

**Time:** 10 minutes

### Step 1: Check current spend

```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-04-01,End=2026-04-08 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --region us-east-1
```

**What you'll see:**

```
+--------------------------------------------------+
|  ResultsByTime[0].Total.BlendedCost.Amount        |
|                                                   |
|  "0.0000000000" = you've spent nothing            |
|  "0.5200000000" = you've spent 52 cents           |
|                                                   |
|  If this is > $1, STOP and investigate before     |
|  continuing.                                      |
+--------------------------------------------------+
```

**Verify:**
- [ ] Amount is $0 or very close to it

### Step 2: Create the SNS notification topic

```bash
aws sns create-topic \
  --name billing-alarm \
  --region us-east-1 \
  --tags Key=project,Value=aws-free-tier-lab
```

**What you'll see:**

```
+--------------------------------------------------+
|  { "TopicArn": "arn:aws:sns:us-east-1:703091483538:billing-alarm" }
|                                                   |
|  SAVE THIS ARN. You need it for the next steps.   |
+--------------------------------------------------+
```

**Verify:**
- [ ] You got a TopicArn back (no error)

### Step 3: Subscribe your email

```bash
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:703091483538:billing-alarm \
  --protocol email \
  --notification-endpoint YOUR_EMAIL@example.com \
  --region us-east-1
```

Replace `YOUR_EMAIL@example.com` with your real email.

**What you'll see:**

```
+--------------------------------------------------+
|  { "SubscriptionArn": "pending confirmation" }    |
|                                                   |
|  GO CHECK YOUR EMAIL NOW.                         |
|  Click the confirmation link AWS sent you.        |
|  Until you confirm, alerts won't reach you.       |
+--------------------------------------------------+
```

**Verify:**
- [ ] You received a confirmation email from AWS
- [ ] You clicked the confirmation link
- [ ] Confirm it worked:

```bash
aws sns list-subscriptions-by-topic \
  --topic-arn arn:aws:sns:us-east-1:703091483538:billing-alarm \
  --region us-east-1
```

Look for `"SubscriptionArn"` that is NOT "PendingConfirmation".

### Step 4: Create the billing alarm

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name billing-alarm-1-dollar \
  --alarm-description "Alert when AWS spend exceeds 1 dollar" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 21600 \
  --threshold 1 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:703091483538:billing-alarm \
  --dimensions Name=Currency,Value=USD \
  --region us-east-1 \
  --tags Key=project,Value=aws-free-tier-lab
```

**What you'll see:** Nothing (silence = success).

**Verify:**

```bash
aws cloudwatch describe-alarms \
  --alarm-names billing-alarm-1-dollar \
  --region us-east-1 \
  --query 'MetricAlarms[0].{Name:AlarmName,State:StateValue,Threshold:Threshold}' \
  --output table
```

```
+--------------------------------------------------+
|  You should see:                                  |
|                                                   |
|  Name:      billing-alarm-1-dollar                |
|  State:     OK  (or INSUFFICIENT_DATA initially)  |
|  Threshold: 1.0                                   |
|                                                   |
|  OK = your spend is below $1. Good.               |
|  INSUFFICIENT_DATA = billing metrics haven't      |
|                      published yet. Normal for     |
|                      new alarms. Wait 6 hours.     |
+--------------------------------------------------+
```

**Verify:**
- [ ] Alarm exists
- [ ] State is OK or INSUFFICIENT_DATA (NOT "ALARM")
- [ ] Threshold is 1.0

---

## Lab 3: Explore IAM

**Goal:** Understand your current IAM setup.

**Time:** 10 minutes

### Step 1: List all users

```bash
aws iam list-users \
  --query 'Users[].{Name:UserName,Created:CreateDate}' \
  --output table
```

```
+--------------------------------------------------+
|  Table of all IAM users in your account.          |
|  You should see at least: chadi-admin             |
|                                                   |
|  Each user has:                                   |
|  - Name: the username                             |
|  - Created: when it was made                      |
+--------------------------------------------------+
```

**Verify:**
- [ ] You see `chadi-admin` in the list

### Step 2: What can you do? (your policies)

```bash
aws iam list-attached-user-policies \
  --user-name chadi-admin \
  --query 'AttachedPolicies[].{Policy:PolicyName,Arn:PolicyArn}' \
  --output table
```

```
+--------------------------------------------------+
|  Shows which policies are attached to your user.  |
|                                                   |
|  If you see AdministratorAccess:                  |
|  You can do ANYTHING. This is fine for learning   |
|  but dangerous in production.                     |
|                                                   |
|  FOR AGENTS: In production, your agent would      |
|  have a scoped policy, not admin access.          |
+--------------------------------------------------+
```

**Verify:**
- [ ] You can see which policies are attached

### Step 3: Read the admin policy

```bash
aws iam get-policy-version \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess \
  --version-id v1 \
  --query 'PolicyVersion.Document' \
  --output json
```

```
+--------------------------------------------------+
|  {                                                |
|    "Statement": [{                                |
|      "Effect": "Allow",                           |
|      "Action": "*",      <-- ANY action           |
|      "Resource": "*"     <-- on ANY resource       |
|    }]                                             |
|  }                                                |
|                                                   |
|  This is the nuclear option. One policy rule      |
|  that allows everything. For learning = fine.     |
|  For production agents = terrible idea.           |
+--------------------------------------------------+
```

### Step 4: List existing roles

```bash
aws iam list-roles \
  --query 'Roles[?starts_with(RoleName, `aws-service`) == `false`].{Name:RoleName,Service:AssumeRolePolicyDocument.Statement[0].Principal.Service}' \
  --output table
```

This filters out AWS-internal roles and shows you roles YOU created plus what service can assume them.

**Verify:**
- [ ] You can see the list (may be empty if this is a fresh account)

---

## Lab 4: Create the Lambda Execution Role

**Goal:** Build the IAM role that your Lambda functions will use in Phase 02.

**Time:** 10 minutes

### Step 1: Write the trust policy

```bash
cat > /tmp/lambda-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
```

**Verify the file:**

```bash
cat /tmp/lambda-trust-policy.json | python3 -m json.tool
```

```
+--------------------------------------------------+
|  This trust policy says:                          |
|                                                   |
|  WHO: lambda.amazonaws.com (Lambda service)       |
|  CAN: sts:AssumeRole (wear this role)             |
|                                                   |
|  Think of it as: "Lambda gets a badge that says   |
|  it can enter the rooms this role has keys for"   |
+--------------------------------------------------+
```

### Step 2: Create the role

```bash
aws iam create-role \
  --role-name lambda-free-tier-role \
  --assume-role-policy-document file:///tmp/lambda-trust-policy.json \
  --tags Key=project,Value=aws-free-tier-lab
```

```
+--------------------------------------------------+
|  SAVE THE ROLE ARN FROM THE OUTPUT:               |
|                                                   |
|  arn:aws:iam::703091483538:role/lambda-free-tier-role
|                                                   |
|  You'll use this in EVERY Lambda lesson.          |
+--------------------------------------------------+
```

**Verify:**
- [ ] No errors
- [ ] You see the RoleName and Arn in the output

### Step 3: Give the role permission to write logs

```bash
aws iam attach-role-policy \
  --role-name lambda-free-tier-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

**What you'll see:** Nothing (silence = success).

### Step 4: Verify the complete role

```bash
# Check the role exists
aws iam get-role \
  --role-name lambda-free-tier-role \
  --query 'Role.{Name:RoleName,Arn:Arn,Created:CreateDate}' \
  --output table

# Check policies are attached
aws iam list-attached-role-policies \
  --role-name lambda-free-tier-role \
  --output table
```

```
+--------------------------------------------------+
|  You should see:                                  |
|                                                   |
|  Role: lambda-free-tier-role                      |
|  Policy: AWSLambdaBasicExecutionRole              |
|                                                   |
|  This role can now:                               |
|  - Be assumed by Lambda                           |
|  - Write to CloudWatch Logs                       |
|  - Nothing else (least privilege!)                |
+--------------------------------------------------+
```

**Verify:**
- [ ] Role exists with correct name
- [ ] AWSLambdaBasicExecutionRole is attached
- [ ] No other policies attached

---

## Lab 5: Monitor Free Tier Usage

**Goal:** Learn to check what you've consumed.

**Time:** 5 minutes

```bash
# Check free tier usage
aws freetier get-free-tier-usage --region us-east-1
```

```
+--------------------------------------------------+
|  Shows every free tier service and your usage.    |
|                                                   |
|  Look for:                                        |
|  - actualUsageAmount: how much you've used        |
|  - forecastedUsageAmount: projected usage          |
|  - freeTierType: ALWAYS_FREE or 12_MONTH_FREE     |
|  - limit: the free tier cap                       |
|                                                   |
|  If actualUsageAmount > limit for any service,    |
|  you're paying for the overage.                   |
+--------------------------------------------------+
```

```bash
# Projected cost for rest of month
aws ce get-cost-forecast \
  --time-period Start=2026-04-09,End=2026-05-01 \
  --granularity MONTHLY \
  --metric BLENDED_COST \
  --region us-east-1
```

```
+--------------------------------------------------+
|  Shows predicted spend for the rest of the month. |
|                                                   |
|  MeanValue: the expected cost                     |
|                                                   |
|  This should be $0 or very close.                 |
+--------------------------------------------------+
```

**Verify:**
- [ ] You can see your free tier usage
- [ ] No services are over their limit

---

## Lab Completion Checklist

After completing all labs, verify:

- [ ] **Lab 1:** You know your account ID, username, and region
- [ ] **Lab 2:** Billing alarm is active, email subscription confirmed
- [ ] **Lab 3:** You can list users, read policies, understand the JSON format
- [ ] **Lab 4:** `lambda-free-tier-role` exists with CloudWatch Logs permission
- [ ] **Lab 5:** You can check free tier usage and cost forecast

**Total time:** ~40 minutes

**What you built:**

```
+-------------------------------------------------------+
|                YOUR AWS ACCOUNT (after Lab 5)          |
|                                                        |
|  [CloudWatch Alarm: billing-alarm-1-dollar]            |
|      Watches: EstimatedCharges > $1                    |
|      Notifies: SNS topic "billing-alarm"               |
|                    |                                    |
|                    v                                    |
|              [Your Email] -- gets alerts               |
|                                                        |
|  [IAM Role: lambda-free-tier-role]                     |
|      Trust: Lambda service                             |
|      Perms: CloudWatch Logs (write)                    |
|      Ready for: Phase 02 (Lambda)                      |
|                                                        |
+-------------------------------------------------------+
```
