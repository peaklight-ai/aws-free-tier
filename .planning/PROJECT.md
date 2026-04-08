# PROJECT: AWS Free Tier Hands-On Learning

## Vision
Learn AWS services through the CLI by doing -- not reading. Each phase covers one service, with Chadi running every command himself to build muscle memory and visual familiarity with AWS CLI output.

## Context
- **Who:** Chadi (PLAI founder), experienced developer, new to AWS CLI hands-on
- **AWS Account:** 703091483538 (chadi-admin, IAM user)
- **Default Region:** me-south-1 (Bahrain) -- some services may need us-east-1
- **Approach:** GSD-phased, one service per phase, CLI-first (no console)
- **Repo:** peaklight-ai/aws-free-tier

## Learning Philosophy
- Every command is run by Chadi in the terminal (not automated)
- Claude explains what each command does BEFORE Chadi runs it
- Visual output is discussed -- what to look for, what matters
- Each phase ends with a working artifact + cleanup knowledge
- Billing safety is checked at every step

## Success Criteria
- Can deploy a Lambda function from CLI and invoke it
- Can create/query a DynamoDB table from CLI
- Can manage S3 buckets and objects from CLI
- Can wire services together (Lambda + DynamoDB, Lambda + S3)
- Understands IAM roles, policies, and least-privilege basics
- Can set up billing alerts and monitor costs from CLI
- Has a personal reference repo with working examples

## Constraints
- Free tier only -- zero spend tolerance
- CLI only -- no AWS Console clicks
- me-south-1 preferred, us-east-1 fallback
- Each phase should be completable in ~45-60 min

## Current Milestone: v1.0 -- Core Services

### Phases

| Phase | Service | Goal | Status |
|-------|---------|------|--------|
| 1 | Billing & IAM | Set up billing alarm, understand IAM basics | Planned |
| 2 | Lambda | Deploy, invoke, update, monitor a function | Planned |
| 3 | DynamoDB | Create table, CRUD operations, query patterns | Planned |
| 4 | S3 | Buckets, upload/download, policies, static hosting | Planned |
| 5 | Lambda + DynamoDB | Wire Lambda to read/write DynamoDB | Planned |
| 6 | Lambda + S3 | Trigger Lambda on S3 upload, process files | Planned |
| 7 | SNS + SQS | Pub/sub messaging, queue processing | Planned |
| 8 | CloudWatch | Logs, metrics, dashboards, alarms | Planned |

### Future Milestones
- **v2.0 -- Compute & Networking:** EC2, EBS, ELB, VPC basics
- **v3.0 -- CI/CD Pipeline:** CodeCommit, CodeBuild, CodePipeline
- **v4.0 -- Data & Storage:** RDS, Glacier, CloudFront
