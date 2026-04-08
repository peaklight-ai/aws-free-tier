# 01 -- "Don't Get Billed"

## Billing Safety & IAM Foundations

Before touching any AWS service, you set up guardrails so you never get a surprise bill. Then you learn how AWS identity works -- because every single thing you do in AWS is controlled by IAM.

---

## What You'll Have When Done

```
+-------------------------------------------------------+
|                  YOUR AWS ACCOUNT                      |
|                                                        |
|  [CloudWatch Alarm] ---> [SNS Topic] ---> Your Email   |
|   "Spend > $1?"          "Billing Alert"   "Hey!"      |
|                                                        |
|  [IAM User: chadi-admin]                               |
|   |                                                    |
|   +-- Has policies attached (what you CAN do)          |
|                                                        |
|  [IAM Role: lambda-free-tier-role]                     |
|   |                                                    |
|   +-- Trust policy: Lambda can assume this role        |
|   +-- Permission: Can write to CloudWatch Logs         |
|                                                        |
+-------------------------------------------------------+
```

---

## Part 1: Check Your Current Spend

### What this does

```
YOU                           AWS
 |                             |
 |  "How much did I spend?"   |
 |---------ce---------------->| Cost Explorer
 |                             |  (looks up billing data)
 |  { Amount: "0.00" }        |
 |<----------------------------|
```

Cost Explorer (`ce`) is the billing calculator. It only runs in `us-east-1`, no matter what region your resources are in.

### Run it

```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-04-01,End=2026-04-08 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --region us-east-1
```

### What each flag means

| Flag | Meaning |
|------|---------|
| `ce` | Cost Explorer service |
| `--time-period Start=...,End=...` | Date range to check (this month so far) |
| `--granularity MONTHLY` | Group costs by month (vs DAILY or HOURLY) |
| `--metrics BlendedCost` | Show actual cost after discounts |
| `--region us-east-1` | Cost Explorer only works in us-east-1 |

### What the output looks like

```json
{
    "ResultsByTime": [
        {
            "TimePeriod": {
                "Start": "2026-04-01",
                "End": "2026-04-08"
            },
            "Total": {
                "BlendedCost": {
                    "Amount": "0.0000000000",   <-- THIS IS WHAT MATTERS
                    "Unit": "USD"
                }
            }
        }
    ]
}
```

**What to look for:** The `Amount` field. If it's `0` or near-zero, you're good. Anything above `$0.50` means something is running that shouldn't be.

---

## Part 2: Create a Billing Alarm

### What this does

```
CloudWatch                    SNS                     You
    |                          |                       |
    |  Checks every 6 hours:   |                       |
    |  "Is spend > $1?"        |                       |
    |                          |                       |
    |  YES! Spend is $1.20     |                       |
    |---"ALARM triggered"----->|                       |
    |                          |---email notification-->|
    |                          |   "Your AWS bill is    |
    |                          |    above $1"           |
```

We need two things:
1. An **SNS topic** (a notification channel)
2. A **CloudWatch alarm** (watches billing and sends to the topic)

### Step 2a: Create an SNS topic for billing alerts

SNS (Simple Notification Service) is like a broadcast channel. You create a topic, subscribe to it, and anything that publishes to it reaches you.

```bash
aws sns create-topic \
  --name billing-alarm \
  --region us-east-1 \
  --tags Key=project,Value=aws-free-tier-lab
```

**What the output looks like:**

```json
{
    "TopicArn": "arn:aws:sns:us-east-1:703091483538:billing-alarm"
}
```

**Save this ARN** -- you'll need it in the next step. An ARN (Amazon Resource Name) is how AWS identifies every single resource. The format is:

```
arn:aws:SERVICE:REGION:ACCOUNT_ID:RESOURCE_NAME
 |    |    |       |       |           |
 |    |    |       |       |           +-- billing-alarm
 |    |    |       |       +-- your account number
 |    |    |       +-- us-east-1
 |    |    +-- sns
 |    +-- always "aws"
 +-- always "arn"
```

