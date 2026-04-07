# AWS Free Tier Quickstart Lab

A hands-on reference for every AWS service available on the free tier. Each service gets its own directory with a quickstart guide, example code, and notes on limits so you never get surprise-billed.

## Services

| Service | Free Tier | Type | Quickstart |
|---------|-----------|------|------------|
| [Lambda](lambda/) | 1M requests/mo, 400K GB-s compute | Always Free | Ready |
| [DynamoDB](dynamodb/) | 25 GB storage, 25 RCU/WCU | Always Free | Planned |
| [S3](s3/) | 5 GB storage, 20K GET, 2K PUT | 12 months | Planned |
| [EC2](ec2/) | 750 hrs/mo t2.micro or t3.micro | 12 months | Planned |
| [EBS](ebs/) | 30 GB General Purpose SSD | 12 months | Planned |
| [RDS](rds/) | 750 hrs/mo db.t2/t3/t4g.micro, 20 GB | 12 months | Planned |
| [CloudFront](cloudfront/) | 1 TB egress/mo, 2M Function invocations | Always Free | Planned |
| [CloudWatch](cloudwatch/) | 10 custom metrics, 10 alarms | Always Free | Planned |
| [CodeBuild](codebuild/) | 100 min build time/mo | Always Free | Planned |
| [CodeCommit](codecommit/) | 5 users, 50 GB storage, 10K requests/mo | Always Free | Planned |
| [CodePipeline](codepipeline/) | 1 active pipeline/mo | Always Free | Planned |
| [SNS](sns/) | 1M publishes/mo | Always Free | Planned |
| [SES](ses/) | 3,000 messages/mo | 12 months | Planned |
| [SQS](sqs/) | 1M requests/mo | Always Free | Planned |
| [Glacier](glacier/) | 10 GB long-term storage | Always Free | Planned |
| [Elastic Load Balancing](elastic-load-balancing/) | 750 hrs/mo | 12 months | Planned |

## How to Use This Repo

1. Pick a service directory
2. Follow the `README.md` quickstart inside it
3. Each guide includes: what you get free, setup steps, example code, and billing guardrails

## Free Tier Types

- **Always Free** -- permanent, does not expire after 12 months
- **12 months** -- free for the first 12 months after account creation, then standard pricing

## Prerequisites

- An AWS account ([create one here](https://aws.amazon.com/free/))
- AWS CLI installed and configured (`aws configure`)
- Python 3.9+ (for Lambda examples)
- Basic terminal familiarity

## Billing Safety

Every quickstart includes a "Stay Free" section with hard limits and alerts. General rules:

- Set up a [billing alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html) immediately after account creation
- Use `aws ce get-cost-and-usage` to check spend anytime
- Tag all resources with `project: aws-free-tier-lab` for easy cleanup
- When done experimenting, tear down resources -- each guide has a cleanup section

## Source

Free tier data sourced from [free-for.dev](https://free-for.dev) and the [AWS Free Tier page](https://aws.amazon.com/free/).

---

Built by [PLAI](https://peaklight.ai) R&D Scout Lab
