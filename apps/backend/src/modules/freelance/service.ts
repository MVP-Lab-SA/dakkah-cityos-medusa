import { MedusaService } from "@medusajs/framework/utils"
import GigListing from "./models/gig-listing"
import Proposal from "./models/proposal"
import FreelanceContract from "./models/freelance-contract"
import Milestone from "./models/milestone"
import TimeLog from "./models/time-log"
import FreelanceDispute from "./models/freelance-dispute"

class FreelanceModuleService extends MedusaService({
  GigListing,
  Proposal,
  FreelanceContract,
  Milestone,
  TimeLog,
  FreelanceDispute,
}) {
  /** Submit a proposal for a gig */
  async submitProposal(gigId: string, freelancerId: string, data: {
    coverLetter: string
    proposedRate: number
    estimatedDuration?: number
    metadata?: Record<string, unknown>
  }): Promise<any> {
    if (!data.coverLetter || data.proposedRate <= 0) {
      throw new Error("Cover letter and valid proposed rate are required")
    }

    const gig = await this.retrieveGigListing(gigId) as any
    if (gig.status !== "open") {
      throw new Error("Gig is not accepting proposals")
    }

    const existing = await this.listProposals({ gig_listing_id: gigId, freelancer_id: freelancerId }) as any
    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0) {
      throw new Error("You have already submitted a proposal for this gig")
    }

    return await (this as any).createProposals({
      gig_listing_id: gigId,
      freelancer_id: freelancerId,
      cover_letter: data.coverLetter,
      proposed_rate: data.proposedRate,
      estimated_duration: data.estimatedDuration || null,
      status: "submitted",
      submitted_at: new Date(),
      metadata: data.metadata || null,
    })
  }

  /** Award a contract to a freelancer based on their proposal */
  async awardContract(proposalId: string): Promise<any> {
    const proposal = await this.retrieveProposal(proposalId) as any

    if (proposal.status !== "submitted" && proposal.status !== "shortlisted") {
      throw new Error("Proposal is not in a valid state for awarding")
    }

    const contract = await (this as any).createFreelanceContracts({
      gig_listing_id: proposal.gig_listing_id,
      proposal_id: proposalId,
      freelancer_id: proposal.freelancer_id,
      rate: proposal.proposed_rate,
      status: "active",
      started_at: new Date(),
    })

    await (this as any).updateProposals({ id: proposalId, status: "accepted" })

    await (this as any).updateGigListings({
      id: proposal.gig_listing_id,
      status: "in_progress",
    })

    return contract
  }

  /** Submit a deliverable for a contract milestone */
  async submitDeliverable(contractId: string, data: {
    title: string
    description: string
    milestoneId?: string
  }): Promise<any> {
    const contract = await this.retrieveFreelanceContract(contractId) as any

    if (contract.status !== "active") {
      throw new Error("Contract is not active")
    }

    if (data.milestoneId) {
      const milestone = await this.retrieveMilestone(data.milestoneId) as any
      await (this as any).updateMilestones({
        id: data.milestoneId,
        status: "submitted",
        submitted_at: new Date(),
        deliverable_title: data.title,
        deliverable_description: data.description,
      })
      return milestone
    }

    return await (this as any).createMilestones({
      contract_id: contractId,
      title: data.title,
      description: data.description,
      status: "submitted",
      submitted_at: new Date(),
    })
  }

  /** Release payment for a completed contract */
  async releasePayment(contractId: string): Promise<any> {
    const contract = await this.retrieveFreelanceContract(contractId) as any

    if (contract.status !== "active" && contract.status !== "completed") {
      throw new Error("Contract is not in a payable state")
    }

    const milestones = await this.listMilestones({ contract_id: contractId }) as any
    const milestoneList = Array.isArray(milestones) ? milestones : [milestones].filter(Boolean)
    const pendingMilestones = milestoneList.filter((m: any) => m.status !== "approved" && m.status !== "paid")

    if (pendingMilestones.length > 0) {
      throw new Error("All milestones must be approved before releasing payment")
    }

    await (this as any).updateFreelanceContracts({
      id: contractId,
      status: "completed",
      completed_at: new Date(),
      payment_released: true,
      payment_released_at: new Date(),
    })

    return { contractId, status: "payment_released", amount: contract.rate }
  }
}

export default FreelanceModuleService
