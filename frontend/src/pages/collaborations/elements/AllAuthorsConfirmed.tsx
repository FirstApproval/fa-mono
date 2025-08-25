export const AllAuthorsConfirmed = () => {
  return (
    <div style={{marginTop: '20px'}}>
      <div>
        <b>🎉 Congratulations!</b>
        <br />
        <span>
          All data authors have approved the final draft of your manuscript.
        You’re now ready to submit it to the journal!
        </span>
      </div>
      <p>
        Please keep your collaborators informed about editorial decisions, reviewer comments,
        and any changes made to the manuscript throughout the publication process.
        You can continue using this collaboration log to stay in touch with the Data Authors as needed.
      </p>
      <p>
        🗂 If your manuscript requires a data repository for sharing supplementary data,
        we encourage you to consider <b>publishing the dataset on First Approval</b>.
        Our platform offers a unique <b>collaboration and co-authorship requirement feature</b>,
        which allows data authors to supervise further use of their datasets and participate in future co-authored publications.
      </p>
      <span>To publish your dataset, simply click the “<b>Publish</b>” button.</span>
    </div>
  );
}
