# Phase 01 Doc: Billing & IAM -- GUI + CLI Walkthrough

## Goal
Produce `PLAI_AWS_Lesson_01_Billing_and_IAM.docx` -- a PLAI-branded tutorial that teaches Chapter 01 (Billing Safety & IAM) via BOTH the AWS Console GUI and the AWS CLI, side-by-side, researched from official AWS documentation.

## Why This Doc
Chadi wants to learn by clicking through the real console (visual) while also seeing the CLI equivalents (terminal). The current README/LABS/NOTES cover CLI only. This doc adds the GUI half and ships it as a printable, branded artifact.

## Scope
- **In scope:** Lesson 01 only (Billing alarm, IAM users/roles/policies, free tier monitoring)
- **Out of scope:** Lessons 02-16 (future phases, one doc each)

## Success Criteria
1. Every CLI command in `01-billing-and-iam/LABS.md` has a matching GUI walkthrough
2. Every GUI step is verified against official AWS documentation (cited with URLs)
3. PLAI branding is applied (colors, fonts, header/footer)
4. Document is DOCX format (editable), delivered in `01-billing-and-iam/`
5. Agent relevance section explains what it means when Claude Code runs these commands
6. Table of contents, clear section structure, verification checkboxes

## Tasks

### Task 1: Research AWS Console flows (OFFICIAL DOCS)
Research the exact UI flows for every GUI action in Lesson 01:

**Sources:**
- AWS official docs (docs.aws.amazon.com)
- context7 MCP queries for: "AWS IAM console", "AWS billing alarm console", "AWS Cost Explorer", "AWS SNS console"

**What to capture for each flow:**
- Full menu path (Services -> IAM -> Users)
- Button labels and positions
- Required form fields and valid values
- Confirmation dialogs and expected responses
- Where to find the result (verification page)
- Official doc URL as citation

**Flows to research:**
1. Viewing current IAM user identity (console)
2. Viewing attached policies for a user
3. Reading a policy document in the console
4. Creating an IAM role (with trust policy via JSON editor)
5. Attaching a managed policy to a role
6. Viewing Cost Explorer (current spend)
7. Creating a CloudWatch billing alarm (full wizard)
8. Creating an SNS topic via the console
9. Subscribing an email to an SNS topic
10. Viewing free tier usage dashboard

**Output:** `research/console-flows.md` with verified step-by-step flows and source URLs

### Task 2: Map GUI to CLI side-by-side
Create a mapping table: for each flow, list the GUI steps alongside the CLI commands from LABS.md.

**Output:** `research/gui-cli-mapping.md`

### Task 3: Doc outline
Structure the PLAI doc:

1. Cover page (PLAI branded)
2. Introduction: what you'll learn, prerequisites
3. How to read this doc (GUI | CLI side-by-side)
4. Chapter 1.1: Know Your Account
5. Chapter 1.2: Set Up Billing Safety
6. Chapter 1.3: Understand IAM
7. Chapter 1.4: Create the Lambda Execution Role
8. Chapter 1.5: Monitor Free Tier Usage
9. Agent Relevance section
10. Cleanup reference
11. Next steps (pointer to Lesson 02)

**Output:** `research/doc-outline.md`

### Task 4: Write the DOCX
Use the `plai-docx` skill to generate the document with PLAI branding.

**Requirements:**
- PLAI color palette and typography
- Code blocks for CLI commands (monospace)
- Tables for GUI | CLI comparisons
- Checkboxes for verification steps
- Citations for every GUI step (footnote with AWS doc URL)
- Agent relevance callout boxes

**Output:** `01-billing-and-iam/PLAI_AWS_Lesson_01_Billing_and_IAM.docx`

### Task 5: Verify
- Every CLI command runs successfully (dry-run validation)
- Every GUI step has a citation
- PLAI branding is applied correctly
- DOCX opens in Word/Pages without errors
- Cross-reference with official AWS CLI reference (docs.aws.amazon.com/cli/)

**Output:** `VERIFICATION.md` in this phase directory

## Dependencies
- `plai-docx` skill (for DOCX generation with PLAI branding)
- `plai:branding` skill (for colors/typography if needed)
- `context7` MCP (for AWS documentation queries)
- Web fetch for AWS official docs (fallback if context7 doesn't have it)

## Risks
- AWS Console UI changes -- mitigation: cite official docs (they update with UI changes)
- Branding may not render identically in all DOCX viewers -- mitigation: verify in Word and Pages
- Screenshots would be ideal but we can't take them -- mitigation: describe UI textually with menu paths and element labels

## Non-Goals
- Screenshots (textual descriptions only)
- Multi-language support (English only)
- Interactive elements (this is a static doc)
- Lessons 02-16 (separate phases)

## Timeline
- Task 1 (Research): 30-45 min
- Task 2 (Mapping): 15 min
- Task 3 (Outline): 10 min
- Task 4 (Write DOCX): 45-60 min
- Task 5 (Verify): 15 min

**Total:** ~2 hours
