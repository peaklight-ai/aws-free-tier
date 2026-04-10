// PLAI AWS Lesson 01 -- Billing & IAM GUI+CLI Walkthrough
// Generates: 01-billing-and-iam/PLAI_AWS_Lesson_01_Billing_and_IAM.docx

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require("docx");
const fs = require("fs");
const path = require("path");

// ============ PLAI BRAND CONSTANTS ============
const VAPOR_VIOLET = "BB8CFC";
const NEON_NOIR = "1A1A1A";
const CYBER_LIME = "C3FE4C";
const OFF_WHITE = "FAF8F8";
const LIGHT_GRAY = "F0F0F0";
const MID_GRAY = "666666";
const BORDER_GRAY = "D0D0D0";

const FONT_HEAD = "Afacad Flux";
const FONT_BODY = "Montserrat";
const FONT_CODE = "JetBrains Mono";

const logoPath = "/Users/chadiabifadel/.claude/skills/plai-docx/assets/logos/logo-purple.png";
const logo = fs.readFileSync(logoPath);

// ============ HELPER FUNCTIONS ============

// Title (cover page)
function titleText(text, size = 72) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, font: FONT_HEAD, size, color: VAPOR_VIOLET, bold: false })]
  });
}

// Subtitle
function subtitleText(text, size = 32) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 400 },
    children: [new TextRun({ text, font: FONT_HEAD, size, color: NEON_NOIR })]
  });
}

// H1
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 240 },
    children: [new TextRun({ text, font: FONT_HEAD, size: 44, color: VAPOR_VIOLET })]
  });
}

// H2
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 180 },
    children: [new TextRun({ text, font: FONT_HEAD, size: 32, color: VAPOR_VIOLET })]
  });
}

// H3
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: FONT_HEAD, size: 26, color: NEON_NOIR, bold: true })]
  });
}

// Body paragraph
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({ text, font: FONT_BODY, size: 22, color: NEON_NOIR, ...opts })]
  });
}

// Body paragraph with mixed runs
function pRuns(runs) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    children: runs.map(r => new TextRun({
      font: FONT_BODY,
      size: 22,
      color: NEON_NOIR,
      ...r
    }))
  });
}

// Bullet item (uses numbering ref)
function bullet(text, ref = "bullet-default") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: FONT_BODY, size: 22, color: NEON_NOIR })]
  });
}

// Numbered item
function numItem(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: FONT_BODY, size: 22, color: NEON_NOIR })]
  });
}

// Code block (dark background)
function code(text) {
  const lines = text.split("\n");
  return lines.map((line, i) => new Paragraph({
    spacing: { before: i === 0 ? 100 : 0, after: i === lines.length - 1 ? 100 : 0 },
    shading: { fill: NEON_NOIR, type: ShadingType.CLEAR },
    indent: { left: 200, right: 200 },
    children: [new TextRun({
      text: line || " ",
      font: FONT_CODE,
      size: 20,
      color: CYBER_LIME
    })]
  }));
}

// Callout box (light purple background)
function callout(title, body, color = VAPOR_VIOLET) {
  return [
    new Paragraph({
      spacing: { before: 200, after: 0 },
      shading: { fill: "F5EEFF", type: ShadingType.CLEAR },
      indent: { left: 200, right: 200 },
      children: [new TextRun({ text: title, font: FONT_BODY, size: 22, color, bold: true })]
    }),
    new Paragraph({
      spacing: { before: 60, after: 200 },
      shading: { fill: "F5EEFF", type: ShadingType.CLEAR },
      indent: { left: 200, right: 200 },
      children: [new TextRun({ text: body, font: FONT_BODY, size: 22, color: NEON_NOIR })]
    })
  ];
}

// Agent callout (dark background with lime text)
function agentCallout(title, body) {
  return [
    new Paragraph({
      spacing: { before: 200, after: 0 },
      shading: { fill: NEON_NOIR, type: ShadingType.CLEAR },
      indent: { left: 200, right: 200 },
      children: [new TextRun({ text: `[ AGENT RELEVANCE ] ${title}`, font: FONT_BODY, size: 22, color: CYBER_LIME, bold: true })]
    }),
    new Paragraph({
      spacing: { before: 60, after: 200 },
      shading: { fill: NEON_NOIR, type: ShadingType.CLEAR },
      indent: { left: 200, right: 200 },
      children: [new TextRun({ text: body, font: FONT_BODY, size: 22, color: OFF_WHITE })]
    })
  ];
}

// Table borders
const tBorder = { style: BorderStyle.SINGLE, size: 4, color: BORDER_GRAY };
const tBorders = { top: tBorder, bottom: tBorder, left: tBorder, right: tBorder };

