import { createPreview } from "@sit-onyx/storybook-utils";
import type { Preview } from "@storybook/vue3";

import "@sit-onyx/storybook-utils/style.css";
import "../assets/css/main.scss";

const preview: Preview = {
  // we need to destructure here because as of Storybook 7.6
  // it can not statically analyze that the `preview` variable is an object
  ...createPreview({
    // optional overrides...
  }),
};

export default preview;
