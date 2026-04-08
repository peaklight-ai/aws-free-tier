# Exercise 02 -- Policy Builder

**Time:** 10 minutes
**Type:** CLI + thinking

You'll write IAM policies in JSON by hand, then verify them with the CLI. This is the single most important skill for running agents securely on AWS.

---

## Warm-up: Read an existing policy

Run this to see what `AWSLambdaBasicExecutionRole` allows:

```bash
# First get the policy version
aws iam get-policy \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
  --query 'Policy.DefaultVersionId' \
  --output text

# Then read the actual document (use the version from above)
aws iam get-policy-version \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
  --version-id v1 \
  --query 'PolicyVersion.Document' \
  --output json
```

**What three actions does this policy allow?**

1. _______________
2. _______________
3. _______________

**What resource can it act on?** _______________

---

## Challenge 1: Read-Only S3 Policy

Write a policy that allows reading objects from a specific bucket called `my-reports`, but nothing else.

**Fill in the blanks:**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "______",
            "Action": "______",
            "Resource": "arn:aws:s3:::my-reports/______"
        }
    ]
}
```

<details>
<summary>Answer</summary>

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::my-reports/*"
        }
    ]
}
```

- `Effect`: Allow (grant permission)
- `Action`: s3:GetObject (download files)
- `Resource`: `/*` means all objects in the bucket

</details>

---

## Challenge 2: Lambda + DynamoDB Policy

Your agent needs a role for a Lambda function that can:
- Read items from a DynamoDB table called `users`
- Write items to the same table
- Write logs to CloudWatch

**Write the policy:**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "______",
                "______",
                "______",
                "______"
            ],
            "Resource": "arn:aws:dynamodb:us-east-1:703091483538:table/______"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "______"
        }
    ]
}
```

**Hint:** DynamoDB actions are `dynamodb:GetItem`, `dynamodb:PutItem`, `dynamodb:UpdateItem`, `dynamodb:Query`

<details>
<summary>Answer</summary>

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:us-east-1:703091483538:table/users"
        },
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

Key points:
- DynamoDB resource is scoped to ONE specific table
- Logs resource is `*` because log groups are created dynamically
- Two separate statements for two different services

</details>

---

## Challenge 3: Deny Override

Given these two policies both attached to the same role:

**Policy A:**
```json
{ "Effect": "Allow", "Action": "s3:*", "Resource": "*" }
```

**Policy B:**
```json
{ "Effect": "Deny", "Action": "s3:DeleteBucket", "Resource": "*" }
```

**Questions:**

1. Can this role upload a file to S3? (Yes/No) ___
2. Can this role delete a bucket? (Yes/No) ___
3. Why? _______________________________________________

<details>
<summary>Answer</summary>

1. **Yes** -- Policy A allows `s3:*` which includes `s3:PutObject`
2. **No** -- Policy B explicitly denies `s3:DeleteBucket`, and Deny ALWAYS wins over Allow
3. The evaluation order: Check for Deny first. If found, denied regardless of any Allow.

**For agents:** This is how you create guardrails. Give your agent broad S3 access but explicitly deny destructive operations. The agent can read/write but never accidentally delete a bucket.

</details>

---

## Challenge 4: Spot the Security Problem

An agent uses this policy for its Lambda functions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
```

**What's wrong with this? List at least 3 problems:**

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

<details>
<summary>Answer</summary>

1. **No least privilege** -- the Lambda can do anything: delete databases, create expensive EC2 instances, read secrets, modify IAM
2. **Blast radius is unlimited** -- if the function has a bug or gets exploited, the attacker has full account access
3. **No resource scoping** -- `Resource: *` means every resource in the account, not just what the function needs
4. **Violates compliance** -- most security frameworks (SOC2, HIPAA) require least-privilege access
5. **Cost risk** -- a runaway function could spin up expensive resources

**The fix:** Scope to exactly what the function needs (specific actions on specific resources).

</details>

---

## Agent Relevance

In the PLAI workflow:

```
Claude Code (plai-aws skill)
    |
    |  Uses: chadi-admin credentials (broad access)
    |  To: create Lambda functions, assign roles
    |
    v
Lambda Function (in production)
    |
    |  Uses: scoped IAM role (least privilege)
    |  Can only: read/write specific DynamoDB table
    |            write CloudWatch logs
    |  Cannot: delete things, access other services
    |
    v
DynamoDB Table (the data)
```

Your agent is the **powerful deployer**. The functions it deploys should be **restricted workers**. Writing good policies is how you enforce that boundary.
