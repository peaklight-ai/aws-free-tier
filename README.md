# AWS Free Tier -- Hands-On CLI Syllabus

A structured, hands-on learning path for AWS services using only the CLI. Each numbered folder is a lesson with a quickstart guide, example code, and billing guardrails. Follow the order -- each lesson builds on the previous ones.

## Syllabus

### Foundation

| # | Folder | Subtitle | What You'll Learn | Free Tier | Duration |
|---|--------|----------|-------------------|-----------|----------|
| 01 | [01-billing-and-iam](01-billing-and-iam/) | **"Don't get billed"** | Set up billing alarms, understand IAM users/roles/policies, learn how AWS identity and permissions work | Always Free | 45 min |

### Core Serverless

| # | Folder | Subtitle | What You'll Learn | Free Tier | Duration |
|---|--------|----------|-------------------|-----------|----------|
| 02 | [02-lambda](02-lambda/) | **"Run code without servers"** | Deploy Python functions, invoke them, create free HTTP endpoints, view logs | 1M requests/mo -- Always Free | 60 min |
| 03 | [03-dynamodb](03-dynamodb/) | **"NoSQL in 60 minutes"** | Create tables, insert/read/update/delete items, query vs scan, auto-expire data with TTL | 25 GB, 25 RCU/WCU -- Always Free | 60 min |
| 04 | [04-s3](04-s3/) | **"The internet's hard drive"** | Create buckets, upload/download files, set permissions, host a static website | 5 GB, 20K GET -- 12 months | 60 min |

### Integrations

| # | Folder | Subtitle | What You'll Build | Duration |
|---|--------|----------|-------------------|----------|
| 05 | [05-lambda-dynamodb](05-lambda-dynamodb/) | **"Your first serverless API"** | A CRUD API -- Lambda handles HTTP requests, DynamoDB stores the data | 60 min |
| 06 | [06-lambda-s3](06-lambda-s3/) | **"Upload a file, trigger code"** | An event pipeline -- drop a file in S3, Lambda auto-processes it | 45 min |

### Messaging

| # | Folder | Subtitle | What You'll Learn | Free Tier | Duration |
|---|--------|----------|-------------------|-----------|----------|
| 07a | [07a-sns](07a-sns/) | **"Broadcast to many"** | Create topics, subscribe email/SMS/Lambda, publish messages to multiple receivers at once | 1M publishes/mo -- Always Free | 30 min |
| 07b | [07b-sqs](07b-sqs/) | **"Queue work for later"** | Create queues, send/receive messages, build reliable async processing with retries | 1M requests/mo -- Always Free | 30 min |

### Observability

| # | Folder | Subtitle | What You'll Learn | Free Tier | Duration |
|---|--------|----------|-------------------|-----------|----------|
| 08 | [08-cloudwatch](08-cloudwatch/) | **"See everything happening"** | Read Lambda logs, create custom metrics, build dashboards, set alarms that notify you | 10 metrics, 10 alarms -- Always Free | 45 min |

### Compute & Networking (v2.0)

| # | Folder | Subtitle | What You'll Learn | Free Tier | Duration |
|---|--------|----------|-------------------|-----------|----------|
| 09 | [09-ec2](09-ec2/) | **"Your own server in the cloud"** | Launch a Linux instance, connect without SSH (SSM), install software, open ports | 750 hrs/mo t3.micro -- 12 months | 60 min |
| 10 | [10-ebs](10-ebs/) | **"Plug-in hard drives"** | Create storage volumes, attach to EC2, take snapshots, restore from backup | 30 GB SSD -- 12 months | 30 min |
| 11 | [11-rds](11-rds/) | **"Managed Postgres/MySQL"** | Launch a database, connect from CLI, backups and snapshots -- no DBA needed | 750 hrs/mo db.t3.micro -- 12 months | 60 min |
| 12 | [12-elastic-load-balancing](12-elastic-load-balancing/) | **"Spread traffic across servers"** | Create a load balancer, register targets, configure health checks | 750 hrs/mo -- 12 months | 45 min |
| 13 | [13-cloudfront](13-cloudfront/) | **"Make your site fast everywhere"** | Set up a CDN, cache content at edge locations worldwide, custom domains | 1 TB egress/mo -- Always Free | 45 min |

