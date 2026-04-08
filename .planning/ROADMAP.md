# ROADMAP: AWS Free Tier Learning -- v1.0 Core Services

## Milestone Goal
Master the core serverless AWS services through CLI hands-on. By the end, be able to build and deploy a serverless app using Lambda + DynamoDB + S3 + messaging -- entirely from the terminal.

---

## Phase 1: Billing Safety & IAM Foundations
**Goal:** Never get surprise-billed. Understand AWS identity model.

- Set up a billing alarm via CloudWatch CLI
- Explore IAM: list users, roles, policies
- Create a scoped IAM role for Lambda
- Understand ARNs, policies, trust relationships
- Check free tier usage from CLI

**Deliverable:** Billing alarm active, IAM role ready for Phase 2

---

## Phase 2: Lambda
**Goal:** Deploy, invoke, update, and monitor a Lambda function from CLI.

- Create a Python function locally
- Package and deploy with `aws lambda create-function`
- Invoke synchronously and asynchronously
- Update function code
- Create a Function URL (free HTTP endpoint)
- View logs in CloudWatch via CLI
- Understand cold starts, timeouts, memory config

**Deliverable:** Working Lambda with HTTP URL, documented in lambda/README.md

---

## Phase 3: DynamoDB
**Goal:** Create a table, perform CRUD, understand query patterns.

- Create a table with partition key + sort key
- Put, get, update, delete items
- Query vs Scan -- when to use each
- Understand capacity modes (provisioned vs on-demand)
- Set up TTL for auto-expiring items
- Export table to JSON

**Deliverable:** Working table with sample data, documented in dynamodb/README.md

---

## Phase 4: S3
**Goal:** Manage storage from CLI -- buckets, objects, policies, hosting.

- Create a bucket with proper naming
- Upload, download, list, delete objects
- Understand storage classes
- Set bucket policy for public read (static site)
- Enable static website hosting
- Generate presigned URLs
- Set lifecycle rules

**Deliverable:** Static site hosted on S3, documented in s3/README.md

---

## Phase 5: Lambda + DynamoDB Integration
**Goal:** Wire Lambda to read/write DynamoDB.

- Add DynamoDB permissions to Lambda role
- Write a Lambda that stores data in DynamoDB
- Write a Lambda that queries DynamoDB
- Create a mini CRUD API with Function URLs
- Understand IAM least-privilege for service-to-service

**Deliverable:** Working serverless API (Lambda + DynamoDB)

---

## Phase 6: Lambda + S3 Integration
**Goal:** Trigger Lambda on S3 events.

- Configure S3 event notification to trigger Lambda
- Write a Lambda that processes uploaded files
- Handle event payload parsing
- Write results back to S3 or DynamoDB
- Understand resource-based vs identity-based policies

**Deliverable:** S3 upload triggers Lambda processing pipeline

---

## Phase 7: SNS + SQS Messaging
**Goal:** Understand pub/sub and queue patterns.

- Create an SNS topic, subscribe an email endpoint
- Publish messages from CLI
- Create an SQS queue
- Send and receive messages
- Wire SNS -> SQS (fan-out pattern)
- Trigger Lambda from SQS

**Deliverable:** Working message pipeline (SNS -> SQS -> Lambda)

---

## Phase 8: CloudWatch Observability
**Goal:** Monitor everything built in prior phases.

- Explore log groups from previous Lambda work
- Create custom metrics
- Build a CLI-driven dashboard
- Set up metric alarms
- Understand log insights queries
- Review overall free tier usage

**Deliverable:** Monitoring dashboard, alarm configuration, documented in cloudwatch/README.md

---

## Dependencies
```
Phase 1 (IAM/Billing) -- required before all others
Phase 2 (Lambda) -- required before 5, 6, 7
Phase 3 (DynamoDB) -- required before 5
Phase 4 (S3) -- required before 6
Phase 5 (Lambda+DDB) -- requires 2, 3
Phase 6 (Lambda+S3) -- requires 2, 4
Phase 7 (SNS+SQS) -- requires 2
Phase 8 (CloudWatch) -- best after 2-7 are done
```