// Two-column GUI | CLI table
function guiCliTable(rows) {
  return new Table({
    columnWidths: [4680, 4680],
    margins: { top: 120, bottom: 120, left: 180, right: 180 },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            borders: tBorders,
            width: { size: 4680, type: WidthType.DXA },
            shading: { fill: VAPOR_VIOLET, type: ShadingType.CLEAR },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "AWS Console (GUI)", font: FONT_HEAD, size: 24, color: OFF_WHITE, bold: true })]
            })]
          }),
          new TableCell({
            borders: tBorders,
            width: { size: 4680, type: WidthType.DXA },
            shading: { fill: NEON_NOIR, type: ShadingType.CLEAR },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "AWS CLI", font: FONT_HEAD, size: 24, color: CYBER_LIME, bold: true })]
            })]
          })
        ]
      }),
      ...rows.map((row, idx) => new TableRow({
        children: [
          new TableCell({
            borders: tBorders,
            width: { size: 4680, type: WidthType.DXA },
            shading: { fill: idx % 2 === 0 ? OFF_WHITE : LIGHT_GRAY, type: ShadingType.CLEAR },
            children: row.gui.map(line => new Paragraph({
              spacing: { before: 40, after: 40 },
              children: [new TextRun({ text: line, font: FONT_BODY, size: 20, color: NEON_NOIR })]
            }))
          }),
          new TableCell({
            borders: tBorders,
            width: { size: 4680, type: WidthType.DXA },
            shading: { fill: idx % 2 === 0 ? OFF_WHITE : LIGHT_GRAY, type: ShadingType.CLEAR },
            children: row.cli.map(line => new Paragraph({
              spacing: { before: 40, after: 40 },
              children: [new TextRun({ text: line, font: FONT_CODE, size: 18, color: NEON_NOIR })]
            }))
          })
        ]
      }))
    ]
  });
}

// Generic 2-col table with custom header
function simpleTable(headerRow, rows) {
  return new Table({
    columnWidths: [3120, 6240],
    margins: { top: 100, bottom: 100, left: 150, right: 150 },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headerRow.map(h => new TableCell({
          borders: tBorders,
          shading: { fill: VAPOR_VIOLET, type: ShadingType.CLEAR },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: h, font: FONT_HEAD, size: 22, color: OFF_WHITE, bold: true })]
          })]
        }))
      }),
      ...rows.map((r, idx) => new TableRow({
        children: r.map(cell => new TableCell({
          borders: tBorders,
          shading: { fill: idx % 2 === 0 ? OFF_WHITE : LIGHT_GRAY, type: ShadingType.CLEAR },
          children: [new Paragraph({
            children: [new TextRun({ text: cell, font: FONT_BODY, size: 20, color: NEON_NOIR })]
          })]
        }))
      }))
    ]
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ============ DOCUMENT CONTENT ============

const children = [];

// === COVER PAGE ===
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1800, after: 400 },
    children: [new ImageRun({ data: logo, transformation: { width: 120, height: 120 } })]
  }),
  titleText("PLAI", 84),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 600 },
    children: [new TextRun({ text: "AWS Free Tier Learning Lab", font: FONT_HEAD, size: 32, color: NEON_NOIR })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 200 },
    shading: { fill: NEON_NOIR, type: ShadingType.CLEAR },
    indent: { left: 1000, right: 1000 },
    children: [new TextRun({ text: "LESSON 01", font: FONT_HEAD, size: 36, color: CYBER_LIME })]
  }),
  titleText("Billing Safety & IAM Foundations", 48),
  subtitleText("GUI + CLI Walkthrough", 28),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1200, after: 100 },
    children: [new TextRun({ text: "Don't Get Billed", font: FONT_HEAD, size: 28, color: VAPOR_VIOLET, italics: true })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1800, after: 100 },
    children: [new TextRun({ text: "Document Ref: PLAI-LESSON-01-BILLING-IAM", font: FONT_BODY, size: 18, color: MID_GRAY })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "peaklight.ai", font: FONT_BODY, size: 20, color: VAPOR_VIOLET })]
  }),
  pageBreak()
);

// === TABLE OF CONTENTS ===
children.push(
  h1("Table of Contents"),
  p("1. About This Document"),
  p("2. Prerequisites"),
  p("3. How to Read This Document"),
  p("4. Part 1 -- Know Your Account"),
  p("5. Part 2 -- Enable Billing Alerts & Cost Explorer"),
  p("6. Part 3 -- Create the Billing Alarm"),
  p("7. Part 4 -- Understand IAM (Users, Roles, Policies)"),
  p("8. Part 5 -- Create the Lambda Execution Role"),
  p("9. Part 6 -- Monitor Free Tier Usage"),
  p("10. What This Means for Your Agents"),
  p("11. Cleanup Reference"),
  p("12. Next Steps"),
  p("13. Sources & Citations"),
  pageBreak()
);

// === ABOUT ===
children.push(
  h1("About This Document"),
  p("This is Lesson 01 of the PLAI AWS Free Tier Learning Lab. Every action is shown two ways: through the AWS Management Console (the GUI you click through in your browser) and through the AWS CLI (the terminal commands)."),
  p("Why both? The GUI helps you build mental models of what AWS services actually look like and how they connect. The CLI makes you productive once you know what you're doing. By the end of this lesson, you'll be able to set up billing safety and IAM foundations either way."),
  ...callout("Learning Goal",
    "By the end of this lesson you will have a working billing alarm that protects you from surprise bills, a scoped IAM role ready for Lambda, and a solid mental model of how AWS identity and permissions work."),
  h2("Prerequisites"),
  bullet("An AWS account (https://aws.amazon.com/free/)", "bullet-prereq"),
  bullet("AWS CLI v2 installed locally (aws --version)", "bullet-prereq"),
  bullet("AWS CLI configured (aws configure) with access keys", "bullet-prereq"),
  bullet("A terminal and a browser", "bullet-prereq"),
  bullet("An email address for billing notifications", "bullet-prereq"),
  h2("How to Read This Document"),
  p("Each part of the lesson has the same structure:"),
  bullet("Concept explanation (what you're doing and why)", "bullet-read"),
  bullet("GUI walkthrough (click-by-click in the AWS Console)", "bullet-read"),
  bullet("CLI walkthrough (equivalent aws commands)", "bullet-read"),
  bullet("Verification (how to confirm it worked)", "bullet-read"),
  bullet("Agent relevance (what this means for your Claude agents)", "bullet-read"),
  p("The GUI and CLI walkthroughs are presented in side-by-side tables. Run one or both. They achieve the same result."),
  ...callout("Region Note",
    "Billing-related services (Cost Explorer, billing alarms) only operate in us-east-1 (N. Virginia). Set your region to us-east-1 before Parts 2, 3, and 6. Other parts can use any region.",
    NEON_NOIR),
  pageBreak()
);

