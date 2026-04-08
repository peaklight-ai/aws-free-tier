# AWS Free Tier -- Hands-On CLI Syllabus

A structured, hands-on learning path for AWS services using only the CLI. Each numbered folder is a lesson with a quickstart guide, example code, and billing guardrails. Follow the order -- each lesson builds on the previous ones.

## Syllabus

### Foundation

| # | Folder | Lesson | Free Tier | Duration |
|---|--------|--------|-----------|----------|
| 01 | [01-billing-and-iam](01-billing-and-iam/) | Billing alarms, IAM users/roles/policies, ARNs | Always Free | 45 min |

### Core Serverless

| # | Folder | Lesson | Free Tier | Duration |
|---|--------|--------|-----------|----------|
| 02 | [02-lambda](02-lambda/) | Deploy, invoke, update functions. Function URLs | 1M requests/mo -- Always Free | 60 min |
| 03 | [03-dynamodb](03-dynamodb/) | Tables, CRUD, queries, scans, TTL | 25 GB, 25 RCU/WCU -- Always Free | 60 min |
| 04 | [04-s3](04-s3/) | Buckets, objects, policies, static hosting | 5 GB, 20K GET -- 12 months | 60 min |

### Integrations

| # | Folder | Lesson | What You'll Build | Duration |
|---|--------|--------|-------------------|----------|
| 05 | [05-lambda-dynamodb](05-lambda-dynamodb/) | Serverless CRUD API | Lambda + DynamoDB | 60 min |
| 06 | [06-lambda-s3](06-lambda-s3/) | Event-driven file processing | Lambda + S3 triggers | 45 min |

### Messaging

| # | Folder | Lesson | Free Tier | Duration |
|---|--------|--------|-----------|----------|
| 07a | [07a-sns](07a-sns/) | Topics, subscriptions, pub/sub | 1M publishes/mo -- Always Free | 30 min |
| 07b | [07b-sqs](07b-sqs/) | Queues, send/receive, fan-out | 1M requests/mo -- Always Free | 30 min |

### Observability

| # | Folder | Lesson | Free Tier | Duration |
|---|--------|--------|-----------|----------|
| 08 | [08-cloudwatch](08-cloudwatch/) | Logs, metrics, dashboards, alarms | 10 metrics, 10 alarms -- Always Free | 45 min |

### Compute & Networking (v2.0)

| # | Folder | Lesson | Free Tier | Duration |
|---|--------|--------|-----------|----------|
| 09 | [09-ec2](09-ec2/) | Launch instances, connect via SSM | 750 hrs/mo t3.micro -- 12 months | 60 min |
| 10 | [10-ebs](10-ebs/) | Volumes, snapshots, attach/detach | 30 GB SSD -- 12 months | 30 min |
| 11 | [11-rds](11-rds/) | Managed databases, connect from CLI | 750 hrs/mo db.t3.micro -- 12 months | 60 min |
| 12 | [12-elastic-load-balancing](12-elastic-load-balancing/) | ALB/NLB, target groups, health checks | 750 hrs/mo -- 12 months | 45 min |
| 13 | [13-cloudfront](13-cloudfront/) | CDN, distributions, caching | 1 TB egress/mo -- Always Free | 45 min |

### CI/CD (v3.0)

| # | Folder | Lesson | Free Tier | Duration |
|---|--------|--------|-----------|----------|
| 14a | [14a-codebuild](14a-codebuild/) | Build projects, buildspec.yml | 100 min/mo -- Always Free | 45 min |
| 14b | [14b-codecommit](14b-codecommit/) | Git repos on AWS | 5 users, 50 GB -- Always Free | 30 min |
| 14c | [14c-codepipeline](14c-codepipeline/) | Automated deployment pipelines | 1 pipeline/mo -- Always Free | 45 min |

### Email & Storage (v4.0)

| # | Folder | Lesson | Free Tier | Duration |
|---|--------|--------|-----------|----------|
| 15 | [15-ses](15-ses/) | Transactional email from CLI | 3K messages/mo -- 12 months | 30 min |
| 16 | [16-glacier](16-glacier/) | Archival storage, retrieval tiers | 10 GB -- Always Free | 30 min |

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

- [ ] 01 -- Billing & IAM
- [ ] 02 -- Lambda
- [ ] 03 -- DynamoDB
- [ ] 04 -- S3
- [ ] 05 -- Lambda + DynamoDB
- [ ] 06 -- Lambda + S3
- [ ] 07a -- SNS
- [ ] 07b -- SQS
- [ ] 08 -- CloudWatch
- [ ] 09 -- EC2
- [ ] 10 -- EBS
- [ ] 11 -- RDS
- [ ] 12 -- ELB
- [ ] 13 -- CloudFront
- [ ] 14a -- CodeBuild
- [ ] 14b -- CodeCommit
- [ ] 14c -- CodePipeline
- [ ] 15 -- SES
- [ ] 16 -- Glacier

## Source

Free tier data sourced from [free-for.dev](https://free-for.dev) and the [AWS Free Tier page](https://aws.amazon.com/free/).

---

Built by [PLAI](https://peaklight.ai) R&D Scout Lab
