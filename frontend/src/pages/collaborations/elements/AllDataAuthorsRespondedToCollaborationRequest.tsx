import { HeightElement } from "../../common.styled"

export const AllDataAuthorsRespondedToCollaborationRequest = () => {
  return (
    <div style={{marginTop: '20px'}}>
      <span><b>All data authors have responded to your collaboration request ✅</b></span>
      <p>
        Now you have collaborators for working with the dataset!
        Data authors will be significantly more motivated to support your work —
        including answering questions, providing additional context, or even co-developing the analysis.
      </p>
      <p>
        However, please remember: the initiative is on your side.
        As part of the collaboration, <b>you are responsible for conducting the data analysis and preparing the final manuscript draft</b>.
        The data author’s main responsibility is to provide the dataset and to review the final draft to ensure the appropriate use of their data.
      </p>
      <p>
        ⏳ Please keep in mind that, according to the agreement,
        data authors have <b>30 days to review</b> the final draft of your collaborative manuscript.
        If you’re working under a tighter deadline, we recommend contacting the data authors in advance to coordinate the review process directly.
      </p>
      <span>
        You can do this by using the "Upload Final Draft" function —
        this will send the manuscript to your collaborators for review and approval before submission.
      </span>
      <HeightElement value="10px"/>
      <span>
        <b>
          Wishing you success in writing a great co-authored paper! ✨
        </b>
      </span>
    </div>
  );
}