// === PART 1: KNOW YOUR ACCOUNT ===
children.push(
  h1("Part 1 -- Know Your Account"),
  p("Before doing anything, confirm who you are and which account you're operating in. This prevents costly mistakes like deploying resources in the wrong account."),
  h2("Key Concepts"),
  h3("Account ID"),
  p("Every AWS account has a 12-digit identifier. It appears in every ARN (Amazon Resource Name) and is how AWS knows which account owns a resource."),
  h3("ARN (Amazon Resource Name)"),
  p("Every single resource in AWS has a unique ARN. Format:"),
  ...code("arn:aws:SERVICE:REGION:ACCOUNT:RESOURCE"),
  p("Example:"),
  ...code("arn:aws:iam::703091483538:user/chadi-admin"),
  p("Note: IAM is a global service, so the region field is empty (between the double colons)."),
  h3("IAM User vs Root User"),
  p("Your AWS account has a root user (the email you signed up with) and can have IAM users (e.g., chadi-admin). Never use the root user for daily work -- always operate as an IAM user."),
  h2("GUI and CLI Walkthrough"),
  guiCliTable([
    {
      gui: [
        "1. Open console.aws.amazon.com",
        "2. Sign in with your IAM user",
        "3. Top-right: click your username",
        "4. See: Account ID, User ARN"
      ],
      cli: [
        "aws sts get-caller-identity \\",
        "  --region us-east-1"
      ]
    },
    {
      gui: [
        "1. Top-right: region dropdown",
        "2. Confirm your selected region",
        "3. Remember: billing needs us-east-1"
      ],
      cli: [
        "aws configure list"
      ]
    },
    {
      gui: [
        "1. Open IAM: Services menu",
        "2. Search for IAM",
        "3. Left nav -> Dashboard",
        "4. See account ID and sign-in URL"
      ],
      cli: [
        "aws iam list-account-aliases"
      ]
    }
  ]),
  h2("Expected Output (CLI)"),
  ...code(`{
    "UserId": "AIDA2HM4EUOJPD4X4TTWY",
    "Account": "703091483538",
    "Arn": "arn:aws:iam::703091483538:user/chadi-admin"
}`),
  h2("Verification Checklist"),
  bullet("I know my 12-digit account ID", "bullet-verify1"),
  bullet("I know my IAM username and its full ARN", "bullet-verify1"),
  bullet("My current region is set (us-east-1 for billing work)", "bullet-verify1"),
  ...agentCallout("What This Means for Agents",
    "When your Claude agent calls any AWS API via the plai-aws skill, AWS records the call under this IAM user's identity. Every CloudTrail log entry, every cost, every security audit trail traces back to this user. Treat your IAM user credentials like production secrets -- never commit them to git, never share them."),
  pageBreak()
);

