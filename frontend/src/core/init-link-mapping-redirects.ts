import { linkMappingService } from '../core/service';
import { contestWebinarPath, linkPath } from "./router/constants"
import { routerStore } from "./router"

export async function initLinkMappingRedirects(): Promise<void> {
  const isLinkPath = window.location.pathname.startsWith(linkPath) || window.location.pathname.startsWith(contestWebinarPath)

  debugger;
  if (isLinkPath) {
    const linkAlias = routerStore.lastPathSegment;
    linkMappingService.getLinkByAlias(linkAlias)
      .then(response => {
        const url = response.data;
        debugger;
        window.location.replace(url);
      })
  }
}
