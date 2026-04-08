# Exercise 04 -- Role Surgery

**Time:** 10 minutes
**Type:** CLI

Practice creating, inspecting, modifying, and deleting IAM roles. These are the exact operations your agents perform when deploying serverless functions.

---

## Part 1: Inspect the Role You Built

### Read the trust policy

```bash
aws iam get-role \
  --role-name lambda-free-tier-role \
  --query 'Role.AssumeRolePolicyDocument' \
  --output json
```

**Questions:**

1. What service can assume this role? _______________
2. What action does the trust policy allow? _______________
3. Could an EC2 instance assume this role? (Yes/No) ___ Why? _______________

---

### List its permissions

```bash
aws iam list-attached-role-policies \
  --role-name lambda-free-tier-role \
  --output table
```

**How many policies are attached?** ___

**What can this role do? (list the actions):**

1. _______________
2. _______________
3. _______________

---

## Part 2: Add a Permission (Temporarily)

Let's give the role read-only access to S3, then take it away.

### Attach S3 read-only policy

```bash
aws iam attach-role-policy \
  --role-name lambda-free-tier-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
```

### Verify it's attached

```bash
aws iam list-attached-role-policies \
  --role-name lambda-free-tier-role \
  --output table
```

**How many policies now?** ___ (should be 2)

### Read what S3ReadOnly allows

```bash
aws iam get-policy \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess \
  --query 'Policy.DefaultVersionId' \
  --output text
```

```bash
aws iam get-policy-version \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess \
  --version-id v1 \
  --query 'PolicyVersion.Document.Statement[0].Action' \
  --output json
```

**What actions does it allow?** _______________

### Remove it (we don't need it yet)

```bash
aws iam detach-role-policy \
  --role-name lambda-free-tier-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
```

### Verify it's gone

```bash
aws iam list-attached-role-policies \
  --role-name lambda-free-tier-role \
  --output table
```

**Back to 1 policy?** ___

**What you just did:**

```
BEFORE:  Role --> [CloudWatch Logs]
   |
   v (attach)
DURING:  Role --> [CloudWatch Logs] + [S3 ReadOnly]
   |
   v (detach)
AFTER:   Role --> [CloudWatch Logs]
```

This is how you dynamically adjust permissions. In Phase 05, you'll attach DynamoDB permissions to this same role when Lambda needs database access.

---

## Part 3: Create a Throwaway Role

Practice the full lifecycle: create, use, destroy.

### Create a trust policy for EC2

```bash
cat > /tmp/ec2-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
```

**How is this different from the Lambda trust policy?**

_______________________________________________

### Create the role

```bash
aws iam create-role \
  --role-name test-ec2-role-DELETE-ME \
  --assume-role-policy-document file:///tmp/ec2-trust-policy.json \
  --tags Key=project,Value=aws-free-tier-lab Key=temporary,Value=true
```

### Verify it exists

```bash
aws iam get-role \
  --role-name test-ec2-role-DELETE-ME \
  --query 'Role.{Name:RoleName,Arn:Arn,TrustService:AssumeRolePolicyDocument.Statement[0].Principal.Service}' \
  --output table
```

### Delete it (cleanup)

```bash
aws iam delete-role --role-name test-ec2-role-DELETE-ME
```

### Verify it's gone

```bash
aws iam get-role --role-name test-ec2-role-DELETE-ME 2>&1
```

**You should get:** `NoSuchEntity` error. That confirms deletion.

---

## Part 4: The Dangerous Query

List ALL roles in your account and count them:

```bash
aws iam list-roles \
  --query 'length(Roles)' \
  --output text
```

**How many roles total?** ___

Now filter to just the ones you created (not AWS service-linked roles):

```bash
aws iam list-roles \
  --query 'Roles[?!starts_with(RoleName, `aws-service-role`) && !starts_with(RoleName, `AWS`)].{Name:RoleName,Created:CreateDate}' \
  --output table
```

**How many are yours?** ___

---

## Agent Relevance

This is the exact workflow your Claude agent performs:

```
AGENT DEPLOYS A NEW SERVICE:

1. Create trust policy JSON
   (decides WHICH service gets the role)

2. aws iam create-role
   (creates the identity)

3. aws iam attach-role-policy  
   (gives it specific permissions)

4. aws lambda create-function --role ROLE_ARN
   (assigns the role to the function)

AGENT UPDATES PERMISSIONS:

5. aws iam attach-role-policy
   (adds new capabilities, e.g., DynamoDB access)

AGENT TEARS DOWN:

6. aws iam detach-role-policy (for EACH policy)
7. aws iam delete-role
   (Note: must detach ALL policies before deleting)
```

**Key gotcha:** You cannot delete a role that still has policies attached. Your agent must detach first, then delete. If it tries to delete directly, it gets an error.