// === PART 2: ENABLE BILLING ALERTS & COST EXPLORER ===
children.push(
  h1("Part 2 -- Enable Billing Alerts & Cost Explorer"),
  p("Before you can create a billing alarm, AWS needs to know you want billing metrics published. And before you can see cost breakdowns, Cost Explorer must be enabled. Both are one-time setup steps."),
  h2("Key Concepts"),
  h3("Billing Metrics"),
  p("AWS publishes an EstimatedCharges metric in CloudWatch, but only after you opt in via Billing Preferences. This is required for billing alarms to work."),
  h3("Cost Explorer"),
  p("A visual tool that shows your spend broken down by service, region, time, or custom tags. The UI is free. API calls cost $0.01 per paginated request, so prefer the UI for exploration and CLI for automation."),
  h2("Part 2A -- Enable Billing Alerts"),
  guiCliTable([
    {
      gui: [
        "1. Open Billing console:",
        "   console.aws.amazon.com/costmanagement",
        "2. Nav: Billing Preferences",
        "3. Alert preferences -> Edit",
        "4. Check: Receive CloudWatch",
        "   Billing Alerts",
        "5. Save preferences"
      ],
      cli: [
        "# Not directly scriptable via CLI --",
        "# must be done once in the console.",
        "# After enabling, verify with:",
        "",
        "aws cloudwatch list-metrics \\",
        "  --namespace AWS/Billing \\",
        "  --region us-east-1"
      ]
    }
  ]),
  ...callout("Wait Time",
    "After enabling billing alerts, wait approximately 15 minutes before CloudWatch publishes the first billing metric data point. The metric list-metrics command will return empty until then."),
  h2("Part 2B -- Enable Cost Explorer"),
  guiCliTable([
    {
      gui: [
        "1. Billing console:",
        "   console.aws.amazon.com/costmanagement",
        "2. Nav pane -> Cost Explorer",
        "3. Welcome page:",
        "   Launch Cost Explorer",
        "4. Wait ~24 hours for data"
      ],
      cli: [
        "# Cannot enable via API.",
        "# After enablement, query with:",
        "",
        "aws ce get-cost-and-usage \\",
        "  --time-period \\",
        "    Start=2026-04-01,End=2026-04-10 \\",
        "  --granularity MONTHLY \\",
        "  --metrics BlendedCost \\",
        "  --region us-east-1"
      ]
    }
  ]),
  h2("Expected Output (CLI)"),
  ...code(`{
    "ResultsByTime": [
        {
            "TimePeriod": {
                "Start": "2026-04-01",
                "End": "2026-04-10"
            },
            "Total": {
                "BlendedCost": {
                    "Amount": "0.0000000000",
                    "Unit": "USD"
                }
            }
        }
    ]
}`),
  p("The Amount field is what matters. 0 or near-zero means you're not spending anything."),
  h2("Verification Checklist"),
  bullet("Billing alerts are enabled (console setting saved)", "bullet-verify2"),
  bullet("Cost Explorer is launched (not showing welcome page anymore)", "bullet-verify2"),
  bullet("CLI ce command returns data without errors", "bullet-verify2"),
  ...agentCallout("What This Means for Agents",
    "Your agent can run aws ce get-cost-and-usage at the start of every session to check current spend before deploying anything. If spend > threshold, the agent should abort and alert you. This is how you build cost-aware agents that won't burn through your budget overnight."),
  pageBreak()
);

// === PART 3: CREATE BILLING ALARM ===
children.push(
  h1("Part 3 -- Create the Billing Alarm"),
  p("The alarm that protects you from surprise bills. If your AWS spend exceeds $1, you get an email within 6 hours. Simple, free, and essential."),
  h2("Architecture"),
  ...code(`CloudWatch        SNS              Your Email
    |              |                   |
    | watches      |                   |
    | billing      |                   |
    | metric       |                   |
    |              |                   |
    |-spend>$1---->|                   |
    |              |----email--------->|
    |              |                   |
    |              | "AWS spend        |
    |              |  exceeded $1"     |`),
  p("Three components work together: CloudWatch watches the billing metric, SNS is the notification channel, and your email subscription receives the alert."),
  h2("Part 3A -- Create the SNS Topic"),
  guiCliTable([
    {
      gui: [
        "1. Switch region to us-east-1",
        "2. Open SNS console:",
        "   console.aws.amazon.com/sns",
        "3. Nav: Topics",
        "4. Create topic",
        "5. Type: Standard",
        "6. Name: billing-alarm",
        "7. Tags (optional):",
        "   Key=project,",
        "   Value=aws-free-tier-lab",
        "8. Create topic",
        "9. Copy the ARN shown on",
        "   the details page"
      ],
      cli: [
        "aws sns create-topic \\",
        "  --name billing-alarm \\",
        "  --region us-east-1 \\",
        "  --tags Key=project,Value=aws-free-tier-lab",
        "",
        "# Output includes TopicArn --",
        "# save it for the next step."
      ]
    }
  ]),
  h2("Part 3B -- Subscribe Your Email"),
  guiCliTable([
    {
      gui: [
        "1. SNS console -> Subscriptions",
        "2. Create subscription",
        "3. Topic ARN:",
        "   paste from Part 3A",
        "4. Protocol: Email",
        "5. Endpoint: your@email.com",
        "6. Create subscription",
        "7. CHECK YOUR EMAIL",
        "8. Click the confirmation link"
      ],
      cli: [
        "aws sns subscribe \\",
        "  --topic-arn TOPIC_ARN_FROM_3A \\",
        "  --protocol email \\",
        "  --notification-endpoint \\",
        "    your@email.com \\",
        "  --region us-east-1",
        "",
        "# CHECK YOUR EMAIL and click",
        "# the confirmation link."
      ]
    }
  ]),
  ...callout("Critical Step",
    "AWS SNS requires you to confirm every email subscription by clicking a link in a confirmation email. Until you click it, your alarm will fire but you won't receive the notification. Do this immediately after creating the subscription."),
  h2("Part 3C -- Create the CloudWatch Alarm"),
  guiCliTable([
    {
      gui: [
        "1. CloudWatch console in us-east-1",
        "2. Left nav -> Alarms -> All alarms",
        "3. Create alarm",
        "4. Select metric",
        "5. AWS Namespaces -> Billing",
        "6. Total Estimated Charge",
        "7. Check: EstimatedCharges",
        "8. Select metric",
        "9. Statistic: Maximum",
        "10. Period: 6 hours",
        "11. Threshold: Static, Greater, 1",
        "12. Next",
        "13. In alarm -> select topic",
        "    billing-alarm",
        "14. Next",
        "15. Name: billing-alarm-1-dollar",
        "16. Description: Alert when spend > 1",
        "17. Next -> Create alarm"
      ],
      cli: [
        "aws cloudwatch put-metric-alarm \\",
        "  --alarm-name billing-alarm-1-dollar \\",
        "  --alarm-description \\",
        "    \"Alert when spend > 1 USD\" \\",
        "  --metric-name EstimatedCharges \\",
        "  --namespace AWS/Billing \\",
        "  --statistic Maximum \\",
        "  --period 21600 \\",
        "  --threshold 1 \\",
        "  --comparison-operator \\",
        "    GreaterThanThreshold \\",
        "  --evaluation-periods 1 \\",
        "  --alarm-actions \\",
        "    TOPIC_ARN_FROM_3A \\",
        "  --dimensions \\",
        "    Name=Currency,Value=USD \\",
        "  --region us-east-1 \\",
        "  --tags \\",
        "    Key=project,Value=aws-free-tier-lab"
      ]
    }
  ]),
  h2("Verify the Alarm"),
  guiCliTable([
    {
      gui: [
        "1. CloudWatch -> Alarms",
        "2. Find billing-alarm-1-dollar",
        "3. Check state:",
        "   OK = good",
        "   INSUFFICIENT_DATA = wait 6h",
        "   ALARM = investigate NOW"
      ],
      cli: [
        "aws cloudwatch describe-alarms \\",
        "  --alarm-names \\",
        "    billing-alarm-1-dollar \\",
        "  --region us-east-1 \\",
        "  --query \\",
        "    'MetricAlarms[0].StateValue' \\",
        "  --output text"
      ]
    }
  ]),
  h2("Verification Checklist"),
  bullet("SNS topic billing-alarm exists", "bullet-verify3"),
  bullet("Email subscription is confirmed (not PendingConfirmation)", "bullet-verify3"),
  bullet("CloudWatch alarm billing-alarm-1-dollar exists", "bullet-verify3"),
  bullet("Alarm state is OK or INSUFFICIENT_DATA (not ALARM)", "bullet-verify3"),
  bullet("Threshold is 1.0 USD", "bullet-verify3"),
  ...agentCallout("What This Means for Agents",
    "This alarm is your safety net. When your agent deploys resources that accidentally run up costs (e.g., a Lambda stuck in an infinite loop triggering itself), the alarm fires within 6 hours and emails you. Without this, a misconfigured agent could burn through hundreds of dollars overnight. Every agent that touches AWS should run inside an account that has a billing alarm active."),
  pageBreak()
);

