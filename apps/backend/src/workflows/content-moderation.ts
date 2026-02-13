import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

type ContentModerationInput = {
  contentId: string
  contentType: string
  content: string
  authorId: string
  tenantId: string
}

const submitContentStep = createStep(
  "submit-content-for-moderation-step",
  async (input: ContentModerationInput) => {
    const submission = {
      content_id: input.contentId,
      content_type: input.contentType,
      author_id: input.authorId,
      status: "pending_review",
      submitted_at: new Date(),
    }
    return new StepResponse({ submission })
  }
)

const aiScanContentStep = createStep(
  "ai-scan-content-step",
  async (input: { content: string; contentId: string }) => {
    const scanResult = {
      content_id: input.contentId,
      spam_score: 0.05,
      toxicity_score: 0.02,
      sentiment: "neutral",
      flagged: false,
      scanned_at: new Date(),
    }
    return new StepResponse({ scanResult })
  }
)

const reviewContentStep = createStep(
  "review-content-decision-step",
  async (input: { contentId: string; scanResult: any }) => {
    const approved = !input.scanResult.flagged
    const decision = {
      content_id: input.contentId,
      approved,
      reason: approved ? "auto_approved" : "flagged_for_review",
      decided_at: new Date(),
    }
    return new StepResponse({ decision })
  }
)

const publishContentStep = createStep(
  "publish-or-reject-content-step",
  async (input: { contentId: string; approved: boolean }, { container }) => {
    const status = input.approved ? "published" : "rejected"
    const result = {
      content_id: input.contentId,
      status,
      published_at: input.approved ? new Date() : null,
    }
    return new StepResponse({ result })
  }
)

export const contentModerationWorkflow = createWorkflow(
  "content-moderation-workflow",
  (input: ContentModerationInput) => {
    const { submission } = submitContentStep(input)
    const { scanResult } = aiScanContentStep({ content: input.content, contentId: input.contentId })
    const { decision } = reviewContentStep({ contentId: input.contentId, scanResult })
    const { result } = publishContentStep({ contentId: input.contentId, approved: decision.approved })
    return new WorkflowResponse({ submission, scanResult, decision, result })
  }
)
