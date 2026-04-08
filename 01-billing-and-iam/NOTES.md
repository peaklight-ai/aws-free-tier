# Lesson 01 -- Notes

## The Mental Model

AWS is a building with thousands of rooms. IAM is the security system -- it controls every door.

```
+===========================================================+
|                    AWS ACCOUNT (the building)               |
|                                                             |
|   FRONT DESK: IAM                                           |
|   "Show me your badge. What room do you need?"              |
|                                                             |
|   BADGE TYPES:                                              |
|   +------------------+  +------------------+                |
|   | USER             |  | ROLE             |                |
|   | For: Humans      |  | For: Services    |                |
|   | Has: Password +  |  | Has: Trust policy|                |
|   |      Access keys |  |      (who can    |                |
|   | Lives: Forever   |  |       wear it)   |                |
|   | Example: you     |  | Example: Lambda  |                |
|   +------------------+  +------------------+                |
|                                                             |
|   ROOM KEYS = POLICIES                                      |
|   Each key says: "Allow/Deny [action] on [resource]"        |
|                                                             |
|   NO KEY = NO ENTRY (default deny)                          |
|   "DENIED" KEY OVERRIDES "ALLOWED" KEY                      |
|                                                             |
+=============================================================+
```

## Core Concepts

### 1. ARN -- The Address System

Every AWS resource has a unique address called an ARN:

```
arn:aws:lambda:us-east-1:703091483538:function:hello-free-tier
 |    |    |       |          |          |         |
 |    |    |       |          |          |         +-- resource name
 |    |    |       |          |          +-- resource type
 |    |    |       |          +-- your account ID
 |    |    |       +-- region
 |    |    +-- service name
 |    +-- partition (always "aws" for public)
 +-- always "arn"
```

**For agents:** When your Claude agent calls `aws lambda invoke`, it needs to reference the function by ARN or name. ARNs are how agents address AWS resources programmatically.

### 2. Policies -- The Permission Language

A policy is JSON that answers three questions:

```
+----------------------------------------------------+
|  POLICY = a rule card                               |
|                                                     |
|  1. EFFECT:   Allow or Deny?                        |
|  2. ACTION:   What operation? (s3:GetObject)        |
|  3. RESOURCE: On what thing? (arn:aws:s3:::bucket) |
|                                                     |
|  Example in English:                                |
|  "Allow downloading files from the reports bucket"  |
|                                                     |
|  Example in JSON:                                   |
|  {                                                  |
|    "Effect": "Allow",                               |
|    "Action": "s3:GetObject",                        |
|    "Resource": "arn:aws:s3:::reports-bucket/*"      |
|  }                                                  |
+----------------------------------------------------+
```

### 3. Users vs Roles

```
USER (for humans)                 ROLE (for services)
+------------------------+       +------------------------+
| Has credentials:       |       | Has trust policy:      |
|   - Password (console) |       |   "Lambda can assume   |
|   - Access keys (CLI)  |       |    this role"          |
|                        |       |                        |
| Credentials are        |       | No credentials stored. |
| permanent (rotate      |       | Service gets temporary |
| them regularly!)       |       | creds when it assumes  |
|                        |       | the role (15min-12hr)  |
| You ARE a user.        |       | Lambda WEARS a role.   |
+------------------------+       +------------------------+
```

**For agents:** Your Claude agent (via the plai-aws skill) authenticates as an IAM USER (`chadi-admin`) using access keys in `~/.aws/credentials`. But when your agent deploys a Lambda function, that Lambda runs as a ROLE. The agent creates the role, Lambda wears it.

### 4. The Evaluation Flow

When any API call hits AWS:

```
API Call arrives
      |
      v
+-- Is there an explicit DENY? --+
|                                 |
| YES --> DENIED. Period.         |
|         (Deny always wins)      |
|                                 |
| NO  --> Is there an ALLOW? --+  |
|         |                    |  |
|         | YES --> ALLOWED    |  |
|         |                    |  |
|         | NO  --> DENIED     |  |
|         |  (implicit deny)   |  |
|         +--------------------+  |
+---------------------------------+
```

### 5. Billing -- How AWS Charges