// === PART 4: IAM ===
children.push(
  h1("Part 4 -- Understand IAM"),
  p("IAM (Identity and Access Management) is the security layer of AWS. Every single API call is checked against IAM policies. Before creating anything, you need to understand three concepts: users, roles, and policies."),
  h2("Mental Model: The Bouncer"),
  p("Think of AWS as a building with thousands of rooms. IAM is the bouncer at every door. Every time you (or a service) try to do something, the bouncer checks: 'Do you have permission for this?'"),
  ...code(`+--------------------------------+
|        AWS ACCOUNT             |
|                                |
|  IAM (the bouncer)             |
|                                |
|  Users  = badges for humans    |
|  Roles  = badges for services  |
|  Groups = collections of users |
|                                |
|  Policies = keys to rooms      |
|  Default: ALL DOORS LOCKED     |
|  Deny always beats Allow       |
+--------------------------------+`),
  h2("Users vs Roles"),
  simpleTable(
    ["Aspect", "User"],
    [
      ["Who", "Humans (you, a colleague)"],
      ["Credentials", "Permanent: password + access keys"],
      ["Lifetime", "Forever (until deleted)"],
      ["Example", "chadi-admin"],
      ["Use for", "Console login, CLI access from laptop"]
    ]
  ),
  p(""),
  simpleTable(
    ["Aspect", "Role"],
    [
      ["Who", "Services (Lambda, EC2, etc.)"],
      ["Credentials", "Temporary (15 min to 12 hours)"],
      ["Lifetime", "As long as the role exists"],
      ["Example", "lambda-free-tier-role"],
      ["Use for", "Letting services make AWS calls on your behalf"]
    ]
  ),
  h2("Policies"),
  p("A policy is a JSON document that answers three questions: Allow or Deny? What action? On what resource?"),
  ...code(`{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::my-bucket/*"
    }]
}`),
  p("In plain English: 'Allow downloading any object from the my-bucket bucket.' The wildcard after the slash means 'any file in the bucket.'"),
  h2("The Evaluation Flow"),
  ...code(`API call arrives
      |
      v
Check for explicit Deny
      |
      +-- Found? --> DENIED (done)
      |
      +-- Not found?
              |
              v
      Check for explicit Allow
              |
              +-- Found? --> ALLOWED
              |
              +-- Not found? --> DENIED (default)`),
  p("Key rules: Everything is denied by default. An explicit Deny always wins over an Allow. This is the foundation of AWS security."),
  h2("GUI and CLI Walkthrough: Explore IAM"),
  guiCliTable([
    {
      gui: [
        "1. Open IAM:",
        "   console.aws.amazon.com/iam",
        "2. Left nav -> Users",
        "3. See table of users",
        "4. Click chadi-admin"
      ],
      cli: [
        "aws iam list-users \\",
        "  --query \\",
        "    'Users[].UserName' \\",
        "  --output table"
      ]
    },
    {
      gui: [
        "1. User detail page",
        "2. Permissions tab",
        "3. See attached policies",
        "   (e.g., AdministratorAccess)"
      ],
      cli: [
        "aws iam \\",
        "  list-attached-user-policies \\",
        "  --user-name chadi-admin"
      ]
    },
    {
      gui: [
        "1. Left nav -> Policies",
        "2. Search: AdministratorAccess",
        "3. Click policy name",
        "4. Click the { } JSON tab",
        "5. Read the policy document"
      ],
      cli: [
        "aws iam get-policy-version \\",
        "  --policy-arn \\",
        "  arn:aws:iam::aws:policy/AdministratorAccess \\",
        "  --version-id v1"
      ]
    }
  ]),
  h2("Verification Checklist"),
  bullet("I can find my IAM user in the console and list via CLI", "bullet-verify4"),
  bullet("I can see which policies are attached to my user", "bullet-verify4"),
  bullet("I can read a policy document (JSON) in the console", "bullet-verify4"),
  bullet("I understand that Deny always beats Allow", "bullet-verify4"),
  ...agentCallout("What This Means for Agents",
    "Your Claude agent authenticates as an IAM user (chadi-admin). In production, you'd create a scoped IAM user for the agent with permissions only for the services it needs. The AdministratorAccess policy is fine for learning but dangerous in production: if the agent is compromised, blast radius is your entire AWS account."),
  pageBreak()
);

