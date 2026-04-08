# Exercise 01 -- Identity Quiz

**Time:** 5 minutes
**Type:** CLI

Answer each question by running the AWS CLI command. Write your answers below.

---

## Q1: What is your 12-digit AWS account number?

**Command to find out:**

```bash
aws sts get-caller-identity --region us-east-1 --query 'Account' --output text
```

**Your answer:** _______________

---

## Q2: What is the full ARN of your IAM user?

**Command to find out:**

```bash
aws sts get-caller-identity --region us-east-1 --query 'Arn' --output text
```

**Your answer:** _______________

**Break it apart:**

| Part | Value |
|------|-------|
| arn | arn |
| partition | ___ |
| service | ___ |
| region | ___ (hint: IAM is global) |
| account | ___ |
| resource | ___ |

---

## Q3: How many IAM users exist in your account?

**Command to find out:**

```bash
aws iam list-users --query 'length(Users)' --output text
```

**Your answer:** _______________

---

## Q4: What policy gives you admin access? What is its ARN?

**Command to find out:**

```bash
aws iam list-attached-user-policies --user-name chadi-admin --output table
```

**Your answer:** _______________

---

## Q5: What does that policy actually allow?

**Command to find out:**

```bash
aws iam get-policy-version \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess \
  --version-id v1 \
  --query 'PolicyVersion.Document.Statement[0]' \
  --output json
```

**In your own words, what does this policy do?**

_______________________________________________________________

---

## Agent Relevance

**Why this matters for your agents:**

When Claude Code runs `aws lambda create-function`, AWS checks:

1. Who is calling? --> `arn:aws:iam::703091483538:user/chadi-admin`
2. What are they trying to do? --> `lambda:CreateFunction`
3. Is there a policy that allows it? --> Yes, `AdministratorAccess` allows `*`
4. Result: ALLOWED

If you scoped your agent's permissions (which you should in production), step 3 would check for specific Lambda permissions, not `*`.
