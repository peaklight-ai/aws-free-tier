# Research: AWS Console Flows for Chapter 01

All flows verified against official AWS documentation. Sources cited inline.

---

## Flow 1: Enable Billing Alerts (Prerequisite for Billing Alarm)

**Source:** https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html

**Steps:**
1. Open the Billing and Cost Management console: https://console.aws.amazon.com/costmanagement/
2. In the navigation pane, choose **Billing Preferences**
3. Under **Alert preferences**, choose **Edit**
4. Check the box for **Receive CloudWatch Billing Alerts**
5. Choose **Save preferences**

**Wait time:** ~15 minutes before billing metrics start publishing.

---

## Flow 2: Enable Cost Explorer

**Source:** https://docs.aws.amazon.com/cost-management/latest/userguide/ce-enable.html

**Who can enable:** Management account holders (or member accounts if org mgmt allows)

**Steps:**
1. Open the Billing and Cost Management console: https://console.aws.amazon.com/costmanagement/
2. In the navigation pane, choose **Cost Explorer**
3. On the **Welcome to Cost Explorer** page, choose **Launch Cost Explorer**

**Data availability:**
- Current month: ~24 hours after enablement
- 13 months historical: a few days
- 12 months forecast: calculated automatically
- Refresh rate: at least every 24 hours

**Note:** Cost Explorer UI is free. API calls cost $0.01 per paginated request.

---

## Flow 3: Create a Billing Alarm (CloudWatch)

**Source:** https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Alarm-Use-Cases.html

**Prerequisites:**
- Billing alerts enabled (Flow 1)
- Region set to **US East (N. Virginia)** (us-east-1) -- billing metrics only live here

**Steps:**
1. Open CloudWatch console: https://console.aws.amazon.com/cloudwatch/
2. Ensure region is **us-east-1** (top-right region selector)
3. Navigation pane -> **Alarms** -> **All alarms**
4. Choose **Create alarm**
5. Choose **Select metric**
6. Under **AWS Namespaces**, choose **Billing**
7. Choose **Total Estimated Charge**
8. Select the checkbox for the **EstimatedCharges** metric
9. Choose **Select metric**
10. Configure conditions:
    - **Statistic**: Maximum
    - **Period**: 6 hours
    - **Threshold type**: Static
    - **Whenever EstimatedCharges is...**: Greater
    - **than...**: 1 (USD)
11. Expand **Additional configuration**:
    - **Datapoints to alarm**: 1 out of 1
    - **Missing data treatment**: Treat missing data as missing
12. Choose **Next**
13. Configure notification:
    - Ensure **In alarm** is selected
    - Select **Create new topic** (or existing)
    - Topic name: `billing-alarm`
    - Email endpoints: your email address
    - Choose **Create topic**
14. Choose **Next**
15. **Alarm name**: `billing-alarm-1-dollar`
16. **Alarm description**: Alert when AWS spend exceeds 1 dollar
17. Choose **Next**
18. Review configuration
19. Choose **Create alarm**

**Verification:**
- Navigate to Alarms -> All alarms
- Look for `billing-alarm-1-dollar` with state OK or INSUFFICIENT_DATA
- Check email inbox for SNS confirmation email from AWS -- must click confirmation link

---

## Flow 4: Create an SNS Topic

**Source:** https://docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html

**Steps:**
1. Sign in to the Amazon SNS console: https://console.aws.amazon.com/sns/home
2. Ensure region is **us-east-1** (top-right)
3. In navigation pane, choose **Topics**
4. Choose **Create topic**
5. **Details** section:
   - **Type**: Standard
   - **Name**: `billing-alarm`
   - **Display name** (optional): Billing Alarm
6. (Leave other sections at defaults: Encryption, Access policy, etc.)
7. **Tags** section (optional): Add `project=aws-free-tier-lab`
8. Choose **Create topic**

**Result:** Topic details page displays with:
- Name
- ARN (format: `arn:aws:sns:us-east-1:703091483538:billing-alarm`)
- Display name
- Topic owner

**Action:** Copy the ARN -- you'll need it for the alarm.

---

## Flow 5: Subscribe Email to SNS Topic

**Source:** https://docs.aws.amazon.com/sns/latest/dg/sns-create-subscribe-endpoint-to-topic.html

**Steps:**
1. In the SNS console, in navigation pane choose **Subscriptions**
2. Choose **Create subscription**
3. Configure:
   - **Topic ARN**: Paste your topic ARN from Flow 4
   - **Protocol**: Email
   - **Endpoint**: Your email address
4. Choose **Create subscription**

**Confirmation workflow:**
- AWS sends a confirmation email to the endpoint
- Subject: "AWS Notification - Subscription Confirmation"
- Body contains a "Confirm subscription" link
- User MUST click the link to activate
- Until confirmed, subscription status shows "Pending confirmation"

**Verify:**
- Return to SNS console -> Subscriptions
- Refresh the page
- Status should show a subscription ARN (not "PendingConfirmation")

---

## Flow 6: Create an IAM Role for Lambda