// === PART 5: CREATE LAMBDA ROLE ===
children.push(
  h1("Part 5 -- Create the Lambda Execution Role"),
  p("You'll use this role in Lesson 02 when you deploy your first Lambda function. A role has two parts: a trust policy (who can assume it) and permission policies (what it can do)."),
  h2("The Trust Policy"),
  p("This document says 'the Lambda service is allowed to assume this role.' Without it, nothing can wear the role."),
  ...code(`{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Principal": {
            "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
    }]
}`),
  h2("The Permission Policy"),
  p("AWSLambdaBasicExecutionRole is an AWS-managed policy that allows writing to CloudWatch Logs. Every Lambda function needs this at minimum."),
  h2("GUI and CLI Walkthrough"),
  guiCliTable([
    {
      gui: [
        "1. Open IAM:",
        "   console.aws.amazon.com/iam",
        "2. Left nav -> Roles",
        "3. Create role",
        "4. Trusted entity type: AWS service",
        "5. Service or use case: Lambda",
        "6. Next"
      ],
      cli: [
        "# Write trust policy to file",
        "cat > /tmp/trust.json << EOF",
        "{\"Version\":\"2012-10-17\",",
        " \"Statement\":[{",
        "  \"Effect\":\"Allow\",",
        "  \"Principal\":{",
        "   \"Service\":\"lambda.amazonaws.com\"},",
        "  \"Action\":\"sts:AssumeRole\"}]}",
        "EOF"
      ]
    },
    {
      gui: [
        "7. Search: AWSLambdaBasicExecutionRole",
        "8. Check the box",
        "9. Next"
      ],
      cli: [
        "aws iam create-role \\",
        "  --role-name \\",
        "    lambda-free-tier-role \\",
        "  --assume-role-policy-document \\",
        "    file:///tmp/trust.json \\",
        "  --tags \\",
        "    Key=project,Value=aws-free-tier-lab"
      ]
    },
    {
      gui: [
        "10. Role name:",
        "    lambda-free-tier-role",
        "11. Description (optional):",
        "    Execution role for free tier",
        "    Lambda functions",
        "12. Tags: project=aws-free-tier-lab",
        "13. Review -> Create role"
      ],
      cli: [
        "aws iam attach-role-policy \\",
        "  --role-name \\",
        "    lambda-free-tier-role \\",
        "  --policy-arn \\",
        "  arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
      ]
    }
  ]),
  h2("Verify the Role"),
  guiCliTable([
    {
      gui: [
        "1. IAM -> Roles",
        "2. Search: lambda-free-tier-role",
        "3. Click the role",
        "4. Permissions tab:",
        "   see AWSLambdaBasicExecutionRole",
        "5. Trust relationships tab:",
        "   see lambda.amazonaws.com"
      ],
      cli: [
        "aws iam get-role \\",
        "  --role-name lambda-free-tier-role",
        "",
        "aws iam \\",
        "  list-attached-role-policies \\",
        "  --role-name lambda-free-tier-role"
      ]
    }
  ]),
  h2("Verification Checklist"),
  bullet("Role lambda-free-tier-role exists", "bullet-verify5"),
  bullet("Trust policy allows lambda.amazonaws.com", "bullet-verify5"),
  bullet("AWSLambdaBasicExecutionRole is attached", "bullet-verify5"),
  bullet("I've saved the role ARN for use in Lesson 02", "bullet-verify5"),
  ...agentCallout("What This Means for Agents",
    "When your Claude agent deploys a Lambda function, it passes this role ARN to the Lambda API. Lambda then 'wears' the role while running your code. If your Lambda needs to read from DynamoDB, you attach DynamoDB permissions to THIS role, not to your IAM user. This is how you achieve least privilege: your agent has broad permissions to deploy, but the things it deploys have narrow permissions to operate."),
  pageBreak()
);

