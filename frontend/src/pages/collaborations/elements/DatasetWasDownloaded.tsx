import { Publication } from "../../../apis/first-approval-api"
import { observer } from "mobx-react-lite"

export const DatasetWasDownloaded = observer((
  props: { publication: Publication }
) => {
  return <div style={{marginTop: '20px'}}>
      <span>
      {
        `The dataset ${props.publication.title} was downloaded.` +
        'Important note: By incorporating this Dataset into your work or using it as a part of your larger Dataset you undertake to send\n' +
        'the Data Author(s) a Collaboration Request. This may result in including the Data Author(s) as co-author(s) to your work.\n' +
        'Read more about Collaboration...'
      }
      </span>
  </div>
});