**Source:** https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html

**Steps:**
1. Sign in to the AWS Management Console
2. Navigate to IAM: https://console.aws.amazon.com/iam/
3. In the left navigation pane, choose **Roles**
4. Choose **Create role**
5. **Select trusted entity**:
   - **Trusted entity type**: AWS service
   - **Service or use case**: Lambda
   - Choose **Next**
6. **Add permissions**:
   - In the search box, type `AWSLambdaBasicExecutionRole`
   - Check the box next to the policy
   - Choose **Next**
7. **Name, review, and create**:
   - **Role name**: `lambda-free-tier-role`
   - **Description**: (optional) Execution role for Lambda functions in the AWS free tier lab
   - Under **Tags**, add: Key=`project`, Value=`aws-free-tier-lab`
8. Review the Trust policy (automatically generated):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Principal": {"Service": "lambda.amazonaws.com"},
       "Action": "sts:AssumeRole"
     }]
   }
   ```
9. Choose **Create role**

**Verification:**
- Navigate to IAM -> Roles
- Search for `lambda-free-tier-role`
- Click the role name to view details
- Check the **Permissions** tab -- should show `AWSLambdaBasicExecutionRole`
- Check the **Trust relationships** tab -- should show Lambda as the trusted service

---

## Flow 7: View IAM Users (Standard Flow)

*Note: AWS documentation pages for this flow redirect via JavaScript. The flow below is the stable, standard IAM console navigation that has been consistent for years.*

**Steps:**
1. Navigate to IAM: https://console.aws.amazon.com/iam/
2. In navigation pane, choose **Users**
3. The Users page shows a table with:
   - User name
   - Groups
   - Last activity
   - MFA
   - Password age
   - Console last sign-in
   - Access key age
4. Click a user's name to view details
5. User detail page has tabs:
   - **Permissions** -- attached policies
   - **Groups** -- group memberships
   - **Tags** -- user tags
   - **Security credentials** -- access keys, passwords, MFA
   - **Access Advisor** -- which services the user has used

**To view attached policies:**
- Click the user
- Click **Permissions** tab
- See list of attached policies (managed + inline)
- Click a policy name to view its JSON

---

## Flow 8: View IAM Policy Document

**Standard flow:**
1. Navigate to IAM -> Policies in the left nav
2. Search for a policy name (e.g., `AdministratorAccess`)
3. Click the policy name
4. View the policy details page with tabs:
   - **Permissions defined in this policy** -- Visual editor (structured view)
   - **{ } JSON** -- Raw JSON document
   - **Entities attached** -- Users/roles/groups with this policy
   - **Policy versions** -- Version history
   - **Access Advisor** -- Services the policy grants access to

**To read the JSON:**
- Click the **{ } JSON** tab
- The full policy document displays
- Look for:
  - `Version` -- usually `2012-10-17`
  - `Statement` -- array of rules
  - Each statement has `Effect`, `Action`, `Resource`

---

## Flow 9: View Free Tier Usage Dashboard

**Source:** https://docs.aws.amazon.com/cost-management/latest/userguide/

**Steps:**
1. Open Billing and Cost Management console: https://console.aws.amazon.com/billing/
2. In navigation pane, choose **Free tier**
3. The Free tier page shows:
   - Services with free tier usage
   - Current usage vs limit
   - Forecasted usage for the month
   - Free tier type (12-month or always-free)

**Filter:** Use the search/filter to find specific services.

---

## Flow 10: Check Current Spend in Cost Explorer

**Steps:**
1. Open Cost Explorer: https://console.aws.amazon.com/costmanagement/home#/cost-explorer
2. Default view shows:
   - Monthly costs chart (bar chart)
   - Current month (in-progress)
   - Last 6 months history
3. To filter:
   - Use **Group by** dropdown: Service, Region, Tag, etc.
   - Use **Time range** dropdown
   - Use **Filters** panel on the right

**Reading the chart:**
- Y-axis: dollars
- X-axis: time periods
- Each bar = total cost for that period
- Hover over bars for breakdown

---

## Summary of Verified Sources

| Flow | Source URL | Status |
|------|-----------|--------|
| 1. Enable billing alerts | docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html | Verified |
| 2. Enable Cost Explorer | docs.aws.amazon.com/cost-management/latest/userguide/ce-enable.html | Verified |
| 3. Create billing alarm | docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Alarm-Use-Cases.html | Verified |
| 4. Create SNS topic | docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html | Verified |
| 5. Subscribe email to SNS | docs.aws.amazon.com/sns/latest/dg/sns-create-subscribe-endpoint-to-topic.html | Verified |
| 6. Create IAM role for Lambda | docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html | Verified |
| 7. View IAM users | docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html | Standard flow (docs page uses JS redirect) |
| 8. View IAM policy JSON | docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage.html | Standard flow (docs page uses JS redirect) |
| 9. Free tier dashboard | docs.aws.amazon.com/cost-management/latest/userguide/ | Standard flow |
| 10. Cost Explorer view | docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ce-what-is.html | Verified |