// === PART 6: FREE TIER MONITORING ===
children.push(
  h1("Part 6 -- Monitor Free Tier Usage"),
  p("AWS provides a Free Tier dashboard that shows how much of your free allowance you've used. Check this regularly to avoid surprises."),
  h2("Free Tier Types"),
  simpleTable(
    ["Type", "Description"],
    [
      ["Always Free", "Never expires. Examples: Lambda 1M requests/mo, DynamoDB 25GB, SNS 1M publishes/mo."],
      ["12 Months Free", "Free for 12 months after account creation, then pay-as-you-go. Examples: EC2 750 hrs/mo, S3 5GB."],
      ["Trial", "Short-term free offers (hours to 90 days) for specific services."]
    ]
  ),
  h2("GUI and CLI Walkthrough"),
  guiCliTable([
    {
      gui: [
        "1. Open Billing console:",
        "   console.aws.amazon.com/billing",
        "2. Left nav -> Free tier",
        "3. See table of services",
        "   with usage vs limit",
        "4. Filter/search by service"
      ],
      cli: [
        "aws freetier \\",
        "  get-free-tier-usage \\",
        "  --region us-east-1"
      ]
    },
    {
      gui: [
        "1. Cost Explorer",
        "2. Filter: Service = a specific",
        "   service (e.g., Lambda)",
        "3. See actual cost breakdown"
      ],
      cli: [
        "aws ce get-cost-and-usage \\",
        "  --time-period \\",
        "   Start=2026-04-01,End=2026-04-10 \\",
        "  --granularity MONTHLY \\",
        "  --metrics BlendedCost \\",
        "  --group-by \\",
        "   Type=DIMENSION,Key=SERVICE \\",
        "  --region us-east-1"
      ]
    },
    {
      gui: [
        "1. Cost Explorer -> Forecast",
        "2. See projected month-end cost",
        "3. Compare to your budget"
      ],
      cli: [
        "aws ce get-cost-forecast \\",
        "  --time-period \\",
        "   Start=2026-04-10,End=2026-05-01 \\",
        "  --granularity MONTHLY \\",
        "  --metric BLENDED_COST \\",
        "  --region us-east-1"
      ]
    }
  ]),
  h2("Verification Checklist"),
  bullet("I can see my free tier usage in the console", "bullet-verify6"),
  bullet("CLI freetier command returns data", "bullet-verify6"),
  bullet("I can read a cost forecast", "bullet-verify6"),
  ...agentCallout("What This Means for Agents",
    "A well-behaved agent runs aws ce get-cost-and-usage at the start and end of every AWS session. If the delta between start and end exceeds a threshold, the agent should report it. This creates self-monitoring cost visibility that prevents runaway bills better than alarms alone."),
  pageBreak()
);

// === AGENT DEEP DIVE ===
children.push(
  h1("What This Means for Your Agents"),
  p("This lesson isn't just about AWS mechanics. It's about building a foundation for agents that touch the cloud safely."),
  h2("The Two-Identity Pattern"),
  ...code(`+------------------+       +------------------+
|  Claude Agent    |       |  Lambda Function |
|                  |       |                  |
|  Identity:       |       |  Identity:       |
|  chadi-admin     |       |  lambda-free-    |
|  (IAM user)      |       |  tier-role       |
|                  |       |                  |
|  Permissions:    |       |  Permissions:    |
|  Broad (admin)   |       |  Narrow (logs)   |
|                  |       |                  |
|  Purpose:        |       |  Purpose:        |
|  Deploy & manage |       |  Run your code   |
+------------------+       +------------------+
         |                          ^
         |                          |
         +--- deploys/assigns ------+`),
  p("Your agent and the things it deploys should always have different identities. The agent is powerful (it builds things). The things it builds are restricted (they do one job)."),
  h2("Why Billing Alarms Matter for Agents"),
  p("Agents can accidentally create runaway costs in ways humans rarely do:"),
  bullet("An infinite loop that invokes itself, burning Lambda compute", "bullet-ag1"),
  bullet("A bug that writes to DynamoDB faster than you can notice", "bullet-ag1"),
  bullet("A misconfigured EventBridge rule that fires every second", "bullet-ag1"),
  bullet("Accidental deployment to an expensive region", "bullet-ag1"),
  p("The billing alarm catches these within 6 hours instead of at month-end when the bill is a surprise. Consider it a fire alarm -- not for preventing fires, but for catching them before they spread."),
  h2("Cost-Aware Agent Pattern"),
  p("Your agent can implement cost awareness natively:"),
  ...code(`# Start of session
STARTING_SPEND=$(aws ce get-cost-and-usage ...)

# Do work
aws lambda create-function ...
aws lambda invoke ...

# End of session
ENDING_SPEND=$(aws ce get-cost-and-usage ...)
DELTA=$((ENDING_SPEND - STARTING_SPEND))

if [[ $DELTA > $THRESHOLD ]]; then
  echo "ALERT: session cost $DELTA USD"
  exit 1
fi`),
  h2("Least Privilege in Practice"),
  p("For production, replace AdministratorAccess with scoped policies. For example, an agent that only manages Lambda and DynamoDB:"),
  ...code(`{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "lambda:*",
                "dynamodb:*",
                "logs:*",
                "iam:PassRole"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Deny",
            "Action": [
                "iam:CreateUser",
                "iam:DeleteUser",
                "iam:AttachUserPolicy"
            ],
            "Resource": "*"
        }
    ]
}`),
  p("The allow block grants broad access to Lambda, DynamoDB, and logs. The deny block prevents the agent from creating new IAM users (privilege escalation) even though it has admin on the services it needs. Deny always wins, so this is enforceable."),
  pageBreak()
);

