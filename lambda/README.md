# AWS Lambda -- Free Tier Quickstart

## What You Get Free (Always Free)

- **1,000,000 requests** per month
- **400,000 GB-seconds** of compute per month
- This does NOT expire -- it's free forever, not just 12 months

With the default 128 MB memory, 400K GB-s = ~3.2 million seconds of execution time per month.

## Prerequisites

- AWS CLI configured (`aws configure`)
- Python 3.9+
- An IAM role with Lambda execution permissions (we'll create one below)

## Quickstart

### 1. Create the execution role

Lambda needs an IAM role to run. Create a trust policy file first:

```bash
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "lambda.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
```

Create the role:

```bash
aws iam create-role \
  --role-name lambda-free-tier-role \
  --assume-role-policy-document file://trust-policy.json
```

Attach basic execution permissions (CloudWatch Logs):

```bash
aws iam attach-role-policy \
  --role-name lambda-free-tier-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

Save the role ARN -- you'll need it:

```bash
ROLE_ARN=$(aws iam get-role --role-name lambda-free-tier-role --query 'Role.Arn' --output text)
echo $ROLE_ARN
```

### 2. Write the function

```bash
cat > lambda_function.py << 'EOF'
import json

def handler(event, context):
    name = event.get("name", "world")
    return {
        "statusCode": 200,
        "body": json.dumps({"message": f"hello {name}", "free_tier": True})
    }
EOF
```

### 3. Package and deploy

```bash
zip function.zip lambda_function.py

aws lambda create-function \
  --function-name hello-free-tier \
  --runtime python3.12 \
  --role $ROLE_ARN \
  --handler lambda_function.handler \
  --zip-file fileb://function.zip \
  --tags project=aws-free-tier-lab
```

### 4. Invoke it

```bash
aws lambda invoke \
  --function-name hello-free-tier \
  --payload '{"name": "PLAI"}' \
  --cli-binary-format raw-in-base64-out \
  response.json

cat response.json
```

Expected output:

```json
{"message": "hello PLAI", "free_tier": true}
```

### 5. Invoke via URL (optional)

Create a function URL for HTTP access without API Gateway:

```bash
aws lambda create-function-url-config \
  --function-name hello-free-tier \
  --auth-type NONE

aws lambda add-permission \
  --function-name hello-free-tier \
  --statement-id public-access \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE
```

Get your URL:

```bash
aws lambda get-function-url-config \
  --function-name hello-free-tier \
  --query 'FunctionUrl' --output text
```

Test it:

```bash
curl -X POST "$(aws lambda get-function-url-config --function-name hello-free-tier --query 'FunctionUrl' --output text)" \
  -H "Content-Type: application/json" \
  -d '{"name": "internet"}'
```

## Stay Free

| Resource | Free Limit | What Costs Money |
|----------|-----------|-----------------|
| Requests | 1M/month | $0.20 per additional 1M |
| Compute | 400K GB-s/month | $0.0000166667 per GB-s |
| Function URLs | Free | N/A |
| CloudWatch Logs | 5 GB ingestion/mo free | $0.50/GB after that |

Tips to stay within limits:

- **Set memory to 128 MB** unless you need more -- lower memory = more free seconds
- **Set timeout to 10s** max to prevent runaway executions
- Keep functions short-lived and stateless
- Monitor usage: `aws lambda get-account-settings`

## Useful Patterns on Free Tier

- **Cron jobs**: Use EventBridge (free) to trigger Lambda on a schedule
- **Webhook handler**: Function URL gives you a free HTTPS endpoint
- **S3 event processor**: Trigger on file uploads (pairs with S3 free tier)
- **DynamoDB stream processor**: React to database changes (pairs with DynamoDB free tier)
- **API backend**: Use with API Gateway (1M calls/mo free for REST APIs)

## Cleanup

```bash
# Delete the function URL
aws lambda delete-function-url-config --function-name hello-free-tier

# Delete the function
aws lambda delete-function --function-name hello-free-tier

# Detach policy and delete role
aws iam detach-role-policy \
  --role-name lambda-free-tier-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam delete-role --role-name lambda-free-tier-role

# Clean up local files
rm -f trust-policy.json function.zip lambda_function.py response.json
```

## Next Steps

- Add a [DynamoDB](../dynamodb/) table and read/write from Lambda
- Set up an [EventBridge schedule](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html) to run your function every hour
- Add [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) for path-based routing (1M calls/mo free)
- Connect to [SQS](../sqs/) for async message processing
