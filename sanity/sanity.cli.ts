import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "xo7s2xmj",
    dataset: "production",
  },
  /** Hosted Studio: https://techverge-blog.sanity.studio (after `npm run deploy`) */
  studioHost: "techverge-blog",
});