// === CLEANUP & NEXT STEPS ===
children.push(
  h1("Cleanup Reference"),
  p("Nothing in this lesson should be deleted. The billing alarm protects you. The IAM role is needed for Lesson 02. Both are free."),
  p("However, if you ever need to tear everything down, here are the commands:"),
  ...code(`# Detach policy and delete Lambda role
aws iam detach-role-policy \\
  --role-name lambda-free-tier-role \\
  --policy-arn \\
  arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam delete-role \\
  --role-name lambda-free-tier-role

# Delete alarm
aws cloudwatch delete-alarms \\
  --alarm-names billing-alarm-1-dollar \\
  --region us-east-1

# List subscriptions to find the ARN
aws sns list-subscriptions-by-topic \\
  --topic-arn YOUR_TOPIC_ARN \\
  --region us-east-1

# Unsubscribe and delete topic
aws sns unsubscribe \\
  --subscription-arn SUB_ARN \\
  --region us-east-1

aws sns delete-topic \\
  --topic-arn YOUR_TOPIC_ARN \\
  --region us-east-1`),
  h1("Next Steps"),
  p("You've built the foundation. You have:"),
  bullet("An active billing alarm at $1", "bullet-next"),
  bullet("An SNS topic wired to your email", "bullet-next"),
  bullet("A Lambda execution role ready to use", "bullet-next"),
  bullet("A mental model of how AWS identity works", "bullet-next"),
  bullet("The CLI commands and GUI flows for both", "bullet-next"),
  p("Ready for Lesson 02: Run code without servers (AWS Lambda). You'll deploy your first function, invoke it, and expose it as a free HTTP endpoint."),
  pageBreak()
);

// === SOURCES ===
children.push(
  h1("Sources & Citations"),
  p("Every GUI walkthrough in this document was verified against official AWS documentation. Sources:"),
  simpleTable(
    ["Topic", "Source URL"],
    [
      ["Billing alerts", "docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html"],
      ["CloudWatch alarms", "docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Alarm-Use-Cases.html"],
      ["Cost Explorer enable", "docs.aws.amazon.com/cost-management/latest/userguide/ce-enable.html"],
      ["Cost Explorer overview", "docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ce-what-is.html"],
      ["SNS create topic", "docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html"],
      ["SNS subscribe endpoint", "docs.aws.amazon.com/sns/latest/dg/sns-create-subscribe-endpoint-to-topic.html"],
      ["IAM create role", "docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html"],
      ["IAM users", "docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html"],
      ["IAM policies", "docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage.html"],
      ["AWS CLI reference", "docs.aws.amazon.com/cli/latest/reference/"]
    ]
  ),
  p(""),
  p("For CLI commands, consult the official AWS CLI reference at docs.aws.amazon.com/cli/latest/reference/ -- every command used in this lesson is documented there with complete flag references."),
  p(""),
  p("This document was generated on 2026-04-10 as part of the PLAI AWS Free Tier Learning Lab (peaklight-ai/aws-free-tier on GitHub)."),
  p(""),
  p("End of Lesson 01.", { italics: true, color: MID_GRAY })
);

// ============ NUMBERING DEFINITIONS ============
const numberingConfigs = [
  "bullet-default", "bullet-prereq", "bullet-read",
  "bullet-verify1", "bullet-verify2", "bullet-verify3",
  "bullet-verify4", "bullet-verify5", "bullet-verify6",
  "bullet-ag1", "bullet-next"
].map(ref => ({
  reference: ref,
  levels: [{
    level: 0,
    format: LevelFormat.BULLET,
    text: "•",
    alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
  }]
}));

// ============ BUILD DOCUMENT ============
const doc = new Document({
  background: { color: OFF_WHITE },
  numbering: { config: numberingConfigs },
  styles: {
    default: {
      document: {
        run: { font: FONT_BODY, size: 22, color: NEON_NOIR }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: FONT_HEAD, size: 44, color: VAPOR_VIOLET },
        paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: FONT_HEAD, size: 32, color: VAPOR_VIOLET },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 1 }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: FONT_HEAD, size: 26, color: NEON_NOIR, bold: true },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 }
      }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new ImageRun({
                data: logo,
                transformation: { width: 36, height: 36 }
              })
            ]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "PLAI AWS Lesson 01 -- Billing & IAM  |  ", font: FONT_BODY, size: 16, color: MID_GRAY }),
              new TextRun({ children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES], font: FONT_BODY, size: 16, color: MID_GRAY }),
              new TextRun({ text: "  |  peaklight.ai", font: FONT_BODY, size: 16, color: MID_GRAY })
            ]
          })
        ]
      })
    },
    children
  }]
});

// ============ SAVE ============
const outputPath = path.resolve(__dirname, "../../01-billing-and-iam/PLAI_AWS_Lesson_01_Billing_and_IAM.docx");

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("OK: Written to " + outputPath);
  console.log("Size: " + (buffer.length / 1024).toFixed(1) + " KB");
}).catch(err => {
  console.error("FAIL:", err);
  process.exit(1);
});