### Step 2b: Subscribe your email to the topic

```bash
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:703091483538:billing-alarm \
  --protocol email \
  --notification-endpoint YOUR_EMAIL@example.com \
  --region us-east-1
```

Replace `YOUR_EMAIL@example.com` with your actual email.

**After running this:** Check your email inbox. AWS sends a confirmation link -- you MUST click it or you won't get alerts.

### Step 2c: Create the CloudWatch billing alarm

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

**What each flag means:**

| Flag | Meaning |
|------|---------|
| `--alarm-name` | A name you pick for this alarm |
| `--metric-name EstimatedCharges` | The billing metric AWS publishes |
| `--namespace AWS/Billing` | Billing metrics live in this namespace |
| `--statistic Maximum` | Take the highest value in the period |
| `--period 21600` | Check every 6 hours (21600 seconds) |
| `--threshold 1` | Trigger if spend exceeds $1 |
| `--comparison-operator GreaterThanThreshold` | Trigger when ABOVE threshold |
| `--evaluation-periods 1` | Trigger after 1 check (don't wait) |
| `--alarm-actions` | Where to send the notification (our SNS topic) |
| `--dimensions Name=Currency,Value=USD` | Track USD charges |

### Verify the alarm exists

```bash
aws cloudwatch describe-alarms \
  --alarm-names billing-alarm-1-dollar \
  --region us-east-1
```

Look for `"StateValue": "OK"` -- that means the alarm is active and your spend is below $1.

---

## Part 3: Understand IAM

### The Big Picture

```
+-----------------------------------------------------------+
|                       AWS ACCOUNT                          |
|                                                            |
|  IAM is the BOUNCER. Every API call goes through it.       |
|                                                            |
|  "Can chadi-admin call lambda:CreateFunction?"             |
|      |                                                     |
|      v                                                     |
|  [IAM Policy Check]                                        |
|      |                                                     |
|      +-- YES (policy allows it) --> request proceeds       |
|      +-- NO  (no policy found)  --> AccessDenied error     |
|                                                            |
|  Three things that have identity:                          |
|                                                            |
|  USERS -------- Humans (you, a colleague)                  |
|  ROLES -------- Services or temporary access               |
|  GROUPS ------- Collections of users                       |
|                                                            |
|  What controls access:                                     |
|                                                            |
|  POLICIES ----- JSON docs that say Allow/Deny on actions   |
|                                                            |
+-----------------------------------------------------------+
```

### Step 3a: Who are you?

```bash
aws sts get-caller-identity --region us-east-1
```

**Output:**

```json
{
    "UserId": "AIDA2HM4EUOJPD4X4TTWY",
    "Account": "703091483538",
    "Arn": "arn:aws:iam::703091483538:user/chadi-admin"
}
```

This tells you:
- **UserId** -- unique internal ID
- **Account** -- your 12-digit AWS account number
- **Arn** -- your full identity path (you're an IAM user named `chadi-admin`)

### Step 3b: List all IAM users

```bash
aws iam list-users --region us-east-1
```

This shows every human user in your account. You'll see at least `chadi-admin`.

### Step 3c: See what policies you have

```bash
aws iam list-attached-user-policies \
  --user-name chadi-admin \
  --region us-east-1
```

This shows what permission policies are attached to your user. If you have `AdministratorAccess`, you can do anything (powerful but dangerous -- in production you'd use scoped roles).

### Step 3d: Read a policy document

To actually see what a policy ALLOWS, you need its version:

```bash
aws iam get-policy \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess \
  --region us-east-1
```

Then read the actual rules:

```bash
aws iam get-policy-version \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess \
  --version-id v1 \
  --region us-east-1
```

**Output (simplified):**

```json
{
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
```

This reads as: **Allow ANY action on ANY resource.** That's what admin access means. In production, you'd write policies that only allow specific actions on specific resources.

---

## Part 4: IAM Policies -- How Permissions Actually Work

### Anatomy of a policy

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",            <-- Allow or Deny
            "Action": "s3:GetObject",     <-- What action
            "Resource": "arn:aws:s3:::my-bucket/*"  <-- On what
        }
    ]
}
```

**The flow:**

```
API Call: "s3:GetObject on arn:aws:s3:::my-bucket/file.txt"
    |
    v