```
FREE TIER has two types:

ALWAYS FREE (never expires)          12-MONTH FREE (clock ticking)
+----------------------------+      +----------------------------+
| Lambda: 1M requests/mo    |      | EC2: 750 hrs/mo            |
| DynamoDB: 25GB             |      | S3: 5GB                    |
| SNS: 1M publishes/mo      |      | RDS: 750 hrs/mo            |
| SQS: 1M requests/mo       |      | EBS: 30GB                  |
| CloudWatch: 10 alarms     |      | ELB: 750 hrs/mo            |
+----------------------------+      +----------------------------+
  These are yours forever.           These expire 12 months after
  Lambda is free tier gold.          account creation. Set a
                                     calendar reminder.
```

## What This Means for Your Agents

### Why IAM matters for AI agents

```
YOUR AGENT WORKFLOW:
                                                          
  Claude Code                   AWS                       
  (your agent)                  (the cloud)               
      |                            |                      
      |  aws lambda create-func   |                      
      |--------------------------->|                      
      |                            |                      
      |  IAM checks:              |                      
      |  "Does chadi-admin have   |                      
      |   lambda:CreateFunction?" |                      
      |                            |                      
      |  YES (admin policy)        |                      
      |<---------------------------|                      
      |                            |                      
      |  Function created!         |                      
      |  But the FUNCTION itself   |                      
      |  runs as lambda-free-tier- |                      
      |  role, NOT as chadi-admin  |                      
      |                            |                      
```

**Key insight:** Your agent (Claude Code) and your functions (Lambda) have DIFFERENT identities and permissions.

- **Agent identity:** `chadi-admin` (IAM user) -- can create/delete/manage everything
- **Function identity:** `lambda-free-tier-role` (IAM role) -- can only write logs

This is **separation of concerns:**
- The agent is the **deployer** (powerful, has broad access)
- The function is the **worker** (restricted, can only do its specific job)

### Least privilege for agents

In production, you wouldn't use `AdministratorAccess` for your agent. You'd create a scoped policy:

```json
{
    "Effect": "Allow",
    "Action": [
        "lambda:CreateFunction",
        "lambda:UpdateFunctionCode",
        "lambda:InvokeFunction",
        "lambda:DeleteFunction",
        "iam:PassRole"
    ],
    "Resource": "arn:aws:lambda:us-east-1:703091483538:function:*"
}
```

This says: "The agent can manage Lambda functions but nothing else." If the agent is compromised, blast radius is limited.

### The `iam:PassRole` gotcha

When your agent creates a Lambda function and assigns it a role, AWS requires `iam:PassRole` permission. This is a security gate:

```
Agent: "Create this Lambda with lambda-free-tier-role"
AWS:   "Do you have iam:PassRole for that role?"
Agent: "Yes" (chadi-admin is admin)
AWS:   "OK, Lambda now runs as lambda-free-tier-role"
```

Without `iam:PassRole`, an agent could escalate privileges by creating a Lambda with an admin role and then invoking it.

## CLI Cheat Sheet

| What you want | Command |
|---------------|---------|
| Who am I? | `aws sts get-caller-identity --region us-east-1` |
| My spend this month | `aws ce get-cost-and-usage --time-period Start=YYYY-MM-DD,End=YYYY-MM-DD --granularity MONTHLY --metrics BlendedCost --region us-east-1` |
| List users | `aws iam list-users` |
| My policies | `aws iam list-attached-user-policies --user-name NAME` |
| Read a policy | `aws iam get-policy-version --policy-arn ARN --version-id v1` |
| List roles | `aws iam list-roles --query 'Roles[].RoleName' --output table` |
| Role's policies | `aws iam list-attached-role-policies --role-name NAME` |
| Create role | `aws iam create-role --role-name NAME --assume-role-policy-document file://trust.json` |
| Attach policy | `aws iam attach-role-policy --role-name NAME --policy-arn ARN` |
| Billing alarm status | `aws cloudwatch describe-alarms --alarm-names NAME --region us-east-1` |
| Free tier usage | `aws freetier get-free-tier-usage --region us-east-1` |

## Output Formatting Tricks

Make CLI output readable:

```bash
# Table format
aws iam list-roles --output table

# Filter with --query (JMESPath)
aws iam list-roles --query 'Roles[].RoleName' --output text

# Pretty JSON
aws iam list-roles --output json | python3 -m json.tool

# Just one field
aws sts get-caller-identity --query 'Account' --output text
```
