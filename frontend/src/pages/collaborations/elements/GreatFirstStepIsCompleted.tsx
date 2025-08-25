import { FlexWrapColumn } from "../../common.styled"

export const GreatFirstStepIsCompleted = () => {
  return (
    <FlexWrapColumn>
      <span>Great! Step 1 is completed 🎉</span>
      <span>We will inform you about the data author(s)’ decision(s) both here and by email.</span>
      <span>
        ⏳ They have 30 days to review and sign the Collaboration Agreement.
      </span>
      <p>
        ✅ If a collaboration is established, the data author will be significantly more motivated to support your work —
        including answering questions, providing additional context, or even co-developing the analysis.
        However, please remember: the initiative is on your side. The data author’s main responsibility is to provide the dataset and
        review the final draft of the manuscript to ensure appropriate use of their data.
      </p>
      <p>
        📌 Important: If the collaboration is confirmed, you are required by the agreement to send the final draft of your manuscript
        to the data author at least 30 days before journal submission.
      </p>
    </FlexWrapColumn>
  )
}