IAM evaluates ALL policies attached to the caller
    |
    +-- Any explicit Deny?  --> DENIED (Deny always wins)
    |
    +-- Any explicit Allow? --> ALLOWED
    |
    +-- Neither?            --> DENIED (default deny)
```

**Key rule:** Everything is denied by default. You must explicitly allow things. And a Deny always beats an Allow.

### Common policy actions you'll see in this course

| Action | What it allows |
|--------|---------------|
| `lambda:CreateFunction` | Deploy a Lambda function |
| `lambda:InvokeFunction` | Run a Lambda function |
| `dynamodb:PutItem` | Write an item to DynamoDB |
| `dynamodb:GetItem` | Read an item from DynamoDB |
| `s3:GetObject` | Download a file from S3 |
| `s3:PutObject` | Upload a file to S3 |
| `logs:CreateLogGroup` | Create a CloudWatch log group |
| `logs:PutLogEvents` | Write log entries |

---

## Part 5: Create a Lambda Execution Role

### What is a role?

```
USERS = identity for HUMANS (you log in with credentials)
ROLES = identity for SERVICES (Lambda, EC2, etc. "wear" a role)

When Lambda runs your code, it needs permissions.
But Lambda can't log in as a user -- it ASSUMES A ROLE.

+------------------+          +------------------+
|  Lambda Service  |          |  IAM Role        |
|                  |--assumes->|                  |
|  "I need to run  |          |  Trust: Lambda   |
|   this function" |          |  Perms: Logs     |
+------------------+          +------------------+
                                     |
                                     v
                              [Can write to CloudWatch Logs]
```

A role has TWO parts:
1. **Trust policy** -- WHO can assume this role (which services or users)
2. **Permission policies** -- WHAT the role can do once assumed

### Step 5a: Create the trust policy

This file says "Lambda is allowed to assume this role":

```bash
cat > /tmp/trust-policy.json << 'EOF'
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

Reading it in plain English:
- **Effect: Allow** -- this is a permission grant
- **Principal: lambda.amazonaws.com** -- the Lambda service
- **Action: sts:AssumeRole** -- can assume (wear) this role

### Step 5b: Create the role

```bash
aws iam create-role \
  --role-name lambda-free-tier-role \
  --assume-role-policy-document file:///tmp/trust-policy.json \
  --region us-east-1
```

**Output (key part):**

```json
{
    "Role": {
        "RoleName": "lambda-free-tier-role",
        "Arn": "arn:aws:iam::703091483538:role/lambda-free-tier-role",
        ...
    }
}
```

**Save this Role ARN** -- you'll use it every time you create a Lambda function.

### Step 5c: Attach permissions (CloudWatch Logs)

Every Lambda needs to write logs. Attach the managed policy for it:

```bash
aws iam attach-role-policy \
  --role-name lambda-free-tier-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
  --region us-east-1
```

This command has no output on success (silence = success in many AWS CLI commands).

### Step 5d: Verify the role

```bash
aws iam get-role \
  --role-name lambda-free-tier-role \
  --region us-east-1
```

And check what policies are attached:

```bash
aws iam list-attached-role-policies \
  --role-name lambda-free-tier-role \
  --region us-east-1
```

You should see `AWSLambdaBasicExecutionRole` in the list.

### What AWSLambdaBasicExecutionRole actually allows

```json
{
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
```

Just three things: create log groups, create log streams, and write log entries. Nothing else. This is **least privilege** -- the role can only do exactly what it needs.

---

