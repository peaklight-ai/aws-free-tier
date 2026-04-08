# Exercise 03 -- Billing Detective

**Time:** 10 minutes
**Type:** CLI

Practice reading billing data and cost reports. These are the commands your agent will use to self-monitor costs.

---

## Mission: Find and Understand Every Dollar

### Step 1: Monthly spend breakdown by service

```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-04-01,End=2026-04-08 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE \
  --region us-east-1
```

**New flag: `--group-by`** -- breaks down costs by service instead of a single total.

**What you'll see:**

```
+--------------------------------------------------+
|  Groups: one entry per AWS service with charges   |
|                                                   |
|  Each group has:                                  |
|  - Keys[0].Value: service name (e.g., "AWS Lambda")
|  - Metrics.BlendedCost.Amount: cost in USD        |
|                                                   |
|  If the list is empty or all $0.00:               |
|  Congratulations -- you're fully within free tier |
+--------------------------------------------------+
```

**Write down any service that shows charges > $0.00:**

| Service | Amount |
|---------|--------|
| _______ | $_____ |
| _______ | $_____ |
| _______ | $_____ |

---

### Step 2: Daily spend for the last 7 days

```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-04-01,End=2026-04-08 \
  --granularity DAILY \
  --metrics BlendedCost \
  --region us-east-1
```

**Changed: `DAILY` instead of `MONTHLY`** -- shows per-day breakdown.

**Questions:**

1. Which day had the highest spend? _______________
2. Is the spend trending up or down? _______________
3. Any day with > $0.10? _______________ (investigate if yes)

---

### Step 3: Cost forecast

```bash
aws ce get-cost-forecast \
  --time-period Start=2026-04-09,End=2026-05-01 \
  --granularity MONTHLY \
  --metric BLENDED_COST \
  --region us-east-1
```

**What you'll see:**

```
+--------------------------------------------------+
|  Total.MeanValue: predicted spend for rest of     |
|                   the month                       |
|                                                   |
|  If this is > $1: your billing alarm will fire    |
|  If this is $0: you're on track                   |
+--------------------------------------------------+
```

**Your projected cost:** $_______________

---

### Step 4: Check tagged resources

```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-04-01,End=2026-04-08 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=TAG,Key=project \
  --region us-east-1
```

**This groups costs by the `project` tag.** You should see `aws-free-tier-lab` if you've been tagging resources as instructed.

**Why this matters for agents:** Your agent can run this command to see exactly how much a specific project costs. Tag discipline = cost visibility.

---

### Step 5: Verify your billing alarm is working

```bash
aws cloudwatch describe-alarms \
  --alarm-names billing-alarm-1-dollar \
  --region us-east-1 \
  --query 'MetricAlarms[0].{Name:AlarmName,State:StateValue,Threshold:Threshold,Actions:AlarmActions[0]}' \
  --output table
```

**Verify:**
- [ ] State is `OK` (or `INSUFFICIENT_DATA` if just created)
- [ ] Threshold is `1.0`
- [ ] Actions points to your SNS topic ARN

---

## Bonus: Build a Cost Check Script

Create a one-liner your agent can run anytime:

```bash
echo "=== CURRENT SPEND ===" && \
aws ce get-cost-and-usage \
  --time-period Start=$(date -u +%Y-%m-01),End=$(date -u +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --query 'ResultsByTime[0].Total.BlendedCost.Amount' \
  --output text \
  --region us-east-1 && \
echo "=== BILLING ALARM ===" && \
aws cloudwatch describe-alarms \
  --alarm-names billing-alarm-1-dollar \
  --query 'MetricAlarms[0].StateValue' \
  --output text \
  --region us-east-1
```

**What this does:**
1. Shows current month's total spend as a single number
2. Shows billing alarm status (OK / ALARM / INSUFFICIENT_DATA)

**Save this.** You'll run it at the start of every future lesson.

---

## Agent Relevance

An agent that deploys AWS resources should:

1. **Check costs before deploying** -- abort if spend is already high
2. **Tag every resource** -- `project=aws-free-tier-lab` for tracking
3. **Check costs after deploying** -- verify nothing unexpected happened
4. **Alert on anomalies** -- the billing alarm is your safety net

```
AGENT DEPLOYMENT FLOW:
                                                  
  1. Check current spend        aws ce get-cost-and-usage
  2. If spend > threshold       ABORT and alert human
  3. Deploy resources           aws lambda create-function
  4. Tag everything             --tags project=aws-free-tier-lab
  5. Check spend again          aws ce get-cost-and-usage
  6. If delta > expected        ALERT and investigate
```

This is how responsible agents manage cloud costs.
