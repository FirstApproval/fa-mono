import sendImage from "../../../assets/fa-send.svg"
import timetableImage from "../../../assets/fa-timetable.svg"
import highfiveImage from "../../../assets/fa-highfive.svg"
import React from "react"

export const showStepsInfo = () => {
  return <div style={{marginTop: '12px'}}>
    <span>
      If you’re interested in this Dataset and considering publishing your future work together with the Data Author(s),
      First Approval will make the collaboration process easier.
      Let me guide you through it before you agree to work on the publication together.
      The FA collaboration process has 3 steps.
    </span>
    <div
      id="fa-collab-helper-box"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        marginBottom: "32px",
        marginTop: "20px"
      }}>
      <div
        id="fa-collab-helper-step1"
        style={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid #dedede",
          borderRadius: "8px"
        }}>
        <img src={sendImage} />
        <div style={{ padding: "8px 16px 0" }}>
                <span
                  style={{
                    background: "#dedede",
                    padding: "5px",
                    borderRadius: "3px",
                    fontSize: "11px"
                  }}>
                  Step 1
                </span>
          <p>Send collaboration request to all dataset authors</p>
        </div>
      </div>
      <div
        id="fa-collab-helper-step2"
        style={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid #dedede",
          borderRadius: "8px"
        }}>
        <img src={timetableImage} />
        <div style={{ padding: "8px 16px 0" }}>
                <span
                  style={{
                    background: "#dedede",
                    padding: "5px",
                    borderRadius: "3px",
                    fontSize: "11px"
                  }}>
                  Step 2
                </span>
          <p>
            Dataset author(s) confirm the collaboration (maximum 30 days)
          </p>
        </div>
      </div>
      <div
        id="fa-collab-helper-step3"
        style={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid #dedede",
          borderRadius: "8px"
        }}>
        <img src={highfiveImage} />
        <div style={{ padding: "8px 16px 0" }}>
                <span
                  style={{
                    background: "#dedede",
                    padding: "5px",
                    borderRadius: "3px",
                    fontSize: "11px"
                  }}>
                  Step 3
                </span>
          <p>
            Discuss and confirm with author(s) the details of your
            publication before submission
          </p>
        </div>
      </div>
    </div>
  </div>
}