## Part 6: Check Free Tier Usage

### See what free tier allowances you've used

```bash
aws freetier get-free-tier-usage \
  --region us-east-1
```

This shows every free tier service and how much of your allowance you've consumed. Look for services with `actualUsageAmount` greater than 0.

### Check projected costs for the rest of the month

```bash
aws ce get-cost-forecast \
  --time-period Start=2026-04-08,End=2026-05-01 \
  --granularity MONTHLY \
  --metric BLENDED_COST \
  --region us-east-1
```

This predicts what your bill will be by end of month based on current usage.

---

## Part 7: List All IAM Roles

See what roles already exist in your account:

```bash
aws iam list-roles \
  --query 'Roles[].{Name:RoleName,Created:CreateDate}' \
  --output table \
  --region us-east-1
```

**New concept: --query and --output**

| Flag | Meaning |
|------|---------|
| `--query` | JMESPath expression to filter/reshape the output |
| `--output table` | Format as a readable table (vs json or text) |

The query `Roles[].{Name:RoleName,Created:CreateDate}` means:
- `Roles[]` -- iterate over every role
- `{Name:RoleName, Created:CreateDate}` -- show only these two fields, renamed

This is incredibly useful for making CLI output human-readable.

---

## Summary: What You Did

```
+------------------------------------------------------------------+
|                        YOUR AWS ACCOUNT                           |
|                                                                   |
|  1. BILLING ALARM (never get surprised)                           |
|     [CloudWatch] --monitors--> EstimatedCharges                   |
|         |                                                         |
|         +--if > $1--> [SNS: billing-alarm] --> your@email.com     |
|                                                                   |
|  2. UNDERSTOOD IAM                                                |
|     - Users (you: chadi-admin)                                    |
|     - Policies (JSON docs: Allow/Deny on Action + Resource)       |
|     - Roles (identity for services, not humans)                   |
|     - Default deny (everything blocked unless explicitly allowed) |
|     - Deny wins over Allow                                        |
|                                                                   |
|  3. CREATED LAMBDA ROLE (for Phase 02)                            |
|     [lambda-free-tier-role]                                       |
|       Trust: Lambda service can assume                            |
|       Perms: CloudWatch Logs (create + write)                     |
|                                                                   |
+------------------------------------------------------------------+
```

## Key Concepts to Remember

| Concept | One-liner |
|---------|-----------|
| ARN | `arn:aws:service:region:account:resource` -- the address of everything |
| IAM User | Identity for humans with long-lived credentials |
| IAM Role | Identity for services, assumed temporarily |
| IAM Policy | JSON doc: Effect + Action + Resource |
| Default Deny | No policy = no access. Always. |
| Deny wins | Explicit Deny beats any Allow |
| Trust Policy | Who can assume a role |
| Permission Policy | What the role can do |
| Least Privilege | Give only the permissions needed, nothing more |

## Cleanup

Nothing to clean up from this lesson -- the billing alarm and role are things you WANT to keep. The alarm protects you, and the role is needed for Phase 02.

If you ever want to remove them:

```bash
# Delete the alarm
aws cloudwatch delete-alarms \
  --alarm-names billing-alarm-1-dollar \
  --region us-east-1

# Delete SNS subscription and topic
# (first list subscriptions to get the subscription ARN)
aws sns list-subscriptions-by-topic \
  --topic-arn arn:aws:sns:us-east-1:703091483538:billing-alarm \
  --region us-east-1

aws sns unsubscribe --subscription-arn <SUBSCRIPTION_ARN>
aws sns delete-topic --topic-arn arn:aws:sns:us-east-1:703091483538:billing-alarm --region us-east-1

# Detach policy and delete role
aws iam detach-role-policy \
  --role-name lambda-free-tier-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam delete-role --role-name lambda-free-tier-role
```

---

## Next Up

**[02 -- "Run code without servers"](../02-lambda/)** -- Deploy your first Lambda function using the role you just created.