### CI/CD (v3.0)

| # | Folder | Subtitle | What You'll Learn | Free Tier | Duration |
|---|--------|----------|-------------------|-----------|----------|
| 14a | [14a-codebuild](14a-codebuild/) | **"Build and test in the cloud"** | Define build specs, compile/test code on AWS, get build logs | 100 min/mo -- Always Free | 45 min |
| 14b | [14b-codecommit](14b-codecommit/) | **"Private Git on AWS"** | Create repos, push/pull code, manage branches -- like GitHub but on your AWS account | 5 users, 50 GB -- Always Free | 30 min |
| 14c | [14c-codepipeline](14c-codepipeline/) | **"Push code, auto-deploy"** | Wire source -> build -> deploy into an automated pipeline | 1 pipeline/mo -- Always Free | 45 min |

### Email & Archival (v4.0)

| # | Folder | Subtitle | What You'll Learn | Free Tier | Duration |
|---|--------|----------|-------------------|-----------|----------|
| 15 | [15-ses](15-ses/) | **"Send email from code"** | Verify domains, send transactional emails, handle bounces | 3K messages/mo -- 12 months | 30 min |
| 16 | [16-glacier](16-glacier/) | **"Cold storage for pennies"** | Archive data cheaply, understand retrieval tiers and when to use each | 10 GB -- Always Free | 30 min |

## How to Use This Repo

1. **Start at 01.** Billing safety first -- never skip this.
2. **Follow the numbers.** Each lesson assumes you completed the ones before it.
3. **Run every command yourself.** This is a CLI course. `aws` commands are meant to be typed and observed.
4. **Read the output.** Each guide explains what the output means and what to look for.
5. **Clean up after each lesson.** Every guide has a cleanup section to stay within free tier.

## Prerequisites

- An AWS account ([create one here](https://aws.amazon.com/free/))
- AWS CLI v2 installed and configured (`aws configure`)
- Python 3.9+ (for Lambda examples)
- A terminal you're comfortable in

## Free Tier Types

- **Always Free** -- never expires, free forever
- **12 months** -- free for 12 months after account creation, then pay-as-you-go

## Billing Safety Rules

1. **Phase 01 is mandatory.** Set up billing alarms before touching anything.
2. **Tag everything:** `project=aws-free-tier-lab` for easy cleanup
3. **Check spend:** `aws ce get-cost-and-usage` after each session
4. **Clean up:** Every lesson has a teardown section. Use it.
5. **When in doubt:** `aws ce get-cost-forecast` to see projected costs

## Progress Tracking

Mark your progress as you go:

- [ ] 01 -- Don't get billed
- [ ] 02 -- Run code without servers
- [ ] 03 -- NoSQL in 60 minutes
- [ ] 04 -- The internet's hard drive
- [ ] 05 -- Your first serverless API
- [ ] 06 -- Upload a file, trigger code
- [ ] 07a -- Broadcast to many
- [ ] 07b -- Queue work for later
- [ ] 08 -- See everything happening
- [ ] 09 -- Your own server in the cloud
- [ ] 10 -- Plug-in hard drives
- [ ] 11 -- Managed Postgres/MySQL
- [ ] 12 -- Spread traffic across servers
- [ ] 13 -- Make your site fast everywhere
- [ ] 14a -- Build and test in the cloud
- [ ] 14b -- Private Git on AWS
- [ ] 14c -- Push code, auto-deploy
- [ ] 15 -- Send email from code
- [ ] 16 -- Cold storage for pennies

## Source

Free tier data sourced from [free-for.dev](https://free-for.dev) and the [AWS Free Tier page](https://aws.amazon.com/free/).

---

Built by [PLAI](https://peaklight.ai) R&D Scout Lab
