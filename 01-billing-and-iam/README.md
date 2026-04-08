# 01 -- Billing Safety & IAM Foundations

## What You'll Learn

- How to set up a billing alarm so you never get surprise-billed
- How AWS identity works: users, roles, policies, ARNs
- How to create scoped IAM roles for services
- How to check your free tier usage from the CLI

## Prerequisites

- AWS CLI v2 configured (`aws configure`)
- Your AWS account credentials

## Quickstart

Start the GSD Phase 1 session with Claude. Each command is explained before you run it.

## Topics

### Billing Alarm
- Create a CloudWatch alarm on estimated charges
- Set threshold at $1 (catch anything immediately)
- Subscribe your email for notifications

### IAM Basics
- List users, roles, policies
- Understand ARNs (Amazon Resource Names)
- Read a policy document
- Understand trust policies vs permission policies

### Create a Lambda Execution Role
- Write a trust policy (who can assume this role)
- Attach managed policies (what the role can do)
- This role carries forward to Phase 2

### Free Tier Monitoring
- Check free tier usage with `aws ce`
- Understand what's always-free vs 12-month-free
- Set up a monthly check habit
